<template>
  <div>
    <el-card class="filter-container">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" @click="searchList()">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form size="small" label-width="200px" :model="listQuery" :inline="true">
          <el-form-item label="订单编号：">
            <el-input class="input-width" v-model="listQuery.orderId" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="订单类型：">
            <el-select v-model="listQuery.orderType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间：">
            <el-date-picker
              v-model="time"
              unlink-panels
               value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="收货姓名：">
            <el-input class="input-width" v-model="listQuery.receiverName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="收货手机：">
            <el-input class="input-width" v-model="listQuery.phone" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input class="input-width" v-model="listQuery.productName" style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <header>
        <div style="width:30%">商品</div>
        <div style="width:10%">价格</div>
        <div style="width:10%">数量</div>
        <div style="width:10%">收货人/手机</div>
        <div style="width:10%">付款金额</div>
        <div style="width:10%">物流方式</div>
        <div style="width:10%">订单状态</div>
        <div style="width:10%">操作</div>
      </header>
      <div v-for="(item,index) in list" :key="index">
        <div class="tableHead">
          <span style="margin-left:40px">订单编号：{{item.orderId}}</span>
          <span style="margin-left:60px">下单时间：{{item.createTime}}</span>
          <span style="margin-left:60px">付款方式：{{item.payType | pay}}</span>
        </div>
        <el-table :data="item.list" style="width: 100%" :span-method="objectSpanMethod" border>
          <el-table-column min-width="30%" align="center">
            <template slot-scope="scope">
              <div style="display:flex;align-items:center">
                <img :src="scope.row.pic" style="width:40px;height:40px;margin-left:40px;" alt />
                <span style="margin-left:60px">{{scope.row.productName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="10%" align="center">
            <template slot-scope="scope">￥{{scope.row.promotionPrice}}</template>
          </el-table-column>
          <el-table-column min-width="10%" align="center">
            <template slot-scope="scope">{{scope.row.productQuantity}}</template>
          </el-table-column>
          <el-table-column min-width="10%" align="center">
            <span>{{item.receiverName}}</span>
            <span>{{item.phone}}</span>
          </el-table-column>
          <el-table-column
            min-width="10%"
            align="center"
          >￥{{item.actualAmount}}(含运费￥{{item.freightAmount}})</el-table-column>
          <el-table-column min-width="10%" align="center"></el-table-column>
          <el-table-column min-width="10%" align="center">{{item.status | orderStatus}}</el-table-column>
          <el-table-column min-width="10%" align="center">
            <el-button type="text">发货</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize_"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum_"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { post, get, del } from "@/api/util";
export default {
  data() {
    return {
      listQuery: {
        pageNum_: 1,
        pageSize_: 10
      },
      list: null,
      total: "",
      time: null,
      options:[]
    };
  },
  created() {
    this.getList();
  },
  filters: {
    pay(val){
       if(val == 0){
         return '未支付'
       }else if(val == 1){
         return '支付宝'
       }else if(val == 2){
         return '微信'
       }
    },
    orderStatus(val){
       if(val == 0){
         return '待付款'
       }else if(val == 1){
         return '待发货'
       }else if(val == 2){
         return '买家待收货（卖家已发货）'
       }else if(val == 3){
         return '待评价'
       }else if(val == 4){
         return '已完成'
       }else if(val == 5){
         return '已关闭'
       }else if(val == 5){
         return '无效订单'
       }
    }
  },
  methods: {
    getList() {
      post("/order/orderList", this.listQuery).then(res => {
        this.list = res.list;
        this.total = res.total;
      });
    },
    searchList() {
      if (this.time) {
        this.listQuery.startTime = this.time[0];
        this.listQuery.endTime = this.time[1];
      }
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum_ = 1;
      this.listQuery.pageSize_ = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum_ = val;
      this.getList();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 2) {
        if (rowIndex % 100 === 0) { 
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
<style >
header {
  width: 100%;
  height: 60px;
  display: flex;
  background: #e1e1e1;
  margin-bottom: 20px;
}
.el-table__header-wrapper {
  display: none;
}
header div {
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 16px;
}
.tableHead {
  width: 100%;
  height: 60px;
  background: #e1e1e1;
  line-height: 60px;
  font-size: 16px;
}
</style>