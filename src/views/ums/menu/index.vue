<template>
  <div class="app-container" :key="menuKey">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addBrand(id)" size="mini">添加</el-button>
      <el-dialog title="添加" :visible.sync="dialogFormVisible" style="text-algin:center">
        <el-card class="operate-container" shadow="never">
          <el-form :model="add" ref="addFrom" label-position="right" label-width="auto">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="add.title" placeholder="小于等于6个字"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="type">
              <el-select v-model="add.type" placeholder="请选择分类">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件名" prop="name">
              <el-input v-model="add.name" placeholder="小于等于6个字"></el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="url">
              <el-input v-model="add.path" placeholder="小于等于6个字"></el-input>
            </el-form-item>
            <el-form-item label="icon" prop="url">
              <el-input v-model="add.icon"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="add.sort" placeholder="请输入大于等于0的正整数"></el-input>
            </el-form-item>
            <el-form-item label="是否缓存" prop="hide">
              <el-switch v-model="add.keepalive" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
            <el-form-item label="不显示" prop="hide">
              <el-switch v-model="add.hidden" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('addFrom')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <div class="table-container">
      <!-- <el-table-column type="selection"  align="center"></el-table-column> -->
      <el-table
        v-loading="listLoading"
        :data="list"
        ref="userTable"
        style="width: 100%;margin-bottom: 20px;"
        :row-key="getRowKeys"
        :load="load"
        border
        lazy
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="菜单名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <!-- <el-table-column label="分类图标" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>-->
        <el-table-column label="文件名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="icon" align="center">
          <template slot-scope="scope">{{scope.row.icon}}</template>
        </el-table-column>
        <el-table-column label="是否缓存" align="center">
          <template slot-scope="scope">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.keepalive"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="不显示" align="center">
          <template slot-scope="scope">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.hidden"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="路由跳转" align="center">
          <template slot-scope="scope">{{scope.row.path}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row.permissionId, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.permissionId, scope.row)"
            >删除</el-button>
            <el-button class="btn-add" @click="addBrand(scope.row.permissionId)" size="mini">添加子菜单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { fetchList, port, portParam } from "@/api/common";
const defaultcompany = {
  keepalive: "1",
  title: null,
  sort: null,
  name: "",
  path: null,
  type: null,
  parentId: 0,
  hidden: null,
  icon: ""
};
export default {
  name: "menuList",
  data() {
    return {
      listLoading: true,
      isEdit: false,
      list: "",
      menuKey: 1,
      add: Object.assign({}, defaultcompany),
      dialogFormVisible: false,
      options: [
        {
          value: "0",
          label: "目录"
        },
        {
          value: "1",
          label: "菜单"
        },
        {
          value: "2",
          label: "按钮"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList().then(response => {
        console.log(response);
        this.listLoading = false;
        this.list = response;
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].hasChildren = "true";
        }
      });
    },
    load(tree, treeNode, resolve) {
      resolve(tree.children);
    },
    handleUpdate(index, row) {
      this.dialogFormVisible = true;
      this.isEdit = true;
      this.add = Object.assign({}, row);
      this.add.permissionId = index;
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        port(
          "permission/deletePermission?ids=" + row.permissionId,
          "post"
        ).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          if (row.parentId == 0) {
            this.getList();
          } else {
            ++this.menuKey;
          }
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
              portParam(
                "/permission/addOrUpdatePermission",
                this.add,
                "post"
              ).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000
                });
                this.dialogFormVisible = false;
                if (this.add.parentId == 0) {
                  this.getList();
                } else {
                  ++this.menuKey;
                }
              });
            } else {
              portParam(
                "/permission/addOrUpdatePermission",
                this.add,
                "post"
              ).then(response => {
                this.$refs[formName].resetFields();
                this.add = Object.assign({}, defaultcompany);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
              });
              this.dialogFormVisible = false;
              if (this.add.parentId == 0) {
                this.getList();
              } else {
                ++this.menuKey;
              }
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
    getRowKeys(row) {
      return row.permissionId;
    },
    addBrand(id) {
      this.add = Object.assign({}, defaultcompany);
      this.dialogFormVisible = true;
      this.isEdit = false;
      if (id) {
        this.add.parentId = id;
      } else {
        this.add.parentId = 0;
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
