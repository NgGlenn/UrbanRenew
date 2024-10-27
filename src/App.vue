<script setup>
  import customerDashboard from '@/views/Dashboard/customerDashboard.vue';
  import home from '@/views/home.vue';
  import contdb from '@/views/Dashboard/contractorDashboard copy.vue';
  import { RouterView } from 'vue-router';

  import PaymentOverview from './views/paymentOverview.vue';
  import Payment2 from './views/payment2.vue';


  import firesbasetesting from '@/components/TestFirebase.vue';
</script>

<template>
  <!-- Firebase testing -->
  <!-- <firesbasetesting/>  -->

  <!-- Views testing -->
  <!-- <prjlist></prjlist> -->
  <!-- <customerDashboard></customerDashboard> -->
  <!-- <home></home> -->
  <!-- <PaymentOverview /> -->

  <!-- For testing of views, comment out <router-view>. Import your file under script first then enter <file_variable>
    i.e. Testing of home page: import home from '@/views/home.vue'
        Under template: <home/>-->
  <RouterView/>
<!-- 
    <contdb/> -->
    
   
</template>


<style>

</style>
