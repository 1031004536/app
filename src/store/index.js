import Vue from 'vue'
import Vuex from 'vuex'
import http from '../common/request.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: true,
		hasLogin: false,
		userName: ""
	},
	mutations: {
		login(state, userName) {
			let opts = {
				url: '/v1/index/index',
				method: 'get'
			}
			let param = {}
			http.httpRequest(opts, param).then(
				res => {
					state.hasLogin = true;
					uni.showToast({
						title: '登录成功',
						duration: 2000,
						icon: "none"
					});
					console.log(state.hasLogin)
				},
				error => {
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: "none"
					});
				}
			);
			state.userName = userName || '新用户';
		},
		logout(state) {
			state.userName = "";

			let opts = {
				url: "/v1/user/logout",
				method: "get"
			};
			let param = {};
			http.httpRequest(opts, param).then(
				res => {
					state.hasLogin = false;
					uni.showToast({
						title: res.data.msg,
						duration: 2000,
						icon: "none"
					});
				},
				error => {
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: "none"
					});
				}
			);
		}
	}
})

export default store