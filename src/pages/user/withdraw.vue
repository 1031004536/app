<template>
  <view class="content">
    <view class="withdraw" @click="open">
      <text>提现方式</text>
      <text style="color:rgba(128,128,128,1);"
        >{{check}} ></text
      >
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="bot">
        <view class="type">请选择提现方式</view>
        <view class="detail" v-for="(item,index) in list" :key="index" @click="changetype(item)">
          <text>{{item.type}}</text>
          <text>></text>
        </view>
        <view class="detail" @click="inother">
            <view style="display:flex;align-items: center;">
            <image src="../../static/img/add-fill.png" style="width:18px;height:18px;margin-right:10px"></image>
          <text>添加提现方式</text>
          </view>
          <text>></text>
        </view>
      </view>
    </uni-popup>
    <view class="custom">
      <text
        style="color:rgba(34,34,34,1);font-size:14px;margin-top:16px;margin-left:20px"
        >转换金额</text
      >
      <view class="input-row border">
        <text>￥</text>
        <m-input
          class="m-input"
          type="text"
          clearable
          focus
          v-model="account"
          placeholder="请输入金额"
          style="height:100%"
        ></m-input>
      </view>
      <text style="color:rgba(128,128,128,1);font-size:13px;margin-left:50px"
        >{{name}}金额￥{{totalMoney}}，<span style="color:#1CAFD6" @click="change">全部转换</span></text
      >
    </view>
    <button class="btu" @click="out">提现</button>
  </view>
</template>

<script>
import http from '../../common/request.js'
import mInput from "../../components/m-input.vue";
import uniPopup from "../../components/uni-popup/uni-popup.vue";
export default {
  components: {
    mInput,
    uniPopup
  },
  data() {
    return {
      account: "",
      name:'',
      totalMoney:'',
      type:'',
      list:'',
      check:'',
      cashoutway_id:''
    };
  },
  onShow(){
   this.getcashout()
  },
  onLoad(options){
    let param = JSON.parse(options.param)
    this.totalMoney = param[0]
    this.type = param[1]
    if (param[1] == 'commission') {
      this.name = '佣金'
    }else{
      this.name = '津贴'
    }
    // var data = JSON.parse(options.param);
    // console.log(data)
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    inother() {
        uni.navigateTo({
        url: "./type"
      });
    },
    change() {
      if (this.totalMoney) {
         this.account = this.totalMoney
      }
      
    },
    getcashout(){
      let opts = {
        url: "/v1/wallet/cashout",
        method: "get"
      };
      let param = {
        type:this.type, 
      };
       http.httpRequest(opts, param).then(
        res => {
            this.list = res.data.data.cashoutway;
            this.check = res.data.data.cashoutway[0].type;
             this.cashoutway_id = res.data.data.cashoutway[0].id
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
    changetype(item) {
      this.check = item.type,
      this.cashoutway_id = item.id
      this.$refs.popup.close()
    },
    getData() {
      let opts = {
        url: "/v1/wallet/cashout",
        method: "post"
      };
      let param = {
        type:this.type,
        cashoutway_id:this.cashoutway_id,
        score:this.account
      };

      http.httpRequest(opts, param).then(
        res => {
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
     
    },
    out() {
      this.getData()
    }
  }
};
</script>

<style scope>
.content {
  padding: 0;
}

.withdraw {
  height: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
  padding-left: 20px;
  font-size: 14px;
}
.bot {
  background: rgba(255, 255, 255, 1);
  border-radius: 7px 7px 0px 0px;
  height: 250px;
}
.type {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
}

.detail {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  height: 50px;
  display: flex;
  padding-left: 25px;
  padding-right: 25px;
  font-size: 15px;
  justify-content: space-between;
  align-items: center;
  font-size: 15px
}
.custom {
  height: 165px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.input-row {
  height: 55px;
  margin-top: 18px;
  margin-left: 50px;
  margin-right: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 17px;
}

.btu {
  margin-left: 18px;
  margin-right: 18px;
  margin-top: 20px;
  height: 40px;
  background: rgba(28, 175, 214, 1);
  border-radius: 7px;
  color: rgba(245, 245, 245, 1);
  font-size: 16px;
}
</style>