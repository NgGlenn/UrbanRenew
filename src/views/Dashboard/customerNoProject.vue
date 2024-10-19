<script setup>
    import NavBar from '@/components/NavBar.vue';
</script>

<template>
    <div class="pageWrapper">
        <NavBar/>
        <div class="container-fluid">   
            <h1><strong>You do not have an ongoing renovation project</strong></h1>
            <RouterLink :to="{ name: 'createProjectCust' }">
                <button type="button" class="btn btn-primary btn-lg" style="background-color: #769FCD; color: white;">
                    Create A Project    
                </button>
            </RouterLink>  
        </div>
    </div>
</template>

<style scoped>
    .pageWrapper {
        /* display: flex;
        flex-direction: column; */
        height: 100%;
    }

    .container-fluid{ 
        height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>