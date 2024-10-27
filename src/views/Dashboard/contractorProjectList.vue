<script setup>
    import LogedInLayout from '@/components/logedInLayout.vue';
    import { computed } from 'vue';
    import { useProjectStore } from '@/stores/projectStore';
    import { storeToRefs } from 'pinia';

    const projectStore = useProjectStore();
    const { contractorJobs } = storeToRefs(projectStore);
    const OngoingProjects = computed(() => contractorJobs.value?.filter(job => job.status === 'in_progress')|| []);
    const CompletedProjects = computed(() => contractorJobs.value?.filter(job => job.status === 'completed')|| []);
    console.log(OngoingProjects)
    console.log(typeof(OngoingProjects))

</script>

<template>
    <LogedInLayout>
        <div class="projectContent">
            <h1><strong>Current Projects</strong></h1>
            <div v-if="OngoingProjects">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(job, index) in OngoingProjects">
                    <div class="col-1 d-flex align-items-center">Project: #{{index + 1}}</div>
                    <div class="col-11 projectDetailsBorder">
                        <strong>Customer Name:</strong> {{job.value}} <strong>Customer ID:</strong> {{job.id}}
                        <br><strong>Project ID:</strong> {{job.projectId}} 
                        <strong>Project Description:</strong> {{ job.description }}
                    </div>
                </div>
            </div>
        </div>
        <div class="projectContent">
            <h1><strong>Completed Projects</strong></h1>
            <div v-if="CompletedProjects">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(customer, index) in CompletedProjects" :key="customer">
                    <div class="col-1 d-flex align-items-center">Project: #{{index + 1}}</div>
                    <div class="col-11 projectDetailsBorder">Customer Name: {{customer.name}} Customer ID: {{customer.id}}
                        <br>Project ID: {{customer.projectId}}
                    </div>
                </div>
            </div>
        </div>
    </LogedInLayout>
</template>
    
<style scoped>
    .projectContent {
        width: 100%;
        min-height: 100%;
        margin-bottom: 50px;
        padding: 50px 10px
    }

    .projectDetailsBorder {
        border: 5px solid grey;
        border-radius: 10px;
        background-color: lightgray;
        color: black;
    }
</style>