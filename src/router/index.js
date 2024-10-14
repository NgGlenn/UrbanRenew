import { createRouter, createWebHistory } from 'vue-router'

import jobRequest from '@/views/jobRequest.vue';
import contractors from '@/views/contractors.vue';
import userDashboard from '@/views/userDashboard.vue';
import userProfile from '@/views/userProfile.vue';
import createProjectCust from '@/views/createProjectCust.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/jobRequest',
      name: 'jobRequest',
      component: jobRequest
    },
    {
      path: '/contractors',
      name: 'contractors',
      component: contractors
    },
    {
      path: '/userDashboard',
      name: 'userDashboard',
      component: userDashboard
    },
    {
      path: '/userProfile',
      name: 'userProfile',
      component: userProfile
    },
    {
      path: '/createProjectCust',
      name: 'createProjectCust',
      component: createProjectCust
    }
  ]
})

export default router
