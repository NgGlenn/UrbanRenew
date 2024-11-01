<template>
  <div ref="ganttContainer" class="Gclass"></div>
</template>

<script setup>
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';
import { onMounted, ref, toRefs, watch, nextTick, inject } from 'vue';
import { doc, updateDoc, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { useProjectStore } from '@/stores/projectStore';

const props = defineProps ({
    tasks: {
        type: Object,
        default: () => {
            return {data: [], links: []}
        }
    }
});
const { tasks } = toRefs(props);
console.log(tasks)
const ganttContainer = ref(null);
const db = inject('db');
const projectStore = useProjectStore();
let isInitialized = false;
const emit = defineEmits(['taskUpdated', 'taskAdded', 'taskDeleted']);

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

    // Add event listeners for Firestore sync
    gantt.attachEvent("onAfterTaskUpdate", async (id, task) => {
        try {
            const taskRef = doc(db, 'tasks', id);
            await updateDoc(taskRef, {
                name: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                progress: task.progress || 0,
                // Add any other fields you're tracking
            });
            console.log('Task updated in Firestore');
            emit('taskUpdated', { id, task });
        } catch (error) {
            console.error('Error updating task:', error);
            // Revert changes in gantt if update fails
            gantt.refreshTask(id);
        }
    });

    gantt.attachEvent("onAfterTaskAdd", async (id, task) => {
        try {
            const taskData = {
                jobId: projectStore.currentJobId,
                name: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                progress: task.progress || 0,
                status: 'pending'
            };

            const docRef = await addDoc(collection(db, 'tasks'), taskData);
            // Update task id in gantt to match Firestore
            gantt.changeTaskId(id, docRef.id);
            console.log('New task added to Firestore');
            emit('taskAdded', { id: docRef.id, task: taskData });
        } catch (error) {
            console.error('Error adding task:', error);
            gantt.deleteTask(id);
        }
    });

    gantt.attachEvent("onAfterTaskDelete", async (id) => {
        try {
            await deleteDoc(doc(db, 'tasks', id));
            console.log('Task deleted from Firestore');
            emit('taskDeleted', id);
        } catch (error) {
            console.error('Error deleting task:', error);
            // Optionally restore the task
        }
    });

    // Handle progress updates
    gantt.attachEvent("onTaskDrag", async (id, mode, task, original) => {
        if (mode === 'progress') {
            try {
                await updateDoc(doc(db, 'tasks', id), {
                    progress: task.progress
                });
                console.log('Progress updated in Firestore');
            } catch (error) {
                console.error('Error updating progress:', error);
                task.progress = original.progress;
                gantt.refreshTask(id);
            }
        }
    });

    // Add columns for status and progress
    gantt.config.columns = [
        { name: "text", label: "Task name", tree: true, width: 200 },
        { 
            name: "status", 
            label: "Status", 
            width: 100,
            template: (task) => {
                const statusClasses = {
                    'pending': 'bg-warning',
                    'in-progress': 'bg-primary',
                    'completed': 'bg-success'
                };
                return `<span class="badge ${statusClasses[task.status] || 'bg-secondary'} status-cell">
                    ${task.status || 'pending'}
                </span>`;
            }
        },
        { name: "start_date", label: "Start", align: "center" },
        { name: "end_date", label: "End", align: "center" },
        { 
            name: "progress", 
            label: "Progress", 
            align: "center",
            template: (task) => Math.round((task.progress || 0) * 100) + "%" 
        }
    ];

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

// Handle status changes
const handleStatusChange = async (taskId) => {
    const task = gantt.getTask(taskId);
    const currentStatus = task.status || 'pending';
    const statusOrder = ['pending', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
        await updateDoc(doc(db, 'tasks', taskId), {
            status: newStatus
        });
        task.status = newStatus;
        gantt.refreshTask(taskId);
        console.log('Status updated in Firestore');
    } catch (error) {
        console.error('Error updating status:', error);
    }
};

// Add click handler for status changes
gantt.attachEvent("onTaskClick", (id, e) => {
    if (e.target.classList.contains('status-cell')) {
        handleStatusChange(id);
        return false; // Prevent default action
    }
});

onMounted(async () => {
    await updateGantt();
});


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

    :deep(.status-cell) {
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 3px;
        color: white;
    }

    :deep(.status-cell:hover) {
        opacity: 0.8;
    }

    /* Add some hover effect to tasks */
    :deep(.gantt_task_row:hover) {
        background-color: #f5f5f5;
    }

    /* Style the progress bar */
    :deep(.gantt_task_progress) {
        background-color: #2196F3;
    }
</style>
