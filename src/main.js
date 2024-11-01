import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'


//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { firebaseApp, db, auth} from './firebase.js';

//Vuefire
import { VueFire, VueFireAuth } from 'vuefire';

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth()
    ]
})

app.provide('db', db)
app.provide('auth', auth)
app.use(router)


app.mount('#app')
