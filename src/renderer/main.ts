import { createApp } from 'vue'
import Viewer from './viewer/Viewer.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/global.css'

createApp(Viewer).mount('#app');

document.documentElement.classList.add('dark');
