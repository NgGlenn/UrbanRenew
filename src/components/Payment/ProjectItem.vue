<script>
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import defaultProfileIcon from "@/assets/defaultProfileIcon.jpg"; //to display default picture if no profile picture set
export default {
    name: "ProjectItem",
    data() {
        return {
            userID: null,
            userRole: '', 
            contractorImageUrl: '',
            currentDate: new Date(),
        };
    },
    props: {
        project: {
            type: Object,
            required: true,
        },
    },
    async mounted() {
        // Fetch contractor's image based on contractorId from project
        if (this.project.contractorId) {
            try {
                const contractorDoc = await getDoc(doc(db, "users", this.project.contractorId));
                if (contractorDoc.exists()) {
                    this.contractorImageUrl = contractorDoc.data().imageUrl || defaultProfileIcon ; // Store contractor's image URL
                } else {
                    console.error("No such contractor document!");
                }
            } catch (error) {
                console.error("Error fetching contractor image:", error);
            }
        }

        // Fetch user role
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        this.userRole = userDoc.data().role; // Store user role
                    }
                }
            });
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    },
    methods: {
        goToPaymentPage() {
            //console.log("Project object:", this.project);
            const queryParams = new URLSearchParams({
                jobID: this.project.id,
            }).toString();

            this.$router.push(`/payment2?${queryParams}`);
        },
    },
};
</script>
<template>
    <div class="row project-item align-items-center mb-4 p-3 border rounded shadow-sm">
        <div class="col-sm-2 d-flex justify-content-center align-items-center">
            <img :src="contractorImageUrl" alt="User Logo" class="contractor-logo">
        </div>
        <div class="col-sm-6">
            <h5 class="mb-1">{{ project.jobName }}</h5>
            <p v-if="userRole=== 'customer'" class="mb-1"><strong>Contractor:</strong> {{ project.contractorName }}</p>
            <p v-if="userRole=== 'contractor'" class="mb-1"><strong>Customer:</strong> {{ project.customerName }}</p>
            <p class="mb-1"><strong>Percentage Paid:</strong> {{ ((project.price - project.remainingBalance) / project.price * 100).toFixed(2) }}%</p>
            <p class="mb-1"><strong>Price:</strong> ${{ project.price }}</p>
            <p class="mb-1"><strong>Remaining Cost:</strong> ${{ project.remainingBalance }}</p>
            <p v-if="project.hold==='held'&& userRole==='contractor'"><strong>Days to Payment Release:</strong> {{ project.daysRemaining }} days</p>
        </div>
        <div class="col-sm-4 d-flex justify-content-sm-end justify-content-center mt-2 mt-sm-0">
            <button
                v-if="userRole === 'customer' && (project.paidstatus === 'pending' || project.paidstatus === 'partiallypaid')"
                type="button" class="btn btn-primary" @click="goToPaymentPage">
                Make Payment
            </button>
        </div>
    </div>
</template>



<style scoped>
.project-item {
    transition: all 0.3s ease;
    background-color: white;
}

.project-item:hover {
    background-color: #f8f9fa;
}

.contractor-logo {
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50%;
    object-fit: cover;
}

.btn {
    background-color: #769FCD;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
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