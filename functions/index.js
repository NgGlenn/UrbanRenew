const functions =require("firebase-functions");
const admin =require("firebase-admin");
const stripe =require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp();

// Cloud Function to create a Payment Intent
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const {paymentMethodId, amount} = data;

  try {
    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
    });

    // Save the payment information to Firestore
    await admin.firestore().collection("payments").add({
      paymentIntentId: paymentIntent.id,
      amount: amount,
      status: paymentIntent.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {paymentIntentId: paymentIntent.id, status: paymentIntent.status};
  } catch (error) {
    return {error: error.message};
  }
});

