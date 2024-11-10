<template>
    <div>
        <NavBar />
        <div class="container payment-container">
            <div class="row g-4 justify-content-center">
                <div class="payment-form-container mb-4">
                    <PaymentForm :project="project" />
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import NavBar from '@/components/NavBar.vue';
import PaymentDetails from '@/components/Payment/PaymentDetails.vue';
import PaymentForm from '@/components/Payment/PaymentForm.vue';
import { db } from '../firebase'  // Ensure your firebase.js is correctly configured
import { collection, getDocs } from 'firebase/firestore';
import { useRoute } from 'vue-router';
export default {
    components: {
        NavBar,
        PaymentDetails,
        PaymentForm
    },
    data() {
        return {
            project: null,
            renoPaymentItems: [],
            // renoPaymentItems: [
            //     {
            //         projectID: 1234,
            //         projectName: 'Hacking of Wall',
            //         contractorName: 'Adrian Tok & Co.',
            //         price: 100000,
            //         status: 'pending',
            //     },
            //     {
            //         projectID: 1299,
            //         projectName: 'Kitchen Reno',
            //         contractorName: 'Shaunbrina Carpentry',
            //         price: 167880,
            //         status: 'held',
            //     },
            //     {
            //         projectID: 4569,
            //         projectName: 'Toilet Plumbing',
            //         contractorName: "Joel's Toilets",
            //         price: 25000,
            //         status: 'pending',
            //     },
            //     {
            //         projectID: 8970,
            //         projectName: 'Cabinet in Master Bedroom',
            //         contractorName: 'Moses & Bed',
            //         price: 1000,
            //         status: 'released',
            //     },
            //     {
            //         projectID: 8930,
            //         projectName: 'Windows for Bedroom',
            //         contractorName: "Glenn's Windows and Doors",
            //         price: 156700,
            //         status: 'held',
            //     },
            // ]
        };
    },
    async created() {
        await this.fetchJobs();
        const jobID = this.$route.query.jobID;
        //console.log(jobID)
        // const jobId = this.$route.query.jobId || this.$route.query.projectID;
        
        // if (jobId) {
        //     this.project = this.renoPaymentItems.find(p => 
        //         p.jobID === jobId || 
        //         p.jobID === Number(jobId)
        //     );
        // }
        this.project = this.renoPaymentItems.find(p => p.id === jobID);
        
    },
    methods:{
        async fetchJobs(){
            try {
                const jobCollection = await getDocs(collection(db, 'jobs'));
                this.renoPaymentItems = jobCollection.docs.map(doc => ({
                    id: doc.id, // Document ID
                    ...doc.data(), // Document data

                }));
                console.log(this.renoPaymentItems);
            } catch (e) {
                console.error("error fetching payments",e);
            }
    }
}};
</script>

<style scoped>
.payment-container {
    padding: 20px;
}

.payment-details-container,
.payment-form-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 30px;
    border: 10px;
}

.project-info {
    margin-bottom: 20px;
}

.project-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
}

.contractor,
.price {
    font-size: 1rem;
    margin: 5px 0;
}

.price {
    font-size: 1.2rem;
    color: #28a745;
    /* Green color for price */
}

.payment-form-container h3 {
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-control:focus {
    border-color: #007bff;
    /* Bootstrap primary color */
    outline: none;
}

.btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.btn:hover {
    background-color: #0056b3;
    /* Darker blue on hover */
}
</style>