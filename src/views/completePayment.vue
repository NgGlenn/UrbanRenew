<script>
import LogedInLayout from '@/components/logedInLayout.vue';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default {
    name: "CompletePayment",
    components: {
        LogedInLayout,
    },
    data() {
        return {
            job: null,
            jobID: this.$route.query.jobID, // Get jobID from URL
        };
    },
    async created() {
        await this.fetchJobDetails();
    },
    methods: {
        async fetchJobDetails() {
            if (this.jobID) {
                const jobRef = doc(db, "jobs", this.jobID);
                const jobSnap = await getDoc(jobRef);
                if (jobSnap.exists()) {
                    this.job = jobSnap.data();
                } else {
                    console.error("No such job document!");
                }
            } else {
                console.error("No jobID provided in URL.");
            }
        },
        goToHome() {
            if (!this.job) {
                console.error("Job details not loaded.");
                return;
            }

            // Determine redirection based on job's paidstatus
            if (this.job.paidstatus === 'partiallypaid') {
                alert("Payment successful!");
                this.$router.push({ name: 'paymentOverview' });
            } else if (this.job.paidstatus === 'paid') {
                const queryParams = new URLSearchParams({
                    contractorID: this.job.contractorId,
                }).toString();
                alert("Payment successful!");
                this.$router.push(`/contractorReview?${queryParams}`);
            }
        }
    }
};
</script>
<template>
    <LogedInLayout>
    <div class="page-container">
        <div class="payment-card">
            <img src="../components/icons/qrCode.png" alt="QR Code" class="payment-image">
            <h1>Scan & Pay</h1>
            <button class="done-button" @click="goToHome">Done</button>
            <div class="instructions">
                <p>To complete your payment, please scan the QR code using your PayNow-compatible mobile banking app.</p>
            </div>
            <div class="help-section">
                <a href="/faq" class="help-link">Need help with payments?</a>
            </div>


        </div>
    </div>
</LogedInLayout>
</template>



<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
}

.payment-card {
    width: 100%;
    max-width: 400px;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}
 .instructions {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: small;
    color: #555;
    text-align: center;
    font-style: italic;
}
.payment-image {
    width: 300px;
    height: 300px;
    margin-bottom: 20px;
}
.help-link {
    font-size: 0.9rem;
    color: #769FCD;
    text-decoration: underline;
    display: block;
    margin-top: 15px;
}
h1 {
    color: #769FCD;
    margin-bottom: 20px;
    font-size: 1.8rem;
}

.done-button {
    width: 100%;
    padding: 12px;
    background-color: #769FCD;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    height: auto;
}

.done-button:hover {
    background-color: #5a8bbf;
}

@media (max-width: 576px) {
    .payment-card {
        padding: 20px;
    }

    .payment-image {
        width: 120px;
        height: 120px;
    }

    h1 {
        font-size: 1.5rem;
    }

    .done-button {
        font-size: 0.9rem;
    }
}
</style>
