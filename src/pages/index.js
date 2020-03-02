import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'
import elCascaderMulti from "el-cascader-multi"

import '@/styles/index.scss' // global css

//import router from '../router'
import router from '../router/index.js'
import store from '../store'
import App from '../App.vue'

import '@/icons' // icon
import VueAMap from 'vue-amap';
import '@/permission' // permission control
Vue.use(elCascaderMulti);
Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.use(VueAMap);

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }

})

VueAMap.initAMapApiLoader({
    key: '5e4cc6450ff7991a6bf55df3035ee6cf',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
});
