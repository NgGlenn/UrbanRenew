import { createRouter, createWebHistory } from 'vue-router'
import { auth } from "@/firebase";

import jobRequest from '@/views/jobRequest.vue';
import contractors from '@/views/contractors.vue';
import customerDashboard from '@/views/Dashboard/customerDashboard.vue';
import customerProfile from '@/views/customerProfile.vue';
import createProjectCust from '@/views/Dashboard/createProjectCust.vue';
import login from '@/views/login.vue'
import register from '@/views/register.vue'
import home from '@/views/home.vue'
import contractorProfile from '@/views/contractorProfile.vue';
import contractorReview from '@/views/contractorReview.vue'

import contractorProjectList from '@/views/Dashboard/contractorProjectList.vue';
import contractorDashboard from '@/views/Dashboard/contractorDashboard.vue';
// import customerDashboard from '@/views/Dashboard/customerDashboard.vue';
import dashboard from '@/views/Dashboard/dashboard.vue';
import Payment from '@/views/Payment.vue';
import customerProjectList from '@/views/Dashboard/customerProjectList.vue';

import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: '/home'
    // },
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/jobRequest',
      name: 'jobRequest',
      component: jobRequest,
      meta: { requiresAuth: true }
    },
    {
      path: '/contractors',
      name: 'contractors',
      component: contractors,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/job/:jobId',
      name: 'JobDetails',
      component: () => import('@/views/Dashboard/contractorDashboard.vue'),
      // component: contractorDashboard,
      meta: { requiresAuth: true, requiresContractor: true }
    },

    {
      path: '/contractorProfile',
      name: 'contractorProfile',
      component: contractorProfile,
      meta: { requiresAuth: true }
    },

    {
      path: '/contractorProjectList',
      name: 'contractorProjectList',
      component: contractorProjectList,
      meta: { requiresAuth: true, requiresContractor: true }
    },
    {
      path: '/customerProjectList',
      name: 'customerProjectList',
      component: customerProjectList,
      meta: { requiresAuth: true }
    },
    {
      path: '/createProjectCust',
      name: 'createProjectCust',
      component: createProjectCust,
      meta: { requiresAuth: true }
    },
    {
      path: '/Payment',
      name: 'Payment',
      component: Payment,
      meta: { requiresAuth: true }
    },
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: profile,
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/customerProfile',
    //   name: 'customerProfile',
    //   component: customerProfile,
    //   meta: { requiresAuth: true }
    // },

    // {
    //   path: '/contractorProfile',
    //   name: 'contractorProfile',
    //   component: contractorProfile,
    //   meta: { requiresAuth: true }
    // },
   

 
    // {
    //   path: '/',
    //   name: 'customerDashboard',
    //   component: customerDashboard,
    //   meta: { requiresAuth: true }
    // },

  ],
  scrollBehavior(to, from, savedPosition) {
    // Check if the target route has a hash (an anchor link)
    if (to.hash) {
      const offset = 100;
      const element = document.querySelector(to.hash);
      if (element) {

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        return { top: offsetPosition, behavior: 'smooth' }; // Return the scroll position
      }
    }
    return savedPosition || { top: 0 }; // Default to saved position or top
  },
});

// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();
//   // const isAuthenticated = userStore.isAuthenticated;
//   const userRole = userStore.userRole;

//   // Check if Firebase has initialized authentication
//   auth.onAuthStateChanged((user) => {
//     if (to.meta.requiresAuth && !user) {
//       // Redirect to login if user is not authenticated
//       next('/login');
//     } else if (to.meta.requiresContractor && userRole !== 'contractor') {
//       next('/dashboard');
//     }  
//     else {
//       next(); // Proceed if user is authenticated or route does not require auth
//     }
//   });
// });

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Wait for Firebase auth state
  try {
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });

    if (to.meta.requiresAuth && !auth.currentUser) {
      next('/login');
    } else if (to.meta.requiresContractor && userStore.userRole !== 'contractor') {
      next('/dashboard');
    } else {
      next();
    }
  } catch (error) {
    console.error('Auth error:', error);
    next('/login');
  }
});

export default router