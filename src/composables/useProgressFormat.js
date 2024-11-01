import { computed } from "vue";

//composable to format data from database to the format of progression chart library
export function useProgressFormat(jobs, tasks){
    const projectProgress = computed(() => {
        // if (!jobs.value?.length || !tasks.value?.length) return {
        //     currentStep: 0,
        //     steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
        // };

        if (!jobs?.value || !tasks?.value) {
            console.log('Jobs or tasks not available yet:', { jobs, tasks });
            return {
                currentStep: 0,
                steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
            };
        }

        //Calculate current step based on task progression
        const overallProgress = calculateOverallProgress(tasks.value);
        const currentStep = determineProjectStep(overallProgress);
        console.log(currentStep)

        return {
            currentStep,
            steps: ['Planning', 'Design', 'Demolition', 'Construction', 'Finishing']
        };
    })

    //Helper function to calculate overall progress
    const calculateOverallProgress = (tasks) => {
        const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
        return totalProgress/tasks.length
    };

    //Helper function to determine project steps
    const determineProjectStep = (progress) => {
        if (progress < 20) return 1; //Planning
        if (progress < 40) return 2; //Design
        if (progress < 60) return 3; //Demolition
        if (progress < 80) return 4; //Construction
        return 5; //Finishing
    };

    return {projectProgress};
}