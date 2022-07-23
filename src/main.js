import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Less from 'less'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Less)

new Vue({
    render: h => h(App),
}).$mount('#app')
