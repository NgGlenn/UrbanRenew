<template>
    <navbar />  
    <div class="quotation-page">
        <div class="quotation-card">
            <h2>Send Quotation</h2>
            <form @submit.prevent="submitQuotation">
                <div class="form-group">
                    <label for="quoteAmount">Quotation Amount</label>
                    <input
                        type="number"
                        v-model="quoteAmount"
                        id="quoteAmount"
                        placeholder="Enter quotation amount"
                        required
                    />
                </div>
                <button type="submit">Submit Quotation</button>
            </form>
        </div>
    </div>
</template>

<script>
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import navbar from '@/components/NavBar.vue';
export default {
    props: {
        jobRequestRef: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            quoteAmount: 0,
        };
    },
    methods: {
        async submitQuotation() {
            // Reference to the specific job request document
            const jobRequestId = this.$route.query.jobRequestId; // Get the document ID as a string
            const jobRequestRef = doc(db, 'jobRequests', jobRequestId); 

            try {
                // Update the `quoteamt` and `quoteReceived` fields
                await updateDoc(jobRequestRef, {
                    quoteamt: this.quoteAmount,
                    quoteReceived: 'quoteReceived',
                });
                alert('Quotation submitted successfully.');
                this.$router.push({ name: 'dashboard' }); // Redirect to the desired page after submission
            } catch (error) {
                console.error('Error submitting quotation:', error);
                alert('Failed to submit quotation. Please try again.');
            }
        },
    },
    components: {
        navbar,
    },
};
</script>

<style scoped>
/* Center the card on the page */
.quotation-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    padding: 20px;
}

/* Card styling */
.quotation-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    padding: 30px;
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
}

/* Form styling */
.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
}

input[type="number"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

/* Button styling */

button:hover {
    background-color: #563aa1;
}

/* Responsive design */
@media (max-width: 600px) {
    .quotation-card {
        padding: 20px;
    }

    h2 {
        font-size: 1.5rem;
    }

}
</style>
