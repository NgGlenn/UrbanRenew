import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//Firestore
import {db, auth} from './firebase.js';

//Vuefire
import { installVuefire } from './firebase';

const pinia = createPinia()
const app = createApp(App)

installVuefire(app)

app.provide('db', db)
app.provide('auth', auth)
app.use(router)
app.use(pinia)

app.mount('#app')
