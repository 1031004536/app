<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addBrand()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="userTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="编号" align="center" type="index"></el-table-column>
        <el-table-column label="专题名称" align="center">
          <template slot-scope="scope">{{scope.row.subjectName}}</template>
        </el-table-column>
        <el-table-column label="专题图标" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.subjectImage" alt style="width:80px;height:80px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" align="center">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.recommendStatus"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleTransferProduct(scope.row.subjectId)">设置商品</el-button>
            <el-button size="mini" @click="handleUpdate(scope.row.subjectId, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handlePublish(scope.row.subjectId, scope.row)">内容发布</el-button>
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 商品模态框 -->
    <el-dialog
      title="关联商品"
      :visible.sync="dialogTableVisible"
      center
      :append-to-body="true"
      :lock-scroll="false"
      width="70%"
    >
      <div>
        <el-select v-model="value" @change="checked(relateId)" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.label"
            style="width:100%;margin-bottom:10px"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
        <el-cascader
          clearable
          v-model="selectProductCateValue"
          placeholder="请选择分类"
          :props="{  checkStrictly: true , value :'productCategoryId',label :'productCategoryName',children:'children'}"
          :options="options"
        ></el-cascader>
        <el-input
          v-model="productQuery.keyword"
          style="width:20%;margin-bottom:10px"
          placeholder="请输入商品名称进行搜索"
        ></el-input>
        <el-button type="info" @click="handleSearchProductList()">查询</el-button>
        <el-table
          ref="productTable"
          :data="productList"
          style="width: 100%"
          @selection-change="handleProductChange"
          v-loading="listLoading"
          border
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="商品图片" align="center">
            <template slot-scope="scope">
              <img style="height: 80px" :src="scope.row.pic" />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.name}}</p>
              <p>品牌：{{scope.row.brandName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <p>价格：￥{{scope.row.price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="SKU库存" align="center">
            <template slot-scope="scope">{{scope.row.sale}}</template>
          </el-table-column>
          <el-table-column label="销量" align="center">
            <template slot-scope="scope">{{scope.row.sale}}</template>
          </el-table-column>
        </el-table>
        <el-footer style="margin-top:20px;display:flex;justify-content:space-between">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :page-size="listQuery.pageSize_"
            :page-sizes="[5,10,15]"
            :current-page.sync="listQuery.pageNum_"
            :total="total"
          ></el-pagination>
          <el-button
            style="height:28px"
            class="search-button"
            @click="handleProductOperate(relateId)"
            type="primary"
            size="small"
          >确定</el-button>
        </el-footer>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, dele } from "@/api/hs";
import { get, post, del } from "@/api/util";
import { fetchList  as getProduct} from "@/api/product";
import { fetchListWithChildren } from "@/api/productCate";
import { relation, checking } from "@/api/hs";
export default {
  name: "brandList",
  data() {
    return {
      operateType: null,
      hide: false,
      phoneNumber: "",
      listQuery: {
        keyword: null,
        pageNum_: 1,
        pageSize: 10
      },
      list: null,
      total: null,
      value:null,
      listLoading: true,
      multipleSelection: [],
      multipleSelectionProduct: null,
      relateId:null,
      options1: [
        {
          value: "选项1",
          label: "全部"
        },
        {
          value: "选项3",
          label: "已选择"
        }
      ],
      options: [],
      selectProductCateValue: null,
      productQuery: {
        keyword: null,
        pageNum_: 1,
        pageSize_: 5,
        publishStatus: null,
        verifyStatus: null,
        productSn: null,
        productCategoryId: null,
        brandId: null
      },
      productList:null,
      dialogTableVisible:false
    };
  },
  watch: {
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length == 2) {
        this.productQuery.productCategoryId = newValue[1];
      } else {
        this.productQuery.productCategoryId = null;
      }
    }
  },
  created() {
    this.getList();
    this.getProductList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.list;
        this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize = response.pageSize;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleUpdate(index, row) {
      this.$router.push({
        path: "/hs/projectClassification/update",
        query: { id: row.subjectId }
      });
    },
    handleProductChange(val) {
      this.multipleSelectionProduct = val;
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该专题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        dele(row.subjectId).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    handleProductOperate(id) {
      if (
        this.multipleSelectionProduct == null ||
        this.multipleSelectionProduct.length < 1
      ) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行该添加操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        this.multipleSelectionProduct.map((item, index) => {
          ids.push(
            Object.assign(
              {},
              {
                productId: item.productId,
                productName: item.productName,
                sort: item.sort,
                pic: item.pic,
                subjectId: this.relateId
              }
            )
          );
        });
        post("/subject/subjectProductRelation", ids).then(response => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.dialogTableVisible = false;
        });
      });
    },
     checked(index) {
      if (this.value == "已选择") {
        checking(index).then(response => {
          this.productList = response;
        });
      } else if (this.value == "全部") {
       this.getProductList()
      }
    },
    handlePublish(index, row) {
      this.$router.push({
        path: "/hs/projectClassification/publish",
        query: { id: row.subjectId }
      });
    },
    handleTransferProduct(index) {
      this.dialogTableVisible = true;
      this.relateId = index;
      get("/subject/homeShowIds/"+index).then(response => {
        response.forEach(item1 => {
          this.productList.forEach(item2 => {
            if (item1.productId == item2.productId) {
              this.$refs.productTable.toggleRowSelection(item2, true);
            }
          });
        });
      });

      this.$nextTick(() => {
        this.$refs.productTable.clearSelection();
      });
    },
    getProductList() {
      this.listLoading = true;
      getProduct(this.productQuery).then(response => {
        this.listLoading = false;
        this.productList = response.list;
        this.total = response.total;
      });
      fetchListWithChildren().then(response => {
        this.options = response;
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSearchList() {
      this.listQuery.pageNum_ = 1;
      this.getList();
    },
    handleSearchProductList(){
      this.productQuery.pageNum_ = 1;
      this.getProductList();
    },
    searchBrandList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },

    addBrand() {
      this.$router.push({ path: "/hs/projectClassification/add" });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
