<template>
    <div class="container my-5">
        <div class="row">
            <!-- Payment Form (left Column on desktop) -->
            <div class="col-12 col-md-6 payment-form">
                <h4><strong>Proceed with Payment</strong></h4>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Enter Custom Amount</label>
                        <div class="row mb-3">
                            <div class="col-auto">
                                <strong>SGD</strong>
                            </div>
                            <div class="col">
                                <input type="number" v-model.number="customPaymentAmount" placeholder="Enter amount in SGD" class="form-control" required />
                            </div>
                            <small v-if="customPaymentAmount > calculatedAmount || customPaymentAmount <= 0" class="text-danger">
                                Payment amount invalid. Please enter a valid amount.
                            </small>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="amount" class="form-label">Total Fees</label>
                        <div class="row mb-3">
                            <div class="col-auto">
                                <strong>SGD</strong>
                            </div>
                            <div class="col">
                                <input type="text" class="form-control" id="amount" :value="totalFeesFormatted" disabled />
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Payment Method</label>
                        <div>
                            <div class="form-check d-flex justify-content-between align-items-center">
                                <div>
                                    <input type="radio" id="paynow" value="paynow" v-model="paymentMethod" class="form-check-input" />
                                    <label for="paynow" class="form-check-label">PayNow</label>
                                </div>
                                <img src="../icons/paynow.png" alt="PayNow" class="payment-method-icon" />
                            </div>
                            <div class="form-check d-flex justify-content-between align-items-center">
                                <div>
                                    <input type="radio" id="creditcard" value="creditcard" v-model="paymentMethod" class="form-check-input"/>
                                    <label for="creditcard" class="form-check-label">Credit Card</label>
                                </div>
                                <img src="../icons/credit_card.png" alt="Credit Card" class="payment-method-icon" />
                            </div>
                        </div>
                    </div>

                    <div v-if="paymentMethod === 'creditcard'" class="mb-3">
                        <label for="cardName" class="form-label">Name on Card</label>
                        <input type="text" class="form-control" id="cardName" v-model="cardName" required pattern="[A-Za-z ]+" title="Card name can only contain alphabets and spaces" />
                    </div>

                    <div v-if="paymentMethod === 'creditcard'" class="mb-3">
                        <label for="cardNumber" class="form-label">Card Number</label>
                        <input type="text" class="form-control" id="cardNumber" v-model="cardNumber" required pattern="\d{16}" title="Card number must be 16 digits" maxlength="16" />
                        <br />
                        <div class="row">
  <div class="col-12 col-md-6 mb-3">
    <label class="form-label">Expiry Date</label>
    <div class="expiry-date-container">
      <input type="text" class="form-control" id="expiryMonth" v-model="expiryMonth" placeholder="MM" required
             pattern="(0[1-9]|1[0-2])" title="Enter a valid month (01-12)" maxlength="2" />
      <span class="divider">/</span>
      <input type="text" class="form-control" id="expiryYear" v-model="expiryYear" placeholder="YYYY" required
             pattern="\d{4}" title="Enter a valid year" maxlength="4" />
    </div>
    <small v-if="!isExpiryValid" class="text-danger">Expiry date must be later than today.</small>
  </div>
  <div class="col-12 col-md-6 mb-3">
    <label for="cvv" class="form-label">CVV</label>
    <input type="text" class="form-control" id="cvv" v-model="cvv" required
           pattern="\d{3}" title="CVV must be 3 digits" maxlength="3" />
  </div>
</div>

                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <button v-if="paymentMethod=== 'creditcard'" type="submit" class="btn btn-primary w-100" :disabled="!isExpiryValid">Make Payment</button>
                            <button v-if="paymentMethod=== 'paynow'" type="submit" class="btn btn-primary w-100" >Make Payment</button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- Payment Details (Right Column on desktop) -->
            <div class="col-12 col-md-6 payment-details">
                <div v-if="project">
                    <div class="row align-items-center mb-3">
                        <div class="col-auto">
                            <img :src="contractorImageUrl || '../icons/moodeng.png'" alt="Contractor Logo" class="contractor-logo">
                        </div>
                        <div class="col">
                            <div class="project-info mb-2">
                                <h5 class="project-name">{{ project.description }}</h5>
                            </div>
                            <div class="contractor-info">
                                <p class="mb-1"><strong>Contractor:</strong></p>
                                <span class="contractor-name">{{ project.contractorName }}</span>
                            </div>
                            <div class="project-price">
                                <p class="mb-1"><strong> Remaining Cost:</strong></p>
                                <span class="contractor-name"> $ {{ project.remainingBalance-calculatedAmount }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="fees-container">
                        <div class="d-flex justify-content-between mb-1">
                            <em>Custom Amount:</em>
                            <span>SGD {{ calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <em>Administration Fee:</em>
                            <span>SGD {{ adminFeeFormatted }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <em>Platform Fee:</em>
                            <span>SGD {{ platformFeeFormatted }}</span>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between mb-1">
                            <strong>Total Fees:</strong>
                            <span class="font-weight-bold"><strong>SGD {{ totalFeesFormatted }}</strong></span>
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
            paymentMethod: '',
            customPaymentAmount: this.project.remainingBalance,
            contractorImageUrl: '',
            cardName: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
        };
    },
    computed: {
        calculatedAmount() {
            return this.project && this.customPaymentAmount <= this.project.remainingBalance
                ? this.customPaymentAmount
                : this.project.remainingBalance;
        },
        adminFee() {
            return this.calculatedAmount * 0.001;
        },
        platformFee() {
            return this.calculatedAmount * 0.0025;
        },
        totalFees() {
            return this.calculatedAmount + this.adminFee + this.platformFee;
        },
        totalFeesFormatted() {
            return this.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        adminFeeFormatted() {
            return this.adminFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        platformFeeFormatted() {
            return this.platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        isExpiryValid() {
            const currentDate = new Date();
            const expiryDate = new Date(this.expiryYear, this.expiryMonth - 1); // Month is zero-based
            return expiryDate > currentDate;
        },
    },
    async created() {
        if (this.project.contractorId) {
            try {
                const contractorDoc = await getDoc(doc(db, "users", this.project.contractorId));
                if (contractorDoc.exists()) {
                    this.contractorImageUrl = contractorDoc.data().imageUrl;
                } else {
                    console.error("No such contractor document!");
                }
            } catch (error) {
                console.error("Error fetching contractor image:", error);
            }
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    this.userRole = userDoc.data().role;
                    this.userID = user.uid;
                }
            }
        });
    },
    methods: {
        async handleSubmit() {
            if (this.paymentMethod=== 'creditcard' && !this.isExpiryValid) {
                alert("Invalid expiry date.");
                return;
            }

            const amountToPay = this.customPaymentAmount;
            if (amountToPay <= 0) {
                alert("Please enter a valid payment amount.");
                return;
            }

            const paymentStatus = amountToPay === this.project.remainingBalance ? 'paid' : 'partiallypaid';

            await addDoc(collection(db, 'payments'), {
                projectname: this.project.jobName,
                contractorname: this.project.contractorName,
                projectID: this.project.id,
                amount: amountToPay,
                paymentMethod: this.paymentMethod,
                paidOn: new Date(),
                customerID: this.userID,
                contractorID: this.project.contractorId,
                remainingBalance: this.project.remainingBalance - amountToPay,
                paymentStatus: paymentStatus,
                price: this.project.price,
            });

            const jobRef = doc(db, 'jobs', this.project.id);
            try {
                const jobSnapshot = await getDoc(jobRef);
                if (jobSnapshot.exists()) {
                    const jobData = jobSnapshot.data();
                    const leftBalance = jobData.remainingBalance - amountToPay;

                    if (paymentStatus === 'paid') {
                        await updateDoc(jobRef, {
                            paidstatus: 'paid',
                            remainingBalance: 0,
                            status: 'completed',
                        });
                    } else {
                        await updateDoc(jobRef, {
                            paidstatus: 'partiallypaid',
                            remainingBalance: leftBalance,
                        });
                    }
                }

                const queryParams = new URLSearchParams({ contractorID: this.project.contractorId }).toString();
                const payParams = new URLSearchParams({ jobID: this.project.id }).toString();
                if (this.paymentMethod === 'creditcard' && paymentStatus === 'paid') {
                    alert('Payment successful.');
                    this.$router.push(`/contractorReview?${queryParams}`);
                } else if (this.paymentMethod === 'creditcard' && paymentStatus === 'partiallypaid') {
                    alert('Payment successful.');
                    this.$router.push(`/paymentOverview?${payParams}`);
                } else {
                    this.$router.push(`/completePayment?${payParams}`);
                }
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
/* General Layout */
.payment-form,
.payment-details,
.fees-container {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
}

/* Typography */
h4,
h5 {
    font-size: 1.5rem;
    color: #769FCD
}

h4   {
    margin-bottom: 10px;
}

p {
    font-size: 1rem;
    color: #555;
    max-width: 900px;
    margin: 0 auto 15px;
}

.form-label {
    font-weight: bold;
    color: #555;
}

.project-name,
.h5 {
    font-weight: bold;
    color: #769FCD;
}

.contractor-name {
    font-weight: 400;
    color: #555;
}

/* Form Controls */
.form-control {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn {
    background-color: #769FCD;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: auto;
}

.btn:hover {
    background-color: #5a8bbf;
}

/* Margins */
.mb-3 {
    margin-bottom: 1.5rem;
}

/* Payment Form and Fees */
.fees-container {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
}

/* Interactive Elements */
.form-check:hover,
.project-info:hover,
.contractor-info:hover {
    background-color: #f9f9f9;
    border-radius: 5px;
}

/* Icons and Images */
.payment-method-icon {
    width: auto;
    height: 30px;
    margin-left: 10px;
}

.contractor-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 15px;
}

/* Sections */
.project-info,
.contractor-info {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
}
.expiry-date-container {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.expiry-date-container input {
  max-width: 70px; /* Limit width on larger screens */
  flex: 1; /* Full width on smaller screens */
}

.divider {
  font-size: 1.5rem;
}

@media (max-width: 576px) {
  .expiry-date-container input {
    max-width: 100%; /* Full width on mobile */
    flex: 0 0 48%; /* Makes each field take 48% of the row on small screens */
  }

  .divider {
    font-size: 1.2rem;
  }
}
</style>