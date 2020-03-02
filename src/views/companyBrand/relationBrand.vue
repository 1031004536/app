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
          <el-form-item label="品牌名称：">
            <el-input v-model="listQuery.brandName" placeholder="请输入品牌名称"></el-input>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" :selectable="selectInit"></el-table-column>
        <el-table-column label="编号" width="55" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{scope.row.brandName}}</template>
        </el-table-column>
        <el-table-column label="品牌Logo" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt style="width:80px;height:80px" />
          </template>
        </el-table-column>
        <el-table-column label="店铺名" align="center">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
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
    <div style="margin-top:20px">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
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
        brandName: ""
      },
      multipleSelection: null,
      total: null,
      checkList:null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      get("/company/brandList", this.listQuery).then(res => {
        this.listLoading = false;
        this.dataList = res.list;
        this.total = res.total;
      });
      get('/company/getBindingBrand').then(res=>{
          this.checkList =res
      })
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
    submit() {
      this.$confirm("是否提交数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.multipleSelection.length > 1) {
          alert("单次只能绑定一个品牌");
        } else {
            let brand = {};
          this.multipleSelection.forEach(item =>{
            brand.brandId = item.brandId
            brand.brandName = item.brandName
          })
          post("/company/bindingBrand", brand).then(res => {
            this.$message({
              message: "绑定成功",
              type: "success",
              duration: 1000
            });
          });
        }
      });
    },
     selectInit(row,index){
        let checkedIds = []
      this.checkList.forEach(item =>{
          checkedIds.push(item.brandId)
      })  
         if(checkedIds.indexOf(row.brandId) != -1){
            return false  //不可勾选
        }else{    
            return true  //可勾选
        }  
   },
  }
};
</script>