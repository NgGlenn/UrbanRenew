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
                userId: this.getUserID(),
                temp: sessionStorage.getItem("userId")
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

                // Add filters for both customerId and status
                const jobRequestsQuery = query(
                    jobRequestsCollection,
                    where("customerId", "==", this.userId),
                    //where("quoteReceived", "==", "Pending") // Filter by "Pending"
                );

                const jobRequestsSnapshot = await getDocs(jobRequestsQuery);
                const jobRequests = jobRequestsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    contractorId: doc.data().contractorId,
                    contractorName: doc.data().contractorName,
                    customerId: doc.data().customerId,
                    customerName: doc.data().customerName,
                    jobType: doc.data().jobType,
                    jobDetails: doc.data().jobDetails,
                    projectId: doc.data().projectId,
                    status: doc.data().status,
                    budget: doc.data().budget,
                    startDate: doc.data().startDate,
                    endDate: doc.data().endDate,
                    quoteamt: doc.data().quoteamt,
                    quoteReceived: doc.data().quoteReceived,
                    comments: doc.data().comments
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
            <h2 class="header"><b> Job Requests (Customer) </b></h2>

            <p v-if="jobRequests.length==0" style="font-style: italic;"> No job requests yet. </p>

            <UserJobRequests
            v-for="request of jobRequests"
            :id="request.id"
            :contractor-id="request.contractorId"
            :contractor-name="request.contractorName"
            :customer-id="request.customerId"
            :customer-name="request.customerName"
            :status="request.status"
            :job-type="request.jobType"
            :desc="request.jobDetails"
            :start-date="request.startDate"
            :end-date="request.endDate"
            :budget="request.budget"
            :quoted-price="request.quoteamt"
            :comments="request.comments"
            :quote-received="request.quoteReceived"
            :project-id="request.projectId"></UserJobRequests>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    .header{
        font-size: 2rem;
        font-weight: 700;
        color: #769FCD;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #ccc;      
    }
</style>