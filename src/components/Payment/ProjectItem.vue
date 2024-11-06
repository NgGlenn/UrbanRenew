<script>
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
export default {
    name: "ProjectItem",
    data() {
        return {
            userID: null,
            userRole: '', // Make userRole reactive by declaring it in data
        };
    },
    props: {
        project: {
            type: Object,
            required: true,
        },
    },
    async created() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.userID = user.uid; // Store logged-in user ID
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
        <div class="col-sm-2 auto">
            <img src="../icons/moodeng.png" alt="Contractor Logo" class="contractor-logo">
        </div>
        <div class="col-sm-6">
            <h5 class="mb-1">{{ project.description }}</h5>
            <p class="mb-1"><strong>Contractor:</strong> {{ project.contractorName }}</p>
            <p class="mb-1"><strong>Price:</strong> ${{ project.price}}</p>
        </div>
        <div class="col-sm-4 text-md-end">
            <button  v-if="userRole === 'customer' && (project.paidstatus === 'pending' || project.paidstatus === 'partiallypaid')"  type="button" class="btn btn-primary" @click="goToPaymentPage">
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
    width: 60px; /* Adjust size */
    height: 60px;
    border-radius: 50%; /* Circle shape */
    object-fit: cover; /* Ensures the image fits well */
}
</style>