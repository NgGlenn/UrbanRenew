<template>
  <div ref="ganttContainer" class="Gclass"></div>
</template>

<script setup>
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';
import { onMounted, ref, toRefs, watch, nextTick } from 'vue';

const props = defineProps ({
    tasks: {
        type: Object,
        default: () => {
            return {data: [], links: []}
        }
    }
});
const { tasks } = toRefs(props);
const ganttContainer = ref(null);
console.log(tasks)

let isInitialized = false;

const initGantt = () => {
    if (isInitialized) return;
    
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.scale_height = 60;
    gantt.config.scales = [
        { unit: "day", step: 1, format: "%d %M" },
        { unit: "month", step: 1, format: "%F %Y" }
    ];
    gantt.config.work_time = true;
    gantt.config.skip_off_time = true;

    gantt.init(ganttContainer.value);
    isInitialized = true;
};

const updateGantt = async () => {
    console.log('Updating gantt with tasks:', tasks.value);
    
    if (!tasks.value?.data) return;
    
    await nextTick();
    
    if (!isInitialized) {
        initGantt();
    }

    gantt.clearAll();
    gantt.parse(tasks.value);
};

onMounted(async () => {
    await updateGantt();
});

// Watch for changes in tasks
watch(() => tasks.value, async (newTasks) => {
    console.log('Tasks changed:', newTasks);
    await updateGantt();
}, { deep: true });




// onMounted(() => {
//     // console.log(tasks)
//     gantt.config.date_format = "%Y-%m-%d";
//     gantt.config.scale_height = 60;
  
//     // Configure time scale
//     gantt.config.scales = [
//         { unit: "day", step: 1, format: "%d %M" },
//         { unit: "month", step: 1, format: "%F %Y" }
//     ];

//     // Set working days
//     gantt.config.work_time = true;
//     gantt.config.skip_off_time = true;

//     // Initialize Gantt
//     gantt.init(ganttContainer.value);

//     // Initial render
//     // if (tasks.value && tasks.value.length > 0) {
//     //     gantt.parse({ data: tasks.value, links: [] });
//     // }
//     // gantt.init(ganttContainer.value);
//     // gantt.parse(tasks.value);
    
//     if (tasks.value && tasks.value.data && tasks.value.data.length > 0) {
//         console.log('Parsing tasks:', tasks.value); // Debug log
//         gantt.parse(tasks.value);
//     }

//     // Add watcher for tasks changes
//     // watch(() => tasks.value, (newTasks) => {
//     //     console.log('Tasks updated:', newTasks); // Debug log
//     //     if (newTasks && newTasks.data && newTasks.data.length > 0) {
//     //         gantt.clearAll();
//     //         gantt.parse(newTasks);
//     //     }
//     // }, { deep: true });
// })
</script>

<style>
    .Gclass {
        width: 100%;
        height: 100%;
    }
</style>
