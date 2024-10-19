<script setup>
    import { RouterLink } from 'vue-router';


</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary p-3 navbarBorder">
        <div class="container-fluid">
            <strong class="companyFont d-flex align-item-center text-start">UrbanRenew</strong>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarToggle" aria-controls="navbarToggle" 
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarToggle">
                <ul class="navbar-nav nav nav-pills ms-auto my-2 buttonFont">
                    <li class="nav-item mx-2">
                        <RouterLink class="nav-link" :to="{ name: 'login' }" active-class="active">Login</RouterLink>
                    </li>
                    <li class="nav-item mx-2">
                        <RouterLink class="nav-link" :to="{ name: 'register' }" active-class="active">Register</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div>
        <h2>Providing the tools you need for a new home</h2>
    </div>
    <div>
        About us
    </div>
</template>

<style scoped>

</style>