<template>
  <view class="content">
    <view>
      <view class="input-row border">
        <text class="title">昵称：</text>
        <m-input type="text" focus clearable v-model="nickname" placeholder="请输入昵称"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">手机号：</text>
        <m-input type="text" v-model="phone" placeholder="请输入手机号"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">设置密码：</text>
        <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">确认密码：</text>
        <m-input type="password" displayable v-model="password_confirm" placeholder="请确认密码"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">选择地区：</text>
        <pickerAddress @change="change" style="font-szie:14px">{{ txt }}</pickerAddress>
      </view>
    </view>
    <view class="btn">
      <button class="reg" @tap="register">代注册</button>
    </view>
  </view>
</template>

<script>
// import service from '../../service.js';
import http from "../../common/request.js";
import mInput from "../../components/m-input.vue";
import pickerAddress from "../../components/wangding-pickerAddress/wangding-pickerAddress";

export default {
  components: {
    mInput,
    pickerAddress
  },
  onLaunch() {
    console.log(this.address);
  },
  onLoad(options){
     if(options.recommender){
       this.invite = options.recommender
     }
  },
  data() {
    return {
      nickname: "",
      password: "",
      phone: "",
      selectList: "",
      password_confirm: "",
      txt:'选择地区'
    };
  },
  methods: {
    change(data) {
      console.log(data)
      console.log(data.data.join(""))
      this.txt = data.data.join("");
      this.selectList = data.code
    },
    register() {
      var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      /**
       * 客户端对账号信息进行一些必要的校验。
       * 实际开发中，根据业务需要进行处理，这里仅做示例。
       */
      if (this.nickname.length < 1) {
        uni.showToast({
          icon: "none",
          title: "账号最短为 1 个字符"
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
      if (!myreg.test(this.phone)) {
        uni.showToast({
          icon: "none",
          title: "请输入正确的手机号"
        });
        return;
      }

      // const data = {
      //     account: this.account,
      //     password: this.password,
      //     email: this.email
      // }
      // service.addUser(data);
      // uni.showToast({
      //     title: '注册成功'
      // });
      // uni.navigateBack({
      //     delta: 1
      // });
      let opts = {
        url: "/v1/team/register",
        method: "post"
      };
      let param = {
        nickname: this.nickname,
        phone: this.phone,
        password: this.password,
        password_confirm: this.password_confirm,
        province: this.selectList[0],
        city: this.selectList[1],
        area: this.selectList[2],
      };
      http.httpRequest(opts, param).then(
        res => {
          if(res.data.code == 100){
             uni.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none",
            success:function () {
                  uni.reLaunch({
                  url: "./team"
                });
            }
            });
            // success: function(res) {
            //   if (res.confirm) {
            //     uni.navigateTo({
            //       url: "../login/login"
            //     });
            //   } else if (res.cancel) {
            //   }
            // }
          // });
          }else{
            uni.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none"
          });
          }
          
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
  }
};
</script>

<style>
.content {
  background: white;
  padding-left: 39px;
  padding-right: 39px;
}
.select-border{
  background: white
}
.title {
  font-size: 14px;
  color: rgba(34, 34, 34, 1);
}

.input-row {
  margin-top: 34px;
}

.reg {
  height: 40px;
  margin-top: 37px;
  background: rgba(205, 0, 17, 1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
}
</style>
