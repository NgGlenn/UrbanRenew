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


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/customerDashboard',
      name: 'customerDashboard',
      component: customerDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/customerProfile',
      name: 'customerProfile',
      component: customerProfile,
      meta: { requiresAuth: true }
    },

    {
      path: '/contractorProfile',
      name: 'contractorProfile',
      component: contractorProfile,
      meta: { requiresAuth: true }
    },

    {
      path: '/createProjectCust',
      name: 'createProjectCust',
      component: createProjectCust,
      meta: { requiresAuth: true }
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
      path: '/',
      name: 'customerDashboard',
      component: customerDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'home',
      component: home
    }
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

router.beforeEach((to, from, next) => {
  // Check if Firebase has initialized authentication
  auth.onAuthStateChanged((user) => {
    if (to.meta.requiresAuth && !user) {
      // Redirect to login if user is not authenticated
      next('/login');
    } else {
      next(); // Proceed if user is authenticated or route does not require auth
    }
  });
});

export default router
