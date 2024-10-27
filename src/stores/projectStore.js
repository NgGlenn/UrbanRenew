import { defineStore } from "pinia";
import { useCollection } from "vuefire";
import { QueryEndAtConstraint, collection, documentId, orderBy, query, where } from "firebase/firestore";
import { useUserStore } from "./userStore";
import { computed, inject } from "vue";

export const useProjectStore = defineStore('projects', () => {
    const userStore = useUserStore();
    const db = inject('db');

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

    const contractorQuery = computed(() => {
        if (!jobs.value?.length) return null;
        const contractorIds = jobs.value.map(job => job.contractorId);
        return query(
            collection(db, 'contractors'),
            where (documentId(), 'in', contractorIds)
        )
    })
    const {data: contractorCompany } = useCollection(contractorQuery);

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

    const contractorJobsQuery = computed(() => {
        if (!userStore.userId) return null;
        return query(
            collection(db, 'jobs'),
            where('contractorId', '==', userStore.userId)
        );
    });
    const { data: contractorJobs } = useCollection(contractorJobsQuery);
    console.log(contractorJobs)
   
    return {
        projects,
        jobs,
        tasks,
        contractorCompany,
        contractorStaff,
        contractorJobs
    }

})