<template>
  <!-- <div>
    <p>{{ message }}</p>
  </div> -->
</template>

<script setup>
// import { ref, onMounted } from 'vue';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';

// const message = ref('Testing Firebase connection...');

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };

// onMounted(async () => {
//   try {
//     const app = initializeApp(firebaseConfig);
//     const db = getFirestore(app);
    
//     // Attempt to fetch documents from a collection
//     const querySnapshot = await getDocs(collection(db, 'contractors'));
    
//     message.value = `Successfully connected to Firebase. Found ${querySnapshot.size} documents in test_collection.`;
//   } catch (error) {
//     message.value = `Error connecting to Firebase: ${error.message}`;
//     console.error('Firebase connection error:', error);
//   }
// });
</script>