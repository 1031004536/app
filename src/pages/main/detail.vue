<template>
    <view class="content">
        <image src="../../static/img/banner.png" style="width:100%;height:350px"></image>
        <view class="productName">
           <text style="font-size:16px;">大松（TODOT）格力电饭煲家用智能IH煲多功能电饭煲4L/升GDCF-40X62C</text>
           <text style="font-size:22px;color:rgba(205,0,17,1);">￥1899.00</text>
        </view>
        <view class="tran">
            <span style="color:#808080">运费：</span>在线支付免运费
        </view>
        <view class="detail">
        </view>
        <view class="tuijian">
            <text style="font-size:14px;margin-top:9px;margin-left:6px;">为你推荐</text>
        </view>
        <view class="bottom">
            <view class="share">
                <view class='ico'>
                    <image src="../../static/img/kefu.png" style="width:20px;height:20px"></image>
                    <text>客服</text>
                </view>
                <!-- <view class='ico'>
                    <image src="../../static/img/share.png" style="width:20px;height:20px"></image>
                    <text>分享</text>
                </view> -->
            </view>
            <button class="btu" style="background:rgba(128,128,128,1);">加入购物车</button>
            <!-- <button class="btu" style="background:rgba(205,0,17,1);" @click="open">立即购买</button> -->
        </view>
        <uni-popup ref="popup" type="bottom">
            <view class="up">
                <view class="img">
                    <image src="../../static/img/avtar.png" style="width:103px;height:103px"></image>
                    <text style="font-size:20px;color:rgba(205,0,17,1);margin-left:16px;">¥1899.00</text>
                </view>
                <text style="color:rgba(40,40,40,1);font-size:14px;margin-top:20px;font-weight:600;margin-left:10px">颜色</text>
                <view class="color">GDCF-20X60C</view>
                <text style="color:rgba(40,40,40,1);font-size:14px;margin-top:35px;font-weight:600;margin-left:10px">数量</text>
                <view class="sum">
                    <view @click="low">-</view>
                    <view style="width:47px;height:25px;background:rgba(230,230,230,1);border-radius:4px;text-align:center;line-height:25px;margin-left:12px;margin-right:12px ">{{num}}</view>
                    <view @click="add">+
                    </view>
                </view>
                <button class="buy">确定</button>
            </view>
        </uni-popup>
    </view>
</template>
<script>
import http from '../../common/request.js'
import uniPopup from "../../components/uni-popup/uni-popup.vue"
export default {
    components: {uniPopup},
    data() {
        return {
            num :'1',
            id:'',
            detail:''
        }
    },
    onLoad(opt){
       this.id = opt.id
    },
    onShow(){
        this.getData()
    },
     methods:{
      open(){
         this.$refs.popup.open()
      },
      getData() {
      let opts = {
              url:'http://111.229.145.178/v1/index/get_goods_detail',
              method:'get'
          }

          let param = {
              id:this.id
          }
           http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data)
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
      add() {
          this.num ++
      },
      low() {
          if(this.num > 1){
              this.num --
          }else{
              uni.showToast({
                title: '最少买一件',
                duration: 2000

          })
          }
      }
   }
}
</script>

<style>
    .content {
        padding: 0;
        position: static
    }

    .productName {
        height: 111px;
        background: white;
        padding-left: 15px;
        padding-right: 50px;
        padding-top: 15px;
        padding-bottom: 25px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .tran {
        height: 40px;
        margin-top: 5px;
        margin-bottom: 5px;
        padding-left: 15px;
        line-height: 40px;
        font-size: 15px;
        background: white
    }

    .detail {
        background: white;
        height: 100%;
    }

    .header {
        height: 39px;
        border-bottom: 1px solid #E6E6E6;
        padding-left: 62px;
        padding-right: 62px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
    }

    .tuijian {
        height: 453px;
        background: white;
        margin-top: 5px;
        box-sizing: border-box
    }

    .bottom {
        height: 50px;
        background: white;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        width: 100%;
    }

    .share {
        display: flex;
        color:rgba(34,34,34,1);
        font-size: 10px;
        justify-content: space-around;
        align-items: center;
        width: 40%;
    }

    .ico {
        display: flex;
        flex-direction: column;
        align-items: center
    }

    .btu {
        width: 60%;
        height: 50px;
        color:rgba(255,255,255,1);
        font-size: 16px;
        line-height: 50px;
        border-radius: 0
    }

    .up {
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        height: 385px;
        background: white;
        padding-top: 15px;
        position: relative;
    }

    .color {
        width:120px;
        height:32px;
        background:rgba(205,0,17,1);
        border-radius:16px;
        margin-top: 10px;
        color:rgba(255,255,255,1);
        font-size: 11px;
        line-height: 32px;
        text-align: center
    }

    .sum {
        display: flex;
        margin-top: 14px;
        font-size: 14px;
        color:rgba(34,34,34,1);
        align-items: center;
        margin-left: 10px;
    }

    .buy {
        width: 100%;
        height: 50px;
        background:rgba(205,0,17,1);
        color:rgba(255,255,255,1);
        font-size: 16px;
        line-height: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0
    }
</style>