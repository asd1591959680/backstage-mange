import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import treeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', treeTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
