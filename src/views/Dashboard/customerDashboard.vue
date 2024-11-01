<script setup>
    import projectDashboard from '@/components/projectDashboard.vue';
    import { storeToRefs } from 'pinia';
    import { computed } from 'vue';
    // import { onMounted } from 'vue';
    import { useProjectStore } from '@/stores/projectStore.js';
    import { useUserStore } from '@/stores/userStore';
    
    const projectStore = useProjectStore();
    const { jobs, tasks, contractorCompany, contractorStaff } = storeToRefs(projectStore);

    const userStore = useUserStore();
    const { userRole } = storeToRefs(userStore);
    const isContractor = computed(() => userRole?.value === 'contractor' )
    console.log(isContractor)

    const projectData = computed(() => ({
        jobs,
        tasks,
        contractorCompany,
        contractorStaff
    }))

</script>

<template>
    <projectDashboard :project-data="projectData" :is-contractor="false"/>
</template>

<style scoped>
  

</style>
