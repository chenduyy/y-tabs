import { imgUrl, getTabs } from "./utils/index"


// #ifndef VUE3
import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$imgUrl = imgUrl
Vue.prototype.$getTabs = getTabs;

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$imgUrl = imgUrl
	app.config.globalProperties.$getTabs = getTabs
	return {
		app
	}
}
// #endif