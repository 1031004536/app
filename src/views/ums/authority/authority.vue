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
      <el-button class="btn-add" @click="addBrand()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="authorityTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" align="center" type="index" width="50"></el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="菜单/权限" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.roleId == 1">全部</div>
            <div v-for="(item,index) in scope.row.permissionList" :key="index">{{item.title}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :id="scope.row.roleId"
              @click="handleUpdate(scope.row.roleId, scope.row)"
               v-if="scope.row.roleId!= 1"
            >设置权限</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.roleId, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
              @change="handleChange(scope.row)"
            ></el-switch>
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
    <el-dialog
      title="设置权限"
      :visible.sync="dialogTableVisible"
    >
      <el-tree
        :data="treeList"
        show-checkbox
        default-expand-all
        node-key="permissionId"
        :default-checked-keys='treeData'
        ref="tree"
        highlight-current
          @check-change="handleCheckChange"
        :props="defaultProps"
      ></el-tree>
      <el-button type="primary" @click="addIds(ids)">确 定</el-button>
    </el-dialog>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" style="text-algin:center">
      <el-card class="form-container" shadow="never" style="position:relative;width:100%">
        <el-form :model="authority" ref="companyFrom" label-width="150px">
          <el-form-item label="角色：" prop="name">
            <el-input v-model="authority.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="type">
            <el-input v-model="authority.description" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('companyFrom')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { authorityList, deleterole, createrole } from "@/api/authority";
import { port, portParam } from "@/api/common";
const defaultcompany = {
  roleName: "",
  description: ""
};
export default {
  name: "authorityList",
  data() {
    return {

      listQuery: {
        keyword: null,
        pageNum_: 1,
        pageSize_: 10
      },
      list: null,
      authority: Object.assign({}, defaultcompany),
      total: null,
      listLoading: true,
      multipleSelection: [],
      dialogFormVisible: false,
      dialogTableVisible:false,
      roleId:null,
      isEdit: false,
       defaultProps: {
          children: 'children',
          label: 'title'
        },
        treeList:null,
        treeData:[],
        ids:[]
    };
  },
  created() {
    this.getList();
    if (this.isEdit) {
      getCompany(this.$route.query.companyId).then(response => {
        this.authority = response.data;
      });
    } else {
      this.authority = Object.assign({}, defaultcompany);
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      authorityList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.list;
      });
      portParam('/permission/permissionTreeList','get').then(response=>{
        this.treeList = response
      })
    },
    handleUpdate(index, row) {
      let arr =[];
      for(let i in row.permissionList){
        arr.push(row.permissionList[i].permissionId)
      };
      this.dialogTableVisible = true;
      this.roleId = index;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(arr)
      })
    },
    handleChange(data) {
      portParam("/role/addOrUpdateRole", data, "post").then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleterole(row.roleId).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
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
            if (this.isEdit) {
              updatecompany(this.$route.query.companyId, this.authority).then(
                response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000
                  });
                }
              );
            } else {
              createrole(this.authority).then(response => {
                this.$refs[formName].resetFields();
                this.authority = Object.assign({}, defaultcompany);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.dialogFormVisible = false;
                this.getList();
              });
            }
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
    addIds(ids){
       this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            port("/role/settingRoleMenuPermission?roleId="+this.roleId+"&menuIds="+this.ids, "post").then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
        this.dialogTableVisible = false;
        this.getList()
      }); 
          }) 
    },
    handleSizeChange(val) {
      this.listQuery.pageNum_ = 1;
      this.listQuery.pageSize_ = val;
      this.getList();
    },

 handleCheckChange () {
      let res = this.$refs.tree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        arr.push(item.permissionId)
      })
      this.ids =Array.from(new Set(arr)).concat(this.$refs.tree.getHalfCheckedKeys())
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum_ = val;
      this.getList();
    },
    searchBrandList() {
      this.listQuery.pageNum_ = 1;
      this.getList();
    },

    addBrand() {
      this.dialogFormVisible = true;
      this.isEdit = false;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
