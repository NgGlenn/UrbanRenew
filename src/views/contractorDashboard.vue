<template>
    <logedInLayout>
        <div class="dashboardContent">
            <div class="row mx-0 py-4">
                <div class="font header">Progress of Project {{  }}</div>
            </div>
            <div class="row mx-0 py-2 font containerBorder" style="text-align: left;">
                <span>Project ID: <span style="color: black; font-weight: normal;">{{  }}</span></span>
                <span>Customer ID: <span style="color: black; font-weight: normal;">{{  }}</span></span>
                <span>Customer Name ID: <span style="color: black; font-weight: normal;">asas{{  }}</span></span>
                <span>Customer Home Location ID: <span style="color: black; font-weight: normal;">{{  }}</span></span>
            </div>
            <div class="row mx-0 my-3">
                <div class="font containerBorder">Overall Progression<br>
                    Overall Progression<br>
                    Overall Progression<br>
                    Overall Progression<br>Overall Progression<br>
                </div>
            </div>
            <div class="customRow">
                <div class="carouselContainer font containerBorder">
                    <!-- BS carousel: start --> 
                    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" data-bs-theme="dark"> 
                        <div class="carousel-inner"> 
                            <div class="carousel-item active" data-bs-interval="0"> 
                                <img src="../assets/gt3rs.png" alt="" style="width:710px;height:600px;">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>Porsche 911 GT3 RS</h5>
                                    <p>Porsche's most hardcore track car.</p>
                                </div>
                            </div> 
                            <div class="carousel-item" data-bs-interval="0"> 
                            <img src="../assets/gt3.webp" alt="" style="width:710px;height:600px;">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>Porsche 911 GT3</h5>
                                    <p>Porsche track car for the road.</p>
                                </div>
                            </div> 
                            <div class="carousel-item" data-bs-interval="0"> 
                                <img src="../assets/logo.png" alt="" style="width:710px;height:600px;">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>Logo of Vue</h5>
                                    <p>Logo lmao</p>
                                </div>
                            </div> 
                        </div> 
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev"> 
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span> 
                            <span class="visually-hidden">Previous</span> 
                        </button> 
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">  
                            <span class="carousel-control-next-icon" aria-hidden="true"></span> 
                            <span class="visually-hidden">Next</span> 
                        </button> 
                    </div> 
                     <!-- BS carousel: end --> 
                </div>
                <div class="jobProgressionContainer font containerBorder"> Overall Progression for Job</div>
            </div>
        </div>
    </logedInLayout>
</template>

<script setup>
    import logedInLayout from '../components/logedInLayout.vue';
</script>

<style scoped>
    h5, p{
        color: #769FCD;
    }
    
    .font{
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        font-size: 20px;
        color: #769FCD;
        text-align: center;
        
    }
    .font.header{
        text-decoration: underline;
        font-size: 50px;
    }

    .dashboardContent {
        min-height: 100vh;
        width: 100%;
        /* padding: 0px; */
        padding-left: 1%;
        padding-right: 1%;
    }

    .containerBorder {
        border: 3px solid ;
        border-radius: 10px;
    }

    .carousel-control-next, .carousel-control-prev{
        width: 10%;
    }

    .customRow{
        display: flex;
        flex-direction: column;
        
    }

    .carouselContainer, .jobProgressionContainer{
        width: 100%;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    .carousel-item {
        width: 100%;
        height: auto;
    }

    @media (min-width: 1300px){
        .customRow{
            display: flex;
            flex-direction: row;
            column-gap: 1%;
        }

         .carouselContainer {
            width: 80%; 
            margin-bottom: 0px; 
        }

        .jobProgressionContainer {
            width: 19%; 
            margin-bottom: 0px;
        }
    }

</style>
