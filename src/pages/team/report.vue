<template>
  <view class="content">
    <view class="head">
      <text style="margin-right:20px;">报单账户：</text>
      <text>{{detail.children.phone}}</text>
    </view>
    <view class="chose">
      <text style="margin-right:20px;">报单金额：</text>
      <view>
        <radio-group @change="radioChange">
          <label
            v-for="(item, index) in detail.score"
            :key="index"
            style="display:flex;margin-right:10px;align-items: center"
          >
            <view>
              <radio :value="item" />
            </view>
            <view>{{ item }}</view>
          </label>
        </radio-group>
      </view>
    </view>
    <button class="report" @click="finsh">立即报单</button>
  </view>
</template>

<script>
import http from "../../common/request.js";
export default {
  data() {
    return {
      current: 0,
      id: "",
      detail: "",
      score:''
    };
  },
  onLoad(index) {
    this.id = index.index;
  },
  onShow() {
    this.getData();
  },
  methods: {
    radioChange: function(evt) {
      console.log(evt.detail.value)
      this.score = evt.detail.value
      // for (let i = 0; i < this.items.length; i++) {
      //   if (this.items[i].value === evt.target.value) {
      //     this.current = i;
      //     break;
      //   }
      // }
    },
    getData() {
      let opts = {
        url: "/v1/team/recharge",
        method: "get"
      };
      let param = {
        id: this.id
      };
      http.httpRequest(opts, param).then(
        res => {
          if (res.data.code == 100) {
            console.log(res.data.data);
            this.detail = res.data.data;
          } else {
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
    },
    finsh() {
      let opts = {
        url: "/v1/team/recharge",
        method: "post"
      };
      let param = {
        children_id: this.id,
         score:this.score
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
    }
  }
};
</script>

<style scope>
.content {
  padding: 0;
  padding-top: 10px;
}

.head {
  height: 45px;
  display: flex;
  align-items: center;
  padding-left: 25px;
  background: white;
  color: rgba(128, 128, 128, 1);
  font-size: 14px;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
}

.chose {
  height: 55px;
  display: flex;
  align-items: center;
  padding-left: 25px;
  background: white;
  color: rgba(128, 128, 128, 1);
  font-size: 14px;
}

uni-radio-group {
  display: flex;
  align-items: center;
}

.report {
  height: 40px;
  border-radius: 7px;
  margin-left: 18px;
  margin-right: 18px;
  margin-top: 86px;
  background: rgba(28, 175, 214, 1);
  color: rgba(245, 245, 245, 1);
  font-size: 16px;
}
</style>