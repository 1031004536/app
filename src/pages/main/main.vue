<template>
  <view class="content">
    <view v-if="hasLogin" class="hello">
      <view class="uni-padding-wrap" style="height:165px;border-radius:7px;">
        <view
          class="page-section swiper"
          style="height:165px;border-radius:7px;"
        >
          <view
            class="page-section-spacing"
            style="height:165px;border-radius:7px;"
          >
            <swiper
              class="swiper"
              :indicator-dots="indicatorDots"
              :autoplay="autoplay"
              :interval="interval"
              :duration="duration"
              style="height:165px;border-radius:7px;"
            >
              <swiper-item style="height:165px;border-radius:7px;">
                <image
                  src="../../static/img/avtar.png"
                  style="width:100%;height:100%;border-radius:7px;"
                ></image>
              </swiper-item>
              <swiper-item>
                <image
                  src="../../static/img/avtar.png"
                  style="width:100%;height:100%;border-radius:7px;"
                ></image>
              </swiper-item>
              <swiper-item>
                <image
                  src="../../static/img/avtar.png"
                  style="width:100%;height:100%;border-radius:7px;"
                ></image>
              </swiper-item>
            </swiper>
          </view>
        </view>
      </view>
      <uni-segmented-control
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        style-type="button"
      ></uni-segmented-control>
      <view style="height:100%;background:white;padding-left:24px">
        <view v-show="current === 0">
          <view class="product" @click="inother">
            <view style="display:flex;align-items: center">
              <image
                src="../../static/img/avtar.png"
                style="width:60px;height:60px;border-radius:4px;"
              ></image>
              <view class="name">
                <text>华为畅享10s</text>
                <text style="color:#CD0011;margin-top:16px">￥1499.00</text>
              </view>
            </view>
            <image
              src="../../static/img/gouwuche1.png"
              style="width:30px;height:28px"
            ></image>
          </view>
        </view>
        <view v-show="current === 1">
          <view class="product">
            <view style="display:flex;align-items: center">
              <image
                src="../../static/img/avtar.png"
                style="width:60px;height:60px;border-radius:4px;"
              ></image>
              <view class="name">
                <text>华为畅享10s</text>
                <text style="color:#CD0011;margin-top:16px">￥1499.00</text>
              </view>
            </view>
            <image
              src="../../static/img/gouwuche1.png"
              style="width:30px;height:28px"
            ></image>
          </view>
        </view>
        <view v-show="current === 2">
          <view class="product">
            <view style="display:flex;align-items: center">
              <image
                src="../../static/img/avtar.png"
                style="width:60px;height:60px;border-radius:4px;"
              ></image>
              <view class="name">
                <text>华为畅享10s</text>
                <text style="color:#CD0011;margin-top:16px">￥1499.00</text>
              </view>
            </view>
            <image
              src="../../static/img/gouwuche1.png"
              style="width:30px;height:28px"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view v-if="!hasLogin" class="hello">
      <view class="title">
        您好 游客。
      </view>
      <view class="ul">
        <view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
      </view>
    </view>
  </view>
</template>

<script>
import http from "../../common/request.js";
import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      background: ["color1", "color2", "color3"],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      current: 0,
      items: ["分类一", "分类二", "分类三"],
      dataList:''
    };
  },
  components: { uniSegmentedControl },
  computed: mapState(["forcedLogin", "hasLogin", "userName"]),
  onShow() {
    this.getData()
    //   if (!this.hasLogin) {
    //     uni.showModal({
    //       title: "未登录",
    //       content: "您未登录，需要登录后才能继续",
    //       /**
    //        * 如果需要强制登录，不显示取消按钮
    //        */
    //       showCancel: !this.forcedLogin,
    //       success: res => {
    //         if (res.confirm) {
    //           /**
    //            * 如果需要强制登录，使用reLaunch方式
    //            */
    //           if (this.forcedLogin) {
    //             uni.reLaunch({
    //               url: "../login/login"
    //             });
    //           } else {
    //             uni.navigateTo({
    //               url: "../login/login"
    //             });
    //           }
    //         }
    //       }
    //     });
    // }
  },
  methods: {
    onClickItem(index) {
      if (this.current !== index.currentIndex) {
        this.current = index.currentIndex;
      }
    },
    inother() {
      uni.navigateTo({
        url: "./detail"
      });
    },
    getData() {
      let opts = {
        url:'/v1/index/get_index_goods',
        method:'get'
      }
      let param = {

      }
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data)
          this.dataList = res.data.data
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

<style>
.hello {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.title {
  color: #8f8f94;
  margin-top: 25px;
}

.ul {
  font-size: 15px;
  color: #8f8f94;
  margin-top: 25px;
}

.ul > view {
  line-height: 25px;
}

.content {
  padding: 0;
  padding-top: 5px;
}

.segmented-control--button {
  height: 60px;
  margin-top: 5px;
  background: white;
  margin-bottom: 5px;
}

.product {
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 25px;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  align-items: center;
}

.name {
  display: flex;
  flex-direction: column;
  margin-left: 13px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(34, 34, 34, 1);
}
</style>
