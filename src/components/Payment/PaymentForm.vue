<template>
    <div class="payment-form">
        <h2>Proceed with Payment</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <input type="text" class="form-control" id="amount" :value="formattedPrice" disabled />
            </div>
            <div class="mb-3">
                <label for="cardElement" class="form-label">Card Information</label>
                <div id="cardElement"></div>
            </div>
            <button type="submit" class="btn btn-primary">Make Payment</button>
        </form>
    </div>
</template>

<script>
// Import Stripe.js
import { loadStripe } from '@stripe/stripe-js';

export default {
    props: ['projectName', 'contractorName', 'price'],
    data() {
        return {
            stripe: null,
            cardElement: null,
        };
    },
    computed: {
        formattedPrice() {
            return `$${parseFloat(this.price).toLocaleString()}`;
        }
    },
    async mounted() {
        // Initialize Stripe with your publishable key
        this.stripe = await loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

        const elements = this.stripe.elements();
        this.cardElement = elements.create('card');
        this.cardElement.mount('#cardElement');
    },
    methods: {
        async handleSubmit() {
            const { paymentMethod, error } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
            });

            if (error) {
                alert(error.message);
                return;
            }

            // Process payment through your backend
            const response = await fetch('/your-backend-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    amount: this.price,
                    contractor: this.contractorName,
                    project: this.projectName
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Payment successful!');
            } else {
                alert('Payment failed: ' + result.error);
            }
        }
    }
};
</script>