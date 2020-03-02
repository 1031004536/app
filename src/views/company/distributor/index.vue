<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="searchBrandList()" type="primary" size="small">查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.companyName" placeholder="公司名称/关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="add" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="companyTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="编号" align="center" type="index" width="50"></el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="scope">{{scope.row.contact}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">{{scope.row.phoneNumber}}</template>
        </el-table-column>
        <el-table-column label="地址" align="center" width="300">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="绑定时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="冻结/启用" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              @change="handleShowStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">{{scope.row.checkStatus | checkStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button @click="checked(scope.row)" type="info" size="mini">查看</el-button>
            <el-button
              v-if="scope.row.checkStatus == 1"
              @click="check(scope.row)"
              type="primary"
              size="mini"
            >审核</el-button>
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum_"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 审核模态框 -->
    <el-dialog :title="title" :visible.sync="checkVisible">
      <div>
        <el-form :model="form" label-width="80px">
          <el-form-item label="公司类型">
            <span>{{form.type}}</span>
          </el-form-item>
          <el-form-item label="名称">
            <span>{{form.companyName}}</span>
          </el-form-item>
          <el-form-item label="公司LOGO">
            <el-image style="width: 100px; height: 100px" :src="form.logo"></el-image>
          </el-form-item>
          <el-form-item label="联系人">
            <span>{{form.contact}}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span>{{form.phoneNumber}}</span>
          </el-form-item>
          <el-form-item label="品牌">
            <span>{{form.brandName}}</span>
          </el-form-item>
          <div class="line">详细信息</div>
          <el-form-item label="身份证正面">
            <el-image style="width: 100px; height: 100px" :src="form.idCardPositive"></el-image>
          </el-form-item>
          <el-form-item label="身份证反面">
            <el-image style="width: 100px; height: 100px" :src="form.idCardNegative"></el-image>
          </el-form-item>
          <el-form-item label="营业执照">
            <el-image style="width: 100px; height: 100px" :src="form.businessLicense"></el-image>
          </el-form-item>
          <el-form-item label="省市区">
            <span>{{form.areaName}}</span>
          </el-form-item>
          <el-form-item label="经度">
            <span>{{form.longitude}}</span>
          </el-form-item>
          <el-form-item label="纬度">
            <span>{{form.latitude}}</span>
          </el-form-item>
          <el-form-item label="详细地址">
            <span>{{form.detailAddress}}</span>
          </el-form-item>
          <el-form-item v-if="hidden">
            <el-button @click="submit(2,form.companyId)">审核通过</el-button>
            <el-button type="primary" @click="submit(3,form.companyId)">审核不通过</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 添加模态框 -->
    <template>
      <el-dialog title="添加" :visible.sync="outVisible">
        <el-form :model="form">
          <el-form-item label="类型" label-width="120px">
            <el-select v-model="form.type" placeholder="请选择公司类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.companyName" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="公司logo" label-width="120px">
            <el-upload
              action="http://apitest.zhongxigo.com:8080/mallAdmin/common/uploadImage"
              list-type="picture-card"
              :limit="1"
              :file-list="logo"
              :on-success="handleLogoSuccess"
              :on-remove="handleLogoRemove"
              :data="dataObj"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="联系人" label-width="120px">
            <el-input v-model="form.contact" />
          </el-form-item>
          <el-form-item label="联系电话" label-width="120px">
            <el-input v-model="form.phoneNumber" />
          </el-form-item>
          <el-form-item label="品牌" label-width="120px">
            <el-select
              v-model="form.brandId"
              filterable
              multiple
              placeholder="请选择"
              ref="brandOption"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <br />
          <div class="line">详细信息</div>
          <br />
          <el-form-item label="身份证正面" label-width="120px">
            <el-upload
              action="http://apitest.zhongxigo.com:8080/mallAdmin/common/uploadImage"
              list-type="picture-card"
              :limit="1"
              :file-list="idCardPositive"
              :on-success="handlePositiveSuccess"
              :on-remove="handlePositiveRemove"
              :data="dataObj"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="身份证反面" label-width="120px">
            <el-upload
              action="http://apitest.zhongxigo.com:8080/mallAdmin/common/uploadImage"
              list-type="picture-card"
              :limit="1"
              :file-list="idCardNegative"
              :on-success="handleNegativeSuccess"
              :on-remove="handleNegativeRemove"
              :data="dataObj"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="营业执照" label-width="120px">
            <el-upload
              action="http://apitest.zhongxigo.com:8080/mallAdmin/common/uploadImage"
              list-type="picture-card"
              :limit="1"
              :file-list="businessLicense"
              :on-success="handleBusinessSuccess"
              :on-remove="handleBusinessRemove"
              :data="dataObj"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="地图地址" label-width="120px">
            <el-col :span="7">
              <el-input v-model="form.longitude" placeholder="经度" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="7">
              <el-input v-model="form.latitude" placeholder="纬度" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              <el-button type="primary" @click="innerVisible = true">打开地图选择</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="省市区选择" label-width="120px">
            <el-cascader
              ref="areaRef"
              placeholder="搜索：省市区"
              :options="options"
              v-model="area"
              @change="checkOption"
              filterable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" label-width="120px">
            <el-input v-model="form.detailAddress" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd()">提 交</el-button>
        </div>
      </el-dialog>
      <el-dialog width="80%" title="地图选点" :visible.sync="innerVisible">
        <AMapModal @getCoordinates="receiceCoordinates" />
        <div style="display: flex;">
          <span v-text="nowAddress"></span>
          <span v-text="center"></span>
          <el-button
            type="primary"
            @click="yesCoordinates()"
            style="margin-left: 650px;margin-top: 30px;"
          >确定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import { distributor, deleteCompany } from "@/api/company";
import { get, post } from "@/api/util";
export default {
  name: "distributorList",
  data() {
    return {
      operateType: null,
      phoneNumber: "",
      listQuery: {
        companyName: null,
        pageSize_: 10,
        pageNum_: 1,
        type: null,
        checkStatus: null
      },
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: [],
      brandIds: null,
      outVisible: false,
      brandOptions: null,
      form: {
        // 表单数据
        type: null, // 公司类型：1企业，2 代理商，3 经销商 4 店铺
        companyName: null, // 店铺名
        logo: null, // logo图片地址
        idCardPositive: null, // 身份证正面
        idCardNegative: null, // 身份证反面
        businessLicense: null, // 营业执照
        detailAddress: null, // 详细地址
        longitude: null, // 经度
        latitude: null, // 纬度
        contact: null, // 联系人
        phoneNumber: null, // 电话号码
        brandName: null, // 品牌名称
        brandId: null, // 品牌id
        areaId: null, // 地区id
        areaName: null, // 地区名字(省-市-区)
        area: null, // 省市区id结合体，用于PC端回显 逗号拼接
        checkStatus: null, // 审核状态 0 待提交 1 审核中 2 审核成功 3 审核失败
        checkRemark: null // 审核意见
      },
      checkVisible: null,
      innerVisible: false,
      title: null,
      logo: null,
      idCardPositive: [],
      idCardNegative: [],
      businessLicense: [],
      area: null,
      condition: {}, //路由回参
      center: null, //接收组件坐标
      nowAddress: "", //接收组件地址
      hidden: false,
      options: null,
      typeOptions: "",
      dataObj: {
        folderName: "test"
      }
    };
  },
  created() {
    this.getList();
    this.getTypeOptions();
    this.getBrandOption();
    this.getAreaTree();
  },
  filters: {
    formatType(type) {
      if (type == 1) {
        return "企业";
      } else if (type == 2) {
        return "代理商";
      } else if (type == 3) {
        return "经销商";
      } else if (type == 4) {
        return "店铺";
      }
    },
    checkStatus(status) {
      if (status == 1) {
        return "待审核";
      } else if (status == 2) {
        return "审核成功";
      } else if (status == 3) {
        return "审核失败";
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      distributor(this.listQuery).then(response => {
        console.log(response);
        this.listLoading = false;
        this.list = response.list;
        this.total = response.total;
        this.totalPage = response.totalPage;
        this.pageSize = response.pageSize_;
      });
    },
    getBrandOption() {
      let _this = this;
      get("/brand/brandOption").then(response => {
        _this.brandOptions = response;
      });
    },
    getAreaTree() {
      let _this = this;
      get("/area/areaTreeList").then(data => {
        _this.options = data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleShowStatusChange(row) {
      let param = {};
      param.brandIds = row.brandIds;
      param.companyId = row.companyId;
      param.status = row.status;
      post("/company/checkOrFreeze", param).then(response => {
        let message = "操作成功";
        if (param.status) {
          message = "启用成功";
        } else {
          message = "冻结成功";
        }
        this.$message({
          message: message,
          type: "success",
          duration: 1000
        });
      });
    },
    getTypeOptions() {
      get("/company/companyTypeOption").then(res => {
        this.typeOptions = res;
      });
    },
    checked(row) {
      let _this = this;
      _this.hidden = false;
      _this.checkVisible = true;
      _this.title = "查看";
      get("/company/getCompany", { companyId: row.companyId }).then(data => {
        switch (data.type) {
          case "1":
            data.type = "企业";
            break;
          case "2":
            data.type = "代理商";
            break;
          case "3":
            data.type = "经销商";
            break;
          case "4":
            data.type = "店铺";
            break;
        }
        _this.form = data;
      });
    },
    check(row) {
      // 审核方法 row代表选中行的数据
      let _this = this;
      _this.hidden = true;
      _this.brandIds = row.brandIds;
      _this.checkVisible = true;
      _this.title = "审核";
      get("/company/getCompany", { companyId: row.companyId }).then(data => {
        switch (data.type) {
          case "1":
            data.type = "企业";
            break;
          case "2":
            data.type = "代理商";
            break;
          case "3":
            data.type = "经销商";
            break;
          case "4":
            data.type = "店铺";
            break;
        }
        _this.form = data;
      });
    },
    add() {
      this.outVisible = true;
    },
    submit(checkStatus, id) {
      let param = {};
      param.brandIds = this.brandIds;
      param.companyId = id;
      param.checkStatus = checkStatus;
      post("/company/checkOrFreeze", param).then(response => {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1000
        });
        this.checkVisible = false;
        this.getList();
      });
    },
    submitAdd() {
      let _this = this;
      let message = "添加成功";
      if (_this.form.area instanceof Array) {
        // 回显时不拼接逗号问题的兼容处理
        _this.form.area = _this.form.area.join(",");
      }
      post("/company/updateCompany", _this.form).then(data => {
        _this.$message({
          message: message,
          type: "success",
          duration: 1000
        });
        _this.outVisible = false;
        _this.getList();
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该公司", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCompany(row.id).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    checkOption(data) {
      // 选中省区市，对数据进行处理
      let _this = this;
      _this.form.areaName = _this.$refs.areaRef
        .getCheckedNodes()[0]
        .pathLabels.join("-");
      _this.form.areaId = data[2];
      _this.form.area = data.join(",");
    },
    handleSizeChange(val) {
      this.listQuery.pageNum_ = 1;
      this.listQuery.pageSize = val;
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
    // 图片处理方法
    handleLogoRemove(file, fileList) {
      // logo
      this.form.logo = null;
    },
    handleLogoSuccess(response, file, fileList) {
      this.form.logo = response;
    },
    handlePositiveRemove(file, fileList) {
      // 身份证正面
      this.form.idCardPositive = null;
    },
    handlePositiveSuccess(response, file, fileList) {
      this.form.idCardPositive = response;
    },
    handleNegativeRemove(file, fileList) {
      // 身份证反面
      this.form.idCardNegative = null;
    },
    handleNegativeSuccess(response, file, fileList) {
      this.form.idCardNegative = response;
    },
    handleBusinessRemove(file, fileList) {
      // 营业执照
      this.form.businessLicense = null;
    },
    handleBusinessSuccess(response, file, fileList) {
      this.form.businessLicense = response;
    },
    receiceCoordinates(parameter) {
      // 接收坐标
      this.center = parameter.center;
      this.nowAddress = parameter.address;
    },
    yesCoordinates() {
      // 确定经纬度
      this.form.longitude = this.center[0];
      this.form.latitude = this.center[1];
      this.form.detailAddress = this.nowAddress;
      this.innerVisible = false;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
