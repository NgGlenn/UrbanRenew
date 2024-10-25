<template>
  <div ref="ganttContainer" class="Gclass"></div>
</template>

<script setup>
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps ({
    tasks: {
        type: Array,
        required: true
        // default: () => {
        //     return {data: [], links: []}
        // }
    }
});
const { tasks } = toRefs(props);
const ganttContainer = ref(null);

onMounted(() => {
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.scale_height = 60;
  
    // Configure time scale
    gantt.config.scales = [
        { unit: "day", step: 1, format: "%d %M" },
        { unit: "month", step: 1, format: "%F %Y" }
    ];

    // Set working days
    gantt.config.work_time = true;
    gantt.config.skip_off_time = true;

    // Initialize Gantt
    gantt.init(ganttContainer.value);

    // Initial render
    if (tasks.value && tasks.value.length > 0) {
        gantt.parse({ data: tasks.value, links: [] });
    }
    // gantt.init(ganttContainer.value);
    // gantt.parse(tasks.value);
})
</script>

<style scoped>
    .Gclass {
        width: 100%;
        height: 100%;
    }
</style>
