<template>
  <view class="content">
    <view class="head">
      <image
        :src="user.thumb"
        style="width:36px;height:36px;border-radius:50%"
      ></image>
      <view class="phone">
        <text>{{ user.nickname }}</text>
        <text style="color:rgba(128,128,128,1);"
          >账号会员等级：{{ user.gradename }}</text
        >
      </view>
    </view>
    <view class="money"
      >支付金额：<span style="color:#EBB46C">{{ score }}</span></view
    >
    <view class="payType">
      <view class="header">支付方式</view>
      <view>
        <uni-segmented-control
          :current="current"
          :values="items"
          @clickItem="onClickItem"
          style-type="button"
        ></uni-segmented-control>
        <view v-show="current === 0" class="wechat">
          <text>收款人姓名：{{ receivables.alipayname }}</text>
          <view class="pay">
            <text>收款二维码：</text>
            <image
              :src="receivables.alipayimg"
              style="width:100px;height:100px;margin-left:24px"
            ></image>
          </view>
          <text style="color:rgba(128,128,128,1);font-size:10px"
            >保存收款码或截图去支付宝扫码付款，付款成功后记得截图上传！</text
          >
        </view>
        <view v-show="current === 1" class="wechat">
          <text>收款人姓名：{{ receivables.weixinname }}</text>
          <view class="pay">
            <text>收款二维码：</text>
            <image
              :src="receivables.weixinimg"
              style="width:100px;height:100px;margin-left:24px"
            ></image>
          </view>
          <text style="color:rgba(128,128,128,1);font-size:10px"
            >保存收款码或截图去微信扫码付款，付款成功后记得截图上传！</text
          >
        </view>
        <view v-show="current === 2" class="bank">
          <text style="margin-top:24px"
            >收款银行：{{ receivables.banktitle }}</text
          >
          <text style="margin-top:24px"
            >收款姓名：{{ receivables.bankname }}</text
          >
          <text style="margin-top:24px"
            >收款账号：<span style="color:#EBB46C">{{
              receivables.bankno
            }}</span></text
          >
          <text style="margin-top:24px;color:rgba(128,128,128,1);font-size:10px"
            >复制收款账号去网银转账，转账成功后记得截图上传！</text
          >
        </view>
      </view>
    </view>
    <view class="jietu">
      <text>上传付款截图:</text>
      <sunui-upimg
        @change="getImageInfo1"
        :upload_auto="true"
        ref="upimg1"
        :upload_count="1"
      ></sunui-upimg>
    </view>

    <view class="textarea_box">
      <textarea
        class="textarea"
        placeholder="备注信息"
        maxlength="100"
        @input="descInput"
        v-model="desc"
      />
      <text class="num">{{ desc.length }}/100</text>
    </view>
    <button class="btn" @click="sure">提交</button>
  </view>
</template>

<script>
import http from "../../../common/request.js";
import uniSegmentedControl from "../../../components/uni-segmented-control/uni-segmented-control.vue";
import sunuiUpimg from "../../../components/sunui-upimg/sunui-upimg.vue";
export default {
  components: { uniSegmentedControl, sunuiUpimg },
  data() {
    return {
      current: 0,
      items: ["支付宝", "微信", "银行卡"],
      desc: "",
      user: "",
      receivables: "",
      score: "",
      grade_id: "",
      imgId: ""
    };
  },
  onShow() {
    this.getData();
  },
  onLoad(options) {
    console.log(options);
    this.grade_id = options.index;
  },
  methods: {
    onClickItem(index) {
      if (this.current !== index.currentIndex) {
        this.current = index.currentIndex;
      }
    },
    descInput(e) {
      this.remnant = e.detail.value.length;
    },
    getImageInfo1(e) {
      this.imgId = e[0].id;
    },
    getData() {
      let opts = {
        url: "/v1/usergrade/recharge",
        method: "get"
      };
      let param = {
        grade_id:this.grade_id
      };
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data);
          this.user = res.data.data.user;
          this.receivables = res.data.data.receivables;
          this.score = res.data.data.score;
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
    sure() {
      let opts = {
        url: "/v1/usergrade/recharge",
        method: "post"
      };

      let param = {};
      if (this.current == 0) {
        param = {
          way: 2,
          proveimg: this.imgId,
          grade_id: this.grade_id,
          memo: this.desc
        };
      } else if (this.current == 1) {
        param = {
          way: 1,
          proveimg: this.imgId,
          grade_id: this.grade_id,
          memo: this.desc
        };
      } else if (this.current == 2) {
        param = {
          way: 3,
          grade_id: this.grade_id,
          proveimg: this.imgId,
          memo: this.desc
        };
      }
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.msg);
          uni.showModal({
            title: "提示",
            content: "充值成功，点击确定返回",
            success: function(res) {
              if (res.confirm) {
                 uni.navigateBack()
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            }
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

<style scope>
.content {
  padding: 0;
}

.head {
  background: rgba(42, 37, 37, 1);
  height: 55px;
  border-radius: 0px 0px 7px 7px;
  display: flex;
  padding-left: 25px;
  align-items: center;
}

.phone {
  display: flex;
  flex-direction: column;
  margin-left: 6px;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
}

.money {
  height: 40px;
  background: white;
  font-size: 14px;
  padding-left: 25px;
  line-height: 40px;
  margin-top: 5px;
  border-radius: 7px;
}

.payType {
  /* height: 250px; */
  background: white;
  margin-top: 5px;
}

.header {
  height: 35px;
  border-bottom: 1px solid #e6e6e6;
  line-height: 35px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  font-size: 13px;
}

.wechat {
  display: flex;
  flex-direction: column;
  padding-left: 45px;
  padding-top: 18px;
  font-size: 13px;
}

.pay {
  display: flex;
  margin-top: 16px;
}

.bank {
  display: flex;
  flex-direction: column;
  padding-left: 45px;
  font-size: 13px;
}

.jietu {
  height: 130px;
  background: white;
  padding-left: 45px;
  padding-top: 15px;
  font-size: 13px;
  display: flex;
  margin-top: 5px;
}

.sunui-uploader-bd {
  padding: 0;
  padding-left: 10px;
}

.textarea_box {
  height: 100px;
  background: white;
  font-size: 13px;
  padding-top: 16px;
  padding-left: 16px;
  position: relative;
  margin-top: 5px;
}

.textarea {
  height: 100px;
  padding: 0;
  margin: 0;
}

.num {
  position: absolute;
  bottom: 0;
  right: 5px;
  color: rgba(128, 128, 128, 1);
  font-size: 13px;
}

.btn {
  margin-right: 12px;
  margin-left: 12px;
  height: 40px;
  margin-top: 10px;
  background: rgba(42, 37, 37, 1);
  border-radius: 7px;
  color: rgba(235, 180, 108, 1);
  font-size: 16px;
  line-height: 40px;
}
</style>
