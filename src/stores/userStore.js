//This file is used for user management. To tell the pages which user details to display.
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCurrentUser, useDocument } from "vuefire";
import { doc } from "firebase/firestore";
import { inject } from "vue";

export const useUserStore = defineStore('users', () => {
    const currentUser = useCurrentUser();
    const db = inject('db');
    
    //Test data, auth has not set up yet
    //customer = mUFDiGa5nwk5F9Yfrmxf
    //contractor = BzxCM6Tke6S7vJ1eqZZB
    // const currentUser = ref('mUFDiGa5nwk5F9Yfrmxf');
    // const userId = computed(() => currentUser.value)

    //Get userId
    //If userId exists and is not null or undefined, return its unique Id. 
    //If not, return undefined
    const userId = computed(() => currentUser.value?.uid);
    
    //Create ref to user's doc in firestore.
    const userDocRef = computed(() => 
        userId.value ? doc(db, 'users', userId.value) : null
    );
    const { data: userData } = useDocument(userDocRef);

    //Get role
    const userRole = computed(() => userData.value?.role);
    
    //return as an object as it needs to be reactive.
    //user will log in and out.
    return {userId, userRole};
})