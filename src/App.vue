<script setup>
  // import customerDashboard from '@/views/Dashboard/customerDashboard.vue';
  import home from '@/views/home.vue';
  // import contdb from '@/views/Dashboard/contractorDashboard copy.vue';
  import makeProject from '@/views/Dashboard/createProjectCust.vue';
  // import contJobList from '@/views/Dashboard/contractorProjectList.vue';
  import { RouterView } from 'vue-router';
  import custPrjList from '@/views/Dashboard/customerProjectList.vue';


  // import firesbasetesting from '@/components/TestFirebase.vue';
</script>

<template>
  <!-- <makeProject/> -->
  <RouterView/>
  <!-- <custPrjList/> -->

</template>


<style>

</style> 
