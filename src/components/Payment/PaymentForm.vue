<template>
    <div class="payment-form">
        <h4><strong>Proceed with Payment</strong></h4>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <div class="row mb-3">
                    <div class="col-auto">
                        <strong>SGD</strong>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" id="amount" :value="formattedPrice" disabled />
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Payment Method</label>
                <div>
                    <div class="form-check d-flex justify-content-between align-items-center">
                        <div>
                            <input type="radio" id="paynow" value="paynow" v-model="paymentMethod"
                                class="form-check-input" required />
                            <label for="paynow" class="form-check-label">PayNow</label>
                        </div>
                        <img src="../icons/paynow.png" alt="PayNow" class="payment-method-icon" />
                    </div>
                    <div class="form-check d-flex justify-content-between align-items-center">
                        <div>
                            <input type="radio" id="creditcard" value="creditcard" v-model="paymentMethod"
                                class="form-check-input" required />
                            <label for="creditcard" class="form-check-label">Credit Card</label>
                        </div>
                        <img src="../icons/credit_card.png" alt="Credit Card" class="payment-method-icon" />
                    </div>
                </div>
            </div>

            <div v-if="paymentMethod === 'creditcard'" class="mb-3">
                <label for="cardName" class="form-label">Name on Card</label>
                <input type="text" class="form-control" id="cardName" required />
            </div>

            <div v-if="paymentMethod === 'creditcard'" class="mb-3">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input type="text" class="form-control" id="cardNumber" required />
                <br />
                <div class="row">
                    <div class="col mb-3">
                        <label class="form-label">Expiry Date</label>
                        <div class="row">
                            <div class="col-4">
                                <input type="text" class="form-control" id="expiryMonth" placeholder="MM" required />
                            </div>
                            <div class="col-1">
                                <p style = 'font-size:x-large'>/</p>
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control" id="expiryYear" placeholder="YYYY" required />
                            </div>
                        </div>
                    </div>
                    <div class="col mb-3">
                        <label for="cvv" class="form-label">CVV</label>
                        <input type="text" class="form-control" id="cvv" required />
                    </div>
                </div>
            </div>
            <div class='row'>
                <div class="col text-center">
                    <button type="submit" class="btn btn-primary w-100">Make Payment</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        project: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            paymentMethod: '', // No default payment method
        };
    },
    methods: {
        handleSubmit() {
            if (this.paymentMethod === 'paynow') {
                alert('Proceeding with PayNow for amount: $' + this.formattedPrice);
            } else if (this.paymentMethod === 'creditcard') {
                alert('Proceeding with Credit Card payment for amount: $' + this.formattedPrice);
                // More handling can be added here if necessary
            } else {
                alert('Please select a payment method.');
            }
        },
    },
    computed: {
        formattedPrice() {
            return this.project ? parseFloat(this.project.price).toLocaleString() : '';
        },
    },
};
</script>

<style scoped>
/* Payment Form Container */
.payment-form {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
}

/* Label and Input Styling */
.form-label {
    font-weight: bold;
    color: #555;
}

.form-control {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* Button Styling */
.btn {
    background-color: #769FCD;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: #5a8bbf;
}

h4 {
    font-size: 1.5rem;
    color: #769FCD;
    margin-bottom: 20px;
}

.mb-3 {
    margin-bottom: 1.5rem;
}

/* Hover Effects for Interactive Elements */
.form-check:hover {
    background-color: #f9f9f9;
    border-radius: 5px;
}

.payment-method-icon {
    width: auto;
    height: 30px;
    margin-left: 10px;
}

</style>