<script>
    import LogedInLayout from '@/components/LogedInLayout.vue';
    import ContractorJobRequest from '@/components/ContractorJobRequest.vue';
    import { doc, getDoc, getDocs } from "firebase/firestore";
    import { useCollection } from 'vuefire';
    import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
    import { db } from "@/firebase";


    export default{
        data(){
            return {
                jobRequests: [],
                targetContractor: "pending"
            }
        },
        async created() {
        this.jobRequests = await this.getJobRequests();
        },
        computed: {
        filteredJobRequests() {
            return this.jobRequests.filter(
                request => request.quote-received === this.targetContractor
            );
        }
        },

        methods: {
        async getJobRequests() {
            const contractorId = "YAScJRRBv48AlGdeHqeI"; // hardcoded for now
            const jobRequestsCollection = collection(db, "jobRequests");

            // Add filters for both contractorId and status
            const jobRequestsQuery = query(
                jobRequestsCollection,
                where("contractorId", "==", contractorId),
                where("quoteReceived", "==", "Pending") // Filter by "Pending"
            );

            const jobRequestsSnapshot = await getDocs(jobRequestsQuery);
            const jobRequests = jobRequestsSnapshot.docs.map(doc => ({
                id: doc.id,
                contractorId: doc.data().contractorId,
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
            ContractorJobRequest
        }
    }
</script>

<template>
    <LogedInLayout>
        <div class="main-body">
            <h2><b> Job Requests </b></h2>
            
            <ContractorJobRequest
            v-for="request of jobRequests"
            :id="request.id"
            :contractorId="request.contractorId"
            :contractor="request.contractorName"
            :status="request.status"
            :desc="request.jobDetails"
            :budget="request.budget"
            :quote-received="request.quoteReceived"
            :startDate="request.startDate"
            :endDate="request.endDate"></ContractorJobRequest>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    
</style>