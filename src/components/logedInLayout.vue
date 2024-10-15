<template>
    <NavBar/>
    <div class="whiteBody">
        <slot></slot>
    </div>
    <footer>
            <ul>
                <li>Copyright © 2024. All rights reserved |</li>
                <li> Terms of Sale |</li>
                <li> Terms of Use |</li>
                <li> UrbanRenew Privacy Policy</li>
            </ul>
    </footer>
    <!-- <div class="appContainer">

    </div> -->
</template>

<script setup>
    import NavBar from './NavBar.vue';
     
</script>

<style scoped>
    /* .appContainer {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    } */

    .whiteBody{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background-color: white;
        width: 95%;
        margin: 0px auto;
        height: auto;
        /* min-height: 100vh;  */
        overflow-y: scroll;

    }

    ul{
        text-align: center;
        padding: 0px;
        margin: 0px;
    }

    li{   
        display: inline;
        list-style: none;
        color: lightgrey;
        
    }

    footer {
        margin-top: auto;
        padding: 10px 0;
        background-color: white;
        width: 95%;
        margin: 0px auto;
        bottom: 0;
        
    }

        /* .blueBackground {
      background-color: #769FCD;
      overflow-y: auto;
      height: 100vh;
      border-radius: 3px;
      padding: 0px;
      margin: 0px;
      display: flex;
      justify-content: center;
      position: relative;
    } */
</style>