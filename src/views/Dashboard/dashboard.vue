<script setup>
    import { computed } from 'vue';
    import { useUserStore } from '@/stores/userStore';
    import { useProjectStore } from '@/stores/projectStore';
    import { storeToRefs } from 'pinia';
    import contractorProjectList from './contractorProjectList.vue';
    import contractorNoJobs from './contractorNoJobs.vue';
    import customerNoProject from './customerNoProject.vue';
    import customerDashboard from './customerDashboard.vue';

    const userStore = useUserStore();
    const projectStore = useProjectStore();
    const { projects, contractorJobs } = storeToRefs(projectStore);
    const { userRole } = storeToRefs(userStore);

    const isContractor = computed(() => userRole.value === 'contractor');
    // console.log(userStore)
    // console.log(isContractor)

    // Check if customer has any projects
    const hasProjects = computed(() => projects.value?.length > 0);

    // Check if contractor has any jobs
    const hasJobs = computed(() => contractorJobs.value?.length > 0);
</script>

<template>
    <!-- Contractor View: Show project list first -->
    <contractorProjectList v-if="isContractor && hasJobs"/>
    <contractorNoJobs v-else-if="isContractor && !hasJobs"/>
    <customerNoProject v-else-if="!isContractor && !hasProjects"/>
    <customerDashboard v-else-if="!isContractor && hasProjects"/>

    <!-- Customer View
    <template v-else>
         No projects
        <customerNoProject v-if="!hasProjects" />
        Has projects: Show dashboard 
        <projectDashboard 
            v-else
            :is-contractor="false"
        />
    </template> -->
</template>