<script setup>
import { ref, computed } from 'vue';
import LogedInLayout from '@/components/logedInLayout.vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const projectStore = useProjectStore();
const userStore = useUserStore();

// Track which jobs are expanded
const expandedJobs = ref(new Set());

// Get current project info
const currentProject = computed(() => projectStore.projects?.[0]);

// Function to toggle job expansion
const toggleJobExpansion = (jobId) => {
    if (expandedJobs.value.has(jobId)) {
        expandedJobs.value.delete(jobId);
    } else {
        expandedJobs.value.add(jobId);
    }
};

// Get tasks for a specific job
const getJobTasks = (jobId) => {
    return projectStore.tasks?.filter(task => task.jobId === jobId) || [];
};

const goToMarketplace = () => {
    router.push({ name: 'marketplace' });
};
</script>

<template>
    <LogedInLayout>
        <div class="container-fluid px-4 py-3">
            <div class="d-flex align-items-center mb-4">
                <h1 class="h2 mb-0">My Project</h1>
                &nbsp;&nbsp;&nbsp;
                <button class="btn btn-primary btn-lg d-flex  align-items-center" style="background-color: #8257E5; border: none;"
                    @click="router.push({ name: 'dashboard' })">
                    Start Project
                </button>
            </div>

            <!-- Job List Section -->
            <div class="mb-5">
                <h2 class="h4 mb-3">Job List</h2>
                
                <!-- Empty State -->
                <div v-if="!projectStore.jobs?.length" class="text-center py-4">
                    <p class="mb-3">No jobs yet. Start by finding contractors in our marketplace!</p>
                    <button @click="goToMarketplace" class="btn btn-primary btn-lg">
                        Browse Contractors
                    </button>
                </div>

                <!-- Job Items -->
                <div v-else class="job-list">
                    <div v-for="(job, index) in projectStore.jobs" :key="job.id" class="job-item mb-2">
                        <div class="job-header p-3 d-flex justify-content-between align-items-center"
                            :class="{ 'expanded': expandedJobs.has(job.id) }">
                            <div class="d-flex align-items-center gap-3">
                                <strong style="font-size: 20px;">Job #{{ index+1}}</strong>
                                <strong>{{ job.title }}</strong>
                                <span class="ms-3">
                                    <template v-if="job.contractorId">
                                        <strong>Contractor company: </strong>{{ job.company }}<br>
                                        <strong>Assigned contractor: </strong>{{ job.contractorName }}
                                        <!-- {{ projectStore.jobs?.find(c => c.id === job.contractorId)?.contractorName || job.contractorId }} -->
                                    </template>
                                    <template v-else>
                                        None
                                    </template>
                                </span>
                            </div>
                            <button class="btn btn-link p-0" @click="toggleJobExpansion(job.id)">
                                <i class="bi" :class="expandedJobs.has(job.id) ? 'bi-arrows-collapse' : 'bi-arrows-expand'"></i>
                            </button>
                        </div>

                        <!-- Expanded Task List -->
                        <div v-if="expandedJobs.has(job.id)" class="task-list px-3">
                            <div v-if="getJobTasks(job.id).length === 0" class="text-muted">
                                <strong>No tasks assigned yet.</strong>
                            </div>
                            <div v-for="task in getJobTasks(job.id)" :key="task.id" class="task-item py-2 d-flex justify-content-between">
                                <!-- <div class=" justify-content-between align-items-center"> -->
                                <div class="py-2">
                                    <span><strong>Task Name: </strong>{{ task.name }}</span>
                                    <span><br><strong>Task Description: </strong>{{ task.description }}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <h4 class="mb-0"><span class="badge" :class="{
                                            'bg-warning': task.status === 'pending',
                                            'bg-primary': task.status === 'in-progress',
                                            'bg-success': task.status === 'completed'
                                        }">
                                        {{ task.status }}
                                    </span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Info Section -->
            <div class="project-info">
                <h2 class="h4 mb-3">Project Info</h2>
                <div class="info-content">
                    <div v-if="currentProject" class="row g-3">
                        <div class="col-12">
                            <strong>Location:</strong> {{ currentProject.location }}
                        </div>
                        <div class="col-12">
                            <strong>Description:</strong> {{ currentProject.description }}
                        </div>
                        <div class="col-12">
                            <strong>Expected Start Date:</strong> 
                            {{ new Date(currentProject.expectedStartDate).toLocaleDateString() }}
                        </div>
                        <div class="col-12">
                            <strong>Expected End Date:</strong>
                            {{ new Date(currentProject.expectedEndDate).toLocaleDateString() }}
                        </div>
                        <div class="col-12">
                            <strong>Design Styles:</strong>
                            <span 
                                v-for="style in currentProject.projectStyles" 
                                :key="style"
                                class="badge bg-secondary ms-2"
                            >
                                {{ style }}
                            </span>
                        </div>
                    </div>
                    <div v-else class="text-muted">
                        No project information available.
                    </div>
                </div>
            </div>
        </div>
    </LogedInLayout>
</template>

<style scoped>
.job-item {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #f8f9fa;
}

.job-header {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.job-header:hover {
    background-color: #f0f0f0;
}

.job-header.expanded {
    border-bottom: 1px solid #e0e0e0;
}

.task-list {
    background-color: white;
    border-radius: 0 0 4px 4px;
}

.task-item {
    border-bottom: 1px solid #f0f0f0;
}

.task-item:last-child {
    border-bottom: none;
}

.info-content {
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1rem;
}

.btn-link {
    color: #6c757d;
    text-decoration: none;
}

.btn-link:hover {
    color: #495057;
}
</style>