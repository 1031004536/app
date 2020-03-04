<template>
  <view class="content">
    <view class="head">
      <text style="font-size:16px;">提货卷余额</text>
      <text style="font-size:13px;">(提货券只可用于消费，不可提现)</text>
      <text style="font-size:35px;">{{total}}</text>
    </view>
    <view class="list">
      <view class="listDetail" v-for="(item,index) in list " :key="index">
        <view class="text">
          <text style="font-size:14px">{{item.type}}</text>
          <text style="font-size:12px;color:rgba(128,128,128,1);"
            >{{item.create_time}}</text
          >
        </view>
        <text style="font-size:20px;color:rgba(205,0,17,1);">{{item.score}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import http from '../../common/request.js'
export default {
  name: '',
  data() {
    return {
    list:'',
      total:'',
    }
  },
  onShow(){
      this.getData()
  },
  methods:{
      getData() {
          let opts = {
              url:'/v1/my/shoppingticket',
              method:'get'
          }

          let param = {}
           http.httpRequest(opts, param).then(
        res => {
          this.list = res.data.data.data;
          this.total = res.data.data.total
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
 }
</script>

<style scoped>
.content {
  padding: 6px;
}

.head {
  height: 123px;
  background: rgba(205, 0, 17, 1);
  border-radius: 7px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 18px;
}

.list {
  background: white;
  margin-top: 5px;
}

.listDetail {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  padding: 10px 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
