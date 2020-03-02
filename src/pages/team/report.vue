<template>
  <view class="content">
    <view class="head">
      <text style="margin-right:20px;">报单账户：</text>
      <text>1234567890098</text>
    </view>
    <view class="chose">
      <text style="margin-right:20px;">报单金额：</text>
      <view>
        <radio-group @change="radioChange">
          <label
            v-for="(item, index) in items"
            :key="item.value"
            style="display:flex;margin-right:10px;align-items: center"
          >
            <view>
              <radio :value="item" :checked="index === current" />
            </view>
            <view>{{ item.name }}</view>
          </label>
        </radio-group>
      </view>
    </view>
    <button class="report">立即报单</button>
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
      items: [
        {
          value: "1",
          name: "1000",
          checked: "true"
        },
        {
          value: "2",
          name: "2000"
        },
        {
          value: "3",
          name: "3000"
        }
      ]
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
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].value === evt.target.value) {
          this.current = i;
          break;
        }
      }
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
            console.log(res.data);
            this.detail = res.data;
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