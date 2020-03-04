<template>
  <view class="content">
      
          <view class="cartList" v-for="item in items" :key="item.value">
              <checkbox-group @change="checkboxChange">
        <label  >
          <view>
            <checkbox
              :value="item.value"
              :checked="item.checked"
              style="border-radius: 50%"
            />
          </view>
          </label>
          </checkbox-group>
          <view style="width:77px;height:47px;margin-left:18px;">
            <image src="" style="width:100%;height:100%"></image>
          </view>
          <view class="title">
            <text style="color:rgba(0,0,0,1);font-size:13px;font-weight:600"
              >Nike耐克女鞋 城市CITY LOOP粗绳绑带潮流运动鞋板...</text
            >
            <view class="price">
              <text style="color:rgba(205,0,17,1);font-size:15px;">¥529</text>
              <view class="add">
                <view
                  style="width:25px;border:1px solid rgba(204,204,204,1);height:18px;color:#999999;font-size:15px;line-height:18px;text-align:center"
                  @click="low"
                  >-</view
                >
                <input
                  v-model="num"
                  style="border:1px solid rgba(204,204,204,1);width:38px;height:18px;line-height:18px;min-height:18px;color:#999999;font-size:15px;line-height:18px;text-align:center"
                />
                <view
                  style="width:25px;border:1px solid rgba(204,204,204,1);height:18px;color:#999999;font-size:15px;line-height:18px;text-align:center"
                  @click="add"
                  >+</view
                >
              </view>
            </view>
          </view>
          </view>
          <view class="bottom">
              <label class="radio"><radio value="r1" :checked= all  @click="allCheck"/>全选</label>
          </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          value: "USA",
          name: "美国"
        },
        {
          value: "CHN",
          name: "中国",
          checked: "true"
        },
        {
          value: "BRA",
          name: "巴西"
        },
        {
          value: "JPN",
          name: "日本"
        },
        {
          value: "ENG",
          name: "英国"
        },
        {
          value: "FRA",
          name: "法国"
        }
      ],
      num: "0",
      all:false
    };
  },
  methods: {
    checkboxChange: function(e) {
      var items = this.items,
        values = e.detail.value;
      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        const item = items[i];
        if (values.includes(item.value)) {
          this.$set(item, "checked", true);
        } else {
          this.$set(item, "checked", false);
        }
      }
    },
    allCheck() {
        this.all = !this.all
    },
    add() {
      this.num++;
    },
    low() {
      if (this.num > 1) {
        this.num--;
      } else {
        uni.showToast({
          title: "最少买一件",
          duration: 2000
        });
      }
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
    width: 100%;
    background: white;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    padding-left: 19px;
    padding-right: 15px;
    align-items: center
}
</style>
