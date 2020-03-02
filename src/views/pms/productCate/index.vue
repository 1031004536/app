<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="handleAddProductCate()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="list"
        :load="load"
        :row-key="getRowKeys"
        v-loading="listLoading"
        border
        lazy
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCategoryId}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.productCategoryName}}</template>
        </el-table-column>
        <el-table-column label="商品图片"  align="center">
          <template slot-scope="scope">
            <img style="height: 80px;width:80px" :src="scope.row.pic" />
          </template>
        </el-table-column>
        <el-table-column label="级别" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="商品数量"  align="center">
          <template slot-scope="scope">{{scope.row.productCount }}</template>
        </el-table-column>

        <el-table-column label="是否显示"  align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序"  align="center">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleTransferProduct(scope.row.productCategoryId)">设置商品</el-button>
            <el-dialog
              title="关联商品"
              :visible.sync="dialogTableVisible"
              center
              :append-to-body="true"
              :lock-scroll="false"
              width="60%"
              @hidden="hiddenShow"
            >
              <relate :closeValue="productCategoryId"></relate>
            </el-dialog>
            <el-button size="mini" @click="setBrand(scope.row.productCategoryId)">设置品牌</el-button>
            <el-dialog
              title="关联商品"
              :visible.sync="dialogTableVisible1"
              center
              :append-to-body="true"
              :lock-scroll="false"
              width="60%"
            >
              <div>
                <el-card class="filter-container" shadow="never">
                  <div>
                    <i class="el-icon-search"></i>
                    <span>筛选搜索</span>
                    <el-button
                      style="float: right"
                      @click="searchBrandList()"
                      type="primary"
                      size="small"
                    >查询结果</el-button>
                  </div>
                  <div style="margin-top: 15px">
                    <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
                      <el-form-item label="输入搜索：">
                        <el-input
                          style="width: 203px"
                          v-model="listQuery.keyword"
                          placeholder="品牌名称/关键字"
                        ></el-input>
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
                    ref="brandTable"
                    :data="brandList"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border
                  >
                    <el-table-column type="selection" width="60" align="center"></el-table-column>
                    <el-table-column label="编号" width="100" align="center">
                      <template slot-scope="scope">{{scope.row.brandId}}</template>
                    </el-table-column>
                    <el-table-column label="品牌名称" align="center">
                      <template slot-scope="scope">{{scope.row.brandName}}</template>
                    </el-table-column>
                    <el-table-column label="品牌首字母" width="100" align="center">
                      <template slot-scope="scope">{{scope.row.firstLetter}}</template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="pagination-container" style="float:none;width:100%">
                  <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes,prev, pager, next,jumper"
                    :page-size="listQuery.pageSize"
                    :page-sizes="[5,10,15]"
                    :current-page.sync="listQuery.pageNum"
                    :total="total"
                    style="float:right"
                  ></el-pagination>
                </div>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { fetchList as brandFetchList } from "@/api/brand";
import Relate from "@/views/hs/projectClassification/relateProduct.vue";
import {
  fetchList,
  deleteProductCate,
  updateShowStatus,
  updateNavStatus
} from "@/api/productCate";

export default {
  name: "productCateList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 15
      },
      parentId: 0,
      brandList: null,
      productCategoryId: "",
      dialogTableVisible: false,
      dialogTableVisible1: false,
      multipleSelection: null
    };
  },
  components: {
    Relate
  },
  created() {
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route(route) {
      this.resetParentId();
      this.getList();
    }
  },
  methods: {
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddProductCate() {
      this.$router.push("/pms/productCate/add");
    },
    getList() {
      this.listLoading = true;
      fetchList(this.parentId, this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.list;
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].hasChildren = "true";
        }
        this.total = response.total;
      });
      brandFetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.brandList = response.list;
        this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize = response.pageSize;
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
    hiddenShow() {
      let that = this;
      that.dialogTableVisible = false;
    },
    handleShowStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.productCategoryId);
      data.append("ids", ids);
      data.append("showStatus", row.showStatus);
      updateShowStatus(data).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    getRowKeys(row) {
      return row.productCategoryId;
    },
    load(tree, treeNode, resolve) {
      fetchList(tree.productCategoryId, this.listQuery).then(response => {
        resolve(response.list);
      });
    },
    handleShowNextLevel(index, row) {
      this.$router.push({
        path: "/pms/productCate/index",
        query: { parentId: row.productCategoryId }
      });
    },
    handleTransferProduct(index) {
      this.dialogTableVisible = true;
      this.productCategoryId = index;
    },
    handleUpdate(index, row) {
      this.$router.push({
        path: "/pms/productCate/update",
        query: { id: row.productCategoryId }
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProductCate(row.productCategoryId).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    setBrand() {
      this.dialogTableVisible1 = true;
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
          this.dialogTableVisible1 = false;
        });
      });
    }
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "一级";
      } else if (value === 1) {
        return "二级";
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style >
.el-table tbody tr:hover>td {
    background-color: #ecf5ff!important;
}
.el-table__row--level-1 {
  background: #F5F7FA !important;
}
</style>
