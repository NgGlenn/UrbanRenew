<script setup>
    import StepProgress from 'vue-step-progress';
    import 'vue-step-progress/dist/main.css';

    const props = defineProps({
        mySteps: {
            type: Array,
            default: () => ['Start', 'End']
        },
        currentStep: {
            type: Number,
            default: 0
        },
        activeColor: {
            type: String,
            default: '#769FCD'
        }

    });


</script>

<template>
    <div>
        <step-progress :steps="mySteps" :current-step="currentStep" :active-color="activeColor" icon-class="fa fa-check">
        </step-progress>
    </div>
</template>

<style scoped>

</style>