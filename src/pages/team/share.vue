<template>
  <view class="content">
    <view class="head">
      {{data.url}}
    </view>
    <image :src="data.qrcode" class="img"></image>
  </view>
</template>
<script>
import http from "../../common/request.js";
export default {
  data() {
    return {
        data:''
    };
  },
  onShow(){
   this.getData()
  },
  methods: {
    getData() {
      let opts = {
        url: "/v1/team/share",
        method: "get"
      };
      let param = {};
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data)
          this.data = res.data.data
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
<style scope>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.head {
  /* height: 40px; */
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  color: rgba(34, 34, 34, 1);
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  margin-top: 60px;
  width: 100%;
}

.img {
  width: 200px;
  height: 200px;
  margin-top: 70px;
}
</style>