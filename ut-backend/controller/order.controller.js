const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");
const { sendEmail } = require("../services/mailer.service");
const { confirmationTemplate, deliveredTemplate, itemsToHtmlRows } = require("../services/email-templates");
const { generateInvoiceBuffer } = require("../services/invoice.service");

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderItems = await Order.create(req.body);

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status: newStatus } },
      { new: true }
    ).populate('user');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Compute ETA: 30 minutes from now if provided none
    const eta = order.estimatedDeliveryTime
      ? new Date(order.estimatedDeliveryTime)
      : new Date(Date.now() + 30 * 60 * 1000);

    // Send emails based on status
    if (newStatus === 'confirmed') {
      try {
        const html = confirmationTemplate({
          name: order.name,
          orderId: order._id,
          itemsHtml: itemsToHtmlRows(order.cart),
          total: order.totalAmount,
          address: order.address,
          eta: eta.toLocaleString(),
        });

        await sendEmail({
          to: order.email,
          subject: `Your UrbanThali Order #${order._id} is Confirmed`,
          html,
        });
        console.log(`Confirmation email sent for order ${order._id}`);
      } catch (emailError) {
        console.error(`Failed to send confirmation email for order ${order._id}:`, emailError);
        // Don't fail the entire request if email fails
      }
    }

    if (newStatus === 'delivered') {
      try {
        // Generate invoice PDF
        const invoiceBuffer = await generateInvoiceBuffer(order);
        const html = deliveredTemplate({
          name: order.name,
          orderId: order._id,
          address: order.address,
        });
        await sendEmail({
          to: order.email,
          subject: `Your UrbanThali Order #${order._id} has been Delivered`,
          html,
          attachments: [
            {
              filename: `UrbanThali-Invoice-${order.invoice || order._id}.pdf`,
              content: invoiceBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
        console.log(`Delivery email sent for order ${order._id}`);
      } catch (emailError) {
        console.error(`Failed to send delivery email for order ${order._id}:`, emailError);
        // Don't fail the entire request if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully and notifications processed',
      data: order,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
