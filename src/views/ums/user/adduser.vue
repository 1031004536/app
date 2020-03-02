<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>基础信息</span>
      <el-button class="btn-add" size="mini" @click="back">返回</el-button>
    </el-card>
    <el-card class="form-container" shadow="never">
      <el-form :model="user" ref="userFrom" label-width="150px">
        <el-form-item label="登录账号：" prop="number">
          <el-input v-model="user.userName" placeholder="请填写登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input v-model="user.password" placeholder="请填写登录密码"></el-input>
        </el-form-item>  
        <el-form-item label="头像" prop="password">
          <single-upload v-model="user.icon"></single-upload>
        </el-form-item>
        <el-form-item label="角色" prop="type">
          <el-select v-model="user.roleId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="type">
          <el-input v-model="user.nickName" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item label="公司" prop="type">
          <el-select v-model="user.companyId" placeholder="请选择">
            <el-option
              v-for="item in companyOptions"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('userFrom')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('userFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>
<script>
import SingleUpload from "@/components/Upload/singleUpload";
import { createuser} from "@/api/authority";
import {get} from "@/api/util"
const defaultcompany = {
  userName: "",
  password: "",
  nickName: "",
  adminId:'',
  createTime:'',
  email:'',
  icon:'',
  loginTime:'',
  note:'',
  salt:'',
  status:'',
  roleId:"",
  companyId:null
};
export default {
  name: "companyDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
   components: { SingleUpload },
  data() {
    return {
      user: Object.assign({}, defaultcompany),
      options: [],
      companyOptions:null
    };
  },
  created() {
    if (this.isEdit) {
      getCompany(this.$route.query.companyId).then(response => {
        this.company = response.data;
      });
    } else {
      this.user = Object.assign({}, defaultcompany);
      this.getOptions();
      this.getCompanyOptions()
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
           if(this.user.companyId){
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.isEdit) {
              updatecompany(this.$route.query.companyId, this.company).then(
                response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000
                  });
                  this.$router.back();
                }
              );
            } else {
              createuser(this.user).then(response => {
                this.$refs[formName].resetFields();
                console.log(this.user)
                this.user = Object.assign({}, defaultcompany);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.go(-1)
              });
            }
          });
           }else{
             this.$message({
            message: "请选择公司",
            type: "error",
            duration: 1000
          }); 
           }
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
    getOptions(){
      get('/role/roleOption').then(res =>{
         this.options =res
      })
    },
    getCompanyOptions(){
      get('/company/companyOption').then(res =>{
         this.companyOptions =res
      })
    },
    back(){
      this.$router.go(-1)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.company = Object.assign({}, defaultcompany);
    }
  }
};
</script>
<style>
</style>


