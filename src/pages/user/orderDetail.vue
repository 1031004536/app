<template>
  <view class="content">
    <view class="head">
      {{detail.status_text}}
    </view>
    <view class="phone">
      {{detail.express_id}}：{{detail.express_no}}
    </view>
    <view class="adress">
      <text style="font-weight:600">{{detail.receive_name}} {{detail.receive_phone}}</text>
      <text style="color:rgba(128,128,128,1);margin-top:12px;font-size:11px"
        >地址：{{detail.receive_address}}</text
      >
    </view>
    <view class="product" v-for="(item,index) in detail.goods" :key="index">
      <view class="img">
        <image :src="item.goods_thumb" style="width:100%;height:100%"></image>
      </view>
      <view class="name">
        <text style="font-size:12px;"
          >{{item.goods_name}}</text
        >
        <view
          style="display:flex;flex-direction: column;text-align:right;font-size:12px"
        >
          <text>￥{{item.goods_price}}</text>
          <text>x{{item.goods_number}}</text>
        </view>
      </view>
    </view>
    <view class="waiter">
      <image
        style="width:14px;height:15px"
        src="../../static/img/kefu.png"
      ></image>
      <text style="font-size:13px;margin-left:6px;line-height:1">联系客服</text>
    </view>
    <view class="detail">
      <view class="num">
        <text class="title">订单编号：</text>
        <text>{{detail.order_no}}</text>
      </view>
      <view class="num">
        <text class="title">下单时间：</text>
        <text>{{detail.create_time}}</text>
      </view>
      <view class="num">
        <text class="title">运费:</text>
        <text>￥{{detail.postage}}</text>
      </view>
      <view style="text-align:right;font-size:13px;"
        >实付款：<span style="font-weight:600;color:#CD0011;font-size:15px"
          >￥{{detail.total}}</span
        ></view
      >
    </view>
    <view class="footer"> 
        <button class="btn" style="margin-left:72px;background:white">删除订单</button>
        <button class="btn" style="margin-left:60px;background:white">申请售后</button>
        <button class="btn" style="margin-left:22px;background:rgba(205,0,17,1);color:rgba(255,255,255,1);">再次购买</button>
    </view>
  </view>
</template>

<script>
import http from '../../common/request.js'
export default {
  data() {
    return {
      id:'',
      detail:''
    }
  },
  onLoad(opt){
    console.log(opt.id)
    this.id = opt.id
  },
  onShow(){
    this.getData()
  },
  methods: {
    getData(){
      let opts = {
        url: "/v1/index/orderdetails",
        method: "get"
      };

      let param = {
        id:this.id
      };
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data);
          this.detail = res.data.data
          
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
  },
};
</script>

<style scoped>
.content {
  padding: 0;
  padding-bottom: 49px;
}
.head {
  height: 52px;
  width: 100%;
  background: url("../../static/img/usee.png") no-repeat;
  background-size: auto;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  line-height: 52px;
  text-align: center;
}

.phone {
  height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 13px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.adress {
  height: 60px;
  background: rgba(255, 255, 255, 1);
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 10px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  padding-left: 25px;
  padding-top: 10px;
}

.product {
  height: 125px;
  background: rgba(255, 255, 255, 1);
  padding: 24px;
  margin-top: 10px;
  display: flex;
  box-sizing: border-box;
}

.img {
  width: 126px;
  height: 82px;
  margin-right: 10px;
  box-sizing: border-box;
}
.name {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1;
  justify-content: space-between;
}

.waiter {
  height: 40px;
  background: rgba(255, 255, 255, 1);
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail {
  height: 150px;
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.num {
  font-size: 13px;
  margin-bottom: 17px;
  display: flex;
}

.title {
  display: block;
  width: 80px;
  margin-right: 10px;
  color: rgba(128, 128, 128, 1);
}

.footer {
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    width: 100%;
}

.btn {
    width:70px;
    height:29px;
    line-height: 29px;
    border-radius: 15px;
    font-size: 13px;
    padding: 0;
    margin: 0;
}
</style>