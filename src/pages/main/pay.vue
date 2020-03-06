<template>
  <view class="content">
    <view class="adress">
      <text style="color:rgba(0,0,0,1);font-size:13px;"
        >{{person.receive_name ? person.receive_name : ''}} <span style="color:#808080">{{person.receive_phone ? person.receive_phone : ''}}</span></text
      >
      <view
        style="color:rgba(0,0,0,1);font-size:12px;display:flex;align-items:center"
        ><text>{{person.province}}{{person.city}}{{person.area}}</text
        ><input
          style="border:1px solid #808080;margin-left:10px;"
          v-model="receive_address"
          placeholder="请填写具体地址"
      /></view>
    </view>
    <view class="product" v-for="(item, index) in list" :key="index">
      <view class="img">
        <image
          :src="item.goods_thumb_path"
          style="width:100%;height:100%"
        ></image>
      </view>
      <view class="name">
        <text style="font-size:12px;">{{ item.goods_name }}</text>
        <view
          style="display:flex;flex-direction: column;text-align:right;font-size:12px"
        >
          <text>￥{{ item.goods_price }}</text>
          <text>x{{ item.goods_number }}</text>
        </view>
      </view>
    </view>
    <view class="payType">
      <text>支付方式:</text>
      <text style="color:rgba(205,0,17,1);">提货卷</text>
    </view>
    <view class="bottom">
      <view class="buy">
        <text style="color:#808080;font-size:13px;margin-right:5px">共{{totalCount}}件,</text>
        <text style="font-size:15px;color:rgba(34,34,34,1);"
          >合计：<span style="color:#CD0011">￥{{ totalPrice }}</span></text
        >
        <button class="btn" @click="pay">提交订单</button>
      </view>
    </view>
  </view>
</template>
<script>
import http from '../../common/request.js'
export default {
  onLoad(options) {
    let param = JSON.parse(options.param);
    this.list = param;
    console.log(param);
  },
  computed: {
      totalCount: function() {
        var totalCount = 0;
        for (let i = 0; i < this.list.length; i++) {
          totalCount += Number(this.list[i].goods_number);
        }
        return totalCount;
      },
      totalPrice: function() {
        var totalPrice = 0;
        for (let i = 0; i < this.list.length; i++) {
          totalPrice += this.list[i].goods_price * this.list[i].goods_number;
        }
        return totalPrice;
      }
    },
  data() {
    return {
      list: "",
      person:'',
      receive_address:''
    };
  },
  onShow(){
      this.getData()
  },
  methods: {
      getData() {
      let opts = {
        url: "/v1/index/get_address",
        method: "get"
      };

      let param = {};
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data);
          this.person = res.data.data
          if(res.data.data.receive_address != 'null '){
              this.receive_address=res.data.data.receive_address
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
    pay() {
       let opts = {
        url: "/v1/index/buy",
        method: "post"
      };

      let param = {
          name:this.person.receive_name,
          phone:this.person.receive_phone,
          address: this.receive_address
      };
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data);
          if(res.data.code == 100){
              uni.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none"
          });
           setTimeout(() => {
               uni.reLaunch({
                   url:'./main'
               })
           }, 1000);
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
    }
  },
};
</script>

<style scope>
.content {
  padding: 0;
}
.adress {
  height: 71px;
  width: 100%;
  background: white;
  border-radius: 7px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 25px;
}
.product {
  height: 125px;
  background: rgba(255, 255, 255, 1);
  padding: 24px;
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
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
}
.payType {
  display: flex;
  height: 40px;
  width: 100%;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
  align-items: center;
  color: rgba(34, 34, 34, 1);
  font-size: 12px;
  margin-top: 10px;
  box-sizing: border-box;
  background: white;
}
.bottom {
  height: 55px;
  /* width: 100%; */
  background: white;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  padding-left: 19px;
  padding-right: 15px;
  align-items: center;
  justify-content: flex-end
}

.buy {
  display: flex;
  align-items: center;
}

.btn {
  width: 97px;
  height: 38px;
  background: url("../../static/img/btn.png") no-repeat 100%;
  border-radius: 19px;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
  line-height: 38px;
  text-align: center;
  margin-left: 12px;
}
</style>
