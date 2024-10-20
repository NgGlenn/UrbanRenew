<script setup>
    import LogedInLayout from '@/components/LogedInLayout.vue';
    import ProjectProgressionBar from '@/components/Project Analytics/ProjectProgressionBar.vue';
    import ProjectDonutChart from '@/components/Project Analytics/JobDonutChart.vue';
    import GanttChart from '@/components/Project Analytics/GanttChart.vue';
    import customerNoProject from './customerNoProject.vue';

    import { ref, computed, inject } from 'vue';
    import { collection, query, where } from 'firebase/firestore';
    import { useCollection } from 'vuefire';


    // const db = inject('db');

    // const props = defineProps(['userId']);

    // //fetch user's project data
    // const projectQuery = computed(() => query(collection(db, 'projects'), where('customerId', '==', props.userId)));   
    // const projects = useCollection(projectQuery);

    // //get jobs associated with project
    // const projectId = computed(() => projects.value[0]?.id);
    // const jobsQuery = computed(() => {
    //     if (!projectId.value) return null
    //     return query(collection(db, 'jobs'), where('projectId', '==', projectId.value))
    // });
    // const jobs = useCollection(jobsQuery);
    
    // //get task associated with job
    // const tasksQuery = computed(() => {
    //     if (!jobs.value || jobs.value.length === 0) return null
    //     const jobIds = jobs.value.map(job => job.id)
    //     return query(collection(db, 'tasks'), where('jobId', 'in', jobIds ));
    // });
    // const tasks = useCollection(tasksQuery)

    // //format jobs and task data for gantt chart
    // const formattedJobs = computed(() => {
    //     if (!jobs.value || !tasks.value) return [];

    //     const taskMap = new Map(tasks.value.map(task => [task.id, task]));

    //     return jobs.value.map(job => {
    //         const jobTasks = tasks.value.filter(task => task.jobId === job.id)

    //         return {
    //             id: job.id,
    //             name: job.description,
    //             tasks: jobTasks.map(task => ({
    //                 id: task.id,
    //                 name: task.name,
    //                 start: task.startDate.toDate(),
    //                 end: task.endDate.toDate(),
    //                 progress: task.progress,
    //                 dependencies: task.dependencies ? [task.dependencies] : [], // Wrap in array if exists
    //                 dependencyTask: task.dependencies ? taskMap.get(task.dependencies) : null
    //             }))
    //         }
    //     })
    // });

    //Test code for template switch
    const activeJobs = ref([]);   //Variable to store active jobs
    const hasActiveJobs = computed(() => activeJobs.value.length > 0); //Variable to check active jobs
    
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
    <customerNoProject v-if="!hasActiveJobs"/>
    <LogedInLayout v-else>
        <div class="container-fluid">
            <div class="row mx-0 py-4">
                <div class="font header">Progress</div>
            </div>
            <div class="row mx-0 my-3">
                <div class="font containerBorder">
                    Overall Progression of Project
                    <ProjectProgressionBar :my-steps="renovationSteps" :current-step="currentStepIndex"></ProjectProgressionBar>
                </div>
            </div>
            <div class="customRow">
                <div class="jobProgressionContainer font containerBorder"> 
                    <p class="my-3">Overall Progression for Job {{ jobNo }}</p>
                    <div class="my-5">
                        <ProjectDonutChart :sections="donutChartSection"/>
                        Completion: {{ jobCompletionPercentage }}%
                    </div>
                </div>
                <div id="carouselExampleControls" class="carousel slide carouselContainer font containerBorder"> 
                    <div class="carousel-inner"> 
                        <div class="carousel-item active"> 
                            <div class="gantt-container">
                                <GanttChart class="left-container" :tasks="task"/>
                            </div>
                        </div> 
                        <div class="carousel-item"> 
                            <div class="gantt-container">
                                <img src="@/assets/gt3rs.png" height="auto" width="auto">
                                <!-- <GanttChart class="left-container" :tasks="task2"/> -->
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
