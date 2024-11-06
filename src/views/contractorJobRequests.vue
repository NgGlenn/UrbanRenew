<script>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import UserJobRequests from '@/components/UserJobRequests.vue';
    import { doc, getDoc, getDocs } from "firebase/firestore";
    import { useCollection } from 'vuefire';
    import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
    import { inject } from 'vue';
    import { db } from "@/firebase";
    import { getAuth } from "firebase/auth";

    export default{

        async created() {
            this.jobRequests = await this.getJobRequests();
        },

        data(){
            return {
                //jobRequests: this.getJobRequests(), // will not load if not called twice for some reason
                jobRequests: [],
                userID: this.getUserID()
            }
        },

        methods: {
            getUserID(){
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                const uid = user.uid;  // Retrieve the user's ID
                console.log("User ID:", uid);
                return uid;
                } else {
                console.log("No user is signed in.");
                }
            },

            async getJobRequests() {
                const jobRequestsCollection = collection(db, "jobRequests");

                // Add filters for both contractorId and status
                const jobRequestsQuery = query(
                    jobRequestsCollection,
                    where("contractorId", "==", this.userID),
                    //where("quoteReceived", "==", "Pending") // Filter by "Pending"
                );

                const jobRequestsSnapshot = await getDocs(jobRequestsQuery);
                const jobRequests = jobRequestsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    contractorId: doc.data().contractorId,
                    contractorName: doc.data().contractorName,
                    createdAt: doc.data().createdAt,
                    customerId: doc.data().customerId,
                    jobDetails: doc.data().jobDetails,
                    projectId: doc.data().projectId,
                    status: doc.data().status,
                    updatedAt: doc.data().updatedAt,
                    budget: doc.data().budget,
                    startDate: doc.data().startDate,
                    endDate: doc.data().endDate,
                }));
                return jobRequests;
            }
        },

        components: {
            LogedInLayout,
            UserJobRequests
        }
    }
</script>

<template>
    <LogedInLayout>
        <div class="main-body" style="padding: 10px">
            <h2><b> Job Requests </b></h2>

            <UserJobRequests
            v-for="request of jobRequests"
            :id="request.id"
            :contractor="request.contractorName"
            :status="request.status"
            :desc="request.jobDetails"
            :start-date="request.startDate"
            :end-date="request.endDate"
            :budget="request.budget"></UserJobRequests>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    
</style>