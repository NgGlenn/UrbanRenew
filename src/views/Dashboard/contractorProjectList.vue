<script setup>
    import LogedInLayout from '@/components/LogedInLayout.vue';
    import { computed, defineProps } from 'vue';
    

    const props = defineProps({
        projects: {
            type: Array,
            required: true
        }
    });
    
    const ongoingProjects = computed(() => {
        return props.projects.filter(project => project.status === 'ongoing');
    });

    const hasOngoingProjects = computed(() => ongoingProjects.value.length > 0);

    const completedProjects = computed(() => {
        return props.projects.filter(project => project.status === 'completed');
    });

    const hascompletedProjects = computed(() => completedProjects.value.length > 0);
</script>

<template>
    <LogedInLayout>
        <div class="projectContent">
            <h1><strong>Current Projects</strong></h1>
            <div v-if="hasOngoingProjects">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(customer, index) in customers" :key="customer">
                    <div class="col-1 d-flex align-items-center">Project: #{{index + 1}}</div>
                    <div class="col-11 projectDetailsBorder">Customer Name: {{customer.name}} Customer ID: {{customer.id}}
                        <br>Project ID: {{customer.projectId}}
                    </div>
                </div>
            </div>
        </div>
        <div class="projectContent">
            <h1><strong>Completed Projects</strong></h1>
            <div v-if="hascompletedProjects">
                <div class="row mx-0 mt-4" style="font-size: 24px;" v-for="(customer, index) in customers" :key="customer">
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