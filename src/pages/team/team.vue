<template>
  <view style="width:100%" v-if="hasLogin">
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      style-type="button"
    ></uni-segmented-control>
    <view style="height:100%">
      <view v-show="current === 0" class="content">
        <view class="detail" v-for="(item, index) in list" :key="index">
          <text>{{item.tier}}</text>
          <image
            :src="
              item.children.thumb
                ? 'item.children.thumb'
                : '../../static/img/timg.jpg'
            "
            style="width:44px;height:44px;border-radius:50%;margin-right:6px"
          ></image>
          <view style="flex:1">
            <view style="display:flex;justify-content: space-between">
              <text>{{ item.children.nickname }}</text>
              <text style="color:rgba(128,128,128,1);">{{
                item.children.phone
              }}</text>
            </view>
            <view
              style="margin-top:12px"
            >
              <view> <text>{{ item.grade.name }}</text></view>
              <text style="color:rgba(128,128,128,1);"
                >注册时间：{{ item.children.create_time }}</text
              >
            </view>
          </view>
          <button class="report" @click="inother('report', item.children.id)">
            报单
          </button>
        </view>
        <view class="all"
          >统计 {{ totalList }}
          <span style="color:#CD0011">（会员 {{ formaltotal }}）</span></view
        >
        <view class="btns">
          <button
            style="width:50%;line-height:40px;"
            @click="inother('reg')"
          >
            代注册
          </button>
          <button
            @click="inother('share')"
            style="width:50%;line-height:40px;background:#CD0011;color:rgba(255,255,255,1);"
          >
            分享
          </button>
        </view>
      </view>
      <view v-show="current === 1" class="content">
        <view class="detail" v-for="(item, index) in list" :key="index">
          <text>{{item.tier}}</text>
          <image
            :src="
              item.children.thumb
                ? 'item.children.thumb'
                : '../../static/img/timg.jpg'
            "
            style="width:44px;height:44px;border-radius:50%;margin-right:6px"
          ></image>
          <view style="flex:1">
            <view style="display:flex;justify-content: space-between">
              <text>{{ item.children.nickname }}</text>
              <text style="color:rgba(128,128,128,1);">{{
                item.children.phone
              }}</text>
            </view>
            <view
              style="margin-top:12px"
            >
              <view>{{ item.grade.name }}</view>
              <text style="color:rgba(128,128,128,1);"
                >注册时间：{{ item.children.create_time }}</text
              >
            </view>
          </view>
          <button class="report" @click="inother('report', item.children.id)">
            报单
          </button>
        </view>
        <text class="all"
          >统计 {{ totalList }}
          <span style="color:#CD0011">（会员 {{ formaltotal }}）</span></text
        >
        <view class="btns">
          <button
            style="width:50%;line-height:40px;"
            @click="inother('reg')"
          >
            代注册
          </button>
          <button
            @click="inother('share')"
            style="width:50%;line-height:40px;background:#CD0011;color:rgba(255,255,255,1);"
          >
            分享
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import http from "../../common/request.js";
import { mapState, mapMutations } from "vuex";
import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue";
export default {
  components: { uniSegmentedControl },
  computed: {
    ...mapState([ "forcedLogin"])
  },
  data() {
    return {
      items: ["直接推荐人", "间接推荐人"],
      current: 0,
      text: "",
      list: "",
      formaltotal: "",
      totalList: "",
      hasLogin:''
    };
  },

  onShow() {
    this.hasLogin = JSON.parse(uni.getStorageSync('hasLogin'))
    this.getData();
  },
  methods: {
    onClickItem(index) {
      if (this.current !== index.currentIndex) {
        this.current = index.currentIndex;
      }
      this.getData();
    },
    inother(name, index) {
      if (index) {
        uni.navigateTo({
          url: "./" + name + "?index=" + index
        });
      } else {
        uni.navigateTo({
          url: "./" + name
        });
      }
    },
    getData() {
      let opts = {
        url: "/v1/team/index",
        method: "get"
      };
      let param = {};
      if (this.current == 0) {
        param = {
          tier: 1
        };
      }
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data.team.data);
          this.list = res.data.data.team.data;
          this.formaltotal = res.data.data.formaltotal;
          this.totalList = res.data.data.total;
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
  height: 100%;
  padding: 0;
}

.detail {
  display: flex;
  align-items: center;
  padding-left: 25px;
  padding-right: 10px;
  height: 60px;
  font-size: 12px;
  background: white;
  margin-top: 5px;
  justify-content: space-between;
}

.report {
  width: 58px;
  height: 26px;
  background: rgba(205, 0, 17, 1);
  border-radius: 13px;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  margin-left: 35px;
  line-height: 26px;
}

.all {
  margin-top: 25px;
  font-size: 15px;
  margin-bottom: 25px;
  display: block;
  text-align: center;
}

.btns {
  height: 40px;
  display: flex;
  font-size: 15px;
  border-radius: 7px;
}
</style>