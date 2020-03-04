<template>
  <view class="content">
    <view class="head">
      <text style="font-size:16px;">佣金余额</text>
      <text style="font-size:13px;">(佣金可经某某过程得到，可提现)</text>
      <text style="font-size:35px;">{{total}}</text>
    </view>
    <view class="center">
      <view class="money">
        <text style="font-weight:600">收入</text>
        <text style="color:rgba(205,0,17,1);">￥{{income}}</text>
      </view>
      <view class="money">
        <text style="font-weight:600">支出</text>
        <text style="color:rgba(205,0,17,1);">￥{{expenditure}}</text>
      </view>
    </view>
    <view class="list">
      <mescroll-body
        ref="mescrollRef"
        @init="mescrollInit"
        @up="upCallback"
        :up="upOption"
      >
        <view class="listDetail" v-for="(item,index) in dataList" :key="index">
          <view class="text">
            <text style="font-size:14px">{{item.memo}}</text>
            <text style="font-size:12px;color:rgba(128,128,128,1);"
              >{{item.create_time}}</text
            >
          </view>
          <text style="font-size:20px;color:rgba(205,0,17,1);">{{item.score}}</text>
        </view>
      </mescroll-body>
    </view>
  </view>
</template>

<script>
import MescrollMixin from "../../components/mescroll-uni/mescroll-mixins.js";
import http from '../../common/request.js'
export default {
  mixins: [MescrollMixin],
  data() {
    return {
      upOption: {
        use: true, // 是否启用上拉加载; 默认true
        auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20 // 每页数据的数量,默认10
        },
        noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
        empty: {
          tip: "暂无相关数据"
        }
      },
      // 列表数据
      dataList: [],
      hasNext:true,
      total:'',
      income:'',
      expenditure:''
    };
  },
  methods: {
    upCallback(page) {
      let pageNum = page.num; // 页码, 默认从1开始
      let pageSize = page.size; // 页长, 默认每页10条
      uni.request({
        url: "/api/v1/my/commission",
        data:{
          page:pageNum,
          pagesize:pageSize
        },
        success: data => {
            console.log(data.data.data)
            this.total = data.data.data.total;
            this.income = data.data.data.total;
            this.expenditure = data.data.data.expenditure;

          let listData = data.data.data.data;
          // 接口返回的当前页数据列表 (数组)
          let curPageData = listData.data;
          // 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
          let curPageLen = listData.per_page;
          // 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
          let totalPage = listData.current_page;
          // 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
          let totalSize = listData.total;
          // 接口返回的是否有下一页 (true/false)
          console.log(listData.last_page,listData.current_page)
          if( listData.last_page  > listData.current_page){
            console.log(listData.last_page,listData.current_page)
              this.hasNext = true
          }else{
              this.hasNext = false
          }
          let hasNext = this.hasNext;

          //设置列表数据
        //   if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
          this.dataList = this.dataList.concat(curPageData); //追加新数据

          // 请求成功,隐藏加载状态
          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          
          this.mescroll.endByPage(curPageLen, totalPage);

          // 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
          this.$nextTick(() => {
            this.mescroll.endSuccess(curPageLen);
          });
        },
        fail: () => {
          //  请求失败,隐藏加载状态
          this.mescroll.endErr();
        }
      });
    }
  }
};
</script>

<style scoped>
.content {
  padding: 6px;
}

.head {
  height: 123px;
  background: rgba(205, 0, 17, 1);
  border-radius: 7px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 18px;
}

.list {
  background: white;
  margin-top: 5px;
}

.listDetail {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  padding: 10px 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.center {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  height: 75px;
  margin-top: 5px;
}

.money {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  justify-content: space-around;
  height: 100%;
  font-weight: 500;
}
</style>
