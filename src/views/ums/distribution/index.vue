<template>
  <div class="app-container">
    <el-card class="filter-container">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form size="small" label-width="200px">
          <el-form-item label="输入查询：">
            <el-input class="input-width" placeholder="搜索物流公司名称或编号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" type="text" @click="handleAdd">添加物流信息</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="distributionTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="序号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.logisticsId}}</template>
        </el-table-column>
        <el-table-column label="物流公司" align="center">
          <template slot-scope="scope">{{scope.row.logisticsName}}</template>
        </el-table-column>
        <el-table-column label="物流公司Logo" align="center" width="120">
          <template slot-scope="scope">
           <img :src="scope.row.logo" style="width:80px;height:80px" />
          </template>
        </el-table-column>
        <el-table-column label="物流编号" align="center">
          <template slot-scope="scope">{{scope.row.logisticsNo}}</template>
        </el-table-column>>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">运费模板</el-button>
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
        :page-size="listQuery.pageSize_"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum_"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="title" :visible.sync="dialogVisible" width="70%" >
      <el-card class="operate-container" shadow="never">
        <el-form label-position="right" label-width="auto" :model="add" ref="addFrom">
          <el-form-item label="物流公司名称">
            <el-input placeholder="请输入物流公司名称" v-model="add.logisticsName"></el-input>
          </el-form-item>
          <el-form-item label="物流公司编号">
            <el-input placeholder="请输入物流公司编号" v-model="add.logisticsNo"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input placeholder="请输入联系电话" v-model="add.phone"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input placeholder="序号越小越靠前" v-model="add.sort"></el-input>
          </el-form-item>
          <el-form-item label="物流公司logo">
            <single-upload v-model="add.logo"></single-upload>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('addFrom')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SingleUpload from "@/components/Upload/singleUpload";
import { post, get, del } from "@/api/util";
const defaultdistribution = {
  logo: null,
  logisticsName: null,
  logisticsNo: null,
  phone: "",
  status: true,
  sort:null,
};
export default {
  data() {
    return {
      dialogVisible: false,
      listQuery: {
        pageNum_: 1,
        pageSize_: 10
      },
      listLoading: true,
      list: null,
      total: null,
      add:Object.assign({}, defaultdistribution),
      title:null,
    };
  },
  created() {
    this.getList();
  },
  components: { SingleUpload },
  methods: {
    getList() {
      this.listLoading = true;
      get("/logistics/logisticsList", this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.list;
        this.total = response.total;
      });
    },
    handleAdd() {
      this.dialogVisible = true;
       this.add = Object.assign({}, defaultdistribution);
      this.title = "添加";
    },
      handleUpdate(index, row) {
      this.dialogVisible = true;
      this.add = Object.assign({}, row);
      this.add.logisticsId = row.logisticsId;
      this.title = "编辑";
    },
    handleDelete(index,row){
       this.$confirm("是否要删除该类目", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      del("/logistics/deleteLogistics",row.logisticsId).then(res=>{
        this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
      })
      })
    },
    handleShowStatusChange(index,row){
       this.add.logisticsId = row.logisticsId;
      post("/logistics/addOrUpdateLogistics", row).then(
        response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
        }
      );
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
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            post(
              "/logistics/addOrUpdateLogistics",
              this.add
            ).then(response => {
              this.$refs[formName].resetFields();
              this.$message({
                message: "提交成功",
                type: "success",
                duration: 1000
              });
              this.dialogVisible = false;
              this.getList();
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
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
