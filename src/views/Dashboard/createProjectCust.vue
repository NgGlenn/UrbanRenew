<script setup>
    import { ref, inject } from 'vue';
    import { useRouter } from 'vue-router';
    import { collection, addDoc } from 'firebase/firestore';
    import { useUserStore } from '@/stores/userStore';
    import { useProjectStore } from '@/stores/projectStore';
    import LogedInLayout from '@/components/logedInLayout.vue';
    import ImageUpload from './imageUpload.vue'

    const router = useRouter();
    const db = inject('db');
    const userStore = useUserStore();

    const location = ref();
    const description = ref();
    const projectStyle = ref([]);
    const currentStyle = ref('');
    const expStartDate = ref('');
    const expEndDate = ref('');
    const uploadedImages = ref([]);
    const isSubmitting = ref(false);

    const handleImageUpload = (url) => {
        console.log('Image uploaded:', url);
        uploadedImages.value.push(url);
    };

    // Available design themes
    const designThemes = [
        { value: 'modern', label: 'Modern' },
        { value: 'heritage', label: 'Heritage' },
        { value: 'simple', label: 'Simple' },
        { value: 'luxury', label: 'Luxury' },
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'scandinavian', label: 'Scandinavian' },
        { value: 'contemporary', label: 'Contemporary' }
    ];

    // Add selected style to the list
    const addStyle = () => {
        if (currentStyle.value && !projectStyle.value.includes(currentStyle.value)) {
            projectStyle.value.push(currentStyle.value);
        }
    };

    // Remove a style from the list
    const removeStyle = (styleToRemove) => {
        projectStyle.value = projectStyle.value.filter(style => style !== styleToRemove);
    };

    // Get label for a style value
    const getStyleLabel = (value) => {
        return designThemes.find(theme => theme.value === value)?.label || value;
    };

    const createProject = async (form) => {
        form.preventDefault();

        if (isSubmitting.value) return;
        isSubmitting.value = true;

        try {
            if (!userStore.userId) {
                throw new Error('User not authenticated');
            }

            const projectData = {
                customerId: userStore.userId,
                location: location.value,
                description: description.value,
                preferredDesignStyle: projectStyle.value,
                expectedStartDate: expStartDate.value,
                expectedEndDate: expEndDate.value,
                imagesURL: uploadedImages.value,
                status: 'new'
            };
            
            await addDoc(collection(db, 'projects'), projectData);

            alert('Project created successfully! Redirecting to your project dashboard...');

            router.push({
                name: 'customerProjectList',
            })
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            isSubmitting.value = false;
        }

    }

</script>

<template>
    <LogedInLayout>
        <div class="container-fluid">
            <form @submit="createProject">
                <div class="mb-3 row">
                    <h1><strong>New Project</strong></h1>
                </div>
                <div class="mb-5 row">
                    <label for="projLocation" class="col-sm-2 col-form-label py-auto">Location</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="location" v-model="location" 
                            placeholder="Enter in the following format: Block-Street Name-Postal Code" required>
                    </div>
                </div>
                <div class="mb-5 row">
                    <label for="projDescription" class="col-sm-2 col-form-label py-auto">Description</label>
                    <div class="col-10">
                        <input type="text" class="form-control" id="projDescription" v-model="description" required>
                    </div>
                </div>
                <div class="mb-5 row">
                    <label for="projExpStartDate" class="col-sm-2 col-form-label py-auto">Expected Start Date</label>
                    <div class="col-md-4 col-10">
                        <input type="date" class="form-control" id="projExpStartDate" required>
                    </div>

                    <label for="projExpEndDate" class="col-sm-2 col-form-label py-auto">Expected Completion Date</label>
                    <div class="col-md-4 col-10">
                        <input type="date" class="form-control" id="projExpEndDate" required>
                    </div>
                </div>
                <div class="mb-5 row">
                    <div class="col-2 col-form-label py-auto">
                        Preferred Design Style 
                    </div>
                    <div class="col-10">
                        <div class="input-group mb-3">
                            <select class="form-select" v-model="currentStyle" aria-label="Select design style">
                                <option v-for="theme in designThemes" :key="theme.value" :value="theme.value" 
                                    :disabled="projectStyle.includes(theme.value)">
                                    {{ theme.label }}
                                </option>
                            </select>
                            <button class="btn btn-outline-secondary" type="button" @click="addStyle"
                                :disabled="projectStyle.includes(currentStyle)">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>

                        <!-- Selected styles display -->
                        <div class="selected-styles">
                            <span v-for="style in projectStyle" :key="style" class="badge rounded-pill bg-primary me-2 mb-2 p-2">
                                {{ getStyleLabel(style) }}
                                <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.5rem;"
                                    @click="removeStyle(style)" aria-label="Remove style"></button>
                            </span>
                        </div>
                        <div v-if="projectStyle.length === 0" class="text-muted small">
                            No design styles selected. Please select at least one style.
                        </div>
                    </div>
                </div>
                <div class="mb-5 row">
                    <div class="col-2 col-form-label py-auto">Photo(s)</div>
                    <div class="col-5">
                        <ImageUpload @uploaded="handleImageUpload"/>
                    </div>
                </div>
                <button type="submit"  style="color: white; background-color: #769FCD;">
                    {{ isSubmitting ? 'Creating Project...' : 'Create Project' }}
                </button>
            </form>
        </div>
    </LogedInLayout>
</template>

<style scoped>
    .container-fluid {
        height: 100%;
        padding: 50px;
    }

    .selected-styles {
        min-height: 38px;
        padding: 5px 0;
    }

    .badge .btn-close {
        padding: 0.25rem;
        width: 0.5rem;
        height: 0.5rem;
        vertical-align: middle;
    }

    .badge {
        transition: all 0.2s ease;
    }

    .badge:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .badge:hover .btn-close {
        opacity: 1;
    }

    .btn.btn-outline-secondary {
        font-size: 1.2rem;
        line-height: 1;
        padding: 0.375rem 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Disable submit button styling */
    button[type="submit"]:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>