<script>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import UserJobRequests from '@/components/UserJobRequests.vue';
    import { doc, getDoc, getDocs } from "firebase/firestore";
    import { useCollection } from 'vuefire';
    import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from 'firebase/firestore';
    import { inject } from 'vue';


    export default{
        setup(){
            const db = inject('db');
            const jobRequests = useCollection(collection(db, 'jobRequests'));
        },

        data(){
            return {
                
            }
        },

        methods: {
            getJobRequests(){ //returns JSON of job requests from database
                return [
                    {
                        id: 1,
                        contractor: "Contractor 1",
                        status: "Pending",
                        desc: "Lorem ipsum jbscbchjvjhknjknjbmnbmnbbjkbkjbkhvhvbnvvnvjvhvjhvnmvvhvhvhv",
                        startDate: "01/01/24",
                        endDate: "01/01/25",
                        budget: 110,
                        quoteReceived: false
                    },
                    {
                        id: 2,
                        contractor: "Contractor 2",
                        status: "Quotation Received",
                        desc: "Lorem ipsum jbscbchjvjh",
                        startDate: "02/02/24",
                        endDate: "02/02/25",
                        budget: 110,
                        quoteReceived: true
                    }
                ]
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
        <div class="main-body">
            <h2><b> Job Requests </b></h2>
            
            <UserJobRequests
            v-for="request of jobRequests"
            :id="request.id"
            :contractor="request.contractor"
            :status="request.status"
            :desc="request.desc"
            :start-date="request.startDate"
            :end-date="request.endDate"
            :budget="request.budget"
            :quote-received="request.quoteReceived"></UserJobRequests>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    
</style>