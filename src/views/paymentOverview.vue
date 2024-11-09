<template>
    <NavBar></NavBar>
    <div class="payment">
        <div class="header">
            <h3>Payment</h3>

            <div class="button-group">
                <button type="button" class="btn btn-link" :class="{ selected: selectedButton === 'pending' }"
                    @click="selectButton('pending')">
                    Pending
                </button>
                <button type="button" class="btn btn-link" :class="{ selected: selectedButton === 'partiallypaid' }"
                    @click="selectButton('partiallypaid')">
                    Partially Paid
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
            <li><strong>Partially Paid</strong> - Job is partially paid.</li>
            <li><strong>Held</strong> - Payment is being processed and held by Urban Renew.</li>
            <li><strong>Released</strong> - Project has been completed and payment has been released to the contractor.</li>
        </ul>
        <p>For further assistance, contact <a href="mailto:support@urbanrenew.com">support@urbanrenew.com</a>.</p>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import ProjectItem from '@/components/Payment/ProjectItem.vue';
import { db, auth } from '../firebase'  // Ensure your firebase.js is correctly configured
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
export default {
    components: {
        ProjectItem,
        NavBar,
    },
    data() {
        return {
            userID: null,
            userRole: null,
            selectedButton: 'pending',
            renoPaymentItems:[],
            currentDate: new Date(),
            jobCompletionDate: null,
        };
    },
    async created() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.userID = user.uid; // Store logged-in user ID
                console.log("User ID:", this.userID);
                try {
                    // Retrieve the user's document from Firestore
                    const userDoc = await getDoc(doc(db, "users", this.userID));
                    if (userDoc.exists()) {
                        this.userRole = userDoc.data().role; // Store the user's role
                        //console.log("User role:", this.userRole);  
                    } else {
                        console.error("No such user document!");
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
        });
        await this.fetchJobs();
    },
    computed: {
        filteredProjects() {
            return this.renoPaymentItems.filter((project) => {
                // Ensure project involves the logged-in user
                console.log(project.customerId);
                if (project.contractorId !== this.userID && project.customerId !== this.userID) {
                    return false; // Exclude projects that don't involve the user
                }

                // Parse endDate from project data 
                const endDate = new Date(project.endDate); // Adjust this if endDate is stored differently
                //console.log("End date:", endDate);
                // Calculate the time difference in days
                const daysDifference = (endDate- this.currentDate) / (1000 * 60 * 60 * 24);
                //console.log("Days difference:", daysDifference);
                //console.log(this.currentDate);
                // Filter projects based on selected button and date conditions
                if (this.selectedButton === 'held') {
                    return project.paidstatus === 'paid' && daysDifference <= 7;
                } else if (this.selectedButton === 'released') {
                    return project.paidstatus === 'paid' && daysDifference > 7;
                } else {
                    return project.paidstatus === this.selectedButton;
                }
            });
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
                console.log("Payment items:", this.renoPaymentItems);
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
h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #769FCD;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid #ccc;
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
}

.btn-link {
    text-decoration: none;
    font-size: 1.1rem;
    color: #769FCD;
    padding: 5px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.btn-link:hover {
    background-color: rgba(0, 123, 255, 0.1);
    /* Light hover effect */
}

.selected {
    font-weight: bold;
    color: darkblue;
    border-radius: 8px;
    padding: 5px;
    pointer-events: none;
    opacity: 0.85;
    /* background-color: rgb(193, 249, 249); */
    position: relative; /* Position relative for the ::after element */
}

.selected::after {
    content: "";
    position: absolute;
    bottom: -3px; /* Position the underline a bit below the element */
    left: 0;
    width: 100%;
    height: 4px; /* Thickness of the underline */
    background-color: #f9bf29; /* Color of the underline */
}

.payment {
    font-family: "Inter", sans-serif;
}

.payment-items {
    padding: 10px;
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
@media (max-width: 768px) {
    h3 {
        font-size: 1.5rem;
    }

    .button-group {
        flex-direction: column;
        gap: 8px;
        align-items: center;
    }

    .btn-link {
        font-size: 1rem;
        padding: 8px;
    }

    .help-section {
        font-size: 0.8rem;
    }
}
</style>