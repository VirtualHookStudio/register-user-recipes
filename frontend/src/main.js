import 'bootstrap/dist/css/bootstrap.css'
import Toaster from '@meforma/vue-toaster';

import './config/axios'
import Store from '@/config/store'
import Router from './config/router'

import {createApp} from 'vue'
import App from './App.vue'

createApp(App)
    .use(Toaster)
    .use(Store)
    .use(Router)
    .mount('#app')


import 'bootstrap/dist/js/bootstrap.js'
