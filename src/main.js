import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia/dist/pinia'


import "./assets/css/tailwind_dist.css"
import "./assets/fonts/font.css"
import 'tw-elements';





const app = createApp(App)
app.use(createPinia())

app.mount('#app')
