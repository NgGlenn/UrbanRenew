<script setup>
    import LogedInLayout from '@/components/LogedInLayout.vue';
    import ProjectProgressionBar from '@/components/Project Analytics/ProjectProgressionBar.vue';
    import ProjectDonutChart from '@/components/Project Analytics/JobDonutChart.vue';
    import GanttChart from '@/components/Project Analytics/GanttChart.vue';
    import { ref } from 'vue';
    import { computed } from 'vue';

    //Overall progression variables
    const renovationSteps = ref(['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']);
    const currentStepIndex = ref(2); 

    //Donut chart variables
    const jobCompletionPercentage = ref(70);
    const remainingJobPercentage = computed(() => 100-jobCompletionPercentage.value);
    const donutChartSection = [{value: jobCompletionPercentage.value, color: '#769FCD'}, 
                                {value: remainingJobPercentage.value, color: 'grey'}]
    const jobNo = ref(1)

    //Gantt Chart variables
    //dummy gantt chart data
    const GanttChartData = [{id: 1, text: 'Task #1', start_date: '2024-10-18', duration: 3, progress: 0.6},
                            {id: 2, text: 'Task #2', start_date: '2024-10-20', duration: 3, progress: 0.4}];
    const GanttChartLinks = [{id: 1, source: 1, target: 2, type: '0'}];
    const task = {data: GanttChartData, links: GanttChartLinks};

    const GanttChartData2 = [{id: 1, text: 'Task #1', start_date: '2024-10-18', duration: 6, progress: 0.6},
                            {id: 2, text: 'Task #2', start_date: '2024-10-20', duration: 6, progress: 0.4}];
    const GanttChartLinks2 = [{id: 1, source: 1, target: 2, type: '0'}];
    const task2 = {data: GanttChartData2, links: GanttChartLinks2};
</script>

<template>
    <LogedInLayout>
        <div class="container-fluid">
            <div class="row mx-0 py-4">
                <div class="font header">Progress</div>
            </div>
            <div class="row mx-0 my-3">
                <div class="font containerBorder">
                    Overall Progression
                    <ProjectProgressionBar :my-steps="renovationSteps" :current-step="currentStepIndex"></ProjectProgressionBar>
                </div>
            </div>
            <div class="customRow">
                <!-- <div class="carouselContainer font containerBorder"> -->
                    <!-- BS carousel: start --> 
                    <div id="carouselExampleControls" class="carousel slide carouselContainer font containerBorder" 
                        data-bs-theme="dark" data-bs-slide="carousel"> 
                        <div class="carousel-inner"> 
                            <div class="carousel-item active"> 
                                <div class="gantt-container">
                                    <GanttChart class="left-container" :tasks="task"/>
                                </div>
                            </div> 
                            <div class="carousel-item"> 
                                <div class="gantt-container">
                                    <img src="@/assets/gt3rs.png" height="200" width="200">
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
                <!-- </div> -->
                <div class="jobProgressionContainer font containerBorder"> 
                    <p class="my-3">Overall Progression for Job {{ jobNo }}</p>
                    <div class="my-5">
                        <ProjectDonutChart :sections="donutChartSection"/>
                        Completion: {{ jobCompletionPercentage }}%
                    </div>
                </div>
            </div>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    h5, p{
        color: #769FCD;
    }
    
    .font{
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        font-size: 30px;
        color: #769FCD;
        text-align: center;
    }
    .font.header{
        text-decoration: underline;
        font-size: 50px;
    }

    .container-fluid {
        /* min-height: 100%; */
        /* padding: 0px; */
        padding-left: 1%;
        padding-right: 1%;
        /* flex-grow: 1; */
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .containerBorder {
        border: 3px solid ;
        border-radius: 10px;
    }

    .carousel-control-next, .carousel-control-prev{
        width: 3%;
    }

    .customRow{
        display: flex;
        flex-direction: column;
        min-height: 800px;
    }

    .carouselContainer, .jobProgressionContainer{
        width: 100%;
        margin-top: 16px;
        margin-bottom: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

     .carousel-inner {
        flex: 1;
        width: 100%;
        height: 100%;

        overflow: hidden;
    }
    .carousel-item {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        

    }

    .gantt-container {
        width: 90%;
        height: 100%;
        display: flex;
        justify-content: center; /* Add this line */
        align-items: center; /* Add this line */
        margin: 0px auto;
    }

    .left-container {
        /* overflow: hidden;
        position: relative;
        height: 100%; */

        position: relative;
        overflow: scroll;
        /* display: flex;
        flex-direction: column;
        justify-content: center; */
        
        flex: 1;
        width: 90%;
        height: 90%; 
        /* margin-left: auto;
        margin-right: auto; */
    }

    @media (min-width: 1400px){
        .customRow{
            display: flex;
            flex-direction: row;
            column-gap: 1%;
            height: auto;
        }

         .carouselContainer {
            width: 80%; 
            max-width: 80%;
            margin-bottom: 0px; 
            /* height: 100%; */
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .jobProgressionContainer {
            width: 19%; 
            max-width: 19%;
            margin-bottom: 0px;
                        flex: 1;
            display: flex;
            flex-direction: column;
        }
    }

</style>
