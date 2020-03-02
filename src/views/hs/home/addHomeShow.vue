<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>基础信息</span>
      <el-button class="btn-add" size="mini" @click="fanhui()">返回</el-button>
    </el-card>
    <el-card class="form-container" shadow="never" style="position:relative;width:100%">
      <el-form :model="add" ref="addFrom" label-width="150px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="add.showName" placeholder="小于等于6个字"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="add.sort" placeholder="请输入大于等于0的正整数"></el-input>
        </el-form-item>
        <el-form-item label="选择模板" prop="sort">
          <el-select v-model="add.templateId" placeholder="请选择模板类型" @change="changeTem">
            <el-option
              v-for="item in templateOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下架设置" prop="hide">
          <el-switch v-model="add.status" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
        <el-form-item label="上架时间" prop="upTime">
          <el-date-picker
            v-model="add.upTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="下架时间" prop="downTime">
          <el-date-picker
            v-model="add.downTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="广告图片" name="first">
            <el-container>
              <el-aside width="300px" style="display:flex;color:white">
                <div
                  class="left"
                  style="width:50px;height:100px;background:gray;line-height:100px;text-align:center"
                >1</div>
                <div class="right" style="width:100px;height:100px;margin-left:5px">
                  <div
                    style="width:100px;height:48px;background:gray;line-height:48px;text-align:center"
                  >2</div>
                  <div style="width:100px;height:48px;margin-top:4px;display:flex">
                    <div
                      style="width:48px;height:48px;background:gray;margin-right:4px;line-height:48px;text-align:center"
                    >3</div>
                    <div
                      style="width:48px;height:48px;background:gray;line-height:48px;text-align:center"
                    >4</div>
                  </div>
                </div>
              </el-aside>
              <el-main>
                <div style="display:flex">
                  <el-button type="primary" @click="addDiv">添加</el-button>
                </div>
                <div v-for="(item,index) in list" :key="index">
                  <el-form-item :label="'上传'+ item.sort +'图片'">
                    <single-upload v-model="item.image"></single-upload>
                  </el-form-item>
                  <el-form-item :label= "item.sort + '图片跳转设置'">
                    <el-select v-model="item.optionId" placeholder="请选择跳转类型">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.name"
                        :value="item.optionId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="item.page" placeholder="请输入相关页面id或链接"></el-input>
                  </el-form-item>
                </div>
              </el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('addFrom')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { fetchList, updateDeleteStatus } from "@/api/product";
import { addHomeShowList, option } from "@/api/hs";
import SingleUpload from "@/components/Upload/singleUpload";
const defaultcompany = {
  showName: "",
  status: true,
  sort: "",
  upTime: "",
  downTime: "",
  homeShowList: "",
  templateId: null
};
const defaultListQuery = {
  keyword: null,
  pageNum_: 1,
  pageSize_: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
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
      list: [
        {
          optionId: "",
          image: "",
          page: "",
          sort: "1"
        }
      ],
      sum: "2",
      multipleSelection: "",
      productList: null,
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: true,
      options: "",
      templateOptions: [
        {
          name: "模板2",
          value: 2
        },
        {
          name: "模板3",
          value: 3
        }
      ],
      add: Object.assign({}, defaultcompany),
      activeName: "first",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    if (this.isEdit) {
      console.log(this.isEdit);
    } else {
      this.add = Object.assign({}, defaultcompany);
      option().then(response => {
        this.options = response;
      });
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
              console.log(this.isEdit);
            } else {
              this.add.homeShowList = this.list;
              addHomeShowList(this.add).then(response => {
                this.$refs[formName].resetFields();
                console.log(this.add);
                this.add = Object.assign({}, defaultcompany);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
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
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.productList = response.list;
        this.total = response.total;
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
    addDiv() {
      let sub = { optionId: "", image: "", page: "", sort: this.sum++ };
      if(this.add.templateId){
      if (this.list.length < this.add.templateId) {
        this.list.push(sub);
        this.name = "";
      }else{
         this.$message({
          message: "最多只能添加"+ this.add.templateId +'个模板',
          type: "error",
          duration: 1000
        });
      }
      }else{
         this.$message({
          message: "请选择模板",
          type: "error",
          duration: 1000
        });
      }
    },
    fanhui() {
      this.$router.go(-1);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.productId);
        this.updateDeleteStatus(1, ids);
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000
        });
      });
      this.getList();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
  }
};
</script>
<style>
</style>


