<template>
  <view style="width:100%">
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      style-type="button"
      active-color="#CD0011"
    ></uni-segmented-control>
    <view class="content" style="height:100%">
      <view v-show="current === 0">
        <view class="list" v-for="(item,index) in list" :key="index">
          <view class="num">
            <text>订单号：{{item.order_no}}</text>
            <text>{{item.status_text}}</text>
          </view>
          <view class="product">
            <view style="width:90px;height:90px" v-for="(img,ind) in item.goods" :key="ind" v-if="!len">
              <image :src="img.goods_thumb" style="width:90px;height:90px"></image>
            </view>
            <view style="width:90px;height:90px" v-if="len">
              <image :src="item.goods[0].goods_thumb" style="width:90px;height:90px"></image>
            </view>
            <view class="price">
                  <text>¥{{item.total}}</text>
                  <text
                    style="font-weight:bold;color:rgba(128,128,128,1);font-size:11px;text-align:right"
                    >x{{item.totalgoodsnumber}}</text
                  >
                </view>
            <view class="text" v-if="len">
                <text>{{item.goods[0].goods_name}}</text>
            </view>   
          </view>
          <view class="btn">
                <button class="but" style="margin-left:70px;">取消订单</button>
                <button class="but" style="margin-left:15px;">再次购买</button>
              </view>
        </view>
      </view>
      <view v-show="current === 1">
        <view class="list">
          <view class="num">
            <text>订单号：25566458745</text>
            <text>代发货</text>
          </view>
          <view class="product">
            <view style="width:90px;height:90px">
              <image src="" style="width:90px;height:90px"></image>
            </view>

            <view class="text">
              <view style="display: flex;justify-content: space-between;">
                <text>【双11狂欢价】卡尔适真 皮床1.8米双人...</text>
                <view class="price">
                  <text>¥4876</text>
                  <text
                    style="font-weight:bold;color:rgba(128,128,128,1);font-size:11px;text-align:right"
                    >x1</text
                  >
                </view>
              </view>
              <view class="btn">
                <button class="but" style="margin-left:70px;">取消订单</button>
                <button class="but" style="margin-left:15px;">再次购买</button>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="current === 2">
        <view class="list">
          <view class="num">
            <text>订单号：25566458745</text>
            <text>代发货</text>
          </view>
          <view class="product">
            <view style="width:90px;height:90px">
              <image src="" style="width:90px;height:90px"></image>
            </view>

            <view class="text">
              <view style="display: flex;justify-content: space-between;">
                <text>【双11狂欢价】卡尔适真 皮床1.8米双人...</text>
                <view class="price">
                  <text>¥4876</text>
                  <text
                    style="font-weight:bold;color:rgba(128,128,128,1);font-size:11px;text-align:right"
                    >x1</text
                  >
                </view>
              </view>
              <view class="btn">
                <button class="but" style="margin-left:70px;">取消订单</button>
                <button class="but" style="margin-left:15px;">再次购买</button>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="current === 3">
        <view class="list">
          <view class="num">
            <text>订单号：25566458745</text>
            <text>代发货</text>
          </view>
          <view class="product">
            <view style="width:90px;height:90px">
              <image src="" style="width:90px;height:90px"></image>
            </view>

            <view class="text">
              <view style="display: flex;justify-content: space-between;">
                <text>【双11狂欢价】卡尔适真 皮床1.8米双人...</text>
                <view class="price">
                  <text>¥4876</text>
                  <text
                    style="font-weight:bold;color:rgba(128,128,128,1);font-size:11px;text-align:right"
                    >x1</text
                  >
                </view>
              </view>
              <view class="btn">
                <button class="but">再次购买</button>
                <button class="but" style="margin-left:10px;">退换货</button>
                <button class="but" style="margin-left:10px;" @click="indetail">
                  查看订单
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import http from '../../common/request.js'
import uniSegmentedControl from "../../components/uni-segmented-control/uni-segmented-control.vue";
export default {
  components: { uniSegmentedControl },
  data() {
    return {
      items: ["全部", "代发货", "待收货", "已收货"],
      current: null,
      list:'',
      len:''
    };
  },
  onLoad: function(option) {
    console.log(option);
    this.current = Number(option.current);
  },
  onShow(){
    this.getData()
  },
  methods: {
    onClickItem(index) {
      if (this.current !== index.currentIndex) {
        this.current = index.currentIndex;
        this.getData()
      }
    },
    indetail() {
      uni.navigateTo({
        url: "./orderDetail"
      });
    },
    getData() {
      let opts = {
        url: "/v1/index/orderlist",
        method: "get"
      };

      let param = {};
      if(this.current == 0){
        param = {}
      }else if(this.current == 1){
        param = {
          status : 0
        }
      }else if(this.current == 2){
        param = {
          status : 1
        }
      }else if(this.current == 3){
        param = {
          status : 2
        }
      }
      http.httpRequest(opts, param).then(
        res => {
          console.log(res.data.data);
          this.list = res.data.data
          if(3 > this.list.goods.length > 1){
            this.len = false
          }else {
            this.len = true
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
  }
};
</script>

<style scoped>
.list {
  height: 190px;
  background: white;
  margin-top: 10px;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}

.num {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: rgba(40, 40, 40, 1);
}

.product {
  display: flex;
  margin-top: 20px;
  box-sizing: border-box;
  position: relative;
}

.text {
  font-size: 14px;
  margin-left: 5px;
}

.price {
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 30px;
  right: 10px;
}

.btn {
  display: flex;
  position: absolute;
  bottom: 10px;
  right: 10px
}

.but {
  width: 72px;
  height: 28px;
  border: 1px solid rgba(128, 128, 128, 1);
  border-radius: 14px;
  padding: 0;
  font-size: 12px;
  color: rgba(40, 40, 40, 1);
  line-height: 28px;
  text-align: center;
  margin: 0;
}
</style>
