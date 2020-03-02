<template>
  <div class="app-container">
    <el-card class="filter-container">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right"  @click="searchBrandList()">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form size="small" label-width="200px">
          <el-form-item label="输入查询：">
            <el-input class="input-width" placeholder="输入关键字" v-model="listQuery.keyword"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" type="text" @click="add">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list" ref="h5Table" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="60" align="center" type="index"></el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="内容" align="center" width="120">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">{{scope.row.modifyTime}}</template>
        </el-table-column>>
        <el-table-column label="发布人员" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.status"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="路径" align="center">
          <template slot-scope="scope">{{scope.row.path}}</template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDele(scope.row)">删除</el-button>
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
    <!-- 弹出框 -->
    <el-dialog title= title :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="页面内容">
           <tinymce :width="595" :height="300" v-model="form.content"></tinymce>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
              :active-value="true"
              :inactive-value="false"
              v-model="form.status"
            ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
import { get, post, del } from "@/api/util";
export default {
    
  data() {
    return {
      dialogVisible: false,
      form: {
        title: "",
        content: "",
        status: false,
        path: "",
        webPageId:null,
      },
      title:null,
      listQuery: {
        keyword: null,
        pageNum_: 1,
        pageSize_: 10
      },
      list: null,
      total: null,
      listLoading: true
    };
  },
  components: {
    Tinymce
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = false;
      get("/webPage/webPageList",this.listQuery).then(res => {
        this.listLoading = true;
        this.listLoading = false;
        this.list = res.list;
        this.total = res.total;
        this.totalPage = res.totalPage;
        this.pageSize_ = res.pageSize_;
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
    handleUpdate(row){
     this.form.webPageId = row.webPageId;
     this.form = row;
     this.dialogVisible =true;
     this.isEdit = true;
    },
     searchBrandList() {
        this.listQuery.pageNum_ = 1;
        this.getList();
      },
      add(){
        console.log(this.form)
        this.dialogVisible =true;
        this.title = '添加'; 
        this.isEdit = false;
        this.form = {};
      },
      handleDele(row){
        this.$confirm("是否删除", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
             post('/webPage/deleteWebPage?webPageId='+row.webPageId).then(res =>{
                this.$message({
                  message: "删除成功",
                  type: "success",
                  duration: 1000
                });
                this.getList()
             }) 
          })
      },
      onSubmit() {
        if (this.form) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.isEdit) {
               post('/webPage/addOrUpdateWebPage',this.form).then(res=>{
                 this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.getList()
                this.dialogVisible =false
              })
            } else {
              post('/webPage/addOrUpdateWebPage',this.form).then(res=>{
                 this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.getList()
                this.dialogVisible =false
              })
            }
          });
        } else {
          this.$message({
            message: "请填写数据",
            type: "error",
            duration: 1000
          });
          return false;
        }
    },
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
