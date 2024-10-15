<script setup>
    import { computed } from 'vue';

    const props = defineProps({
    size: {
        type: String,
        default: '1em'
    },
    color: {
        type: String,
        default: 'grey'
    }
    });

    const style = computed(() => ({
        width: props.size,
        height: props.size,
        fill: props.color
    }));
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" :style="style">
    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
  </svg>
</template>

<style scoped>
    svg {
        display: inline-block;
        vertical-align: middle;
    }
</style>