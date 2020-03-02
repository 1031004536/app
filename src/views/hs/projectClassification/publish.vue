<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="searchBrandList()" type="primary" size="small">查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="公司名称/关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addBrand(id)" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <!-- <el-table-column type="selection"  align="center"></el-table-column> -->
      <el-table
        v-loading="listLoading"
        :data="list"
        :load="load"
        ref="userTable"
        style="width: 100%;margin-bottom: 20px;"
        :row-key = 'getRowKeys'
        :expand-row-keys="expands"
         @row-click="expandChange"
        border
        lazy
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="编号" align="center" type="index"></el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">{{scope.row.subjectName}}</template>
        </el-table-column>
        <!-- <el-table-column label="分类图标" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>-->
        <el-table-column label="级别" align="center">
          <template slot-scope="scope">{{scope.row.level}}</template>
        </el-table-column>
        <el-table-column label="商品数量" align="center">
          <template slot-scope="scope">{{scope.row.productNum}}</template>
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
        <el-table-column label="设置" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="setProduct(scope.row.subjectId)"
            >设置商品</el-button>
            <el-dialog
              title="关联商品"
              :visible.sync="dialogTableVisible"
              center
              :append-to-body="true"
              :lock-scroll="false"
              width="60%"
            >
              <relate  :closeValue = subjectId></relate>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row.subjectId, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.subjectId, scope.row)"
            >删除</el-button>
             <el-button class="btn-add" @click="addBrand(scope.row.subjectId)" size="mini">添加</el-button>
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
  </div>
</template>
<script>
import Relate from '@/views/hs/projectClassification/relateProduct.vue'
import { publish, dele, updatehs, geths } from "@/api/hs";
export default {
  name: "brandList",
  data() {
    return {
      dialogTableVisible: false,
      operateType: null,
      hide: false,
      subjectId:'',
      phoneNumber: "",
      listQuery: {
        keyword: null,
        pageNum_: 1,
        pageSize_: 10
      },
      list: [],
      pull:null,
      total: null,
      listLoading: true,
      multipleSelection: [],
      id: this.$route.query.id,
      expands:[]
    };
  },
  components: {
      Relate
    },
  created() {
    this.getList();
  },
  methods: {
    load(tree, treeNode, resolve) {
      publish(this.listQuery,tree.subjectId).then(response => {
       resolve(response.list);
      });
        
    },
    getList() {
      this.listLoading = true;
      publish(this.listQuery, this.$route.query.id).then(response => {
        console.log(response);
        this.listLoading = false;
        this.list = response.list;
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].hasChildren = "true";
        }
        this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize_ = response.pageSize_;
      });
      
    },
    handleUpdate(index, row) {
      this.$router.push({
        path: "/hs/projectClassification/updatepublish",
        query: { id: row.subjectId }
      });
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    setProduct(id) {
      this.dialogTableVisible = true;
      this.subjectId = id
    },
    expandChange(){
      console.log(getRowKeys)
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该用户", "提示", {
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
    handleSizeChange(val) {
      this.listQuery.pageNum_ = 1;
      this.listQuery.pageSize_ = val;
      this.getList();
    },
    handleExpendRow(id){
      alert(1)
        publish(id).then(response => {
        console.log(response);
        this.listLoading = false;
        this.pull = response.list;
      });
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum_ = val;
      this.getList();
    },
     getRowKeys(row) {
       return row.subjectId
     },
    searchBrandList() {
      this.listQuery.pageNum_ = 1;
      this.getList();
    },

    addBrand(id) {
      this.$router.push({ path: "/hs/projectClassification/addpublish", query: { id: id } });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
