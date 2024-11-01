<template>
    <div>
        <input 
            type="file" 
            @change="handleFileUpload" 
            accept="image/*"
        />
        
        <!-- Show loading state -->
        <div v-if="uploading">Uploading...</div>
        
        <!-- Show preview -->
        <img 
            v-if="imageUrl" 
            :src="imageUrl" 
            style="max-width: 200px;"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { storage } from '@/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const emit = defineEmits(['uploaded']);

const uploading = ref(false);
const imageUrl = ref('');

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    uploading.value = true;

    try {
        // Create a storage reference
        const fileRef = storageRef(storage, `images/${file.name}`);
        
        // Upload the file
        await uploadBytes(fileRef, file);
        
        // Get download URL
        const url = await getDownloadURL(fileRef);
        imageUrl.value = url;
        
        // Emit the URL to parent component
        emit('uploaded', url);
        
    } catch (error) {
        console.error('Upload failed:', error);
    } finally {
        uploading.value = false;
    }
};
</script>