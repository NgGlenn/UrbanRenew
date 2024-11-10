<script setup>
    import { ref, computed, onMounted, onUnmounted, onBeforeMount, watch } from 'vue';
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

    const route = useRoute();

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
        },
        // specificJobId: { 
        //     type: String,
        //     default: null
        // }
    });

    // Using the composables with the passed project data
    const { jobs, tasks, contractorCompany, contractorStaff } = props.projectData;
    const { ganttData } = useGanttFormat(jobs, tasks, contractorCompany, contractorStaff);
    const { projectProgress } = useProgressFormat(jobs, tasks);
    const { jobProgress } = useDonutFormat(jobs, tasks);

    // // console.log(props.projectData)
    console.log('ganttData', ganttData)
    console.log('jobs data',jobs)
    // console.log(tasks)
    console.log(jobs.value)


    // State management
    const currentJobIndex = ref(0);
    const hasActiveJobs = computed(() => props.projectData.jobs.value?.length > 0);
    console.log("hasActiveJobs", hasActiveJobs)

    // const totalJobs = computed(() => ganttData.value.length);

    // const nextJob = () => {
    //     if (currentJobIndex.value < totalJobs.value - 1) {
    //         currentJobIndex.value++;
    //     } else {
    //         currentJobIndex.value = 0;
    //     }
    //     console.log('Next job:', currentJobIndex.value);
    // };

    // const prevJob = () => {
    //     if (currentJobIndex.value > 0) {
    //         currentJobIndex.value--;
    //     } else {
    //         currentJobIndex.value = totalJobs.value - 1;
    //     }
    //     console.log('Previous job:', currentJobIndex.value);
    // };

    //Mobile View
    const isMobile = ref(false);
    // console.log("Mobile: ", isMobile.value)
    const checkMobile = () => {
        isMobile.value = window.innerWidth <= 425;
    };

    // Format tasks for mobile timeline
    const currentPhaseForMobile = computed(() => {
        const currStage = projectProgress.pro;
        console.log(currStage)

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

    onBeforeMount(() => {
        // Set the job ID from route params when component mounts
        if (route.params.jobId) {
            projectStore.setCurrentJob(route.params.jobId);
        }
    });

    onMounted(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // if (props.isContractor && props.specificJobId) {
        //     projectStore.setCurrentJob(props.specificJobId);
        // }
        projectStore.setCurrentJob(route.params.jobId);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkMobile);

        // projectStore.clearCurrentJob();
        // try {
        //     await projectStore.clearCurrentJob();
        // } catch (error) {
        //     console.error('Error clearing job on unmount:', error);
        // }

        projectStore.resetStore();
    });

    //Back button
    const router = useRouter();
    const projectStore = useProjectStore();
    // const handleBack = () => {
    //     // projectStore.clearCurrentJob();
    //     // if (props.isContractor) {
    //     //     projectStore.clearCurrentJob();
    //     // }
    //     router.push('/contractorProjectList');
    // };

    const handleBack = () => {
        // try {
        //     projectStore.resetStore();
        //     await projectStore.clearCurrentJob();
        //     await new Promise(resolve => setTimeout(resolve, 750));
        //     // await router.push('/contractorProjectList');
        //     await router.push('/dashboard');
        // } catch (error) {
        //     console.error('Error handling back:', error);
        // }

        // try {
        //     await projectStore.resetStore();
        //     await router.push('/dashboard');
        // } catch (error) {
        //     console.error('Error handling back:', error);
        // }

        // try {
        //     await projectStore.resetStore();
        //     await router.push({
        //         path: '/dashboard',
        //         replace: true
        //     });
        // } catch (error) {
        //     console.error('Error handling back:', error);
        // }

        projectStore.resetStore();
        router.push('/dashboard');
    };

    watch(
        // () => route.params.jobId,
        // (newJobId) => {
        //     if (newJobId) {
        //         projectStore.clearCurrentJob();
        //         projectStore.setCurrentJob(newJobId);
        //     }
        // }
        () => projectStore.currentJobId,
        (newJobId) => {
            if (!newJobId) {
                currentJobIndex.value = 0; 
            }
        }
    );

    const showPaymentButton = (index) => {
        // const isContractor = props.isContractor;
        !isContractor;
        // props.projectData.jobs?.value?.[index]?.status === 'completed' && 
        props.projectData.jobs?.value?.[index]?.paidstatus !== 'paid';
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

    const hasNoTasks = computed(() => {
        return !ganttData.value?.[currentJobIndex.value]?.task?.data?.length;
    });
    console.log('is contracotr', props.isContractor.valueOf);
</script>

<template>
    <div v-if="isMobile">
        <NavBar/>
        <div class="mobileView">
            <div>
                <span style="color: #769FCD; font-size: 40px; font-weight: bold;">Project Progress: </span>
                <span style="font-size: 30px; font-weight: bold;">{{ projectProgress.currPhase }} Phase</span>
            </div>
            <div class="timelineContainer">
                <h2 style="font-weight: bold;">Timeline</h2>
                <div class="timeline">
                    <div v-for="job in jobs" :key="job.id" class="timelineItem" :class="{ 'completed': job.status === 'completed' }">
                        <div class="timelineMarker"></div>
                        <div>
                            <div class="jobHeader">
                                <div style="width: 70%; margin-right: 5px">
                                    <span class="jobName">{{ job.jobName }}</span>
                                    <span class="jobDates"><br>{{ formatDate(job.startDate) || job.startDate}} to {{ formatDate(job.endDate) || job.endDate }}</span>
                                </div>
                                <div style="width: 30%;">
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
            <!-- <div id="task"> -->
                <div id="mobileCarouselIndicator" class="carousel carousel-dark slide taskContainer">
                    <div class="carousel-indicators">
                        <div v-for="(data, index) in ganttData" :key="index">
                            <button type="button" data-bs-target="#mobileCarouselIndicator" :data-bs-slide-to="index" :class="{active: index === 0}" :aria-current="index===0" :aria-label="`Slide ${index+1}`"></button>
                        </div>
                        
                        <!-- <button type="button" data-bs-target="#mobileCarouselIndicator" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#mobileCarouselIndicator" data-bs-slide-to="2" aria-label="Slide 3"></button> -->
                    </div>
                    <div class="carousel-inner">
                        <div v-for="(data, index) in ganttData" :key="index" class="carousel-item" :class="{active: index === 0}">
                            <h2 style="font-weight: bold;">{{ data.jobName }}</h2>
                            <div v-if="!data.task?.data || data.task.data.length === 0" >Task has not started. Come back later</div>
                            <div v-else>
                                <div v-for="task in data.task.data" :key="task.id" class="progress-item">
                                    <div class="progress-header">
                                        <span class="task-name">{{ task.text }}</span>
                                        <span class="progress-value">{{ Math.round(task.progress * 100)}}%</span>
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
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#mobileCarouselIndicator" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#mobileCarouselIndicator" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            <!-- </div> -->
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

            <div class="row my-4 py-3">
                <div class="font header">Project Dashboard</div>
            </div>

            <div v-if="isContractor" class="contractor-header">
                <div class="containerBorder font text-start px-3">
                    <div>Project Description: <span class="text-dark fw-normal">{{ jobs?.value?.[0]?.description || 'No description available' }}</span></div>
                    <!-- <div>Customer ID: <span class="text-dark fw-normal">{{ customerDetails.id }}</span></div> -->
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
                    :class="{'hasPayment': showPaymentButton}">
                    <p class="my-3">Overall Progression for Job {{ currentJobIndex + 1 }}</p>
                    <div class="my-3">
                        <ProjectDonutChart :sections="jobProgress[currentJobIndex]?.donutSections" :key="currentJobIndex"/>
                        Completion: {{ jobProgress[currentJobIndex]?.completionPercentage }}%
                    </div>
                </div>
                <!-- Option 1: Select -->
                <div class="ganttSection font containerBorder" :class="{'hasPayment': showPaymentButton}">
                    <!-- Job Selector -->
                    <div v-if="!props.isContractor" class="jobSelector">
                        <select v-model="currentJobIndex" class="form-select w-auto mx-auto">
                            <option v-for="(job, index) in ganttData" :key="job.jobId" :value="index" class="p-0">
                                Job #{{index + 1}}: {{ job.jobName }}
                            </option>
                        </select>
                    </div>
                    <div v-if="hasNoTasks && !props.isContractor" class="contractorHaveNotStart">
                        <div>Contractor has yet to start. Come back later !</div>
                    </div>
                    <div v-else>            
                        <!-- Current Job Info -->
                        <div class="ganttTitle">
                            <h3>Job #{{ currentJobIndex + 1 }}: {{ ganttData[currentJobIndex]?.jobName }}</h3>
                            <h4 v-if="!isContractor">
                                Contractor: {{ ganttData[currentJobIndex]?.contractorCompanyName }}, 
                                {{ ganttData[currentJobIndex]?.contractorStaff }}
                            </h4>
                            <div v-if="!isContractor && 
                                props.projectData.jobs.value && 
                                props.projectData.jobs.value[currentJobIndex] && 
                                // props.projectData.jobs.value[currentJobIndex].status === 'completed' && 
                                props.projectData.jobs.value[currentJobIndex].paidstatus !== 'paid'">
                                <RouterLink 
                                    :to="{
                                        name: 'payment2', 
                                        query: {
                                            jobID: props.projectData.jobs.value[currentJobIndex]?.id
                                        }
                                    }">
                                    Job Accepted. Please proceed with payment&nbsp;<button>Payment</button>
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Gantt Chart -->
                        <div class="ganttContainer">
                            <GanttChart 
                                class="leftContainer" 
                                :tasks="ganttData[currentJobIndex]?.task"
                                :is-contractor="props.isContractor"
                                @taskUpdated="handleTaskUpdate" 
                                @taskAdded="handleNewTask" 
                                @taskDeleted="handleTaskDelete"
                            />
                        </div>
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
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .carousel-control-next, .carousel-control-prev{
        width: 5%;
        height: auto;
    }

    .customRow{
        display: flex;
        flex-direction: column;
        /* min-height: 800px; */
        height: 80%;
    }

    .carouselContainer,.ganttSection, .jobProgressionContainer{
        width: 100%;
        margin-top: 16px;
        /* margin-bottom: 16px; */
        /* flex: 1; */
        display: flex;
        flex-direction: column;
        transition: height 0.3s ease;
    }

    .carouselContainer {
        height: 720px;
        /* height: auto; */
    }

    .carouselContainer.has-payment {
        height: 1500px;
        /* height: auto; */
    }

    .jobProgressionContainer{
        justify-content: center;
        /* height: 520px; */
        height: auto;
    }

    .jobProgressionContainer.hasPayment {
        /* height: 950px; */
        height: auto;
    }

        /* .ganttSection {
        width: 100%;
        margin-top: 16px;
        height: 720px;
        display: flex;
        flex-direction: column;
        transition: height 0.3s ease;
    } */

    .ganttSection.hasPayment {
        /* min-height: 800px; */
        /* height: 1500px; */
    }

    .jobSelector {
       margin: 10px;
    }

    .jobSelector select {
        font-size: 18px;
        /* padding: 10px; */
        color: #769FCD;
        border-color: #769FCD;
        min-width: 150px;
    }

    .jobSelector select:focus {
        border-color: #769FCD;
        box-shadow: 0 0 0 0.25rem rgba(118, 159, 205, 0.25);
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

    .contractorHaveNotStart {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        height: 100%;
    }

    .ganttContainer {
        width: 100%;
        height: 84%;
        /* height: 1500px; */
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /* margin: auto; */
         /* align-items: center;  */
        /* margin: 10px auto; */
    }

    .leftContainer {
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
        /* height: 95%;  */
        max-height: 1000px;
        /* margin-left: auto;
        margin-right: auto; */
    }

    .ganttTitle{ 
        text-align: center;
        font-size: 24px;

    }

    @media (min-width: 1080px){
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
            /* min-height: 800px; */
            min-height: 1040px;
            /* min-height: 80vh; */
            /* min-height: 80%; */
            /* flex-grow: 1; */
        }

        .ganttSection {
            width: 78%;
            max-width: 80%;
            margin-bottom: 0px;
            min-height: 720px;
            /* flex: 1; */
        }

        .ganttSection.hasPayment {
            /* min-height: 900px; */
        }

        /* .jobProgressionContainer {
            width: 19%;
            max-width: 19%;
            min-height: 720px;
        } */

         /* .carouselContainer {
            width: 80%; 
            max-width: 80%;
            margin-bottom: 0px; 
            min-height: 720px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .carouselContainer.has-payment {
            min-height: 900px;
        } */

        .jobProgressionContainer {
            width: 25%; 
            max-width: 25%;
            /* flex: 1; */
            display: flex;
            flex-direction: column;
            min-height: 720px;
        }

        .jobProgressionContainer.hasPayment {
            /* min-height: 900px; */
            min-height: 80vh;
        }

         .ganttContainer {
            width: 100%;
            /* height: 100%; */
            min-height: 830px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            /* margin: auto; */
            /* align-items: center;  */
            /* margin: 10px auto; */
        }

        .leftContainer {
            /* overflow: hidden;
            position: relative;
            height: 100%; */

            /* position: relative; */
            overflow: scroll;
            /* display: flex;
            flex-direction: column;
            justify-content: center; */
            
            /* flex: 1; */
            width: 98%;
            height: 98%; 
            /* margin-left: auto;
            margin-right: auto; */
        }
    }

    @media (max-width: 425px){
        .mobileView {
            padding: 13px;
        }

        .carousel-indicators {
            bottom: -20px;
        }

        .timelineContainer, .taskContainer{
            background-color: white;
            padding: 14px;
            border-radius: 10px;
            box-shadow: 0 2px 4px grey;
            margin-bottom: 20px;
            min-height: 300px;
        }

        .taskContainer{
           padding: 24px;      
        }
        .timeline {
            position: relative;
            padding-left: 20px;
        }

        .timelineItem {
            position: relative;
            padding: 10px;
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

        .completed .timelineMarker {
            background: green;
        }

        /* .timelineItem:not(:last-child)::before {
            content: '';
            position: absolute;
            left: -19px;
            top: 36px;
            bottom: -20px;
            width: 2px;
            background: #e0e0e0;
            height: 125px;
        } */

        .jobHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        /* .jobName {
            /* font-weight: 500; */
        

        .jobStatus {
            font-size: 14px;
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