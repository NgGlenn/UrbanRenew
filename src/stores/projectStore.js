import { defineStore } from "pinia";
import { useCollection, useDocument } from "vuefire";
import { doc, collection, documentId, orderBy, query, where } from "firebase/firestore";
import { useUserStore } from "./userStore";
import { ref, computed, inject, watch } from "vue";

export const useProjectStore = defineStore('projects', () => {
    const userStore = useUserStore();
    const db = inject('db');
    const currentJobId = ref(null);

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
    const setCurrentJob = (jobId) => {
        currentJobId.value = jobId;
        
        console.log(currentJobId.value)
    };
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
        console.log('Expected jobId in Firestore: "O2JyZrRbhhXN1tztLhMx"');

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


    // Clear current project
    const clearCurrentJob = () => {
        currentJobId.value = null;
    };

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
        clearCurrentJob
    }

})