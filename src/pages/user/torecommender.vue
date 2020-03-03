<template>
    <view class="content">
        <view class="custom">
            <text style="color:rgba(34,34,34,1);font-size:14px;margin-top:16px;margin-left:20px">转账金额</text>
            <view class="input-row border">
                <text>￥</text>
                 <m-input
                    class="m-input"
                    type="text"
                    clearable
                    focus
                    v-model="account"
                    placeholder="请输入金额"
                    style="height:100%"
                ></m-input>
            </view>
            <text style="color:rgba(128,128,128,1);font-size:13px;margin-left:50px">{{name}}金额￥{{totalMoney}}，<span @click="allchange" style="color:#1CAFD6">全部转换</span></text>
        </view>
        <button class='btu' @click="change">立即转账</button>
    </view>
</template>

<script>
import http from '../../common/request.js'
import mInput from "../../components/m-input.vue";
export default {
    components: {
    mInput,
  },
   data() {
        return {
           account: "",
           totalMoney:'',
           type:'',
           name:''
        }
    },
    onLoad(options){
    let param = JSON.parse(options.param)
    this.totalMoney = param[0]
    this.type = param[1]
    if (param[1] == 'commission') {
      this.name = '佣金'
    }else{
      this.name = '津贴'
    }
    // var data = JSON.parse(options.param);
    // console.log(data)
  },
    methods:{
     change() {
       let opts = {
           url:'/v1/wallet/torecommender',
           method:'post'
       }

       let param = {
           type: this.type,
           score:this.account
       }

       http.httpRequest(opts, param).then(
        res => {
          uni.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none"
          });
          setTimeout(function() {
              uni.reLaunch({
                url: "./user"
              });
            }, 2000);
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
      allchange() {
      if (this.totalMoney) {
         this.account = this.totalMoney
      }
    }
    }
}
</script>

<style scope>
 .content {
     padding:0;
 }

 .custom {
    height: 165px;
    background:rgba(255,255,255,1);
    border-radius:7px;
    display: flex;
    flex-direction: column;
    margin-top: 10px; 
 }
 
 .input-row {
     height: 55px;
     margin-top:18px;
     margin-left: 50px;
     margin-right: 50px;
     display: flex;
     align-items: center;
     margin-bottom: 17px
 }
 
 .btu {
     margin-left:18px;
     margin-right:18px;
     margin-top:20px;
     height:40px;
     background:rgba(28,175,214,1);
     border-radius:7px;
     color:rgba(245,245,245,1);
     font-size:16px;
 }
</style>