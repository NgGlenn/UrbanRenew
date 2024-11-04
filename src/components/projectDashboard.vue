<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import LogedInLayout from './logedInLayout.vue';
    import ProjectProgressionBar from '@/components/Project Analytics/ProjectProgressionBar.vue';
    import ProjectDonutChart from '@/components/Project Analytics/JobDonutChart.vue';
    import GanttChart from '@/components/Project Analytics/GanttChart.vue';
    import NavBar from '@/components/NavBar.vue';
    import { useDonutFormat } from '@/composables/useDonutFormat.js';
    import { useGanttFormat } from '@/composables/useGanttFormat.js';
    import { useProgressFormat } from '@/composables/useProgressFormat.js';
    import { useProjectStore } from '@/stores/projectStore';
    import { useRoute, useRouter } from 'vue-router';


    // Props definition
    const props = defineProps({
        projectData: {
            type: Object,
            required: true,
            default: () => ({
                jobs: { value: [] },
                tasks: { value: [] },
                contractorCompany: { value: '' },
                contractorStaff: { value: '' },
                projectId: ''
            })
        },
        isContractor: {
            type: Boolean,
            default: false
        },
        customerDetails: {
            type: Object,
            default: () => ({
                id: '',
                name: '',
                location: '',
                paidStatus: '',
                status: ''
            })
        }
    });

    // Using the composables with the passed project data
    const { jobs, tasks, contractorCompany, contractorStaff } = props.projectData;
    const { ganttData } = useGanttFormat(jobs, tasks, contractorCompany, contractorStaff);
    const { projectProgress } = useProgressFormat(jobs, tasks);
    const { jobProgress } = useDonutFormat(jobs, tasks);

    // // console.log(props.projectData)
    // console.log(ganttData)
    // console.log(jobs)
    // console.log(tasks)
    // // console.log(jobs.value)


    // State management
    const activeJobIndex = ref(0);
    const hasActiveJobs = computed(() => props.projectData.jobs.value?.length > 0);

    //Mobile View
    const isMobile = ref(false);
    // console.log("Mobile: ", isMobile.value)
    const checkMobile = () => {
        isMobile.value = window.innerWidth <= 425;
    };

    // Format tasks for mobile timeline
    const currentPhaseForMobile = computed(() => {
        const currStage = projectProgress.currentStep;

        if (currStage < 20) return 'Planning';
        if (currStage < 40) return 'Design';
        if (currStage < 60) return 'Demolition'; 
        if (currStage < 80) return 'Construction'; 
        return 'Finishing'; 
    });

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            // Convert seconds to milliseconds
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Carousel setup
    onMounted(() => {
        if (hasActiveJobs.value) {
            const carouselElement = document.getElementById('carouselControls');
            if (carouselElement) {
                carouselElement.addEventListener('slide.bs.carousel', (event) => {
                    activeJobIndex.value = event.to;
                });
            };
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkMobile);
    });

    //Back button
    const router = useRouter();
    const projectStore = useProjectStore();
    const handleBack = () => {
        projectStore.clearCurrentJob();
        router.push('/contractorProjectList');
    };

    const showPaymentButton = (index) => {
        !isContractor && 
        props.projectData.jobs?.value?.[index]?.status === 'completed' && 
        props.projectData.jobs?.value?.[index]?.paidstatus === 'pending';
    }

    const handleTaskUpdate = ({ id, task }) => {
        console.log('Task updated:', id, task);
    };

    const handleNewTask = ({ id, task }) => {
        console.log('New task added:', id, task);
    };

    const handleTaskDelete = (id) => {
        console.log('Task deleted:', id);
    };
</script>

<template>
    <div v-if="isMobile">
        <NavBar/>
        <div class="mobileView">
            <div>
                <span style="color: #769FCD; font-size: 40px; font-weight: bold;">Project Progress: </span>
                <span style="font-size: 30px; font-weight: bold;">{{ currentPhaseForMobile }} Phase</span>
            </div>
            <div class="timelineContainer">
                <h2 style="font-weight: bold;">Timeline</h2>
                <div class="timeline">
                    <div v-for="job in jobs" :key="job.id" class="timelineItem" :class="{ 'completed': job.status === 'completed' }">
                        <div class="timelineMarker"></div>
                        <div>
                            <div class="jobHeader">
                                <div>
                                    <span class="jobName">{{ job.description }}</span>
                                    <span class="jobDates"><br>{{ formatDate(job.startDate) }} - {{ formatDate(job.endDate) }}</span>
                                </div>
                                <div>
                                    <span class="jobStatus" :style="{ color: job.status === 'completed' ? 'green' : 
                                                                        job.status === 'in_progress' ? '#769fcd' : '#D3D3D3',}">
                                        {{  
                                            job.status === 'completed' ? 'Completed' 
                                            : job.status === 'in_progress' ? 'In Progress' 
                                            : 'Pending'
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="taskContainer">
                <div id="carouselExampleIndicators" class="carousel slide">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <div v-for="(data, index) in ganttData" :key="index"
                            :class="['carousel-item', index === 0 ? 'active' : '']">
                            <h2 style="font-weight: bold;">{{ data.jobName }}</h2>
                            <div v-for="task in data.task.data" :key="task.id" class="progress-item">
                                <div class="progress-header">
                                    <span class="task-name">{{ task.text }}</span>
                                    <span class="progress-value">{{ task.progress * 100}}%</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" 
                                        :style="{ width: `${task.progress*100}%` }"
                                        :class="{ 'bg-success': task.progress*100 === 100 }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <LogedInLayout v-else>    
        <!-- Desktop dashboard -->
        <div class="container-fluid">
            <!-- Contractor Information Header -->
            <!-- Progress Header -->
            <div v-if="isContractor">
                <button @click="handleBack" class="btn btn-secondary back-btn my-3">
                    ← Back to Projects
                </button>
            </div>

            <div class="row mx-0 py-4">
                <div class="font header">Progress</div>
            </div>

            <div v-if="isContractor" class="contractor-header">
                <div class="containerBorder font text-start px-3">
                    <div>Project ID: <span class="text-dark fw-normal">{{ projectData.projectId }}</span></div>
                    <div>Customer ID: <span class="text-dark fw-normal">{{ customerDetails.id }}</span></div>
                    <div>Customer Name: <span class="text-dark fw-normal">{{ customerDetails.name }}</span></div>
                    <div>Location: <span class="text-dark fw-normal">{{ customerDetails.location }}</span></div>
                    <div>Paid Status: <span class="text-dark fw-normal">{{ customerDetails.paidStatus }}</span></div>
                    <div>Project Status: <span class="text-dark fw-normal">{{ customerDetails.status }}</span></div>
                </div>
            </div>

            <!-- Overall Project Progress -->
            <div class="row mx-0 my-3">
                <div class="font containerBorder">
                    Overall Progression of Project
                    <ProjectProgressionBar :my-steps="projectProgress.steps" :current-step="projectProgress.currentStep"/>
                </div>
            </div>

            <!-- Detailed Progress Section -->
            <div class="customRow">
                <!-- Job Progress Donut Chart -->
                <div class="jobProgressionContainer font containerBorder" 
                    :class="{'has-payment': showPaymentButton}">
                    <p class="my-3">Overall Progression for Job {{ activeJobIndex + 1 }}</p>
                    <div class="my-3">
                        <ProjectDonutChart :sections="jobProgress[activeJobIndex]?.donutSections"/>
                        Completion: {{ jobProgress[activeJobIndex]?.completionPercentage }}%
                    </div>
                </div>

                <!-- Gantt Chart Carousel -->
                <div id="carouselControls" class="carousel slide carouselContainer font containerBorder"
                    :class="{'has-payment': showPaymentButton}">
                    <div class="carousel-inner">
                        <div v-for="(job, index) in ganttData" :key="job.jobId" :class="['carousel-item', index === 0 ? 'active' : '']">
                            <div class="gantt-title">
                                <h4>Job #{{ activeJobIndex + 1 }}: {{ ganttData[activeJobIndex]?.jobName }}</h4>
                                <h4>Contractor: {{ ganttData[activeJobIndex]?.contractorCompanyName }}, 
                                    {{ ganttData[activeJobIndex]?.contractorStaff }}
                                </h4>
                                <div v-if="!isContractor && 
                                    props.projectData.jobs.value && 
                                    props.projectData.jobs.value[index] && 
                                    props.projectData.jobs.value[index].status === 'completed' && 
                                    props.projectData.jobs.value[index].paidstatus === 'pending'" >
                                    <RouterLink :to="{name: 'payment2', query: {jobID: props.projectData.jobs.value[index]?.id}}">
                                        Job completed. Please complete payment&nbsp;<button>Payment</button>
                                    </RouterLink>
                                </div>
                            </div>
                            <div class="gantt-container">
                                <GanttChart class="left-container" :tasks="ganttData[activeJobIndex]?.task" 
                                    @taskUpdated="handleTaskUpdate" @taskAdded="handleNewTask" @taskDeleted="handleTaskDelete"/>
                            </div>
                        </div>
                    </div>

                    <!-- Carousel Controls -->
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

    .carouselContainer, .jobProgressionContainer{
        width: 100%;
        margin-top: 16px;
        /* margin-bottom: 16px; */
        /* flex: 1; */
        display: flex;
        flex-direction: column;
        transition: height 0.3s ease;
    }

    .carouselContainer {
        /* height: 720px; */
        height: auto;
    }

    .carouselContainer.has-payment {
        /* height: 950px; */
        height: auto;
    }

    .jobProgressionContainer{
        justify-content: center;
        /* height: 520px; */
        height: auto;
    }

    .jobProgressionContainer.has-payment {
        /* height: 950px; */
        height: auto;
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

    .gantt-title{ 
        text-align: center;
        font-size: 24px;

    }

    @media (min-width: 1550px){
        .carousel-inner {
            /* flex: 1; */
            width: 100%;
            height: 100%;

            overflow: hidden;
        }
        .customRow{
            display: flex;
            flex-direction: row;
            column-gap: 1%;
            /* height: auto; */
            min-height: 800px;
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

        .carouselContainer.has-payment {
            min-height: 970px;
        }

        .jobProgressionContainer {
            width: 19%; 
            max-width: 19%;
            /* flex: 1; */
            display: flex;
            flex-direction: column;
            min-height: 720px;
        }

        .jobProgressionContainer.has-payment {
            min-height: 970px;
        }

         .gantt-container {
            width: 100%;
            height: 90%;
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
    }

    @media (max-width: 425px){
        .mobileView {
            padding: 13px;
        }

        .timelineContainer, .taskContainer{
            background-color: white;
            padding: 18px;
            border-radius: 10px;
            box-shadow: 0 2px 4px grey;
            margin-bottom: 20px;
            height: auto;
        }

        .taskContainer{
            min-height: 250px;
        }
        .timeline {
            position: relative;
            padding-left: 20px;
        }

        .timelineItem {
            position: relative;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-left: 12px;
            margin-bottom: 20px;
        }

        .timelineMarker {
            position: absolute;
            left: -24px;
            top: 35px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #769FCD;
            border: 2px solid white;
            box-shadow: 0 0 0 2px #769FCD;
        }

        .timelineItem.completed {
            background: #ebf8dc;
            box-shadow: 0 0 0 2px #f1f8e9;
        }

        .timelineMarker {
            background: green;
        }

        .timelineItem:not(:last-child)::before {
            content: '';
            position: absolute;
            left: -18px;
            top: 36px;
            bottom: -16px;
            width: 2px;
            background: #e0e0e0;
        }

        .jobHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        /* .jobName {
            /* font-weight: 500; */
        

        .jobStatus {
            font-size: 18px;
            color: #769FCD;
        }

        .jobDates {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
        }

        .progress-item {
            margin-bottom: 16px;
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .progress-value {
            color: #769FCD;
        }

        .progress {
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-bar {
            background: #769FCD;
            transition: width 0.3s ease;
        }

        .progress-bar.bg-success {
            background: #4CAF50;
        }

    }
    
</style>