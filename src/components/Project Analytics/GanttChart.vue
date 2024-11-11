<template>
  <div ref="ganttContainer" class="Gclass"></div>
</template>

<script setup>
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';
import { onMounted, ref, toRefs, watch, nextTick, inject } from 'vue';
import { doc, updateDoc, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { useProjectStore } from '@/stores/projectStore';
import { useUserStore } from '@/stores/userStore';

const props = defineProps ({
    tasks: {
        type: Object,
        default: () => {
            return {data: [], links: []}
        }
    },
    isContractor: {
        type: Boolean,
        default: false
    }
});
const { tasks } = toRefs(props);
// console.log(tasks)
const ganttContainer = ref(null);
const db = inject('db');
const projectStore = useProjectStore();
let isInitialized = false;
let isProcessing = false;
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
    gantt.config.start_on_monday = true
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;
    gantt.config.drag_progress = true;
    gantt.config.readonly = !props.isContractor;
    gantt.locale.labels.section_progress = "Progress"; 
    gantt.config.duration_unit = "day";  // Add this
    gantt.config.duration_step = 1;   

    let processingTaskId = null;

    gantt.config.columns = [
        { name: "text", label: "Task name", tree: true, width: 150 },
        // { name: "start_date", label: "Start", align: "center", width: 80 },
        { name: "duration", label: "Duration", align: "center", width: 70 },
        { name: "progress", label: "Progress", align: "center", width: 80,
            template: (task) => Math.round(task.progress * 100) + "%"
        },
        {name:"add"}
    ];

    // Define custom progress editor
    gantt.form_blocks["progress_editor"] = {
        render: function(sns) {
            return "<div class='gantt-progress-editor'>" +
                   "<input type='number' min='0' max='100' step='1'>" +
                   "<span>%</span>" +
                   "</div>";
        },
        set_value: function(node, value, task, section) {
            node.querySelector("input").value = Math.round((value || 0) * 100);
        },
        get_value: function(node, task, section) {
            const value = node.querySelector("input").value;
            return Math.min(Math.max(value, 0), 100) / 100;
        },
        focus: function(node) {
            node.querySelector("input").focus();
        }
    };
    
    // Configure the lightbox
    gantt.config.lightbox.sections = [
        { 
            name: "description", 
            height: 70, 
            map_to: "text", 
            type: "textarea", 
            focus: true 
        },
        { 
            name: "progress", 
            height: 30, 
            map_to: "progress",
            type: "progress_editor",
            single_date: true
        },
        { 
            name: "time", 
            height: 72, 
            type: "duration", 
            map_to: "auto" 
        }
    ];



    // Add event listeners for Firestore sync
    gantt.attachEvent("onAfterTaskUpdate", async (id, task) => {
        console.log('id', id);
        console.log('task', task)
        if (!props.isContractor) {
            console.log('Only contractors can update tasks');
            // Revert changes
            gantt.refreshTask(id);
            return;
        }

        try {
            const taskRef = doc(db, 'tasks', id);
            isProcessing = true;

            await updateDoc(taskRef, {
                name: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                progress: Math.round(task.progress*100) || 0,
                // progress: task.progress
                // Add any other fields you're tracking
            });
            console.log(taskRef.progress)
            console.log('Task updated in Firestore');
            emit('taskUpdated', { id, task });
        } catch (error) {
            console.error('Error updating task:', error);
            // Revert changes in gantt if update fails
            gantt.refreshTask(id);
        } finally {
            isProcessing = false;
        }
    });

    gantt.attachEvent("onBeforeTaskAdd", (id, task) => {
        if (isProcessing || !props.isContractor || processingTaskId === id) {
            return false;
        }
        processingTaskId = id;
        return true;
    });

    gantt.attachEvent("onAfterTaskAdd", async (id, task) => {
        // if (!props.isContractor) {
        //     console.log('Only contractors can add tasks');
        //     gantt.deleteTask(id);
        //     return;
        // }

        // try {
        //     const taskData = {
        //         jobId: projectStore.currentJobId,
        //         name: task.text,
        //         startDate: task.start_date,
        //         endDate: task.end_date,
        //         progress: task.progress || 0,
        //         status: 'pending'
        //     };

        //     const docRef = await addDoc(collection(db, 'tasks'), taskData);
        //     // Update task id in gantt to match Firestore
        //     gantt.changeTaskId(id, docRef.id);
        //     console.log('New task added to Firestore');
        //     emit('taskAdded', { id: docRef.id, task: taskData });
        // } catch (error) {
        //     console.error('Error adding task:', error);
        //     gantt.deleteTask(id);
        // }

        // if (!props.isContractor || isProcessing) return;

        // try {
        //     isProcessing = true;
        //     const taskData = {
        //         jobId: projectStore.currentJobId,
        //         name: task.text,
        //         startDate: task.start_date,
        //         endDate: task.end_date,
        //         progress: Math.round(task.progress*100) || 0,
        //         status: 'pending'
        //     };
        //     console.log(taskData.progress)
        //     const docRef = await addDoc(collection(db, 'tasks'), taskData);
        //     gantt.changeTaskId(id, docRef.id);
        //     emit('taskAdded', { id: docRef.id, task: taskData });
        // } catch (error) {
        //     console.error('Error adding task:', error);
        //     gantt.deleteTask(id);
        // } finally {
        //     isProcessing = false;
        // }

        if (!props.isContractor || isProcessing || id !== processingTaskId) return;

        try {
            isProcessing = true;
            
            // Ensure dates are set to start of day
            const startDate = new Date(task.start_date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(task.end_date);
            endDate.setHours(23, 59, 59, 999);

            const taskData = {
                jobId: projectStore.currentJobId,
                name: task.text,
                startDate: startDate,
                endDate: endDate,
                progress: Math.round(task.progress*100) || 0,
                status: 'pending'
            };

            console.log('Adding task:', {
                original: task,
                processed: taskData
            });

            const docRef = await addDoc(collection(db, 'tasks'), taskData);
            gantt.changeTaskId(id, docRef.id);
            emit('taskAdded', { id: docRef.id, task: taskData });
        } catch (error) {
            console.error('Error adding task:', error);
            gantt.deleteTask(id);
        } finally {
            isProcessing = false;
            processingTaskId = null;
        }
    });

    gantt.attachEvent("onAfterTaskDelete", async (id) => {
        if (id === processingTaskId) {
            processingTaskId = null;
        }
        
        if (!props.isContractor) {
            console.log('Only contractors can add tasks');
            return;
        }

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
    // gantt.attachEvent("onTaskDrag", async (id, mode, task, original) => {
    //     if (!props.isContractor) {
    //         console.log('Only contractors can modify tasks');
    //         // Revert changes
    //         task.progress = original.progress;
    //         gantt.refreshTask(id);
    //         return;
    //     }
        
    //     if (mode === 'progress') {
    //         try {
    //             await updateDoc(doc(db, 'tasks', id), {
    //                 progress: Math.round(task.progress*100)
    //             });
    //             console.log('Progress updated in Firestore');
    //         } catch (error) {
    //             console.error('Error updating progress:', error);
    //             task.progress = original.progress;
    //             gantt.refreshTask(id);
    //         }
    //     }
    // });

    // Add click handler for status changes
    gantt.attachEvent("onTaskClick", (id, e) => {
        if (e.target.classList.contains('status-cell')) {
            handleStatusChange(id);
            return false; // Prevent default action
        }
    });

    // gantt.attachEvent("onAfterTaskDrag", async (id, mode, task, original) => {
    //     if (!props.isContractor || isProcessing) return;
        
    //     if (mode === "move" || mode === "resize") {
    //         try {
    //             isProcessing = true;
    //             const taskRef = doc(db, 'tasks', id);
                
    //             const updateData = {
    //                 startDate: formatDateForFirestore(task.start_date),
    //                 endDate: formatDateForFirestore(task.end_date)
    //             };

    //             await updateDoc(taskRef, updateData);
    //             console.log('Task dates updated in Firestore after drag');
    //             emit('taskUpdated', { id, task });
    //         } catch (error) {
    //             console.error('Error updating task dates:', error);
    //             task.start_date = original.start_date;
    //             task.end_date = original.end_date;
    //             gantt.refreshTask(id);
    //         } finally {
    //             isProcessing = false;
    //         }
    //     }
    // });

    // Handle date changes through lightbox (menu)
    gantt.attachEvent("onLightboxSave", async (id, task, is_new) => {
        //  if (!props.isContractor || isProcessing) return true;

        // try {
        //     isProcessing = true;
        //     const taskRef = doc(db, 'tasks', id);
            
        //     // Ensure dates are set to start of day
        //     const startDate = new Date(task.start_date);
        //     startDate.setHours(0, 0, 0, 0);
            
        //     const endDate = new Date(task.end_date);
        //     endDate.setHours(23, 59, 59, 999);


        //     const updateData = {
        //         text: task.text,
        //         startDate: startDate,
        //         endDate: endDate,
        //         progress: Math.round(task.progress) || 0
        //     };

        //     await updateDoc(taskRef, updateData);
        //     console.log('Task updated in Firestore after lightbox edit', updateData);
        //     emit('taskUpdated', { id, task });
        //     return true;
         if (!props.isContractor || isProcessing) return true;

        try {
            isProcessing = true;
            
            // For new tasks, we need to create them
            if (is_new) {
                const startDate = new Date(task.start_date);
                startDate.setHours(0, 0, 0, 0);
                
                const endDate = new Date(task.end_date);
                endDate.setHours(23, 59, 59, 999);

                const taskData = {
                    jobId: projectStore.currentJobId,
                    name: task.text,
                    startDate: startDate,
                    endDate: endDate,
                    progress: Math.round(task.progress * 100) || 0,
                    status: 'pending'
                };

                const docRef = await addDoc(collection(db, 'tasks'), taskData);
                gantt.changeTaskId(id, docRef.id);
                emit('taskAdded', { id: docRef.id, task: taskData });
            } 
            // For existing tasks, update them
            else {
                const taskRef = doc(db, 'tasks', id.toString());
                const startDate = new Date(task.start_date);
                startDate.setHours(0, 0, 0, 0);
                
                const endDate = new Date(task.end_date);
                endDate.setHours(23, 59, 59, 999);

                const updateData = {
                    name: task.text,
                    startDate: startDate,
                    endDate: endDate,
                    progress: Math.round(task.progress * 100) || 0
                };

                await updateDoc(taskRef, updateData);
                emit('taskUpdated', { id, task: updateData });
            }
            return true;
        } catch (error) {
            console.error('Error updating task:', error);
            return false;
        } finally {
            isProcessing = false;
        }
    });

    gantt.attachEvent("onAfterLightbox", function(id) {
        gantt.refreshData();
    });


    // Also add validation for dates
    // gantt.attachEvent("onTaskDrag", (id, mode, task, original) => {
    //     if (mode === "move" || mode === "resize") {
    //         return true;
    //     }
    //     return true;
    // });

    gantt.init(ganttContainer.value);
    isInitialized = true;
};

const updateGantt = async () => {
    // console.log('Updating gantt with tasks:', tasks.value);
    
    // if (!tasks.value?.data) return;
    
    // await nextTick();
    
    // if (!isInitialized) {
    //     initGantt();
    // }

    // gantt.clearAll();
    // gantt.parse(tasks.value);

    if (!tasks.value?.data || isProcessing) return;
    
    try {
        isProcessing = true;
        await nextTick();
        
        if (!isInitialized) {
            initGantt();
        }

        gantt.clearAll();
        gantt.parse(tasks.value);
    } finally {
        isProcessing = false;
    }
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

onMounted(async () => {
    await updateGantt();
});

// Watch for changes in tasks
// watch(() => tasks.value, async (newTasks) => {
//     if (isInitialized) {
//         gantt.config.readonly = !newValue;
//         gantt.render(); // Re-render the chart
//     }

//     console.log('Tasks changed:', newTasks);
//     await updateGantt();
// }, { deep: true });

watch(() => tasks.value, async (newTasks, oldTasks) => {
    if (isProcessing) return;
    
    if (isInitialized) {
        gantt.config.readonly = !props.isContractor;
        gantt.render();
    }

    if (JSON.stringify(newTasks) !== JSON.stringify(oldTasks)) {
        await updateGantt();
    }
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

    /* :deep(.status-cell) {
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 3px;
        color: white;
    }

    :deep(.status-cell:hover) {
        opacity: 0.8;
    }

    /* Add some hover effect to tasks */
    /* :deep(.gantt_task_row:hover) {
        background-color: #f5f5f5;
    } */

    /* Style the progress bar */
    /*:deep(.gantt_task_progress) {
        /* background-color: #2196F3; */
   /* } */

</style>