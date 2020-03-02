<template>
  <view style="width:100%">
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      style-type="button"
    ></uni-segmented-control>
    <view style="height:100%">
      <view v-show="current === 0" class="content">
        <view class="detail">
          <view class="name">
              <text>姓名</text>
            <m-input
              type="text"
              class="m-input"
              v-model="name"
            ></m-input>
          </view>
          <view class="img">
              <text style="margin-right:63px">收款码：</text>
              <sunui-upimg @change="getImageInfo1" :upload_auto="true" ref="upimg1" :upload_count="1"></sunui-upimg>
          </view>
        </view>
        <button class='btu' @click="next">下一步</button>
      </view>
      <view v-show="current === 1" class="content">
        <view class="detail">
          <view class="name">
              <text>姓名</text>
            <m-input
              type="text"
              class="m-input"
              v-model="name"
            ></m-input>
          </view>
          <view class="img">
              <text style="margin-right:63px">收款码：</text>
              <sunui-upimg @change="getImageInfo1" :upload_auto="true" ref="upimg1" :upload_count="1"></sunui-upimg>
          </view>
        </view>
        <button class='btu' @click="next">下一步</button>
      </view>
      <view v-show="current === 2" class="content">
        <view class='bank'>
            <view class="both">
              <text style="margin-right:55px">银行</text> 
              <m-input
              type="text"
              class="m-input"
              v-model="banktitle"
            ></m-input> 
            </view>
            <view class="both">
                <text style="margin-right:55px">姓名</text> 
                <m-input
              type="text"
              class="m-input"
              v-model="name"
            ></m-input>
            </view>
            <view class="both">
                <text style="margin-right:55px">账号</text> 
                <m-input
              type="text"
              class="m-input"
              v-model="account"
            ></m-input>
            </view>   
        </view>
        <button class='btu' @click="next">下一步</button>
      </view>
    </view>
  </view>
</template>

<script>
import http from '../../common/request.js'
import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue";
import sunuiUpimg from "../../components/sunui-upimg/sunui-upimg.vue";
import mInput from "../../components/m-input.vue";
export default {
  components: { uniSegmentedControl, mInput, sunuiUpimg },
  data() {
    return {
      items: ["支付宝", "微信", "银行卡"],
      current: 0,
      text: "",
      name:'',
      imgId:'',
      banktitle:'',
      account:''
    };
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
    getImageInfo1(e) {
      this.imgId = e[0].id
    },
    next(){
        let opts = {
          url:"/v1/wallet/addcashoutway",
          method:'post'
        }
         
        let param = {}
        if (this.current == 0) {
           param = {
             type: 2 ,
             name:this.name,
             qrcodeimg:this.imgId,
           }
        }else if(this.current == 1) {
          param = {
             type: 1 ,
             name:this.name,
             qrcodeimg:this.imgId,
           }
        }else if(this.current == 2) {
          param = {
             type: 3 ,
             name:this.name,
             banktitle:this.banktitle,
             account:this.account
           }
        }

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
    }
  }
};
</script>

<style  scoped>
.wallet {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.but {
  width: 225px;
  height: 40px;
  background: rgba(205, 0, 17, 1);
  border-radius: 7px;
  margin-top: 68px;
  line-height: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
}

.content {
  padding: 0;
  height: 100%;
}

.detail {
  height: 180px;
  background: white;
  margin-top: 10px;
}

.name {
  height: 45px;
  display: flex;
  font-size: 15px;
  align-items: center;
  padding-left: 25px;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
}

.img {
  display: flex;
  padding-left: 25px;
  padding-top: 14px;
}

.sunui-uploader-bd {
  padding: 0;
}

.bank {
    height: 135px;
    background: white;
    display: flex;
    flex-direction: column;
    margin-top:10px;
}

.both {
    border-bottom: 1px solid rgba(230,230,230,1);
    display: flex;
    align-items: center;
    height: 45px;
    padding-left: 25px;
    font-size: 15px;
}

.btu {
    margin-left: 18px;
    margin-right: 18px;
    height: 40px;
    background:rgba(28,175,214,1);
    border-radius:7px;
    color:rgba(245,245,245,1);
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    margin-top:10px
}

</style>