<template>
  <view class="content">
    <view v-if="hasLogin">
    <view class="head">
      <view class="user">
        <image style="width:65px;height:65px;border-radius:50%;" :src= " this.userInfo.thumb ? this.userInfo.thumb : '../../static/img/timg.jpg'"></image>
        <view class="message">
          <text style="font-size:16px">{{userInfo.nickname}}</text>
          <text style="font-size:13px;margin-top:9px">{{userInfo.gradename}} {{userInfo.phone}}</text>
          <text style="font-size:13px;margin-top:9px">推荐人：{{userInfo.recommen}}</text>
        </view>
      </view>
      <view class="note">
        <view class="money" @click="inother('allMoney')">
          <text>消费金额</text>
          <text>￥{{userInfo.recharge}}</text>
        </view>
        <view class="money" @tap="inother('pick')">
          <text>提货卷</text>
          <text>￥{{userInfo.shoppingticket}}</text>
        </view>
        <view class="money" @tap="inother('brokerage')">
          <text>佣金</text>
          <text>￥{{userInfo.commission}}</text>
        </view>
        <view class="money">
          <text>津贴</text>
          <text>￥{{userInfo.allowance}}</text>
        </view>
        <view class="money">
          <text>报单币</text>
          <text>￥{{userInfo.coin}}</text>
        </view>
      </view>
    </view>

	<view class="order">
		<view class="both" @tap="inother('order',0)">
      <image style="width:25px;height:25px" src="../../static/img/dingwei-.png"></image>
      <text style="font-size:13px;color:rgba(128,128,128,1);margin-top:10px">全部订单</text>
    </view>
    	<view class="both" @tap="inother('order',1)">
      <image style="width:25px;height:25px" src="../../static/img/daifahuo.png"></image>
      <text style="font-size:13px;color:rgba(128,128,128,1);margin-top:10px">代发货</text>
    </view>
    	<view class="both" @tap="inother('order',2)">
      <image style="width:25px;height:25px" src="../../static/img/tubiao-houtai-.png"></image>
      <text style="font-size:13px;color:rgba(128,128,128,1);margin-top:10px">待收货</text>
    </view>
    	<view class="both" @tap="inother('order',3)">
      <image style="width:25px;height:25px" src="../../static/img/yishouhuo.png"></image>
      <text style="font-size:13px;color:rgba(128,128,128,1);margin-top:10px">已收货</text>
    </view>
	</view>
  <view class="order" style="margin-top:0；height:90px">
		<view class="both" @click="inother('wallet')">
      <image style="width:38px;height:38px" src="../../static/img/qianbao-2.png"></image>
      <text style="font-size:15px;color:rgba(34,34,34,1);margin-top:10px">钱包</text>
    </view>
    	<view class="both" @click="inVip">
      <image style="width:38px;height:38px" src="../../static/img/huiyuanshengji-2.png"></image>
      <text style="font-size:15px;color:rgba(34,34,34,1);margin-top:10px">会员升级</text>
    </view>
	</view>
  <view class="order" style="margin-top:0；height:90px">
		<view class="both" @click="inother('personal')">
      <image style="width:38px;height:38px" src="../../static/img/gerenxinxi-3.png"></image>
      <text style="font-size:15px;color:rgba(34,34,34,1);margin-top:10px">个人信息</text>
    </view>
    	<view class="both">
      <image style="width:38px;height:38px" src="../../static/img/lianxikefu-2.png"></image>
      <text style="font-size:15px;color:rgba(34,34,34,1);margin-top:10px">联系客服</text>
    </view>
	</view>
    </view>
    <view class="btn-row">
      <button v-if="!hasLogin"  @tap="bindLogin">
        登录
      </button>
      <button v-if="hasLogin"  @tap="bindLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import http from '../../common/request.js'
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["hasLogin", "forcedLogin"])
  },
  onLoad() {
     let opts = {
        url: "/v1/my/index",
        method: "get"
      };
      let param = {};
      http.httpRequest(opts, param).then(
        res => {
          this.userInfo = res.data.data

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
  data() {
     return {
        userInfo:''
     }
  },
  methods: {
    ...mapMutations(["logout"]),
    bindLogin() {
      uni.navigateTo({
        url: "../login/login"
      });
    },
    inother(name,index) {
      if(index || index == 0){
         uni.navigateTo({
        url: "./" + name + '?current=' + index
      });
      }else{
        uni.navigateTo({
        url: "./" + name 
      });
      }
     
    },
    bindLogout() {
      this.logout();
      /**
       * 如果需要强制登录跳转回登录页面
       */
      if (this.forcedLogin) {
        uni.reLaunch({
          url: "../login/login"
        });
      }
    },
    inVip () {
       uni.navigateTo({
        url: "../user/recharge/upgrade"
      });
    }
  }
};
</script>

<style>
.content {
  padding: 0;
}
.head {
  width: 100%;
  height: 195px;
  background:url('../../static/img/usee.png') no-repeat 100% 100%;
  border-radius: 0px 0px 14px 14px;
  padding: 20px 26px;
  box-sizing: border-box;
}

.user {
  display: flex;
  margin-bottom: 30px;
}

.message {
  display: flex;
  flex-direction: column;
  color: rgba(255, 255, 255, 1);
  margin-left: 15px;
}
.note {
  display: flex;
  justify-content: space-around;
}

.money {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: white;
  height: 48px;
  justify-content: space-between;
}

.order {
  margin: 12.5px;
  margin-bottom: 0;
  height: 85px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  border-radius:7px;
}

.both {
  display: flex;
  flex-direction: column;
  align-items: center
}

.btn-row {
  padding: 0;
  background: white;
  font-size: 15px;
}

uni-button {
  background: white
}
</style>
