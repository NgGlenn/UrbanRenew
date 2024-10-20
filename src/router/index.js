import { createRouter, createWebHistory } from 'vue-router'

import jobRequest from '@/views/jobRequest.vue';
import contractors from '@/views/contractors.vue';
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
      redirect: '/customerDashboard',
    },
    {
      path:'/contractorReview',
      name: 'contractorReview',
      component: contractorReview
    }
  ]
})

export default router
