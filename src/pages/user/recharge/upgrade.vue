<template>
  <view class="content">
    <view class="uni-padding-wrap" style="width:100%;height:100%">
      <view class="page-section swiper">
        <view class="page-section-spacing">
          <swiper
            class="swiper"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :interval="interval"
            :duration="duration"
          >
            <swiper-item style="display: flex;flex-direction: column;align-items: center; box-sizing: border-box" v-for="(item,index) in list" :key="index">
              <view class="head">
                <text
                  style="font-size:23px;color:rgba(235,180,108,1);margin-top:32px;"
                  >{{item.name}}</text
                >
                <text
                  style="font-size:12px;color:rgba(255,255,255,1);margin-top:16px;"
                  >条件：{{item.condition}}</text
                >
              </view>
              <view style="color:#EBB46C;font-size:15px;width:202px;margin-bottom:38px"
                ><span style="color:black">权益：</span
                >{{item.equity}}</view
              >
              <button class="btn" v-if="item.is_display_button === 1" @click="open(item.grade_id)">开通/升级</button>
              <view class="btn" style="margin-bottom:10px;background:rgba(128,128,128,1);border-radius:20px;"  v-for="(detail,ind) in item.upgrade_progress" :key="ind">{{detail}}</view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import http from '../../../common/request.js'
export default {
  data() {
    return {
      background: ["color1", "color2", "color3"],
      indicatorDots: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      list:''
    };
  },
  onShow(){
      this.getData()
  },
  methods: {
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots;
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay;
    },
    intervalChange(e) {
      this.interval = e.target.value;
    },
    durationChange(e) {
      this.duration = e.target.value;
    },
    getData() {
      let opts = {
              url:'/v1/usergrade/index',
              method:'get'
          }

          let param = {}
           http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data)
          this.list = res.data.data
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
    open(index) {
      uni.navigateTo({
        url:'./dredge?index=' + index
      })
    }
  }
};
</script>

<style scope>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.swiper >>> .uni-swiper-wrapper {
   overflow-y: scroll
}
uni-swiper-item {
  overflow: unset
}
.head {
  height: 148px;
  width: 300px;
  background: url("../../../static/img/Vip.png") no-repeat;
  background-size: cover;
  border-radius: 7px;
  margin-top: 27px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 38px;
  margin-left: 38px;
  margin-right: 38px;
}

.swiper {
    height: 100%
}
.page-section-spacing {
    height: 100%
}
.btn {
  height: 40px;
  width: 300px;
  background: rgba(205, 0, 17, 1);
  border-radius: 7px;
  line-height: 40px;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  margin-left: 38px;
  margin-right: 38px;
  text-align: center
}
</style>
