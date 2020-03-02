<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>基础信息</span>
      <el-button class="btn-add" size="mini" @click="fanhui()">返回</el-button>
    </el-card>
    <el-card class="form-container" shadow="never">
      <el-form :model="add" ref="addFrom" label-width="150px">
        <el-form-item label="上级分类" prop="type">
          <el-select v-model="add.type" placeholder="请选择分类">
            <el-option v-for="item in options" :key="item.index" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="add.subjectName" placeholder="小于等于6个字"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="add.sort" placeholder="请输入大于等于0的正整数"></el-input>
        </el-form-item>
         <el-form-item label="显示隐藏" prop="hide">
        <el-switch v-model="add.recommendStatus" :active-value= '1' :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('addFrom')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('addFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createhs ,select} from "@/api/hs";
import SingleUpload from "@/components/Upload/singleUpload";
const defaultcompany = {
  level: '2',
  parentId: '0',
  recommendStatus: '1',
  sort: '',
  subjectImage: "",
  subjectName: "",
  sms_subject:'smsHomeSubject',
  type:'',
  url:'www.baidu.com'
};
export default {
  name: "companyDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      add: Object.assign({}, defaultcompany),
      options: []
    };
  },
  created() {
    if (this.isEdit) {
      getCompany(this.$route.query.companyId).then(response => {
        this.company = response.data;
      });
    } else {
        defaultcompany.parentId = this.$route.query.id
       select(this.$route.query.id).then(response=>{
           this.options = response.data
       })
      this.add = Object.assign({}, defaultcompany);
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
              updatecompany(this.add).then(
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
              createhs(this.add).then(response => {
                this.$refs[formName].resetFields();
                console.log(this.add);
                this.add = Object.assign({}, defaultcompany);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
              });
              this.$router.back(); 
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
    fanhui() {
      this.$router.go(-1);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.add = Object.assign({}, defaultcompany);
    }
  }
};
</script>
<style>
</style>


