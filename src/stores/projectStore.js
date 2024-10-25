import { defineStore } from "pinia";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
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
            where ('jobId', 'in', jobIds)
        );
    });
    const { data: tasks } = useCollection(tasksQuery);
   
    return {
        projects,
        jobs,
        tasks
    }

})