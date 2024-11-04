<template>
    <div class="payment-form">
        <h4><strong>Proceed with Payment</strong></h4>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <div class="row mb-3">
                    <div class="col-auto">
                        <strong>SGD</strong>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" id="amount" :value="formattedPartialPrice" disabled />
                    </div>
                </div>
            </div>
            <label v-if="project.paidstatus=== 'pending'" class="form-label">Payment Percentage</label>
                <div v-if="project.paidstatus=== 'pending'" class="form-check">
                    <input
                        type="radio"
                        id="payment25"
                        value="25"
                        v-model="selectedPercentage"
                        class="form-check-input"
                    />
                    <label for="payment25" class="form-check-label">25% ({{ (project.price * 0.25).toLocaleString() }})</label>
                </div>
                <div v-if="project.paidstatus=== 'pending'" class="form-check">
                    <input
                        type="radio"
                        id="payment50"
                        value="50"
                        v-model="selectedPercentage"
                        class="form-check-input"
                    />
                    <label for="payment50" class="form-check-label">50% ({{ (project.price * 0.50).toLocaleString() }})</label>
                </div>
                <div v-if="project.paidstatus=== 'pending'" class="form-check">
                    <input
                        type="radio"
                        id="payment100"
                        value="100"
                        v-model="selectedPercentage"
                        class="form-check-input"
                    />
                    <label for="payment100" class="form-check-label">100% ({{ project.price.toLocaleString() }})</label>
                </div>
            </div>

        
            <div class="mb-3">
                <label class="form-label">Payment Method</label>
                <div>
                    <div class="form-check d-flex justify-content-between align-items-center">
                        <div>
                            <input type="radio" id="paynow" value="paynow" v-model="paymentMethod" class="form-check-input" required />
                            <label for="paynow" class="form-check-label">PayNow</label>
                        </div>
                        <img src="../icons/paynow.png" alt="PayNow" class="payment-method-icon" />
                    </div>
                    <div class="form-check d-flex justify-content-between align-items-center">
                        <div>
                            <input type="radio" id="creditcard" value="creditcard" v-model="paymentMethod" class="form-check-input" required />
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
                                <p style="font-size:x-large">/</p>
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
import { db } from '../../firebase';  // Ensure your firebase.js is correctly configured
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

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
            selectedPercentage: '100', // Default to full payment (100%)
        };
    },
    computed: {
        calculatedAmount() {
        // Check if project and project.price are defined before calculating
        if (!this.project || this.project.price == null) {
            return 0; // Return a default value if price is not available yet
        }
        const percentage = parseFloat(this.selectedPercentage) / 100;
        return this.project.price * percentage;
    },
        formattedPartialPrice() {
            return this.calculatedAmount.toLocaleString();
        },
    },
    methods: {
        async handleSubmit() {
            const amountToPay = this.calculatedAmount;

            // Add payment record to 'payments' collection
            await addDoc(collection(db, 'payments'), {
                projectname: this.project.Jobname,
                contractorname: this.project.contractorName,
                projectID: this.project.jobID,
                amount: amountToPay,
                paymentMethod: this.paymentMethod,
                projstatus: this.selectedPercentage === '100' ? 'paid' : 'pending',
                paidOn: new Date(),
            });

            // Update job's paid status and remaining amount in the 'jobs' collection
            const jobRef = doc(db, 'jobs', this.project.id);
            try {
                // Fetch the current job details
                const jobSnapshot = await getDoc(jobRef);
                if (jobSnapshot.exists()) {
                const jobData = jobSnapshot.data();
                const remainingBalance = jobData.price - amountToPay;

                if (this.selectedPercentage === '100') {
                // Full payment
                await updateDoc(jobRef, {
                    paidstatus: 'paid',
                    price: 0, // Assuming the job is fully paid, set the remaining price to 0
                });
                } else {
                // Partial payment
                await updateDoc(jobRef, {
                    paidstatus: 'partiallypaid',
                    price: remainingBalance, // Update remaining balance after partial payment
                });
            }
        }

                console.log("Job's status and balance updated successfully");

                // Redirect with appropriate messages
                const queryParams = new URLSearchParams({ contractorID: this.project.contractorId }).toString();
                const message = this.paymentMethod === 'paynow' 
                    ? `Proceeding with PayNow for amount: $${this.formattedPartialPrice}`
                    : `Proceeding with Credit Card payment for amount: $${this.formattedPartialPrice}`;
                alert(message);
                this.$router.push(`/contractorReview?${queryParams}`);
            } catch (error) {
                console.error('Error updating job status or remaining balance:', error);
                alert('Failed to update the job status. Please try again.');
            }
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