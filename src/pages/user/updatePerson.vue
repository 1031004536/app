<template>
  <view class="content">
    <view class="head">
      <image src="" style="width:70px;height:70px;border-radius:50%;"></image>
    </view>
    <view class="person">
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >昵称：</span
        >
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="param.nickname"
        ></m-input
      ></view>
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >性别：</span
        >
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="param.gender"
        ></m-input
      ></view>
      <view style="margin-top:15px;display:flex;justify-content: space-between"
        ><span style="color:#808080;width:100px;display:inline-block"
          >生日：</span
        >
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="param.birthday"
        ></m-input>
        <button
        @click="update"
          style="width:48px;height:22px;background:rgba(205,0,17,1);border-radius:22px;color:rgba(255,255,255,1);font-size:13px;line-height:22px;padding:0"
        >
          完成
        </button>
      </view>
    </view>
    <view class="person">
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >收货名：</span
        >
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="param.receive_name"
        ></m-input
      ></view>
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >收货人电话：</span
        >
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="param.receive_phone"
        ></m-input
      ></view>
      <view style="margin-top:15px;display:flex;justify-content: space-between"
        ><span style="color:#808080;width:100px;display:inline-block"
          >收货地址：</span
        >
        <view >
          <view style="padding-left:10px" >{{province}}{{city}}{{area}}</view>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="param.receive_address"
          :placeholder="param.receive_address"
        ></m-input>

        </view>
        <button
        @click="update"
          style="width:48px;height:22px;background:rgba(205,0,17,1);border-radius:22px;color:rgba(255,255,255,1);font-size:13px;line-height:22px;padding:0"
        >
          完成
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import mInput from "../../components/m-input.vue";
import http from '../../common/request'
export default {
  components: { mInput },
  data() {
    return {
      param: {
        nickname: "",
        gender: "",
        birthday: "",
        receive_name: "",
        receive_phone	: "",
        receive_address: ""
      },
      province: "",
      city: "",
      area: "",
    };
  },

  onLoad(){
    this.getdata()
  },
  methods: {
    getdata() {
       let opts = {
         url:'/v1/my/personal',
         method:'get'
       }
       let param = {}
       http.httpRequest(opts, param).then(
        res => {
          this.param = res.data.data;
          this.province = res.data.data.province;
          this.city = res.data.data.city;
          this.area = res.data.data.area;
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


    update() {
      let opts = {
         url:'/v1/my/personal',
         method:'post'
       }
       let param = this.param
       http.httpRequest(opts, param).then(
        res => {
           uni.showModal({
            title: "提示",
            content: "更改成功",
            success: function(res) {
              if (res.confirm) {
                uni.reLaunch({
                url: "./user"
          });
              } else if (res.cancel) {
                
              }
            }
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
};
</script>

<style>
.content {
  padding: 0;
}

.head {
  height: 100px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.person {
  height: 140px;
  background: white;
  margin-bottom: 10px;
  padding-left: 25px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  padding-right: 30px;
}
</style>
