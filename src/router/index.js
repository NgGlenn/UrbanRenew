import { createRouter, createWebHistory } from 'vue-router'

import jobRequest from '@/views/userJobRequest.vue';
import contractors from '@/views/contractors.vue';
import viewContractorProfile from '@/views/viewContractorProfile.vue';
import createJobRequest from '@/views/createJobRequest.vue';
import customerDashboard from '@/views/Dashboard/customerDashboard.vue';
import userProfile from '@/views/userProfile.vue';
import createProjectCust from '@/views/Dashboard/createProjectCust.vue';
import login from '@/views/login.vue'
import register from '@/views/register.vue'
import contractorReview from '@/views/contractorReview.vue'


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
      path: '/contractors/:id', 
      name: 'viewContractorProfile',
      component: viewContractorProfile,
      props: true
    },
    { 
      path: '/jobRequest/newRequest/:contractor_id', 
      name: 'createJobRequest',
      component: createJobRequest,
      props: true
    },
    {
      path: '/customerDashboard',
      name: 'customerDashboard',
      component: customerDashboard
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
      component: customerDashboard
    }

  ]
})

export default router
