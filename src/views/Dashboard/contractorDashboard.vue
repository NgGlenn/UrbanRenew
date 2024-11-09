<script setup>
    console.log('contractorDashboard loading')
    import { useRoute, useRouter } from 'vue-router';
    import { computed, onMounted, onUnmounted,watch } from 'vue';
    import projectDashboard from '@/components/projectDashboard.vue';
    import { useProjectStore } from '@/stores/projectStore';
    import { storeToRefs } from 'pinia';

    console.log('Script starting'); // Check if script runs at all

    const route = useRoute();
    console.log('Current route:', route);
    console.log('Current URL:', window.location.href);
    const router = useRouter();
    const projectStore = useProjectStore();
    const { currentJob, currentTask, contractorCompany, contractorStaff } = storeToRefs(projectStore);
    // const jobs = currentJob;
    // console.log(jobs)
    // console.log(typeof(jobs))
    // const tasks = currentTask;
    // console.log(tasks)
    // console.log(typeof(tasks))
    
    // onMounted(() => {
    //     console.log(route.params)
    //     projectStore.setCurrentJob(route.params.jobId);
    // });
    const clearJobData = () => {
        projectStore.clearCurrentJob();
    };

    watch(
        // () => route.params.jobId,
        // (newJobId) => {
        //     console.log('JobId from route:', newJobId);
        //     if (newJobId) {
        //         projectStore.setCurrentJob(newJobId);
        //     }
        // },
        // { immediate: true } // This makes it run immediately when component is created
        // () => route.params.jobId,
        // (newJobId, oldJobId) => {
        //     if (newJobId) {
        //         if (oldJobId) {
        //             clearJobData();
        //         }
        //         projectStore.setCurrentJob(newJobId);
        //     }
        // },
        // { immediate: true }
        // () => route.params.jobId,
        // async (newJobId) => {
        //     if (newJobId) {
        //         await projectStore.setCurrentJob(newJobId);
        //     }
        // },
        // { immediate: true }

        // async (newJobId) => {
        //     if (newJobId) {
        //         try {
        //             // await projectStore.clearCurrentJob();
        //             await projectStore.setCurrentJob(newJobId);
        //         } catch (error) {
        //             console.error('Error setting job:', error);
        //         }
        //     }
        // },
        // { immediate: true }

        // () => route.params.jobId,
        // async (newJobId, oldJobId) => {
        //     if (newJobId && newJobId !== oldJobId) {
        //         try {
        //             await projectStore.clearCurrentJob();
        //             await new Promise(resolve => setTimeout(resolve, 100));
        //             await projectStore.setCurrentJob(newJobId);
        //         } catch (error) {
        //             console.error('Error setting job:', error);
        //         }
        //     }
        // },
        // { immediate: true }

        () => route.params.jobId,
        async (newJobId, oldJobId) => {
        if (newJobId) {
            try {
                projectStore.resetStore();
                console.log('Route jobId changed:', newJobId);
                await projectStore.clearCurrentJob();
                await new Promise(resolve => setTimeout(resolve, 100));
                await projectStore.setCurrentJob(newJobId);
                // Force a recompute of the computed properties
                projectData.value;
            } catch (error) {
                console.error('Error setting job:', error);
            }
        }
        },
        { immediate: true }
    );

    // onUnmounted(() => {
    //     await clearJobData();
    // });
    onUnmounted(async () => {
        projectStore.resetStore();

        try {
            await projectStore.clearCurrentJob();
        } catch (error) {
            console.error('Error clearing job:', error);
        }
    });


    //Data to pass to ProjectDashboard component
    // const projectData = computed(() => ({
    //     // currentJob: currentJob?.value || null,
    //     // currentTask: currentTask?.value || null,
    //     // contractorCompany: contractorCompany?.value || null,
    //     // contractorStaff: contractorStaff?.value || null,
    //     // jobId: route.params.jobId
    //     jobs: { value: [currentJob.value] },  // Wrap single job in array
    //     tasks: { value: currentTask.value },
    //     contractorCompany: { value: currentJob.value.company },
    //     contractorStaff: { value: currentJob.value.contractorName },
    //     projectId: route.params.jobId
    // }));
    // Computed properties with null handling
    const projectData = computed(() => {
        if (!currentJob.value) return {
            jobs: { value: [] },
            tasks: { value: [] },
            contractorCompany: { value: '' },
            contractorStaff: { value: '' },
            projectId: ''
        };

        return {
            jobs: { value: [currentJob.value] },
            tasks: { value: currentTask.value || [] },
            contractorCompany: { value: currentJob.value?.company || '' },
            contractorStaff: { value: currentJob.value?.contractorName || '' },
            projectId: route.params.jobId
        };
    });
    console.log(route.params.jobId)
    console.log(projectData.value)

    // const customerDetails = computed(() => ({
    //     id: currentJob.value.customerId,
    //     name: currentJob.value.customerName,
    //     location: currentJob.value.location,
    //     paidStatus: currentJob.value.paidstatus,
    //     status: currentJob.value.status,
    // }))

    const customerDetails = computed(() => {
        if (!currentJob.value) return {
            id: '',
            name: '',
            location: '',
            paidStatus: '',
            status: '',
        };

        return {
            id: currentJob.value.customerId,
            name: currentJob.value.customerName,
            location: currentJob.value.location,
            paidStatus: currentJob.value.paidstatus,
            status: currentJob.value.status,
        };
    });
</script>

<template>
    <!-- <div>
        {{ console.log('Template rendering') }}
        <button @click="handleBack" class="btn btn-secondary back-btn mb-3">
            ← Back to Projects
        </button>
        
        <div v-if="route.params.jobId">
            <p>Job ID: {{ route.params.jobId }}</p>
            <projectDashboard :project-data="projectData" :is-contractor="true"/>
        </div>
        <div v-else>
            <p>No job ID found in route params</p>
        </div>
    </div> -->
    <div>
        <projectDashboard :project-data="projectData" :is-contractor="true" :customer-details="customerDetails"/>
    </div>
</template>

<style scoped>
    .back-btn {
        margin-left: 1rem;
    }
</style>