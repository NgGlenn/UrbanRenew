<script setup>
    import 'vue-css-donut-chart/dist/vcdonut.css';
    import { VcDonut } from 'vue-css-donut-chart';

    const props = defineProps({
        sections: {
            type: Array,
            default: () => [ { label: 'Completed', value: 50, color: '#769FCD' },
                            { label: 'Remaining', value: 50, color: 'grey' }]
        }
    });
</script>

<template>
    <vc-donut :sections="sections" :has-legend="false" :thickness="25" :size="225"></vc-donut>
</template>

<style scoped>

</style>