<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary p-3 navbarBorder">
        <div class="container-fluid">
            <router-link :to="{ name: 'customerDashboard' }"><strong class="websiteFont">UrbanRenew</strong></router-link >

            <!-- <strong class="companyFont d-flex align-item-center text-start">UrbanRenew</strong> -->

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarToggle" aria-controls="navbarToggle" 
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarToggle">
                <ul class="navbar-nav nav nav-pills ms-auto my-2 buttonFont">
                    <li class="nav-item mx-2">
                        <router-link class="nav-link" :to="{ name: 'jobRequest' }" active-class="active">Job Requests</router-link >
                    </li>
                    <li class="nav-item mx-2">
                        <router-link class="nav-link" :to="{ name: 'contractors' }" active-class="active">Contractors</router-link >
                    </li>
                    <!-- Leaving it as customerDashboard first, behaviour should change according based on 
                        what type of user loged in i.e. customer or contractor -->
                    <li class="nav-item mx-2">
                        <router-link class="nav-link" :to="{ name: 'customerDashboard' }" active-class="active">Dashboard</router-link >
                    </li>
                    <li class="nav-item mx-2">
                        <router-link class="nav-link" :to="{ name: 'userProfile' }" active-class="active">Profile</router-link >
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* template {
    font-family: 'Roboto', sans-serif;
} */

/* .navbarBorder {
    border: 5px solid #D6E6F2;
    border-radius: 3px;
} */
a{
    text-decoration: none;
}

.websiteFont {
  font-size: 30px;
  list-style: none;
  color: black;
}

.buttonFont {
  font-size: 18px;
}

@media (min-width: 2560px){
    .websiteFont{
        font-size: 60px;
        list-style: none;
        color: black;
    }

    .buttonFont {
        font-size: 30px;
    }
}


</style>