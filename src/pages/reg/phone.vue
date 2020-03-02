<template>
	<view class="content">
		<view>
      <view class="input-row border phone">
        <m-icon type="phone" ></m-icon>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="account"
          placeholder="请输入手机号"
        ></m-input>
      </view>
      <view class="input-row border">
        <m-icon type="email"></m-icon>
        <m-input
          type="text"
          class="m-input"
          v-model="password"
          placeholder="请输入短信验证码"
        ></m-input>
		<button class="get">获取验证码</button>
      </view>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @tap="bindLogin">登录</button>
    </view>
	<view class='protocol'>
		<text>登录即代表您已经同意<span style="color:rgba(134,202,255,1);">《mm平台服务协议》</span></text>
		<text style="color:rgba(134,202,255,1);">《mm平台服务协议》</text>
	</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import mInput from '../../components/m-input.vue';
	import mIcon from "../../components/m-icon/m-icon.vue";

	export default {
		components: {
			mInput,
			mIcon
		},
		data() {
			return {
				account: '',
				password: '',
				email: ''
			}
		},
		methods: {
			register() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.account.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				if (this.email.length < 3 || !~this.email.indexOf('@')) {
					uni.showToast({
						icon: 'none',
						title: '邮箱地址不合法'
					});
					return;
				}

				const data = {
					account: this.account,
					password: this.password,
					email: this.email
				}
				service.addUser(data);
				uni.showToast({
					title: '注册成功'
				});
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
  .content {
  padding-right: 37.5px;
  padding-left: 37.5px;
  background: #ffffff;
  padding-top: 90px;
}

.input-row {
  height: 28px;
  width: 100%;
  font-size: 14px !important;
  display: flex;
  align-items: center
}

.phone {
  margin-bottom: 42px;
}

.other {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 12px;
}

.protocol {
	display:flex;
  flex-direction: column;
  font-size:11px;
  margin-top: 15PX
}
.btn-row {
	height: 40px;
	margin-top: 45px;
	width: 100%;
	background:rgba(205,0,17,1);
	border-radius:20px;
	padding: 0
}

.primary {
   height: 40px;
   	background:rgba(205,0,17,1);
	border-radius:20px;	
	color:rgba(255,255,255,1);
	font-size:16px;
}
.m-icon {
	font-size: 18px
}

.get {
    width:90px;
	height:33px;
	border:1px solid rgba(205,0,17,1);
	opacity:0.6;
	border-radius:16px;
	font-size:15px;
	color:rgba(205,0,17,1);
	line-height: 33px;
	margin-bottom: 6px;
	padding: 0
}
</style>
