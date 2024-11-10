import { defineStore } from "pinia";
import { useCollection, useDocument } from "vuefire";
import { doc, collection, documentId, orderBy, query, where } from "firebase/firestore";
import { useUserStore } from "./userStore";
import { ref, computed, inject, watch, nextTick } from "vue";

export const useProjectStore = defineStore('projects', () => {
    const userStore = useUserStore();
    const db = inject('db');
    const currentJobId = ref(null);
    const isLoading = ref(false)


    //Get project for current user
    const projectsQuery = computed(() => {
        if (!userStore.userId) return null;
        return query (
            collection(db, 'projects'),
            where ('customerId', '==', userStore.userId)
        );
    });
    const { data: projects } = useCollection(projectsQuery);

    //Get all jobs for project
    const jobsQuery = computed(() => {
        //Customer project query to display their respective project
        const projectId = projects.value?.[0]?.id;
        if (!projectId) return null;
        return query(
            collection(db, 'jobs'),
            where('projectId', '==', projectId)
        );
    });
    const { data: jobs } = useCollection(jobsQuery);

    //Get all tasks for jobs
    const tasksQuery = computed(() => {
        if (!jobs.value?.length) return null;
        const jobIds = jobs.value.map(job => job.id); //Get all jobId
        return query(
            collection(db, 'tasks'),
            where ('jobId', 'in', jobIds),
            orderBy('startDate', 'asc')
        );
    });
    const { data: tasks } = useCollection(tasksQuery);

    //Get contractor company details to display on dashboard 
    const contractorQuery = computed(() => {
        if (!jobs.value?.length) return null;
        const contractorIds = jobs.value.map(job => job.contractorId);
        return query(
            collection(db, 'contractors'),
            where (documentId(), 'in', contractorIds)
        )
    })
    const {data: contractorCompany } = useCollection(contractorQuery);

    //Get contractor name to display on dashboard 
    const contractorNameQuery = computed(() => {
        if (!contractorCompany.value?.length) return null;
        const staffIds = contractorCompany.value.map(contractor => contractor.id);
        // console.log(staffIds)
        return query(
            collection(db, 'users'),
            where(documentId(), 'in', staffIds)
        )
    })
    const { data: contractorStaff } = useCollection(contractorNameQuery);
    // console.log(contractorStaff)

    //Jobs that a contractor has (ongoing and completed) for contractorProjectList.vue
    const contractorJobsQuery = computed(() => {
        if (!userStore.userId) return null;
        return query(
            collection(db, 'jobs'),
            where('contractorId', '==', userStore.userId)
        );
    });
    const { data: contractorJobs } = useCollection(contractorJobsQuery);
    // console.log(contractorJobs)
   

    watch(currentJobId, (newId) => {
        console.log('currentJobId updated to:', newId);
    });


    // Function to set current project for detailed view
    // const setCurrentJob = (jobId) => {
    //     // console.log("Previous currentJobId:", currentJobId.value);
    //     // currentJobId.value = jobId;
    //     // console.log("New currentJobId:", currentJobId.value);
    //     // console.log("Previous currentJobId:", currentJobId.value);
    //     // currentJobId.value = jobId;
    //     // await nextTick(); // Wait for Vue to process the update
    //     // console.log("New currentJobId set to:", currentJobId.value);
    //     // return new Promise((resolve) => {
    //     //     console.log("Previous currentJobId:", currentJobId.value);
    //     //     currentJobId.value = jobId;
    //     //     nextTick(() => {
    //     //         console.log("New currentJobId set to:", currentJobId.value);
    //     //         resolve();
    //     //     });
    //     // });

    //     // try {
    //     //     await clearCurrentJob(); // Clear current job first
    //     //     currentJobId.value = jobId;

    //     //     // Wait for both job and task data to be loaded
    //     //     await Promise.all([
    //     //         new Promise((resolve) => {
    //     //             let stop = watch(currentJob, (newVal) => {
    //     //                 if (newVal) {
    //     //                     stop();
    //     //                     resolve();
    //     //                 }
    //     //             });
    //     //         }),
    //     //         new Promise((resolve) => {
    //     //             let stop = watch(currentTask, (newVal) => {
    //     //                 if (newVal) {
    //     //                     stop();
    //     //                     resolve();
    //     //                 }
    //     //             });
    //     //         })
    //     //     ]);
    //     // } catch (error) {
    //     //     console.error('Error setting current job:', error);
    //     //     throw error;
    //     // }

    //     currentJobId.value = jobId;
    // };

    // const setCurrentJob = async (jobId) => {
    //     try {
    //         isLoading.value = true;
    //         currentJobId.value = jobId;

    //         // Fixed Promise setup for watching data load
    //         await Promise.all([
    //             // Watch for job data
    //             new Promise(resolve => {
    //                 let stopWatchJob = watch(currentJob, (newVal) => {
    //                     if (newVal) {
    //                         stopWatchJob(); // Stop watching
    //                         resolve();
    //                     }
    //                 });
    //             }),
    //             // Watch for task data
    //             new Promise(resolve => {
    //                 let stopWatchTask = watch(currentTask, (newVal) => {
    //                     if (newVal) {
    //                         stopWatchTask(); // Stop watching
    //                         resolve();
    //                     }
    //                 });
    //             })
    //         ]);

    //         await nextTick();
    //         console.log('Job data loaded successfully:', currentJob.value);
    //         console.log('Task data loaded successfully:', currentTask.value);
    //     } catch (error) {
    //         console.error('Error setting current job:', error);
    //         throw error;
    //     } finally {
    //         isLoading.value = false;
    //     }
    // };

    // Clear current project
    // const clearCurrentJob = () => {
    //     // console.log("Clearing currentJobId from:", currentJobId.value);
    //     // currentJobId.value = null;
    //     // console.log("CurrentJobId cleared to:", currentJobId.value);
    //     // console.log("Clearing currentJobId from:", currentJobId.value);
    //     // currentJobId.value = null;
    //     // await nextTick(); // Wait for Vue to process the update
    //     // console.log("CurrentJobId cleared to:", currentJobId.value);
        
    //     // return new Promise((resolve) => {
    //     //     console.log("Clearing currentJobId from:", currentJobId.value);
    //     //     currentJobId.value = null;
    //     //     nextTick(() => {
    //     //         console.log("CurrentJobId cleared to:", currentJobId.value);
    //     //         resolve();
    //     //     });
    //     // });

    //     currentJobId.value = null;
    //     // await new Promise(resolve => setTimeout(resolve, 100)); 
    // };

    // const resetStore = () => {
    //     // currentJobId.value = null;
    //     // Reset any other relevant state
    //     clearCurrentJob();
    // };

    // const resetStore = async () => {
    //     isLoading.value = true;
    //     currentJobId.value = null;
    //     await nextTick();
    //     isLoading.value = false;
    // };

    const resetStore = async () => {
        isLoading.value = true;
        currentJobId.value = null;
        await nextTick();
        isLoading.value = false;
    };

    const setCurrentJob = async (jobId) => {
        try {
            isLoading.value = true;
            await resetStore();
            currentJobId.value = jobId;
            await nextTick();
        } catch (error) {
            console.error('Error setting current job:', error);
        } finally {
            isLoading.value = false;
        }
    };

    watch(currentJobId, (newVal, oldVal) => {
        console.log(`currentJobId changed from ${oldVal} to ${newVal}`);
    });

    // Get specific job details
    const currentJobQuery = computed(() => {
        if (!currentJobId.value) return null;
        return doc(db, 'jobs', currentJobId.value);
    });
    const { data: currentJob } = useDocument(currentJobQuery);
    // console.log(currentJob)

    const currentTaskQuery = computed(() => {
        // if (!currentJobId.value || !currentJob.value) return null;
        // return query(
        //     collection(db, 'tasks'),
        //     where('jobId', '==', currentJobId.value),
        //     orderBy('startDate', 'asc')
        // );

        console.log('Task Query - Comparing values:');
        console.log('currentJobId from store:', currentJobId.value);
        console.log('currentJobId type:', typeof currentJobId.value);
        // console.log('Expected jobId in Firestore: "O2JyZrRbhhXN1tztLhMx"');

        if (!currentJobId.value) return null;

        // For debugging, log the exact query we're making
        const taskQuery = query(
            collection(db, 'tasks'),
            where('jobId', '==', currentJobId.value),
            orderBy('startDate', 'asc')
        );

        console.log('Query created with jobId:', currentJobId.value);
        return taskQuery;
    });
    const { data: currentTask } = useCollection(currentTaskQuery);
    // console.log(currentTask)

    // Add logging for main query
    watch(currentTask, (tasks) => {
        console.log('Main Query - Tasks returned:', tasks);
    }, { immediate: true });

    // Keep this verification query
    const verifyTasksQuery = computed(() => query(collection(db, 'tasks')));
    const { data: allTasks } = useCollection(verifyTasksQuery);

    watch(allTasks, (tasks) => {
        if (tasks) {
            console.log('Verify Query - All tasks:', tasks.map(task => ({
                id: task.id,
                jobId: task.jobId,
                jobIdType: typeof task.jobId
            })));
            // Add comparison with currentJobId
            console.log('Looking for jobId:', currentJobId.value);
            const matchingTasks = tasks.filter(task => task.jobId === currentJobId.value);
            console.log('Matching tasks found:', matchingTasks);
        }
    }, { immediate: true });

    // // Add watcher to see what's coming back
    // watch(currentTask, (tasks) => {
    //     console.log('Tasks returned from query:', tasks);
    //     if (tasks && tasks.length === 0) {
    //         console.log('No tasks found for jobId:', currentJobId.value);
    //     }
    // }, { immediate: true });

    // // Temporary query to verify task data
    // const verifyTasksQuery = computed(() => query(collection(db, 'tasks')));
    // const { data: allTasks } = useCollection(verifyTasksQuery);

    // watch(allTasks, (tasks) => {
    //     if (tasks) {
    //         console.log('All tasks in collection:', tasks.map(task => ({
    //             id: task.id,
    //             jobId: task.jobId,
    //             jobIdType: typeof task.jobId
    //         })));
    //     }
    // }, { immediate: true });


 

    return {
        projects,
        jobs,
        tasks,
        contractorCompany,
        contractorStaff,
        contractorJobs,
        currentJob,
        currentTask,
        currentJobId,
        setCurrentJob,
        // clearCurrentJob,
        resetStore,
        isLoading
    }

})