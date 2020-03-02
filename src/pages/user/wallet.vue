<template>
    <view style="width:100%">
        <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button"  ></uni-segmented-control>
        <view >
            <view v-show="current === 0" class="wallet">
               <image src="../../static/img/qian.png" style="width:49px;height:49px;margin-top:70px"></image>
               <text style="font-size:30px;margin-top:50px;font-weight:500">￥{{money.commission}}</text>
               <button class="but" @click="withdraw(money.commission,'commission')">提现</button>
               <button class="but" style="margin-top:24px;background:rgba(28,175,214,1);" @click="customs(money.commission,'commission')">转为报单币</button>
               <button class="but" style="margin-top:24px;background:rgba(28,175,214,1);" @click="torecommender(money.commission,'commission')">转给推荐人</button>
            </view>
            <view v-show="current === 1" class="wallet">
                 <image src="../../static/img/qian.png" style="width:49px;height:49px;margin-top:70px"></image>
               <text style="font-size:30px;margin-top:50px;font-weight:500">￥{{money.allowance}}</text>
               <button class="but" @click="withdraw(money.allowance,'allowance')">提现</button>
               <button class="but" style="margin-top:24px;background:rgba(28,175,214,1);" @click="customs(money.allowance,'allowance')">转为报单币</button>
               <button class="but" style="margin-top:24px;background:rgba(28,175,214,1);" @click="torecommender(money.allowance,'allowance')">转给推荐人</button>
            </view>
        </view>
    </view>
</template>

<script>
import http from '../../common/request.js'
import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
export default {
    components: {uniSegmentedControl},
    data() {
        return {
            items: ['佣金','津贴'],
            current: 0,
            money:''
        }
    },
    onShow(){
      this.getData()
    },
    methods: {
        onClickItem(index) {
            if (this.current !== index.currentIndex) {
        this.current = index.currentIndex;
      }
        },
        inother(name) {
        uni.navigateTo({
        url: "./" + name 
      });
      },
      withdraw(sum,type){
          let param = [sum,type]
          let pam = JSON.stringify(param);
          uni.navigateTo({
        url: "./withdraw?param=" + pam 
          })
      },
      customs(sum,type){
          let param = [sum,type]
          let pam = JSON.stringify(param);
          uni.navigateTo({
        url: "./customs?param=" + pam 
          })
      },
      torecommender(sum,type){
          let param = [sum,type]
          let pam = JSON.stringify(param);
          uni.navigateTo({
        url: "./torecommender?param=" + pam 
          })
      },
      getData() {
      let opts = {
        url: "/v1/wallet/index",
        method: "get"
      };
      let param = {};

      http.httpRequest(opts, param).then(
        res => {
            console.log(res)
          this.money = res.data.data;
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

<style  scoped>
 .wallet {
     display: flex;
     flex-direction: column;
     align-items: center;
     
 }

 .but {
     width:225px;
     height:40px;
     background:rgba(205,0,17,1);
     border-radius:7px;
     margin-top: 68px;
     line-height: 40px;
     text-align: center;
     color:rgba(255,255,255,1);
     font-size: 16px;
 }
</style>