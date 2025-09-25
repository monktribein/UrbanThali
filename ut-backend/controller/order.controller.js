const { secret } = require("../config/secret");
const Razorpay = require("razorpay");
const Order = require("../model/Order");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: secret.razorpay_key_id || 'rzp_test_1234567890', // Fallback for testing
  key_secret: secret.razorpay_key_secret || 'test_secret_1234567890', // Fallback for testing
});

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    console.log('=== PAYMENT INTENT DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Razorpay Key ID:', secret.razorpay_key_id);
    console.log('Razorpay Key Secret:', secret.razorpay_key_secret ? 'Present' : 'Missing');
    
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100; // Convert to paise for Razorpay
    
    console.log('Price:', price);
    console.log('Amount (paise):', amount);
    
    // Check if Razorpay credentials are available
    if (!secret.razorpay_key_id || !secret.razorpay_key_secret) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
    }
    
    // Check if using test credentials
    if (secret.razorpay_key_id === 'rzp_test_1234567890') {
      console.log('⚠️  Using test Razorpay credentials. Please replace with real credentials for production.');
      // Return mock order for testing
      return res.send({
        orderId: 'order_test_' + Date.now(),
        amount: amount,
        currency: 'INR',
        key: secret.razorpay_key_id
      });
    }
    
    // Create Razorpay order
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };
    
    console.log('Razorpay options:', options);
    
    const order = await razorpay.orders.create(options);
    
    console.log('Razorpay order created:', order);
    
    res.send({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: secret.razorpay_key_id
    });
  } catch (error) {
    console.log('=== PAYMENT INTENT ERROR ===');
    console.log('Error message:', error.message);
    console.log('Error details:', error);
    next(error)
  }
};

// verify-payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", secret.razorpay_key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    next(error);
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

exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  try {
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      }, { new: true })
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
