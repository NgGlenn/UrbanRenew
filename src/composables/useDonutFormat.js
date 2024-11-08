import { computed } from "vue";

//Composable to format data to donut chart library format
export function useDonutFormat(jobs, tasks) {
    const jobProgress = computed(() => {
        // if (!jobs.value || !tasks.value) return [];
        if (!jobs?.value?.length || !tasks?.value?.length) {
            console.log('No jobs or tasks data:', { jobs, tasks });
            return [{
                donutSections: [],
                completionPercentage: 0
            }];
        }

        return jobs.value.map(job => {
            //Get tasks for this job
            const jobTasks = tasks.value.filter(task => task.jobId === job.id)

            //Completion percentage
            let completionPercentage;

            if (jobTasks.length > 0){
                const totalProgress = jobTasks.reduce((sum, task) => {
                    const taskProgress = task.progress || 0;
                    return sum + taskProgress;
                }, 0);

                completionPercentage = (totalProgress/jobTasks.length).toFixed(0);
                // completionPercentage = averageProgress*100;
            }else{
                completionPercentage = 0;
            };

            return {
                jobId: job.id,
                jobName: job.description,
                completionPercentage,
                donutSections: [
                    { value: completionPercentage, color: '#769FCD'},
                    { value: 100 - completionPercentage, color: 'grey'}
                ]
            };

        })
    })
    return {jobProgress};
}