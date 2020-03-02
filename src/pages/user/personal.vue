<template>
  <view class="content">
    <view class="head">
      <image :src="this.person.thumb" style="width:70px;height:70px;border-radius:50%;"></image>
    </view>
    <view class="person">
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >昵称：</span
        >{{person.nickname}}</view
      >
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >性别：</span
        >{{person.gender}}</view
      >
      <view style="margin-top:15px;display:flex;justify-content: space-between"
        ><text
          ><span style="color:#808080;width:100px;display:inline-block"
            >生日：</span
          >{{person.birthday}}</text
        >
        <image
          src="../../static/img/update.png"
          @click="update"
          style="width:20px;height:20px;margin-left:80px;"
        ></image>
      </view>
    </view>
    <view class="person">
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >收货名：</span
        >{{person.receive_name}}</view
      >
      <view style="margin-top:15px;"
        ><span style="color:#808080;width:100px;display:inline-block"
          >收货人电话：</span
        >{{person.receive_phone}}</view
      >
      <view style="margin-top:15px;display:flex;justify-content: space-between"
        ><span style="color:#808080;width:100px;display:inline-block"
          >收货地址：</span>
          <view>
          {{person.province}}{{person.city}}{{person.area}}
          <view>{{person.receive_address}}</view>
          </view>
        <image
          src="../../static/img/update.png"
          @click="update"
          style="width:20px;height:20px;margin-left:80px;"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
import http from "../../common/request.js";
export default {
  data() {
    return {
      person: ""
    };
  },
  onLoad(){
      this.getData()
  },
  methods: {
    update() {
      uni.navigateTo({
        url: "./updatePerson"
      });
    },
    getData() {
      let opts = {
        url: "/v1/my/personal",
        method: "get"
      };
      let param = {};

      http.httpRequest(opts, param).then(
        res => {
          this.person = res.data.data;
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
  height: 125px;
  background: white;
  margin-bottom: 10px;
  padding-left: 25px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  padding-right: 30px;
}
</style>
