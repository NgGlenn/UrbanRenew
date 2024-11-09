<script setup>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import { computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useProjectStore } from '@/stores/projectStore';
    import { useUserStore } from '@/stores/userStore';
    import { storeToRefs } from 'pinia';

    const router = useRouter();
    const projectStore = useProjectStore();
    const { contractorJobs } = storeToRefs(projectStore);

    const OngoingJobs = computed(() => contractorJobs.value?.filter(job => job.status === 'in_progress')|| []);
    const CompletedJobs = computed(() => contractorJobs.value?.filter(job => job.status === 'completed')|| []);
    // console.log('ongoing jobs', OngoingJobs.value)
    // console.log('completed jobs', CompletedJobs.value)
    
    const addresses = [
        "Blk 123 Tampines Street 11 #05-234, Singapore 521123",
        "45 Jalan Bukit Merah #08-12, Singapore 159456",
        "Block 789 Jurong West Ave 5 #12-432, Singapore 640789",
        "67 Marine Parade Road #03-01, Singapore 449297",
        "Blk 555 Ang Mo Kio Ave 10 #15-321, Singapore 560555",
        "88 Kallang Way #04-15, Singapore 349245",
        "Block 234 Serangoon Ave 3 #10-123, Singapore 550234",
        "156 Yishun Ring Road #06-432, Singapore 760156",
        "Blk 445 Clementi Ave 3 #11-222, Singapore 120445",
        "78 Toa Payoh Lorong 4 #07-89, Singapore 310078"
    ]

    // const viewJobDetails = (jobId) => {
    //     // console.log(jobId);
    //     // projectStore.clearCurrentJob();
    //     // projectStore.setCurrentJob(jobId);
    //     // router.push(`/job/${jobId}`);
    //     // router.push({
    //     //     name: 'JobDetails',
    //     //     params: { jobId: jobId }
    //     // });
    //     router.push({
    //         path: `/job/${jobId}`,
    //         query: { specificJobId: jobId }
    //     });
    // };

    const viewJobDetails = async (jobId) => {
        // projectStore.clearCurrentJob(); // Clear before setting new
        // projectStore.setCurrentJob(jobId);
        // router.push(`/job/${jobId}`);

        // await projectStore.clearCurrentJob(); // Wait for clear to complete
        // await router.push(`/job/${jobId}`); // Navigate first
        // projectStore.setCurrentJob(jobId); // Then set the new job

        // try {
        //     await projectStore.clearCurrentJob();
        //     await new Promise(resolve => setTimeout(resolve, 0));
        //     await router.push(`/job/${jobId}`);
        //     await projectStore.setCurrentJob(jobId);
        // } catch (error) {
        //     console.error('Error navigating to job details:', error);
        // }

        try {
            console.log('Starting navigation to job:', jobId);
            projectStore.resetStore();
            await projectStore.clearCurrentJob();
            // Add small delay to ensure state is cleared
            await new Promise(resolve => setTimeout(resolve, 100));
            await router.push(`/job/${jobId}`);
        } catch (error) {
            console.error('Error navigating to job details:', error);
        }
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

    onMounted(async () => {
        const store = useProjectStore();
        await store.clearCurrentJob();
    });
</script>

<template>
    <LogedInLayout>
        <div class="projectContent">
            <h1 style="color: #769FCD;"><strong>Current Jobs</strong></h1>
            <div v-if="OngoingJobs?.length">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(job, index) in OngoingJobs">
                    <div class="col-1 d-flex align-items-center">Job: #{{index + 1}}</div>
                    <div class="col-11 projectDetails">
                        <div class="projectText">
                            <div><strong>Customer Name:</strong> {{job.customerName}} </div>
                            <div><strong>Job Location:</strong> {{job.location || addresses[index]}}</div>
                            <div><strong>Job Name:</strong> {{job.jobName}}</div>
                            <div><strong>Job Description:</strong> {{job.description}}</div>
                            <div><strong>Start Date: </strong> {{job.startDate}}</div>
                            <div><strong>End Date: </strong> {{job.endDate}}</div>
                       
                            <!-- <div class="topText">
                                
                            </div>
                            <div class="bottomText">
                                
                                <strong>Project ID:</strong> {{job.projectId}}
                            </div> -->
                        </div>
                        <div class="view-button">
                            <button @click="viewJobDetails(job.id)" class="btn btn-secondary">
                            View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h3 style="font-style: italic;">No active jobs taken</h3>
            </div>
        </div>
        <div class="projectContent">
            <h1 style="color: #769FCD;"><strong>Completed Jobs</strong></h1>
            <div v-if="CompletedProjects?.length">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(job, index) in CompletedJobs" :key="job">
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
                            <button @click="viewJobDetails(job.id)" class="btn btn-secondary">
                            View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h3 style="font-style: italic;">No completed jobs</h3>
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
    margin-bottom: 25px;
    padding: 25px 20px
}

.projectDetails {
    border: 3px solid lightgray;
    border-radius: 10px;
    background-color: #dee8ef;
    color: #555;
    padding: 12px;
    width: 90%;
    display: flex;
    height: auto;
    font-size: 18px;
   
}

.view-button {
    display: flex;
    align-items: center;
}

button {
    /* width: 10%; */
    height: fit-content;
    /* display: flex;
    justify-content: end;
    align-items: center; */
}


.projectText{
    width: 93%;
    height: 100%;
    display: flex;
    justify-content: start;
    flex-direction: column;
    gap: 8px;
}

.topText {
    display: flex;
    gap: 10px;  /* Space between items in the top row */
}

.bottomText {
    display: flex;
    flex-direction: column;
    gap: 10px;  /* Space between items in the bottom row */
}

@media (max-width: 768px) {
    .row {
        flex-direction: column;
        gap: 10px;
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