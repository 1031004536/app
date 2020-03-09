<template>
  <view class="content">
    <view class="cartList" v-for="item in items" :key="item.value">
      <!-- <checkbox-group @change="checkboxChange">
        <label>
          <view>
            <checkbox
              :value="item.value"
              :checked="item.checked"
              style="border-radius: 50%"
            />
          </view>
        </label>
      </checkbox-group> -->
      <view style="width:77px;height:47px;margin-left:18px;">
        <image
          :src="item.goods_thumb_path"
          style="width:100%;height:100%"
        ></image>
      </view>
      <view class="title">
        <text style="color:rgba(0,0,0,1);font-size:13px;font-weight:600">{{
          item.goods_name
        }}</text>
        <view class="price">
          <text style="color:rgba(205,0,17,1);font-size:15px;"
            >¥{{ item.goods_price }}</text
          >
          <view class="add">
            <view
              style="width:25px;border:1px solid rgba(204,204,204,1);height:18px;color:#999999;font-size:15px;line-height:18px;text-align:center"
              @click="low(item.id)"
              >-</view
            >
            <input
              v-model="item.goods_number"
              style="border:1px solid rgba(204,204,204,1);width:38px;height:18px;line-height:18px;min-height:18px;color:#999999;font-size:15px;line-height:18px;text-align:center"
            />
            <view
              style="width:25px;border:1px solid rgba(204,204,204,1);height:18px;color:#999999;font-size:15px;line-height:18px;text-align:center"
              @click="add(item.id)"
              >+</view
            >
          </view>
        </view>
      </view>
      <button class="del" @click="del(item.id)" v-if="hide">删除</button>
    </view>
    <view class="bottom">
      <!-- <label class="radio"
        ><radio value="r1" :checked="all" @click="allCheck" />全选</label
      > -->
      <button class="btn" @click="updata">{{ text }}</button>
      <view class="buy">
        <text style="font-size:15px;color:rgba(34,34,34,1);"
          >合计：<span style="color:#CD0011">￥{{ totalPrice }}</span></text
        >
        <button class="btn" @click="pay">结算</button>
      </view>
    </view>
  </view>
</template>
<script>
import http from "../../common/request.js";
export default {
  onNavigationBarButtonTap(e) {
    // console.log(e);
    // console.log(this);
    // console.log(this.$mp.page.$getAppWebview);
    // if (e.text === "编辑") {
    // var currentWebview = this.$mp.page.$getAppWebview();
    // currentWebview.setTitleNViewButtonStyle(0, {
    //   text: "完成"
    // });
    // this.titleNViewWebview()
    // console.log(111)
    //   e.text = "完成"
    //   this.showChecked = true;
    // } else {
    //   var currentWebview = this.$mp.page.$getAppWebview();
    //   currentWebview.setTitleNViewButtonStyle(0, {
    //     text: "编辑"
    //   });
    //   // this.titleNViewWebview()
    //   this.showChecked = false;
    // }
  },
  data() {
    return {
      items: [],
      num: "",
      all: false,
      hide: false,
      text: "编辑"
    };
  },
  onShow() {
    this.getData();
  },
  computed: {
    totalCount: function() {
      var totalCount = 0;
      for (let i = 0; i < this.items.length; i++) {
        totalCount += this.items[i].goods_number;
      }
      return totalCount;
    },
    totalPrice: function() {
      var totalPrice = 0;
      for (let i = 0; i < this.items.length; i++) {
        totalPrice += this.items[i].goods_price * this.items[i].goods_number;
      }
      return totalPrice;
    }
  },
  methods: {
    // checkboxChange: function(e) {
    //   var items = this.items,
    //     values = e.detail.value;
    //   for (var i = 0, lenI = items.length; i < lenI; ++i) {
    //     const item = items[i];
    //     if (values.includes(item.value)) {
    //       this.$set(item, "checked", true);
    //     } else {
    //       this.$set(item, "checked", false);
    //     }
    //   }
    // },
    // allCheck() {
    //   this.all = !this.all;
    // },
    updata() {
      if (this.text == "编辑") {
        this.text = "完成";
        this.hide = true;
      } else {
        this.text = "编辑";
        this.hide = false;
      }
    },

    getData() {
      let opts = {
        url: "/v1/index/shopcart",
        method: "get"
      };

      let param = {};
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data);
          this.items = res.data.data;
          this.items.forEach(item => {});
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
    pay() {
      let item = JSON.stringify(this.items);
      uni.navigateTo({
        url: "./pay?param=" + item
      });
    },
    del(id) {
      let opts = {
        url: "/v1/index/shopcart",
        method: "DELETE"
      };

      let param = {
        id: id
      };
      http.httpRequest(opts, param).then(
        res => {
          uni.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none"
          });
          this.getData();
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
    add(id) {
      this.items.forEach(item => {
        if (item.id == id) {
          item.goods_number++;
          let opts = {
            url: "/v1/index/shopcart",
            method: "put"
          };

          let param = {
            id: id,
            number: item.goods_number
          };
          http.httpRequest(opts, param).then(
            res => {
             if(res.data.code !=100){
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
      });
    },
    low(id) {
      this.items.forEach(item => {
        if (item.id == id && item.goods_number > 1) {
          item.goods_number--;
          let opts = {
            url: "/v1/index/shopcart",
            method: "put"
          };

          let param = {
            id: id,
            number: item.goods_number
          };
          http.httpRequest(opts, param).then(
            res => {
              if(res.data.code !=100){
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
      });
    }
  }
};
</script>

<style scoped>
.content {
  padding: 0;
  padding-top: 10px;
  padding-bottom: 55px;
}
.cartList {
  height: 120px;
  background: white;
  display: flex;
  align-items: center;
  padding-left: 26px;
  padding-right: 24px;
  padding-top: 19px;
  padding-bottom: 23px;
  box-sizing: border-box;
}

checkbox >>> .uni-checkbox-input {
  border-radius: 50%;
}

.title {
  display: flex;
  flex-direction: column;
  margin-left: 29px;
  justify-content: space-between;
  height: 100%;
  flex: 1;
}

.price {
  display: flex;
  justify-content: space-between;
}

.add {
  display: flex;
  width: 88px;
  height: 18px;
  box-sizing: border-box;
  position: relative;
  /* z-index: 10; */
}
.bottom {
  height: 55px;
  /* width: 100%; */
  background: white;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  padding-left: 19px;
  padding-right: 15px;
  align-items: center;
  justify-content: space-between;
}

.buy {
  display: flex;
  align-items: center;
}

.btn {
  width: 97px;
  height: 38px;
  background: url("../../static/img/btn.png") no-repeat 100%;
  border-radius: 19px;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
  line-height: 38px;
  text-align: center;
  margin-left: 12px;
}
.radio {
  color: rgba(128, 128, 128, 1);
  font-size: 15px;
}
.del {
  width: 40px;
  background: url("../../static/img/btn.png") no-repeat 100%;
  border-radius: 19px;
  font-size: 15px;
  color: rgba(255, 255, 255, 1);
  /* line-height: 38px; */
  text-align: center;
  /* margin-left: 12px; */
  margin: 0;
  padding: 0;
}
</style>
