//This file is used for user management. To tell the pages which user details to display.
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCurrentUser } from "vuefire";

export const useUserStore = defineStore('users', () => {
    // const currentUser = useCurrentUser();

    //Test data, auth has not set up yet
    //customer = mUFDiGa5nwk5F9Yfrmxf
    //contractor = BzxCM6Tke6S7vJ1eqZZB
    const currentUser = ref('BzxCM6Tke6S7vJ1eqZZB');

    //Get userId
    //If userId exists and is not null or undefined, return its unique Id. 
    //If not, return undefined
    // const userId = computed(() => currentUser.value?.uid)
    const userId = computed(() => currentUser.value)
    
    //return as an object as it needs to be reactive.
    //user will log in and out.
    return {userId};
})