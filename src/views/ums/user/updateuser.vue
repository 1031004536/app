<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="user" ref="userFrom" label-width="150px">
      <el-form-item label="账号" prop="name">
        <el-input v-model="user.userName" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="user.nickName" placeholder="请输入用户名"></el-input>
      </el-form-item>
       <el-form-item label="头像" prop="password">
          <single-upload v-model="user.icon"></single-upload>
        </el-form-item>
      <el-form-item label="角色" prop="type">
        <el-select v-model="user.roleId" placeholder="请选择">
          <el-option v-for="item in options" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
        </el-select>
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
</template>
<script>
import {get} from "@/api/util"
import { getuser, updateuser } from "@/api/authority";
import SingleUpload from "@/components/Upload/singleUpload";
const defaultcompany = {
  username: "",
  password: "",
  nickName: "",
  adminId: "",
  createTime: "",
  email: "",
  icon: "",
  loginTime: "",
  note: "",
  salt: "",
  status: "",
  roleId:'',
  companyId:null
};
export default {
  name: "companyDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      user: Object.assign({}, defaultcompany),
      options: [],
       companyOptions:null,
      tableName: {
        tableName: "coms_user",
        id: this.$route.query.id
      }
    };
  },
  created() {
    if (this.isEdit) {
      this.getOptions();
      this.getCompanyOptions();
      getuser(this.tableName, this.$route.query.id).then(response => {
        this.user = response;
      });
    } else {
      console.log(this.user);
      this.user = Object.assign({}, defaultcompany);
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.isEdit) {
              updateuser(this.$route.query.id,this.user).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createCompany(this.user).then(response => {
                this.$refs[formName].resetFields();
                this.user = Object.assign({}, defaultcompany);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
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
    getCompanyOptions(){
      get('/company/companyOption').then(res =>{
         this.companyOptions =res
      })
    },
     getOptions(){
      get('/role/roleOption').then(res =>{
         this.options =res
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.user = Object.assign({}, defaultcompany);
    }
  }
};
</script>
<style>
</style>


