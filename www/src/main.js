import Vue from 'vue'
import App from './App.vue'
import styles from 'milligram/dist/milligram.min.css' // eslint-disable-line 

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
