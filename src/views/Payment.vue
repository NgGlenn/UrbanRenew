<template>
    <div class="payment-container">
      <h1>Payment Information</h1>
      <form @submit.prevent="handleSubmit">
        <!-- Card details placeholder -->
        <label for="card-element">Card Details</label>
        <div id="card-element" class="card-element"></div>
        <div id="card-errors" role="alert"></div>
  
        <!-- Name and other info -->
        <label for="cardholder-name">Cardholder's Name</label>
        <input type="text" id="cardholder-name" v-model="cardholderName" placeholder="Enter your name" required />
  
        <label for="task-details">Task Details</label>
        <textarea id="task-details" v-model="taskDetails" placeholder="Enter task details" required></textarea>
  
        <!-- Submit Button -->
        <button type="submit" :disabled="processing">Pay Now</button>
      </form>
    </div>
  </template>
  
  <script>
  import { loadStripe } from '@stripe/stripe-js';
  
  export default {
    data() {
      return {
        stripe: null,
        card: null,
        cardholderName: '',
        taskDetails: '',
        processing: false,
      };
    },
    async mounted() {
      // Load Stripe with your publishable key
      this.stripe = await loadStripe('pk_test_51QAhnrFvAGbEgh1Ez3Xwq2giSZsUFL276Ddcjj7C8wBk8CLGJLynvLZQ6eJSu9PaUkufy6BioUOqwfMwGAGjA2HL00SZg28ZG1');
  
      // Create an instance of Elements and mount the card element
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
  
      // Handle real-time validation errors from the card Element.
      this.card.on('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
    },
    methods: {
      async handleSubmit() {
        this.processing = true;
  
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.card,
          billing_details: {
            name: this.cardholderName,
          },
        });
  
        if (error) {
          // Inform the user if there was an error.
          document.getElementById('card-errors').textContent = error.message;
          this.processing = false;
        } else {
          // Call your server to handle the payment intent.
          this.confirmPayment(paymentMethod.id);
        }
      },
      async confirmPayment(paymentMethodId) {
        try {
          const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_method_id: paymentMethodId,
              task_details: this.taskDetails,
            }),
          });
  
          const paymentResult = await response.json();
  
          if (paymentResult.error) {
            // Show error to your customer.
            document.getElementById('card-errors').textContent = paymentResult.error.message;
            this.processing = false;
          } else {
            // The payment has been processed!
            alert('Payment successful!');
            this.processing = false;
          }
        } catch (error) {
          console.error('Error confirming payment:', error);
          this.processing = false;
        }
      },
    },
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
  
  h1 {
    text-align: center;
    font-size: 24px;
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
  </style>
  