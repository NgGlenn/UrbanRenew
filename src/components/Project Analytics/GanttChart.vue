<template>
  <div ref="ganttContainer" class='Gclass'></div>
</template>

<script setup>
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';
import { onMounted, ref, toRefs } from 'vue';

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

onMounted(() => {
    gantt.config.date_format = "%Y-%m-%d";
    gantt.init(ganttContainer.value);
    gantt.parse(tasks.value);
})
</script>

<style scoped>
    .Gclass {
        width: auto;
        height: auto;
    }
</style>
