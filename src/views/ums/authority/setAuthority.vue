<template>
  <div class="block">
    <el-cascader-multi
      v-model="checkList"
      :data="options"
      value-key="permissionId"
      label-key="name"
      children-key="children"
    ></el-cascader-multi>
    <el-button type="primary" @click="onSubmit()">提交</el-button>
  </div>
</template>
<script>
import { treeList, updateAuthority } from "@/api/authority";
export default {
  name: "authorityList", //这个LoginName最好和引入的vue的LoginName相同
  data() {
    return {
      checkList: "",
      multipleSelection: [],
      dialogTableVisible: false,
      options: [],
      permissionIds: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      treeList().then(response => {
        this.options = response;
      });
    },
    onSubmit() {
      if (this.options) {
        this.$confirm("是否提交数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            for (var i = 0; i < this.checkList.length; i++) {
          this.permissionIds.push(this.checkList[i][this.checkList[i].length - 1]);
        } 
        
         let params=new URLSearchParams();
          params.append("permissionIds",this.permissionIds);
          updateAuthority(this.$route.query.id, params).then(
            response => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
              this.$router.back();
            }
          );
        });
      } else {
        this.$message({
          message: "验证失败",
          type: "error",
          duration: 1000
        });
        return false;
      }
    }
  }
};
</script>
<style scoped>
.block {
  display: flex;
  justify-content: center;
  min-height: 600px;
}
.el-button {
  width: 100px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>