<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="用户详情" name="first">
      <el-card>
        <el-tag>基本信息</el-tag>
        <table
          style="width:100%;margin-top:20px;margin-bottom:20px;border:1px solid #EBEEF5"
          border="1"
          cellpadding="0"
          cellspacing="0"
        >
          <tr>
            <td rowspan="5" style="width:20%;">
              <div
                style="width:100%;display:flex;align-items: center;justify-content: space-around;"
              >
                <img :src="list.icon" alt />
                <p>{{list.nickName}}</p>
                <p>{{list.memberType}}</p>
              </div>
            </td>
            <td style="width:12%;text-align:right">ID</td>
            <td style="width:28%;text-align:left">{{list.memberId}}</td>
            <td style="width:12%;text-align:right">职业</td>
            <td style="width:28%;text-align:left">{{list.job}}</td>
          </tr>
          <tr>
            <td>手机号码</td>
            <td>{{list.phone}}</td>
            <td>个性签名</td>
            <td>{{list.personalizedSignature}}</td>
          </tr>
          <tr>
            <td>性别</td>
            <td>{{list.gender}}</td>
            <td>昵称</td>
            <td>{{list.nickName}}</td>
          </tr>
          <tr>
            <td>生日</td>
            <td>{{list.birthday}}</td>
            <td>注册时间</td>
            <td>{{list.createTime}}</td>
          </tr>
          <tr>
            <td>城市</td>
            <td>{{list.city}}</td>
            <td>用户来源</td>
            <td>{{list.sourceType}}</td>
          </tr>
        </table>
        <el-tag style="margin-bottom:20px">统计信息</el-tag>
        <el-table
          ref="userTable"
          :data="listarr"
          style="width: 100%"
          v-loading="listLoading"
          border
        >
          <el-table-column label="消费金额" align="center">
            <template slot-scope="scope">{{scope.row.money}}</template>
          </el-table-column>
          <el-table-column label="订单数量" align="center">
            <template slot-scope="scope">{{scope.row.orderCount}}</template>
          </el-table-column>
          <el-table-column label="可用余额" align="center">
            <template slot-scope="scope">{{scope.row.balance}}</template>
          </el-table-column>
          <el-table-column label="优惠卷（张）" align="center">
            <template slot-scope="scope">{{scope.row.coupon}}</template>
          </el-table-column>
          <el-table-column label="商品评价" align="center">
            <template slot-scope="scope">{{scope.row.productReview}}</template>
          </el-table-column>
          <el-table-column label="退货记录" align="center">
            <template slot-scope="scope">{{scope.row.returnRecord}}</template>
          </el-table-column>
          <el-table-column label="登录次数" align="center">
            <template slot-scope="scope">{{scope.row.loginCount}}</template>
          </el-table-column>
        </el-table>
        <el-table
          ref="userTable"
          :data="listarr"
          style="width: 100%"
          v-loading="listLoading"
          border
        >
          <el-table-column label="关注" align="center">
            <template slot-scope="scope">{{scope.row.attentionCount}}</template>
          </el-table-column>
          <el-table-column label="粉丝" align="center">
            <template slot-scope="scope">{{scope.row.fansCount}}</template>
          </el-table-column>
          <el-table-column label="收藏商品" align="center">
            <template slot-scope="scope">{{scope.row.favoriteProduct}}</template>
          </el-table-column>
          <el-table-column label="收藏店铺" align="center">
            <template slot-scope="scope">{{scope.row.favoriteCompany}}</template>
          </el-table-column>
          <el-table-column label="收藏企业" align="center">
            <template slot-scope="scope">{{scope.row.favoriteEnterprise}}</template>
          </el-table-column>
          <el-table-column label="邀请好友" align="center">
            <template slot-scope="scope">{{scope.row.inviteFriends}}</template>
          </el-table-column>
          <el-table-column label="剩余抽奖次数" align="center">
            <template slot-scope="scope">{{scope.row.lotteryCount}}</template>
          </el-table-column>
        </el-table>
        <el-tag style="margin-bottom:20px;margin-top:20px;">统计信息</el-tag>
        <el-table
          ref="userTable"
          :data="list.addressList"
          style="width: 100%;border-top:0"
          v-loading="listLoading"
          border
        >
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">{{scope.row.receiver}}</template>
          </el-table-column>
          <el-table-column label="手机号码" align="center">
            <template slot-scope="scope">{{scope.row.phoneNumber}}</template>
          </el-table-column>
          <el-table-column label="详细地址" align="center">
            <template slot-scope="scope">{{scope.row.detailAddress}}</template>
          </el-table-column>
          <el-table-column label="邮政编码" align="center">
            <template slot-scope="scope">{{scope.row.favoriteCompany}}</template>
          </el-table-column>
          <el-table-column label="默认地址" align="center">
            <template slot-scope="scope">
              <el-switch
                disabled
                :active-value="true"
                :inactive-value="false"
                v-model="scope.row.defaultStatus"
                @change="handleChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="编辑资料" name="second">
      <el-card>
        <el-form :model="list" ref="userFrom" label-width="150px">
          <el-form-item label="手机号：" prop="name">
            <el-input v-model="list.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="用户类型：" prop="name">
            <el-select v-model="list.memberType" placeholder="请选择用户分类">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别：" prop="type">
            <el-select v-model="list.gender" placeholder="请选择性别">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日：" prop="name">
            <el-date-picker v-model="list.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
            <el-form-item label="所在城市：" prop="name">
            <el-input v-model="list.city" placeholder="请输入手机号"></el-input>
          </el-form-item>
            <el-form-item label="职业：" prop="name">
            <el-input v-model="list.job" placeholder="请输入手机号"></el-input>
          </el-form-item>
            <el-form-item label="个性签名：" prop="name">
            <el-input v-model="list.personalizedSignature" placeholder="请输入手机号"></el-input>
          </el-form-item>
            <el-form-item label="启用状态：" prop="name">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="list.status"
              @change="handleChange(scope.row)"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('userFrom')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="登录日志" name="third">
         <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="userTable"
                :data="log"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="时间"  align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="IP" align="center">
          <template slot-scope="scope">{{scope.row.ip}}</template>
        </el-table-column>
        <el-table-column label="地区" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="登录方式" align="center">
          <template slot-scope="scope">{{scope.row.sourceType | formatType}}</template>
        </el-table-column>
      </el-table>
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
    </el-tab-pane>
  </el-tabs>
</template> 
<script>
import { port, portParam } from "@/api/common";
export default {
  data() {
    return {
      activeName: null,
      log:null,
      list: null,
      listarr: [],
      listQuery: {
        keyword: null,
        pageNum_: 1,
        pageSize_: 10,
      },
      listLoading: true,
      options:[
          {
              value:'0',
              label: '普通用户'
          },
          {
              value:'1',
              label: '企业'
          },
          {
              value:'2',
              label: '实体经销商'
          }
      ],
      options1:[
          {
              value:'0',
              label: '未知'
          },
          {
              value:'1',
              label: '男'
          },
          {
              value:'2',
              label: '女'
          }
      ]
    };
  },
  created() {
    this.getList();
   this.activeName = this.$route.query.activeName
  },
   filters:{
      formatType(type){
        if(type===1){
          return 'App';
        }else if(type===2){
          return 'Pc';
        }
      },
   },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getList() {
      this.listLoading = true;
      portParam(
        "/member/memberDetail/" + this.$route.query.id,
        this.listQuery,
        "get"
      ).then(response => {
        this.listLoading = false;
        this.list = response;
        this.listarr.push(response);
        this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize = response.pageSize;
      });
      portParam('/member/loginLog?pageNum_='+this.listQuery.pageNum_ +'&memberId='+this.$route.query.id,this.listQuery,'get').then(response =>{
           this.listLoading = false;
             this.log = response.list;
              this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize_ = response.pageSize_;
      })
    },
      onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
              portParam('/member/updateMember',this.list,'post').then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
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
     handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
}
}
</script>
<style scoped>
tr td {
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #ebeef5;
  color: #909399;
  font-size: 14px;
}
tr td:nth-child(2n + 1) {
  text-align: right;
}
</style>