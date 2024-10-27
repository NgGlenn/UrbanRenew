<template>
    <NavBar />
    <div class="payment">
        <div class="header">
            <h2>Payment</h2>

            <div class="button-group">
                <button type="button" class="btn btn-link" :class="{ selected: selectedButton === 'pending' }"
                    @click="selectButton('pending')">
                    Pending
                </button>
                <button type="button" class="btn btn-link" :class="{ selected: selectedButton === 'held' }"
                    @click="selectButton('held')">
                    Held
                </button>
                <button type="button" class="btn btn-link" :class="{ selected: selectedButton === 'released' }"
                    @click="selectButton('released')">
                    Released
                </button>
            </div>
        </div>
        <div class="payment-items">
            <div class="container">
                <ProjectItem v-for="project in filteredProjects" :key="project.jobID" :project="project" />
            </div>
        </div>

    </div>

    <div class="help-section">
        <h4>Need Help?</h4>
        <p>If you're unsure about the payment statuses:</p>
        <ul>
            <li><strong>Pending</strong> - Payment not yet made.</li>
            <li><strong>Held</strong> - Payment is being processed or held by admin.</li>
            <li><strong>Released</strong> - Payment has been completed.</li>
        </ul>
        <p>For further assistance, contact <a href="mailto:support@urbanrenew.com">support@urbanrenew.com</a>.</p>
    </div>

</template>

<script>
import NavBar from '@/components/NavBar.vue';
import ProjectItem from '@/components/Payment/ProjectItem.vue';
import { db } from '../firebase'  // Ensure your firebase.js is correctly configured
import { collection, getDocs } from 'firebase/firestore';
export default {
    components: {
        ProjectItem,
        NavBar,
    },
    data() {
        return {
            selectedButton: 'pending',
            renoPaymentItems:[],
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
            // ],
        };
    },
    async created() {
        await this.fetchJobs();
    },
    computed: {
        filteredProjects() {
            return this.renoPaymentItems.filter(
                (project) => project.paidstatus === this.selectedButton
            );
        },
    },
    methods: {
        async fetchJobs() {
            try {
                const jobCollection = await getDocs(collection(db, 'jobs'));
                this.renoPaymentItems = jobCollection.docs.map(doc => ({
                    id: doc.id, // Document ID
                    ...doc.data() // Document data
                }));
                //console.log("success");
            } catch (e) {
                console.error("error fetching payments",e);
            }
        },
        selectButton(status) {
            this.selectedButton = status;
        },
    },
};
</script>

<style scoped>
h2 {
    font-size: 2.4rem;
    font-weight: 700;
    /* font-size: 30px; */
    padding: 20px 0px 0px 20px;
    /* margin-bottom: 30px; */
    color: #769FCD;
    border-bottom: 2px solid #ccc;
}

.button-group {
    display: flex;
    gap: 15px;
}

.btn-link {
    text-decoration: none;
    font-size: 1.1rem;
    color: #769FCD;
    padding: 10px 15px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.btn-link:hover {
    background-color: rgba(0, 123, 255, 0.1);
    /* Light hover effect */
}

.selected {
    font-weight: bold;
    color: #1170dd;
    border-radius: 8px;
    padding: 10px 15px;
    pointer-events: none;
    opacity: 0.85;
    background-color: rgb(193, 249, 249);
}

.payment {
    font-family: "Inter", sans-serif;
}


.header {
    padding: 20px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    margin-bottom: 20px;

}

.help-section {
    margin-top: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 0.9rem;
    font-style: italic;
}

.help-section h4 {
    margin-bottom: 8px;
    font-size: 1rem;
}

.help-section ul {
    list-style-type: none;
    padding-left: 0;
}

.help-section li {
    margin-bottom: 6px;
}
</style>