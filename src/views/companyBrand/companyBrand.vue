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
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.productName" placeholder="公司名称/关键字"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="listQuery.productCategoryId"
              :options="productCateOptions"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
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
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" :selectable="selectInit"></el-table-column>
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
      <el-button type="primary" @click="addSend">添加配送</el-button>
      <el-button type="primary" @click="addProduct">添加商品池</el-button>
      <el-button type="primary">批量导出</el-button>
    </div>
    <!-- 商品模态框 -->
    <el-dialog title="配送列表" :visible.sync="dialogVisible" width="70%">
      <div>
        <el-table
          :data="multipleSelection"
          stripe
          style="width: 100%"
          v-loading="listLoading"
          @selection-change="handleProductChange"
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
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendSure">确定配送</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, post } from "@/api/util";
import { port } from "@/api/common";
import { fetchList as fetchBrandList } from "@/api/brand";
import { fetchListWithChildren } from "@/api/productCate";
export default {
  data() {
    return {
      dataList: null,
      listLoading: true,
      listQuery: {
        pageSize_: 10,
        pageNum_: 1,
        productName: null,
        brandId: "",
        productCategoryId: ""
      },
      productCateOptions: [],
      brandOptions: [],
      multipleSelection: null,
      total: null,
      dialogVisible: false,
      sendProduct: null,
      checkedList:null
    };
  },
  created() {
    this.getList();
    this.getProductCateList();
    this.getBrandList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      get("/companyBrand/brandProductList", this.listQuery).then(res => {
        this.listLoading = false;
        this.dataList = res.list;
        this.total = res.total;
      });
       get("/companyBrand/proxyProductList").then(res => {
          this.checkedList = res
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
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].productCategoryName,
                value: list[i].children[j].productCategoryId
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].productCategoryName,
            value: list[i].productCategoryId,
            children: children
          });
        }
      });
    },
    selectInit(row,index){
        let checkedIds = []
      this.checkedList.forEach(item =>{
          checkedIds.push(item.productId)
      })  
         if(checkedIds.indexOf(row.productId) != -1){
            return false  //不可勾选
        }else{    
            return true  //可勾选
        }  
   },
    getBrandList() {
      get('/companyBrand/brandOption').then(res =>{
         this.brandOptions = res
      }) 
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
    addProduct() {
      if (this.multipleSelection) {
        this.$message({
          message: "添加成功",
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: "请选择要添加的商品",
          type: "warning",
          duration: 1000
        });
      }
    },
    addSend() {
      this.dialogVisible = true;
    },
    handleProductChange(val) {
      this.sendProduct = val;
    },
    sendSure(){
        if(this.sendProduct){
             this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
          post('/companyBrand/proxyProduct',this.sendProduct).then(res=>{
           this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
               this.dialogVisible = false; 
               this.getList()
          })
          })
        }else{
            this.$message({
            message: "请选择商品",
            type: "error",
            duration: 1000
          });
        }
    }
  
  }
};
</script>