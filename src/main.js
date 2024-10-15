import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//Firestore
import {db, auth} from './firebase.js';

const app = createApp(App)

app.provide('db', db)
app.provide('auth', auth)
app.use(router)


app.mount('#app')
