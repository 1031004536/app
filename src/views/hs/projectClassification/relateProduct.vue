<template>
  <div>
    <el-select v-model="value" @change="checked" placeholder="请选择">
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

    <!-- <el-cascader
      v-model="selectProductCateValue"
      :options="options"
      style="width:40%;margin-bottom:10px"
      clearable
      :props="{ multiple: true, checkStrictly: true , value :'productCategoryId',label :'productCategoryName',children:'children'}"
    ></el-cascader>-->
    <el-input
      v-model="listQuery.keyword"
      style="width:20%;margin-bottom:10px"
      placeholder="请输入商品名称进行搜索"
    ></el-input>
    <el-button type="info" @click="handleSearchList()">查询</el-button>
    <el-table
      ref="productTable"
      :data="productList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
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
        @click="handleBatchOperate()"
        type="primary"
        size="small"
      >确定</el-button>
    </el-footer>
  </div>
</template>
<script>
import { fetchList } from "@/api/product";
import { fetchListWithChildren } from "@/api/productCate";
import { relation, checking } from "@/api/hs";
const defaultListQuery = {
  keyword: null,
  pageNum_: 1,
  pageSize_: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};
export default {
  name: "Relate",
  props: ["closeValue"],
  data() {
    return {
      selectProductCateValue: null,
      listQuery: Object.assign({}, defaultListQuery),
      productList: null,
      total: null,
      listLoading: true,
      options: [],
      multipleSelection: [],
      value: null,
      options1: [
        {
          value: "选项1",
          label: "全部"
        },
        {
          value: "选项3",
          label: "已选择"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  watch: {
    selectProductCateValue: function(newValue) {
      console.log(newValue);
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.productList = response.list;
        this.total = response.total;
      });
      fetchListWithChildren().then(response => {
        this.options = response;
      });
    },
    checked() {
      if (this.value == "已选择") {
        checking(this.closeValue).then(response => {
          this.productList = response;
        });
        this.$refs.productTable.toggleRowSelection(this.productList, true);
      } else if (this.value == "全部") {
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.productList = response.list;
          this.total = response.total;
        });
      }
    },
    handleSearchList() {
      this.listQuery.pageNum_ = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum_ = val;
      this.getList();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
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
        this.multipleSelection.map((item, index) => {
          ids.push(
            Object.assign(
              {},
              {
                productId: item.productId,
                productName: item.productName,
                sort: item.sort,
                pic: item.pic,
                subjectId: this.closeValue
              }
            )
          );
        });
        relation(ids).then(response => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.$emit('hidden')
        });
      });
    }
  }
};
</script>