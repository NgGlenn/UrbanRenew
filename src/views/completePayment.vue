<template>
    <div class="page-container">
     <NavBar></NavBar>
     <h1> Thank You! </h1>
     <button @click="goToHome">Back to Homepage</button>
    </div>
</template>
<script> 
import NavBar from '@/components/NavBar.vue';
export default {
    name: "CompletePayment",
    components: {
        NavBar,
    },
    methods:{
        goToHome() {    
        // Redirect to home.vue
        this.$router.push({ name: 'home' });
      }
    }
};

</script>
