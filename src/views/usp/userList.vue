<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchBrandList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="手机号：">
              <el-input style="width: 203px" v-model="listQuery.phone" placeholder="手机号搜索"></el-input>
            </el-form-item>
            <el-form-item label="注册时间：">
            <el-date-picker
              v-model="time"
              unlink-panels
               value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
            <el-form-item label="会员id：">
              <el-input style="width: 203px" v-model="listQuery.memberId" placeholder="会员id搜索"></el-input>
            </el-form-item>
            <el-form-item label="用户来源：">
              <el-input style="width: 203px" v-model="listQuery.sourceType" placeholder="用户来源搜索"></el-input>
            </el-form-item>
            <el-form-item label="帐号启用状态：">
              <el-input style="width: 203px" v-model="listQuery.status" placeholder="帐号启用状态搜索"></el-input>
            </el-form-item>
            <el-form-item label="消费金额区间段：">
              <el-input style="width: 203px" v-model="listQuery.beforeMoney" placeholder=""></el-input>—
              <el-input style="width: 203px" v-model="listQuery.afterMoney" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addBrand()"
        size="mini">
        导出
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="userTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection"  align="center"></el-table-column>
        <el-table-column label="ID"  align="center">
          <template slot-scope="scope">{{scope.row.memberId}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="订单数量" align="center">
          <template slot-scope="scope">{{scope.row.orderCount}}</template>
        </el-table-column>
        <el-table-column label="消费金额" align="center">
          <template slot-scope="scope">{{scope.row.money}}</template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
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
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
              <el-button
              size="mini"
              @click="check(scope.row.adminId, scope.row)">查看
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.row.adminId, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.adminId, scope.row)">删除
            </el-button>
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {port,portParam} from '@/api/common'
  export default {
    name: 'brandList',
    data() {
      return {
        operateType: null,
        hide:false,
        time:null,
        phoneNumber:'',
        listQuery: {
          phone: null,
          pageNum_: 1,
          pageSize_: 10,
          startTime: null,
          endTime: null,
          memberId: null,
          sourceType: null,
          status: null,
          beforeMoney: null,
          afterMoney: null,
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        portParam('/member/memberList',this.listQuery,'post').then(response => {
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
      check(index,row){
       this.$router.push({path: '/usp/detail',query: {id: row.memberId,activeName:'first'}})
      },
      handleUpdate(index,row) {
        this.$router.push({path: '/usp/detail',query: {id: row.memberId,activeName:'second'}})
      },
      handleChange(data) {
      portParam("/member/updateMember", data, "post").then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
      handleDelete(index, row) {
        this.$confirm('是否要删除该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteuser(row.adminId).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
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
      searchBrandList() {
        if (this.time) {
        this.listQuery.startTime = this.time[0];
        this.listQuery.endTime = this.time[1];
      }
        this.listQuery.pageNum = 1;
        this.getList();
      },
     
      addBrand() {
       
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
