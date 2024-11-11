// import { computed } from "vue";

// //composable to format data from database to the format of progression chart library
// export function useProgressFormat(jobs, tasks){
//     const projectProgress = computed(() => {
//         // if (!jobs.value?.length || !tasks.value?.length) return {
//         //     currentStep: 0,
//         //     steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
//         // };

//         if (!jobs?.value || !tasks?.value) {
//             console.log('Jobs or tasks not available yet:', { jobs, tasks });
//             return {
//                 currentStep: 0,
//                 steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
//             };
//         }

//         //Calculate current step based on task progression
//         const overallProgress = calculateOverallProgress(tasks.value);
//         const currentStep = determineProjectStep(overallProgress);
//         console.log("task", tasks)
//         console.log("job", jobs)
//         console.log("overall progress", overallProgress)
//         console.log("current step for progress", currentStep)

//         return {
//             currentStep,
//             steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
//         };
//     })

//     //Helper function to calculate overall progress
//     const calculateOverallProgress = (tasks) => {
//         const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
//         return totalProgress/tasks.length
//     };

//     //Helper function to determine project steps
//     const determineProjectStep = (progress) => {
//         if (progress < 20) return 1; //Planning
//         if (progress < 40) return 2; //Design
//         if (progress < 60) return 3; //Demolition
//         if (progress < 80) return 4; //Construction
//         return 5; //Finishing
//     };

//     return {projectProgress};
// }

import { computed } from "vue";

export function useProgressFormat(jobs, tasks) {
    const projectProgress = computed(() => {
        if (!jobs?.value?.length || !tasks?.value?.length) {
            console.log('Jobs or tasks not available yet:', { jobs, tasks });
            return {
                currentStep: 0,
                steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
            };
        }

        // Group tasks by job
        const tasksByJob = groupTasksByJob(tasks.value);
        const projectStatus = calculateProjectStatus(jobs.value, tasksByJob);

        return {
            currentStep: projectStatus.currentStep,
            steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing'],
            currPhase: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing'][projectStatus.currentStep-1]
        };
    });

    // Helper function to group tasks by jobId
    const groupTasksByJob = (tasks) => {
        return tasks.reduce((acc, task) => {
            if (!acc[task.jobId]) {
                acc[task.jobId] = [];
            }
            acc[task.jobId].push(task);
            return acc;
        }, {});
    };

    // Calculate overall project status considering jobs and their tasks
    const calculateProjectStatus = (jobs, tasksByJob) => {
        // Calculate progress for each job
        const jobProgressList = jobs.map(job => {
            const jobTasks = tasksByJob[job.id] || [];
            const jobProgress = calculateJobProgress(jobTasks);

            return {
                jobId: job.id,
                progress: jobProgress,
                status: job.status,
                weight: determineJobWeight(job)
            };
        });

        // Calculate weighted project progress
        const totalWeight = jobProgressList.reduce((sum, job) => sum + job.weight, 0);
        const weightedProgress = jobProgressList.reduce((sum, job) => {
            return sum + (job.progress * job.weight);
        }, 0) / totalWeight;

        return {
            currentStep: determineProjectStep(weightedProgress),
            overallProgress: weightedProgress
        };
    };

    // Calculate progress for a single job based on its tasks
    const calculateJobProgress = (tasks) => {
        if (!tasks.length) return 0;

        const completedTasks = tasks.filter(task => task.progress === 100).length;
        const inProgressTasks = tasks.filter(task => task.progress > 0 && task.progress < 100);

        const progressSum = inProgressTasks.reduce((sum, task) => sum + task.progress, 0);
        return ((completedTasks * 100) + progressSum) / tasks.length;
    };

    // Determine job weight based on its characteristics
    const determineJobWeight = (job) => {
        // Base weight on job characteristics
        let weight = 1;

        // // Add weight if it's a critical job
        // if (job.description.toLowerCase().includes('demolition') ||
        //     job.description.toLowerCase().includes('construction')) {
        //     weight += 0.5;
        // }

        // Consider status
        if (job.status === 'completed') weight += 0.3;
        if (job.status === 'in_progress') weight += 0.2;

        return weight;
    };

    // Determine project step with more granular thresholds
    const determineProjectStep = (progress) => {
        if (progress < 15) return 1;  // Planning

        if (progress < 35) return 2;  // Design

        if (progress < 55) return 3;  // Demolition

        if (progress < 85) return 4;  // Construction

        return 5;  // Finishing
    };

    return { projectProgress };
}