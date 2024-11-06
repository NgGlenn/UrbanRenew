<template>
    <div class="container my-5">
        <div class="row">
             <!-- Payment Form (left Column on desktop) -->
             <div class="col-12 col-md-6 payment-form">
                <h4><strong>Proceed with Payment</strong></h4>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="amount" class="form-label">Amount</label>
                        <div class="row mb-3">
                            <div class="col-auto">
                                <strong>SGD</strong>
                            </div>
                            <div class="col">
                                <input type="text" class="form-control" id="amount" :value=" ((calculatedAmount * 0.0025) + (calculatedAmount* 0.0010) + calculatedAmount).toLocaleString()" disabled />
                            </div>
                        </div>
                    </div>

                    <label class="form-label">Enter Payment Percentage</label>
                    <div class="mb-3">
                        <input
                            type="number"
                            v-model.number="customPaymentPercentage"
                            placeholder="Enter percentage (1-100)"
                            class="form-control"
                            min="1"
                            max="100"
                            required
                        />
                        <small v-if="customPaymentPercentage > 100" class="text-danger">Percentage cannot exceed 100%.</small>
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
                    <div class="row">
                        <div class="col text-center">
                            <button type="submit" class="btn btn-primary w-100">Make Payment</button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- Payment Details (Right Column on desktop) -->
            <div class="col-12 col-md-6 payment-details">
                <div v-if="project">
                    <div class="row align-items-center mb-3">
                        <div class="col-auto">
                            <img src="../icons/moodeng.png" alt="Contractor Logo" class="contractor-logo">
                        </div>
                        <div class="col">
                            <div class="project-info mb-2">
                                <h5 class="project-name">{{ project.projectName }}</h5>
                            </div>
                            <div class="contractor-info">
                                <p class="mb-1"><strong>Contractor:</strong></p>
                                <span class="contractor-name">{{ project.contractorName }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="fees-container">
                        <div class="d-flex justify-content-between mb-1">
                            <em>Project Cost:</em>
                            <span>SGD {{ formattedPartialPrice }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <em>Administration Fee:</em>
                            <span>SGD {{ (calculatedAmount* 0.0010).toLocaleString() }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <em>Platform Fee:</em>
                            <span>SGD {{ (calculatedAmount * 0.0025).toLocaleString() }}</span>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between mb-1">
                            <strong>Total Fees:</strong>
                            <span class="font-weight-bold"><strong>SGD {{ ((calculatedAmount * 0.0025) + (calculatedAmount* 0.0010) + calculatedAmount).toLocaleString() }}</strong></span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Loading project details...</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
            userID: null,
            paymentMethod: '', // No default payment method
            customPaymentPercentage: 100, // Default to full payment (100%)
        };
    },
    computed: {
        calculatedAmount() {
            // Calculate the payment amount based on the percentage entered by the user
            const percentage = Math.min(this.customPaymentPercentage, 100) / 100;
            return this.project && this.project.price ? this.project.price * percentage : 0;
        },
        formattedPartialPrice() {
            return this.calculatedAmount.toLocaleString();
        },
    },
    async created() {
        onAuthStateChanged(auth, (user) => {
        if (user) {
        this.userID = user.uid; // Store logged-in user ID
      }
    });
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
                projstatus: this.customPaymentPercentage === 100 ? 'paid' : 'pending',
                paidOn: new Date(),
                CustomerID: this.userID,
                contractorID: this.project.contractorId,
            });

            // Update job's paid status and remaining amount in the 'jobs' collection
            const jobRef = doc(db, 'jobs', this.project.id);
            try {
                const jobSnapshot = await getDoc(jobRef);
                if (jobSnapshot.exists()) {
                    const jobData = jobSnapshot.data();
                    const remainingBalance = jobData.price - amountToPay;

                    if (this.customPaymentPercentage === 100) {
                        await updateDoc(jobRef, {
                            paidstatus: 'paid',
                            price: 0, // Set to 0 if fully paid
                        });
                    } else {
                        await updateDoc(jobRef, {
                            paidstatus: 'partiallypaid',
                            price: remainingBalance, // Update remaining balance
                        });
                    }
                }

                console.log("Job's status and balance updated successfully");

                // Redirect with appropriate messages
                const queryParams = new URLSearchParams({ contractorID: this.project.contractorId }).toString();
                // const message = this.paymentMethod === 'paynow' 
                //     ? `Proceeding with PayNow for amount: $${this.formattedPartialPrice}`
                //     : `Proceeding with Credit Card payment for amount: $${this.formattedPartialPrice}`;
                //alert(message);
                if (this.customPaymentPercentage === 100) {
                    this.$router.push(`/contractorReview?${queryParams}`);
                    } else {
                        this.$router.push(`/dashboard`);
                    }
                //this.$router.push(`/contractorReview?${queryParams}`);
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
.payment-details {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
}

/* Contractor Logo Styling */
.contractor-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 15px;
}

/* Project and Contractor Info Styling */
.project-info,
.contractor-info {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
}

.project-name {
    font-weight: bold;
    color: #769FCD;
}

.contractor-name {
    font-weight: 500;
    color: #555;
}

/* Fees Container */
.fees-container {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
}

/* Hover Effects for Interactive Elements */
.project-info:hover,
.contractor-info:hover {
    background-color: #f9f9f9;
    border-radius: 5px;
}

/* Consistent Typography */
h5,
p {
    margin: 0;
}

h5 {
    font-size: 1.5rem;
    color: #769FCD;
    margin-bottom: 10px;
}

p {
    font-size: 1rem;
    color: #555;
    max-width: 900px;
    margin: 0 auto 15px;
}

</style>