<script setup>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import ProjectProgressionBar from '@/components/Project Analytics/ProjectProgressionBar.vue';
    import ProjectDonutChart from '@/components/Project Analytics/JobDonutChart.vue';
    import GanttChart from '@/components/Project Analytics/GanttChart.vue';
    import customerNoProject from './customerNoProject.vue';
    import { useDonutFormat } from '@/composables/useDonutFormat.js';
    import { useGanttFormat } from '@/composables/useGanttFormat.js';
    import { useProgressFormat } from '@/composables/useProgressFormat.js';
    import { useProjectStore } from '@/stores/projectStore.js';
    
    import { storeToRefs } from 'pinia';
    import { ref, computed } from 'vue';
    import { onMounted } from 'vue';

    const projectStore = useProjectStore();
    const { jobs, tasks } = storeToRefs(projectStore);

    //Using the composables
    const { ganttData } = useGanttFormat(jobs, tasks);
    console.log(ganttData)
    const { projectProgress } = useProgressFormat(jobs, tasks);
    const { jobProgress } = useDonutFormat(jobs, tasks);

    //Template switch
    // const activeJobs = ref([1]);   //Variable to store active jobs
    const hasActiveJobs = computed(() => jobs.value.length > 0); //Variable to check active jobs
    console.log(jobs)
    //Track active job index for donut chart to change as the job in the gantt chart changes
    const activeJobIndex = ref(0);

    //Event listener for carousel change to update donut chart
    onMounted(() => {
        const carouselControlElement = document.getElementsByClassName('carouselControls')[0];
        if (carouselControlElement) {
            carouselControlElement.addEventListener('slide.bs.carousel', (event) => {
                activeJobIndex.value = event.to;
            });
        }
    })
</script>

<template>
    <customerNoProject v-if="!hasActiveJobs"/>
    <LogedInLayout v-else>
        <div class="container-fluid">
            <div class="row mx-0 py-4">
                <div class="font header">Progress</div>
            </div>
            <div class="row mx-0 my-3">
                <div class="font containerBorder">
                    Overall Progression of Project
                    <ProjectProgressionBar :my-steps="projectProgress.steps" :current-step="projectProgress.currentStep"></ProjectProgressionBar>
                </div>
            </div>
            <div class="customRow">
                <div class="jobProgressionContainer font containerBorder"> 
                    <p class="my-3">Overall Progression for Job {{ activeJobIndex + 1 }}</p>
                    <div class="my-5">
                        <ProjectDonutChart :sections="jobProgress[activeJobIndex]?.donutSections"/>
                        Completion: {{ jobProgress[activeJobIndex]?.completionPercentage }}%
                    </div>
                </div>
                <div id="carouselControls" class="carousel slide carouselContainer font containerBorder"> 
                    <div class="carousel-inner"> 
                        <div v-for="(job, index) in ganttData" :key="job.jobId" :class="['carousel-item', index === 0 ? 'active' : '']"> 
                            <div class="gantt-container">
                                <GanttChart class="left-container" :tasks="ganttData[activeJobIndex]?.task || []"/>
                            </div>
                        </div> 
                    </div> 
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev"> 
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span> 
                        <span class="visually-hidden">Previous</span> 
                    </button> 
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselControls" data-bs-slide="next">  
                        <span class="carousel-control-next-icon" aria-hidden="true"></span> 
                        <span class="visually-hidden">Next</span> 
                    </button> 
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
        height: 100%;
        /* padding: 0px; */
        padding-left: 1%;
        padding-right: 1%;
        flex-grow: 1;
        /* flex: 1; */
        display: flex;
        flex-direction: column;
    }

    .containerBorder {
        border: 3px solid ;
        border-radius: 10px;
    }

    .carousel-control-next, .carousel-control-prev{
        width: 3%;
        height: auto;
    }

    .customRow{
        display: flex;
        flex-direction: column;
        min-height: 800px;
    }

    .carouselContainer {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 16px;
        /* flex: 1; */
        display: flex;
        flex-direction: column;
        height: 720px;
    }

    .jobProgressionContainer{
        width: 100%;
        margin-top: 16px;
        margin-bottom: 16px;
        /* flex: 1; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 520px;
    }

     .carousel-inner {
        /* flex: 1; */
        width: 100%;
        height: 100%;

        overflow: hidden;
    }
    .carousel-item {
        /* display: flex; */
        
        width: 100%;
        height: 100%;
        margin: 0px;
        
    }

    .gantt-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /* margin: auto; */
         /* align-items: center;  */
        /* margin: 10px auto; */
    }

    .left-container {
        /* overflow: hidden;
        position: relative;
        height: 100%; */

        /* position: relative; */
        overflow: scroll;
        /* display: flex;
        flex-direction: column;
        justify-content: center; */
        
        /* flex: 1; */
        width: 95%;
        height: 95%; 
        /* margin-left: auto;
        margin-right: auto; */
    }

    @media (min-width: 1550px){
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
            min-height: 720px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .jobProgressionContainer {
            width: 19%; 
            max-width: 19%;
            /* flex: 1; */
            display: flex;
            flex-direction: column;
            min-height: 720px;
        }
    }

</style>
