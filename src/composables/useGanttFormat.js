import { computed } from "vue";

export function useGanttFormat(jobs, tasks) {
    const ganttData = computed(() => {
        if (!jobs.value || !tasks.value) return [];

        //return formated data for each job
        return jobs.value.map(job => {
            //Get tasks for this specific job
            const jobTasks = tasks.value.filter(task => task.jobId === job.id);
            
            //Format tasks according to Gantt Chart library format
            const formattedTasks = {
                task: {
                    data: jobTasks.map(task => ({
                        id: task.id,
                        text: task.name,
                        start_date: task.startDate.toDate().toISOString().split('T')[0],
                        duration: calculateDuration(task.startDate.toDate(), task.endDate.toDate()),
                        progress: task.progress ? task.progress / 100 : 0,
                        parent: 0
                    }))
                }
            };

            return {
                jobId: job.id,
                jobName: job.description,
                task: formattedTasks.task.data
            }
        })
    })

    //function to calculate duration in days
    const calculateDuration = (startDate, endDate) => {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    return {ganttData};
}

