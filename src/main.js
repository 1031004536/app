import Vue from 'vue'
import App from './App'

import store from './store'
import MescrollBody from "./components/mescroll-uni/mescroll-body.vue"

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.component('mescroll-body', MescrollBody)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
