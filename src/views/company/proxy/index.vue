<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          type="info"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        :data="dataList"
        stripe
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="55" align="center" ></el-table-column>
        <el-table-column label="编号" width="55" align="center" type="index"></el-table-column>
        <el-table-column label="代理商名称" align="center">
          <template slot-scope="scope">{{scope.row.proxyName}}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">{{scope.row.status | formStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <el-button type="primary" @click="detail(scope.row)">商品详情</el-button>
               <el-button type="primary" @click="checked(scope.row)" v-if="scope.row.status == 1">审核</el-button>
              </template>
        </el-table-column>
      </el-table>
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
    <!-- 商品模态框 -->
    <el-dialog title="配送列表" :visible.sync="dialogVisible" width="70%">
      <div>
        <el-table
          :data="productList"
          stripe
          style="width: 100%"
          v-loading="listLoading"
          border
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="编号" width="55" align="center" type="index"></el-table-column>
          <el-table-column label="商品图片" align="center">
            <template slot-scope="scope">
              <img style="height: 80px" :src="scope.row.pic" />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">{{scope.row.productName}}</template>
          </el-table-column>
          <el-table-column label="品牌名称" align="center">
            <template slot-scope="scope">{{scope.row.brandName}}</template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">￥{{scope.row.price}}</template>
          </el-table-column>
          <el-table-column label="销量" align="center">
            <template slot-scope="scope">{{scope.row.sale}}</template>
          </el-table-column>
        </el-table>
        <div  v-if="hide" style="position:relative;top:20px;left:70%">
                  <el-button @click="submit(2,proxyProductId)" >审核通过</el-button>
                  <el-button type="primary" @click="submit(3,proxyProductId)">审核不通过</el-button>
              </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, post } from "@/api/util";
export default {
  data() {
    return {
      dataList: null,
      listLoading: true,
      listQuery: {
        pageSize_: 10,
        pageNum_: 1,
        status:'',
      },
      statusOptions:[
        {
            label:'审核中',
            value: 1
        },
         {
            label:'审核成功',
            value: 2
        },
         {
            label:'审核失败',
            value: 3
        }
      ],
      multipleSelection: null,
      total: null,
      dialogVisible: false,
      productList:null,
      hide:null,
      proxyProductId:null,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formStatus(val){
        if(val == 1){
            return '审核中'
        }else if(val == 2){
            return '审核成功'
        }else if(val == 3){
            return '审核失败'
        }
    }  
  },
  methods: {
    getList() {
      this.listLoading = true;
      get("/proxyProduct/proxyProductList", this.listQuery).then(res => {
        this.listLoading = false;
        this.dataList = res.list;
        this.total = res.total;
      });
    },
    handleSearchList() {
      this.listQuery.pageNum_ = 1;
      this.getList();
    },
    handleResetSearch() {
      this.listQuery = {};
      this.pageNum_ = 1;
      this.pageSize_ = 10;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    detail(row){
        this.dialogVisible = true;
        this.hide = false;
        this.productList = row.productDetail ;
        this.proxyProductId = row.proxyProductId;
    },
    checked(row){
        this.proxyProductId = row.proxyProductId;
        this.dialogVisible = true;
        this.hide = true;
        this.productList = row.productDetail 
    },
     submit(status,id) {
      post('/proxyProduct/proxyProductCheck?proxyProductId=' + id + '&status=' + status).then(
        response => {
          this.$message({
            message: '操作成功',
            type: "success",
            duration: 1000
          });
          this.dialogVisible = false;
          this.getList()
        }
      );
    },
  }
};
</script>