<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="company"  ref="companyFrom" label-width="150px">
      <el-form-item label="公司名称：" prop="name" >
        <el-input v-model="company.companyName"  placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="公司LOGO：" prop="logo">
        <single-upload v-model="company.logo"></single-upload>
      </el-form-item>
      <el-form-item label="公司类型：" prop="type">
        <el-input v-model="company.type"  placeholder="请输入公司类型"></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="type">
        <el-input v-model="company.contact"  placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="type">
        <el-input v-model="company.phoneNumber"  placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="type" class="demo-input-size">
        <el-input v-model="company.province"  placeholder="请输入所在省份"></el-input>
        <el-input v-model="company.city"  placeholder="请输入所在市区"></el-input>
        <el-input v-model="company.region"  placeholder="请输入所在县/区"></el-input>
      </el-form-item>
      <el-form-item label="绑定时间：" prop="type" >
        <el-input v-model="company.createTime" placeholder="请输入绑定时间"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('companyFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('companyFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCompany, getCompany, updateCompany} from '@/api/company'
  import SingleUpload from '@/components/Upload/singleUpload'
  const defaultcompany={
    companyId:'',
    type:'',
    phoneNumber:'',
    province:'',
    city:'',
    region:'',
    logo: '',
    companyName: '',
    contact:'',
    companyParentId:'',
    status:0
  };
  export default {
    name: 'companyDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        company:Object.assign({}, defaultcompany),
      }
    },
    created() {
      if (this.isEdit) {
        getCompany(this.$route.query.companyId).then(response => {
          console.log(this.$route.query.companyId)
          this.company = response.data;
        });
      }else{
        console.log(this.company)
        this.company = Object.assign({},defaultcompany);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updatecompany(this.$route.query.companyId, this.company).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createCompany(this.company).then(response => {
                  this.$refs[formName].resetFields();
                  this.company = Object.assign({},defaultcompany);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.company = Object.assign({},defaultcompany);
      }
    }
  }
</script>
<style>
</style>


