<template>
  <div class="app-container" :key="menuKey">
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
          <template slot-scope="scope">{{scope.row.recommendCategoryId}}</template>
        </el-table-column>
        <el-table-column label="类目名称" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column label="图标" align="center">
          <template slot-scope="scope">
            <el-image style="height: 80px;width:80px" :src="scope.row.icon" ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="关键字" align="center">
          <template slot-scope="scope">{{scope.row.keyword}}</template>
        </el-table-column>
        <el-table-column label="链接" align="center">
          <template slot-scope="scope">{{scope.row.url}}</template>
        </el-table-column>

        <el-table-column label="是否推荐" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.row.recommendCategoryId, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleTransferProduct(scope.row.recommendCategoryId)"
            >设置商品</el-button>
            <el-dialog
              title="关联商品"
              :visible.sync="dialogTableVisible"
              center
              :append-to-body="true"
              :lock-scroll="false"
              width="70%"
            >
              <div>
                <el-select v-model="value" @change="checked(this.relateId)" placeholder="请选择">
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
                <el-button type="info" @click="handleSearchList()">查询</el-button>
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
                      <el-image style="height: 80px" :src="scope.row.pic"></el-image>
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
            <el-button size="mini" @click="setBrand(scope.row.recommendCategoryId)">设置品牌</el-button>
            <el-dialog
              title="关联品牌"
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
                    style="float:left"
                  ></el-pagination>
                  <el-button
                    style="height:28px;float:right"
                    class="search-button"
                    @click="handleBatchOperate(relateId)"
                    type="primary"
                    size="small"
                  >确定</el-button>
                </div>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row.recommendCategoryId, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.recommendCategoryId, scope.row)">删除</el-button>
            <el-button
              size="mini"
              @click="addChildren(scope.row.recommendCategoryId, scope.row)"
            >添加子菜单</el-button>
            <el-button
              size="mini"
              @click="checkNext(scope.row.recommendCategoryId)"
              v-if="scope.row.parentId != 0"
            >查看下级菜单</el-button>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" style="text-algin:center">
      <el-card class="operate-container" shadow="never">
        <el-form :model="add" ref="addFrom" label-position="right" label-width="auto">
          <el-form-item label="类目名称" prop="title">
            <el-input v-model="add.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="关键字" prop="type">
            <el-input v-model="add.keyword"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="name">
            <single-upload v-model="add.icon"></single-upload>
          </el-form-item>
          <el-form-item label="链接" prop="url">
            <el-input v-model="add.url"></el-input>
          </el-form-item>
          <el-form-item label="是否推荐" prop="hide">
            <el-switch v-model="add.status" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('addFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="三级菜单"
      :visible.sync="dialogTableVisible2"
      style="text-algin:center;"
      width="70%"
    >
      <el-table style="width: 100%" :data="finallList" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.recommendCategoryId}}</template>
        </el-table-column>
        <el-table-column label="类目名称" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column label="图标" align="center">
          <template slot-scope="scope">
            <el-image style="height: 80px;width:80px" :src="scope.row.icon"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="关键字" align="center">
          <template slot-scope="scope">{{scope.row.keyword}}</template>
        </el-table-column>
        <el-table-column label="链接" align="center">
          <template slot-scope="scope">{{scope.row.url}}</template>
        </el-table-column>

        <el-table-column label="是否推荐" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.row.recommendCategoryId, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="设置" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleTransferProduct(scope.row.recommendCategoryId)"
            >设置商品</el-button>
            <el-button size="mini" @click="setBrand(scope.row.recommendCategoryId)">设置品牌</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row.recommendCategoryId, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.recommendCategoryId, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/product";
import { fetchListWithChildren } from "@/api/productCate";
import { relation, checking } from "@/api/hs";
import { get, post, del } from "@/api/util";
import { fetchList as brandFetchList } from "@/api/brand";
import SingleUpload from "@/components/Upload/singleUpload";
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
  name: "productCateList",
  data() {
    return {
      list: null,
      total: null,
      value: null,
      listLoading: true,
      title: null,
      listQuery: {
        pageNum_: 1,
        pageSize_: 10,
        parentId: 0
      },
      parentId: 0,
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
      brandList: null,
      recommendCategoryId: "",
      dialogTableVisible: false,
      productList: "",
      multipleSelectionProduct: "",
      productQuery: Object.assign({}, defaultListQuery),
      relateId: null,
      menuKey: 1,
      selectProductCateValue: null,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      multipleSelection: null,
      dialogFormVisible: false,
      finallList: null,
      add: {
        categoryName: null,
        keyword: null,
        icon: null,
        url: "",
        status: 1,
        parentId: 0
      }
    };
  },
  components: {
    SingleUpload
  },
  created() {
    this.getList();
    this.getProductList();
    this.getBrand();
  },
  watch: {
    $route(route) {
      this.getList();
    },
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length == 2) {
        this.productQuery.productCategoryId = newValue[1];
      } else {
        this.productQuery.productCategoryId = null;
      }
    }
  },
  methods: {
    handleAddProductCate() {
      this.dialogFormVisible = true;
      this.add = {};
      this.add.parentId = 0;
      this.title = "添加";
      this.listQuery.parentId = 0;
    },
    handleProductChange(val) {
      this.multipleSelectionProduct = val;
    },
    addChildren(index, row) {
      this.dialogFormVisible = true;
      this.add = {};
      this.add.parentId = index;
      this.listQuery.parentId = 0;
      this.title = "添加子菜单";
    },
    getProductList() {
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
    getList() {
      this.listLoading = true;
      get("/recommendCategory/recommendCategoryList", this.listQuery).then(
        response => {
          this.listLoading = false;
          this.list = response.list;
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].hasChildren = "true";
          }
          this.total = response.total;
        }
      );
    },
    getBrand() {
      brandFetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.brandList = response.list;
        this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize = response.pageSize;
      });
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
    handleShowStatusChange(index, row) {
      this.add.recommendCategoryId = row.recommendCategoryId;
      post("/recommendCategory/addOrUpdateRecommendCategory", row).then(
        response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
        }
      );
    },
    getRowKeys(row) {
      return row.recommendCategoryId;
    },
    load(tree, treeNode, resolve) {
      this.listQuery.parentId = tree.recommendCategoryId;
      get("/recommendCategory/recommendCategoryList", this.listQuery).then(
        response => {
          resolve(response.list);
          this.listQuery.parentId = 0;
        }
      );
    },
    handleTransferProduct(index) {
      this.dialogTableVisible = true;
      this.relateId = index;
      get("/recommendCategory/bindingProductView", {
        recommendCategoryId: index
      }).then(response => {
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
    checked(index) {
      if (this.value == "已选择") {
        checking(index).then(response => {
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
    handleUpdate(index, row) {
      this.dialogFormVisible = true;
      this.add = Object.assign({}, row);
      this.add.recommendCategoryId = row.recommendCategoryId;
      this.title = "编辑";
    },
    handleDelete(index, row) {
      this.listQuery.parentId = 0;
      this.$confirm("是否要删除该类目", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        del(
          "/recommendCategory/deleteRecommendCategory",
          row.recommendCategoryId
        ).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
        });
        if (row.parentId == 0) {
          this.getList();
        } else {
          ++this.menuKey;
        }
        this.dialogTableVisible2 = false;
      });
    },
    setBrand(index) {
      this.dialogTableVisible1 = true;
      this.relateId = index;
      get("/recommendCategory/bindingBrandView", {
        recommendCategoryId: index
      }).then(response => {
        response.forEach(item1 => {
          this.brandList.forEach(item2 => {
            if (item1.brandId == item2.brandId) {
              this.$refs.brandTable.toggleRowSelection(item2, true);
            }
          });
        });
      });

      this.$nextTick(() => {
        this.$refs.brandTable.clearSelection();
      });
    },
    handleSelectionChange(val) {
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
                brandId: item.brandId,
                brandName: item.brandName,
                firstLetter: item.firstLetter,
                recommendCategoryId: this.relateId
              }
            )
          );
        });
        post("/recommendCategory/bindingBrand", ids).then(response => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.dialogTableVisible1 = false;
        });
      });
    },
     handleSearchList() {
      this.listQuery.pageNum_ = 1;
      this.getList();
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
                recommendCategoryId: this.relateId
              }
            )
          );
        });
        post("/recommendCategory/bindingProduct", ids).then(response => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.dialogTableVisible = false;
        });
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            post(
              "/recommendCategory/addOrUpdateRecommendCategory",
              this.add
            ).then(response => {
              this.$refs[formName].resetFields();
              this.$message({
                message: "提交成功",
                type: "success",
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.dialogTableVisible2 = false;
              if (this.add.parentId == 0) {
                this.getList();
              } else {
                ++this.menuKey;
              }
            });
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
    },
    getProductOptions() {
      fetchListWithChildren().then(response => {
        this.options = response;
      });
    },
    checkNext(index) {
      this.dialogTableVisible2 = true;
      this.listQuery.parentId = index;
      get("/recommendCategory/recommendCategoryList", this.listQuery).then(
        response => {
          this.finallList = response.list;
        }
      );
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

<style scoped>
</style>
