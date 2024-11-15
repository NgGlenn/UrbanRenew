// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//vuefire, makes retrieving docuements from firestore easier
import { VueFire } from "vuefire";
import { getStorage, ref } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const storage = getStorage(firebaseApp);
const storageRef = ref(storage);

const vuefireOptions = {
    firestore: db
}

export function installVuefire(vueApp){
    vueApp.use(VueFire, vuefireOptions)
}

// Export the services
export { db, auth, storage }
