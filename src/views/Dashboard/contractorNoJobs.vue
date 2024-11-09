<script setup>
    import NavBar from '@/components/NavBar.vue';
</script>

<template>
    <div class="pageWrapper">
        <NavBar/>
        <div class="container-fluid">   
            <h1><strong>You do not have an ongoing renovation project.</strong></h1>
            <h1><strong>Head to Job Requests to start accepting jobs !</strong></h1>
            <RouterLink :to="{ name: 'jobRequest' }">
                <button type="button" class="btn btn-primary btn-lg" style="background-color: #769FCD; color: white;">
                    Job Requests    
                </button>
            </RouterLink>  
        </div>
    </div>
</template>

<style scoped>
    .pageWrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .container-fluid{ 
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin: 20px;
    }

    button {
        height: fit-content;
    }
</style>