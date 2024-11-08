<script setup>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useProjectStore } from '@/stores/projectStore';
    import { useUserStore } from '@/stores/userStore';
    import { storeToRefs } from 'pinia';

    const router = useRouter();
    const projectStore = useProjectStore();
    const { contractorJobs } = storeToRefs(projectStore);

    const OngoingProjects = computed(() => contractorJobs.value?.filter(job => job.status === 'in_progress')|| []);
    const CompletedProjects = computed(() => contractorJobs.value?.filter(job => job.status === 'completed')|| []);
    console.log(CompletedProjects.value)
    
    const viewProjectDetails = (jobId) => {
        console.log(jobId);
        projectStore.setCurrentJob(jobId);
        router.push(`/job/${jobId}`);
        // router.push({
        //     name: 'JobDetails',
        //     params: { jobId: jobId }
        // });
    };

    // const viewProjectDetails = (jobId) => {
    //     console.log('Starting navigation');
    //     const userStore = useUserStore();
    //     console.log('User role:', userStore.userRole);  // Check if role is 'contractor'
        
    //     try {
    //         projectStore.setCurrentJob(jobId);
    //         router.push(`/job/${jobId}`);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };
</script>

<template>
    <LogedInLayout>
        <div class="projectContent">
            <h1 style="color: ##769FCD;"><strong>Current Projects</strong></h1>
            <div v-if="OngoingProjects">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(job, index) in OngoingProjects">
                    <div class="col-1 d-flex align-items-center">Project: #{{index + 1}}</div>
                    <div class="col-11 projectDetails">
                        <div class="projectText">
                            <div class="topText">
                                <strong>Customer Name:</strong> {{job.customerName}} 
                                &nbsp;<strong>Customer ID:</strong> {{job.customerId}}
                            </div>
                            <div class="bottomText">
                                <strong>Location:</strong> {{job.location}}
                                <strong>Project ID:</strong> {{job.projectId}}
                            </div>
                        </div>
                        <div class="view-button">
                            <button @click="viewProjectDetails(job.id)" class="btn btn-secondary">
                            View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="projectContent">
            <h1 style="color: ##769FCD;"><strong>Completed Projects</strong></h1>
            <div v-if="CompletedProjects">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(job, index) in CompletedProjects" :key="job">
                    <div class="col-1 d-flex align-items-center p-0 projectNo">Project: #{{index + 1}}</div>
                    <div class="col-11 projectDetails">
                        <div class="projectText">
                            <div class="topText">
                                <strong>Customer Name:</strong> {{job.customerName}} 
                                &nbsp;<strong>Customer ID:</strong> {{job.customerId}}
                            </div>
                            <div class="bottomText">
                                <strong>Location:</strong> {{job.location}}
                                <strong>Project ID:</strong> {{job.projectId}}
                            </div>
                        </div>
                        <div class="view-button">
                            <button @click="viewProjectDetails(job.id)" class="btn btn-secondary">
                            View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LogedInLayout>
</template>
    
<style scoped>
.projectNo {
    width: 10%;
}
.projectContent {
    width: 100%;
    min-height: 100%;
    margin-bottom: 50px;
    padding: 50px 10px
}

.projectDetails {
    border: 5px solid grey;
    border-radius: 10px;
    background-color: lightgray;
    color: black;
    padding: 1rem;
    width: 90%;
    display: flex;
    height: auto;
   
}
.view-button{
    width: 10%;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
}


.projectText{
    width: 90%;
    height: 100%;
    display: flex;
    justify-content: start;
    flex-direction: column;
    gap: 1rem;
}

.topText {
    display: flex;
    gap: 1rem;  /* Space between items in the top row */
}

.bottomText {
    display: flex;
    gap: 1rem;  /* Space between items in the bottom row */
}

@media (max-width: 768px) {
    .row {
        flex-direction: column;
        gap: 1rem;
    }

    .col-1, .col-11 {
        width: 100%;
        text-align: center;
    }

    .view-btn {
        width: auto;
    }
}
</style>