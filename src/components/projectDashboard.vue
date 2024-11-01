<script setup>
    import { ref, computed } from 'vue';
    import { onMounted } from 'vue';
    import LogedInLayout from './logedInLayout.vue';
    import ProjectProgressionBar from '@/components/Project Analytics/ProjectProgressionBar.vue';
    import ProjectDonutChart from '@/components/Project Analytics/JobDonutChart.vue';
    import GanttChart from '@/components/Project Analytics/GanttChart.vue';
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

    console.log(props.projectData)
    console.log(ganttData)


    // State management
    const activeJobIndex = ref(0);
    const hasActiveJobs = computed(() => props.projectData.jobs.value?.length > 0);

    // Carousel setup
    onMounted(() => {
        if (hasActiveJobs.value) {
            const carouselElement = document.getElementById('carouselControls');
            if (carouselElement) {
                carouselElement.addEventListener('slide.bs.carousel', (event) => {
                    activeJobIndex.value = event.to;
                });
            }
        }
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
        // Additional handling if needed
    };

    const handleNewTask = ({ id, task }) => {
        console.log('New task added:', id, task);
        // Additional handling if needed
    };

    const handleTaskDelete = (id) => {
        console.log('Task deleted:', id);
        // Additional handling if needed
    };
</script>

<template>
    <LogedInLayout>    
        <!-- Main dashboard content -->
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
                    <div class="my-5">
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
        margin-bottom: 16px;
        /* flex: 1; */
        display: flex;
        flex-direction: column;
        transition: height 0.3s ease;
    }

    .carouselContainer {
        height: 720px;
    }

    .carouselContainer.has-payment {
        height: 950px;
    }

    .jobProgressionContainer{
        justify-content: center;
        height: 520px;
    }

    .jobProgressionContainer.has-payment {
        height: 950px;
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
            min-height: 780px;
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
            min-height: 780px;
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
</style>