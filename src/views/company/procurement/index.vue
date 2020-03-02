<template>
  <div class="app-container">
    <el-card class="filter-container">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" @click="searchList">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form ref="listQuery" :model="listQuery" label-width="200px">
          <el-form-item label="订单状态">
            <el-select v-model="listQuery.status" placeholder="请选择订单状态">
              <el-option
               v-for="item in checkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table :data="list"  style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="店铺名称" align="center" prop="proxyName"/>
        <el-table-column label="订单状态" align="center" prop="status"/>
        <el-table-column label="采购数量" align="center" prop="total"/>
        <el-table-column label="创建时间" align="center" prop="createTime"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
            <el-button size="mini" @click="sendProduct(scope.row)" v-if="scope.row.status == '待发货'">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
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
    <!-- 弹出框 -->
    <el-dialog title="新增" :visible.sync="dialogVisible" width="80%" >
      <el-table :data="productList" border style="width: 100%">
        <el-table-column label="编号" align="center" type="index"/>
        <el-table-column label="商品名称" align="center" prop="productName"/>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.pic" alt="" style="width:80px;height:80px">
          </template>
        </el-table-column>
        <el-table-column label="商品品牌" align="center" prop="brandName"/>
        <el-table-column label="价格" align="center" prop="price"/>
        <el-table-column label="采购数量"  align="center" prop="num"/>
         <el-table-column label="sku信息" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowSkuEditDialog(scope.row.productId, scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- sku列表 -->
    <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo" width="70%">
      <el-table style="width: 100%" :data="skuList" border>
        <el-table-column label="颜色" width="200" align="center">
          <template slot-scope="scope">{{scope.row.sp1}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.pic" style="width=100%;height:140px"/>
          </template>
        </el-table-column>
        <el-table-column label="容量" width="200" align="center">
          <template slot-scope="scope">{{scope.row.sp2}}</template>
        </el-table-column>
        <el-table-column label="SKU编号" width="200" align="center">
          <template slot-scope="scope">
           {{scope.row.skuCode}}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.promotionPrice}}
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.stock}}
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.lowStock}}
          </template>
        </el-table-column>
         <el-table-column label="商品采购数" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.num}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {post,get,del} from '@/api/util'
export default {
  data() {
    return {
      dialogVisible: false,
      listQuery:{
         pageNum_: 1,
        pageSize_: 10,
        status:null,
        flag:1
      },
      list:null,
      skuList:null,
      total:null,
      productList:null,
      listLoading:false,
      editSkuInfo:false,
      checkOptions:[
        {
          value:1,
          label:'待发货'
        },
        {
          value:2,
          label:'待收货'
        },
        {
          value:3,
          label:'已收货'
        }
      ],
    };
  },
  created () {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false;
      get("/purchase/purchaseProductList",this.listQuery).then(res => {
          for (let i in res.list) {
          switch (res.list[i].status) {
            case 1:
              res.list[i].status = "待发货";
              break;
            case 2:
              res.list[i].status = "待收货";
              break;
            case 3:
              res.list[i].status = "已收货";
              break;
          }
          }
        this.listLoading = true;
        this.listLoading = false;
        this.list = res.list;
        this.total = res.total;
        this.totalPage = res.totalPage;
        this.pageSize_ = res.pageSize_;
       
      });
    },
    checkDetail(row){
     this.productList = row.productDetail;
     this.dialogVisible =true;
     console.log(row)
    },
     handleShowSkuEditDialog(index, row) {
      this.editSkuInfo = true;
      this.skuList = row.skuList
    },
    sendProduct(row){
      this.$confirm("是否发货", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        post('/purchase/updatePurchaseStatus?status=2&purchaseOrderId=' + row.purchaseOrderId).then(res=>{
          this.$message({
            message: "发货成功",
            type: "success",
            duration: 1000
          });
          this.getList()
        })
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
    searchList() {
        this.listQuery.pageNum_ = 1;
        this.getList();
      },
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
