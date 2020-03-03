<template>
  <view class="content">
    <view>
      <view class="input-row border phone">
        <m-icon type="phone"></m-icon>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="phone"
          placeholder="请输入手机号"
        ></m-input>
      </view>
      <view class="input-row border">
        <m-icon type="locked"></m-icon>
        <m-input
          type="password"
          class="m-input"
          displayable
          v-model="password"
          placeholder="请输入密码"
        ></m-input>
      </view>
    </view>
    <view class="other">
      <navigator url="../reg/reg">
        <text style="font-weight:800;color:rgba(34,34,34,1);">注册账号</text>
      </navigator>
      <!-- <navigator url="../reg/">注册账号</navigator> -->
      <text style="color:rgba(134,202,255,1);">忘记密码</text>
    </view>
    <view class="btn-row">
      <button type="primary" class="primary" @tap="bindLogin">登录</button>
    </view>
    <view class="protocol">
      <text
        >登录即代表您已经同意<span style="color:rgba(134,202,255,1);"
          >《mm平台服务协议》</span
        ></text
      >
      <text style="color:rgba(134,202,255,1);">《mm平台服务协议》</text>
    </view>

    <view class="line-main">
      <view class="line">
        <view class="line-text">使用以下账号登录</view>
      </view>
    </view>

    <view class="wechat">
      <image
        src="../../static/img/wechat.png"
        style="width:100%;height:100%"
      ></image>
    </view>

    <view
      class="oauth-row"
      v-if="hasProvider"
      v-bind:style="{ top: positionTop + 'px' }"
    >
      <view
        class="oauth-image"
        v-for="provider in providerList"
        :key="provider.value"
      >
        <image :src="provider.image" @tap="oauth(provider.value)"></image>
        <!-- #ifdef MP-WEIXIN -->
        <button
          v-if="!isDevtools"
          open-type="getUserInfo"
          @getuserinfo="getUserInfo"
        ></button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
import service from "../../service.js";
import http from "../../common/request.js";
import { mapState, mapMutations } from "vuex";
import mInput from "../../components/m-input.vue";
import mIcon from "../../components/m-icon/m-icon.vue";

export default {
  components: {
    mInput,
    mIcon
  },
  data() {
    return {
      providerList: [],
      hasProvider: false,
      phone: "",
      password: "",
      positionTop: 0,
      isDevtools: false
    };
  },
  onShow() {
   
    let value = JSON.parse(uni.getStorageSync("hasLogin"))
     console.log(typeof(value))
    if(value){
      console.log(value)
       uni.reLaunch({
          url: "../main/main"
        });
    }
  },
  computed: mapState(["forcedLogin"]),
  methods: {
    ...mapMutations(["login"]),
    initProvider() {
      const filters = ["weixin", "qq", "sinaweibo"];
      
      uni.getProvider({
        service: "oauth",
        success: res => {
          if (res.provider && res.provider.length) {
            for (let i = 0; i < res.provider.length; i++) {
              if (~filters.indexOf(res.provider[i])) {
                this.providerList.push({
                  value: res.provider[i],
                  image: "../../static/img/" + res.provider[i] + ".png"
                });
              }
            }
            this.hasProvider = true;
          }
        },
        fail: err => {
          console.error("获取服务供应商失败：" + JSON.stringify(err));
        }
      });
    },
    initPosition() {
      /**
       * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
       * 反向使用 top 进行定位，可以避免此问题。
       */
      this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
    },
    bindLogin() {
      /**
       * 客户端对账号信息进行一些必要的校验。
       * 实际开发中，根据业务需要进行处理，这里仅做示例。
       */
      if (this.phone.length < 8) {
        uni.showToast({
          icon: "none",
          title: "手机号格式不对"
        });
        return;
      }
      if (this.password.length < 6) {
        uni.showToast({
          icon: "none",
          title: "密码最短为 6 个字符"
        });
        return;
      }
      let opts = {
        url: "/v1/user/login",
        method: "post"
      };
      let param = {
        phone: this.phone,
        password: this.password
      };
      http.httpRequest(opts, param).then(
        res => {
          this.toMain(this.phone)
        },
        error => {
          uni.showToast({
            title: error.msg,
            duration: 2000,
            icon: "none"
          });
        }
      );
    },
    toMain(userName) {
      this.login(userName);
      /**
       * 强制登录时使用reLaunch方式跳转过来
       * 返回首页也使用reLaunch方式
       */
      if (this.forcedLogin) {
        uni.reLaunch({
          url: "../main/main"
        });
      } else {
        uni.navigateBack();
      }
    },
    onReady() {
      this.initPosition();
      this.initProvider();
      // #ifdef MP-WEIXIN
      this.isDevtools = uni.getSystemInfoSync().platform === "devtools";
      // #endif
    }
  }
};
</script>

<style>
.action-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.action-row navigator {
  color: #007aff;
  padding: 0 10px;
}
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
  align-items: center;
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
  display: flex;
  flex-direction: column;
  font-size: 11px;
  margin-top: 15px;
}
.btn-row {
  height: 40px;
  margin-top: 45px;
  width: 100%;
  background: rgba(205, 0, 17, 1);
  border-radius: 20px;
  padding: 0;
}

.primary {
  height: 40px;
  background: rgba(205, 0, 17, 1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
}
.m-icon {
  font-size: 18px;
}

.line-main {
  margin: 10rpx 0;
  background: #fff;
  text-align: center;
  height: 100px;
  padding: 0 30px;
  line-height: 100px;
}
.line:before {
  content: "";
  display: block;
  height: 1px;
  width: 100%;
  background-color: #ccc; /*颜色需与主题大背景色一致*/
  position: relative;
  top: 50px; /*调节线高*/
  left: 0;
}
.line-text {
  display: inline-block;
  background: #fff;
  padding: 0 36px 0 36px;
  position: relative;
  font-weight: 500;
}

.wechat {
  width: 42px;
  height: 42px;
  margin: 0 auto;
  margin-top: 25px;
}
.oauth-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.oauth-image {
  position: relative;
  width: 50px;
  height: 50px;
  border: 1px solid #dddddd;
  border-radius: 50px;
  margin: 0 20px;
  background-color: #ffffff;
}

.oauth-image image {
  width: 30px;
  height: 30px;
  margin: 10px;
}

.oauth-image button {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
