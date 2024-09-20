const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../../models/Profile'); // User model
const Wallet = require('../../models/Wallet'); // Wallet model
const Transaction = require('../../models/TransactionSchema'); // Transaction model

const razorpay = new Razorpay({
  key_id: "rzp_test_uDS9YXiBUt9A51", // Replace with your Razorpay key_id
  key_secret: "dqOCPIc0LyBsVjw2f604csaW", // Replace with your Razorpay key_secret
});

// Create an order and generate payment link
exports.createOrder = async (req, res) => {
  const { amount, currency, userId } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise for INR
    currency,
    receipt: `receipt_${Date.now()}`, // Unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options); // Create order with Razorpay
    
    // Generate payment link
    const paymentLink = `https://checkout.razorpay.com/v1/checkout.js?key=${razorpay.key_id}&order_id=${order.id}&amount=${order.amount}&name=Your App Name&description=Payment for Order&prefill[name]=User%20Name&prefill[email]=user@example.com&prefill[contact]=9999999999`;

    res.json({ order, paymentLink }); // Send the order details and payment link to the frontend
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Verify payment and update wallet
exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature, userId, amount } = req.body;

  const hmac = crypto.createHmac('sha256', razorpay.key_secret);
  hmac.update(order_id + '|' + payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === signature) {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      wallet.balance += amount;
      await wallet.save();

      const transaction = await Transaction.create({
        userId,
        walletId: wallet._id,
        amount,
        transactionType: 'credit',
        orderId: order_id,
        paymentId: payment_id,
        status: 'success',
      });

      wallet.transactions.push(transaction._id);
      await wallet.save();

      res.json({ status: 'success', order_id, payment_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
};
