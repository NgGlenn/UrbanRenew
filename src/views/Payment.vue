<template>
  <div class="payment-page">
    <h2>Complete Your Payment</h2>

    <form @submit.prevent="handleSubmit">
      <div id="card-element"></div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Processing..." : "Pay Now" }}
      </button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
    </form>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { getFunctions, httpsCallable } from "firebase/functions";

export default {
  data() {
    return {
      stripe: null,
      cardElement: null,
      loading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  async mounted() {
    // Load Stripe instance with your public key
    this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);
    const elements = this.stripe.elements();
    this.cardElement = elements.create("card");
    this.cardElement.mount("#card-element");
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      // Create a Payment Method
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: "card",
        card: this.cardElement,
      });

      if (error) {
        this.errorMessage = error.message;
        this.loading = false;
        return;
      }

      // Call Firebase Cloud Function to process payment
      const functions = getFunctions();
      const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");

      try {
        const result = await createPaymentIntent({
          paymentMethodId: paymentMethod.id,
          amount: 1000 // Example amount in cents ($10)
        });

        if (result.data.error) {
          this.errorMessage = result.data.error;
        } else {
          this.successMessage = "Payment successful!";
        }
      } catch (e) {
        this.errorMessage = "Payment failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  }
};
  </script>
  
  <style scoped>
  .payment-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  h2 {
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .card-element {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  
  #card-errors {
    color: red;
    margin-bottom: 15px;
  }
  
  button {
    width: 100%;
    background-color: #6a42c7;
    color: white;
    padding: 15px;
    border: none;
    border-radius: 30px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #5333a0;
  }
  
  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
 
.payment-page {
  max-width: 400px;
  margin: 0 auto;
}
#card-element {
  margin-bottom: 20px;
}
button {
  background-color: #6772e5;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>


  