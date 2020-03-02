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
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="公司名称/关键字"></el-input>
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
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="selection"  align="center"></el-table-column>
        <el-table-column label="编号"  align="center"  type="index">
        </el-table-column>
        <el-table-column label="名称"  align="center">
          <template slot-scope="scope">{{scope.row.showName}}</template>
        </el-table-column>
         <el-table-column label="上下架时间"  align="center">
          <template slot-scope="scope">
              <p><span>上架时间：</span>{{scope.row.upTime | formatDate }}</p>
              <p><span>下架时间：</span>{{scope.row.downTime  | formatDate }}</p>
              </template>
        </el-table-column>
        <el-table-column label="当前状态" align="center">
          <template slot-scope="scope">  <el-switch
                :active-value="true"
                :inactive-value="false"
                v-model="scope.row.status"
                disabled>
              </el-switch></template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.row.homeShowId, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.homeShowId, scope.row)">删除
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
        :page-size="listQuery.pageSize_"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum_"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date'
  import {homeShowList,addHomeShowList,delHomeShowList} from '@/api/hs'
  export default {
    name: 'brandList',

    data() {
      return {
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum_: 1,
          pageSize_: 10
        },
        list: null,
        total: null,
        listLoading: true,
      }
    },
    created() {
      this.getList();
    },
     filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');  // 此处可根据自己的需要自定义想要的日期格式
        }
    },
    methods: {
      getList() {
        this.listLoading = true;
        homeShowList(this.listQuery).then(response => {
          console.log(response)
          this.listLoading = false;
          this.list = response.list;
          this.total = response.total;
          this.totalPage = response.totalPage;
          this.pageSize_ = response.pageSize_;
        });
      },
      handleUpdate(index,row) {
        this.$router.push({path: '/hs/home/updateHomeShow',query: {id: row.homeShowId}})
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该专题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.homeShowId);
          delHomeShowList(ids).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
            this.ids = ''
          });
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
      searchBrandList() {
        this.listQuery.pageNum_ = 1;
        this.getList();
      },
     
      addBrand() {
        this.$router.push({name: 'addHomeShow'})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
