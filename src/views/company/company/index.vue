<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="findList" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="reset"
          type="info"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="param" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-select v-model="param.type" placeholder="请选择公司类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-select v-model="param.checkStatus" placeholder="请选择审核状态">
              <el-option
                v-for="item in checkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="param.companyName" placeholder="公司名称/关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="dataList" stripe style="width: 100%" border>
        <el-table-column label="公司名称" prop="companyName" align="center" />
        <el-table-column label="公司类型" prop="type" align="center" />
        <el-table-column label="联系人" prop="contact" align="center" />
        <el-table-column label="联系电话" prop="phoneNumber" align="center" />
        <el-table-column label="详细地址" prop="address" align="center" />
        <el-table-column label="申请时间" prop="createTime" align="center" />
        <el-table-column label="审核状态" prop="checkStatus" align="center" />
        <el-table-column label="冻结/启用" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              v-if="checkIsExit(scope.row)"
              @click="check(scope.row)"
              type="text"
              size="small"
            >审核</el-button>
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
        :page-size="param.pageSize_"
        :page-sizes="[5,10,15]"
        :current-page.sync="param.pageNum_"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 编辑模态框 -->
    <template>
      <el-dialog :title="title" :visible.sync="outVisible">
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
          <el-button type="primary" @click="submit(0)">提 交</el-button>
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

    <!-- 审核模态框 -->
    <template>
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
            <el-form-item label="审核意见">
              <el-input type="textarea" v-model="form.checkRemark" />
            </el-form-item>
            <el-form-item>
              <el-button @click="submit(2)">审核通过</el-button>
              <el-button type="primary" @click="submit(3)">审核不通过</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { get, post } from "@/api/util";
import AMapModal from "../../../components/Map/index";
export default {
  components: {
    AMapModal
  },
  data() {
    return {
      param: {
        // 入参
        type: null,
        checkStatus: null,
        companyName: null,
        pageNum_: 1,
        pageSize_: 10
      },
      dataList: [],
      total: null,
      outVisible: false, // 外层模态框是否打开标记 true 打开 false 关闭 默认关闭
      innerVisible: false, // 内层模态框是否打开标记 true 打开 false 关闭 默认关闭
      checkVisible: false, // 审核模态框是否打开标记 true 打开 false 关闭 默认关闭
      title: "编辑",
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
        brandId:null, // 品牌id
        areaId: null, // 地区id
        areaName: null, // 地区名字(省-市-区)
        area: null, // 省市区id结合体，用于PC端回显 逗号拼接
        checkStatus: null, // 审核状态 0 待提交 1 审核中 2 审核成功 3 审核失败
        checkRemark: null // 审核意见
      },
       dataObj: {
          folderName: 'test',
        },
      typeOptions: [],
      checkOptions: [
        // 审核状态下拉数据
        {
          value: "0",
          label: "待提交"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "审核成功"
        },
        {
          value: "3",
          label: "审核失败"
        }
      ],
      // 以下为省市区存储数据
      area: null,
      options: [],
      //以下为图片数据回显使用
      logo: [],
      idCardPositive: [],
      idCardNegative: [],
      businessLicense: [],
      // 以下为高德地图属性
      condition: {}, //路由回参
      center: null, //接收组件坐标
      nowAddress: "" //接收组件地址
    };
  },
  created() {
    this.getList();
    this.getAreaTree();
    this.getTypeOptions()
  },
  methods: {
    getList() {
      let _this = this;
      get("/company/companyList", this.param).then(data => {
        for (let i in data.list) {
          // 数据便利 进行数据替换展示
          switch (data.list[i].type) {
            case "1":
              data.list[i].type = "企业";
              break;
            case "2":
              data.list[i].type = "代理商";
              break;
            case "3":
              data.list[i].type = "经销商";
              break;
            case "4":
              data.list[i].type = "店铺";
              break;
          }
          switch (data.list[i].checkStatus) {
            case 0:
              data.list[i].checkStatus = "待提交";
              break;
            case 1:
              data.list[i].checkStatus = "审核中";
              break;
            case 2:
              data.list[i].checkStatus = "审核成功";
              break;
            case 3:
              data.list[i].checkStatus = "审核失败";
              break;
          }
          data.list[i].address =
            data.list[i].areaName + " " + data.list[i].detailAddress;
        }

        _this.dataList = data.list;
        _this.total = data.total;
      });
    },
    getTypeOptions(){
     get('/company/companyTypeOption').then(res=>{
       this.typeOptions = res
     })
    },
    getAreaTree() {
      let _this = this;
      get("/area/areaTreeList").then(data => {
        _this.options = data;
      });
    },
    checkOption(data) {
      // 选中省区市，对数据进行处理
      let _this = this;
      _this.form.areaName = _this.$refs.areaRef.getCheckedNodes()[0].pathLabels.join("-");
      _this.form.areaId = data[2];
      _this.form.area = data.join(",");
    },
    changeStatus(row) {
      // 冻结/启用 方法 row代表选中行的数据
      let _this = this;
      let param = {};
      param.status = row.status;
      param.companyId = row.companyId;
      post("/company/updateCompany", param).then(data => {
        let message = "操作成功";
        if (param.status) {
          message = "启用成功";
        } else {
          message = "冻结成功";
        }
        _this.$message({
          message: message,
          type: "success",
          duration: 1000
        });
      });
    },
    edit(row) {
      // 编辑方法 row代表选中行的数据
      let _this = this;
      _this.title = "编辑";
      get("/company/getCompany", { companyId: row.companyId }).then(data => {
        _this.form = data;
        _this.area = data.area;
        _this.logo = [];
        _this.logo.push({ url: data.logo });
        _this.idCardPositive = [];
        _this.idCardPositive.push({ url: data.idCardPositive });
        _this.idCardNegative = [];
        _this.idCardNegative.push({ url: data.idCardNegative });
        _this.businessLicense = [];
        _this.businessLicense.push({ url: data.businessLicense });
        _this.outVisible = true;
      });
    },
    check(row) {
      // 审核方法 row代表选中行的数据
      let _this = this;
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
    checkIsExit(row) {
      // 对审核按钮进行控制
      switch (row.checkStatus) {
        case "审核成功":
        case "审核失败":
          return false;
      }
      return true;
    },
    handleSizeChange(val) {
      let _this = this;
      _this.param.pageNum_ = 1;
      _this.param.pageSize_ = val;
      _this.getList();
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.param.pageNum_ = val;
      _this.getList();
    },
    findList() {
      let _this = this;
      _this.param.pageNum_ = 1;
      _this.getList();
    },
    reset() {
      let _this = this;
      _this.param = {};
      _this.param.pageNum_ = 1;
      _this.param.pageSize_ = 10;
      _this.getList();
    },
    handleAdd(){
      this.form= {},
      console.log(this.form)
      this.outVisible = true
       // 以下为省市区存储数据
      this.area = null
      //以下为图片数据回显使用
      this.logo= []
      this.idCardPositive= []
      this.idCardNegative= []
      this.businessLicense= []
    },
    submit(flag) {
      let _this = this;
      let message = "编辑成功";
      if (_this.form.area instanceof Array) {
        // 回显时不拼接逗号问题的兼容处理
        _this.form.area = _this.form.area.join(",");
      }
      if (flag) {
        _this.form.checkStatus = flag;
        message = "审核成功";
      }
      post("/company/updateCompany", _this.form).then(data => {
        _this.$message({
          message: message,
          type: "success",
          duration: 1000
        });
        _this.outVisible = false;
        _this.checkVisible = false;
        _this.getList();
      });
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
<style scoped lang="scss">
.amap-wrapper {
  width: 100%;
  height: 600px;
}

.line {
  padding: 0 20px 0;
  margin: 20px 0;
  line-height: 1px;
  border-left: 250px solid #ddd;
  border-right: 250px solid #ddd;
  text-align: center;
}

.checkTable {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.checkTable tr {
  margin-top: 20px;
}
</style>
