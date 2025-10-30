const { secret } = require("../config/secret");
const Order = require("../model/Order");
const { confirmationTemplate, itemsToHtmlRows } = require('../services/email-templates');
const { sendEmail } = require('../services/mailer.service');

//  Add a new order
exports.addOrder = async (req, res, next) => {
  try {
    const requiredFields = [
      'user', 'cart', 'name', 'address', 'email', 'contact',
      'city', 'country', 'zipCode', 'subTotal', 'totalAmount', 'paymentMethod'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const order = await Order.create(req.body);

    // add socket
   const io = req.app.get("io")
   if (io){
    io.emit("newOrder", {
      message: "New Order Received",
      order,
    })
    console.log("New order emitted at admin panel.")
   }else{
    console.warn("Socket instance not found on app")
   }


    res.status(201).json({
      success: true,
      message: "Order added successfully",
      order,
    });
  } catch (error) {
    console.error("Add Order Error:", error);
    next(error);
  }
};


// Get all orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    next(error);
  }
};


//  Get a single order by ID 
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Get Single Order Error:", error);
    next(error);
  }
};


// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    // Send email only for confirmed orders
    if (status === 'confirmed') {
      try {
        const itemsHtml = itemsToHtmlRows(order.cart);
        const htmlContent = confirmationTemplate({
          name: order.user?.name || order.name || "Customer",
          orderId: order.invoice || order._id,
          itemsHtml,
          total: order.total || order.totalAmount,
          address: order.address || "N/A",
          eta: order.estimatedDeliveryTime || 'Soon',
        });

        await sendEmail({
          to: order.user?.email || order.email,
          subject: `Your UrbanThali Order #${order.invoice || order._id} is Confirmed!`,
          html: htmlContent,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    res.status(200).json({ success: true, message: 'Status updated successfully', order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    next(error);
  }
};
