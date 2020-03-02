<template> 
  <div>
    <el-upload
      action="http://apitest.zhongxigo.com:8080/mallAdmin/common/uploadImage"
      :data="dataObj"
      list-type="picture-card"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="5"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from '@/api/oss'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
      return {
        dataObj: {
          folderName: 'test',
        },
        dialogVisible: false,
        dialogImageUrl:null
      };
    },
    computed: {
      fileList() {
        let fileList=[];
        for(let i=0;i<this.value.length;i++){
          fileList.push({url:this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
      emitInput(fileList) {
        let value=[];
        for(let i=0;i<fileList.length;i++){
          value.push(fileList[i].url);
        }
        this.$emit('input', value)
      },
      handleRemove(res,file, fileList) {
        let index = '';
        for(let i in this.fileList){
          if(this.fileList[i] == res){
             index = i
          }
        }
        this.fileList.splice(index,1)
        this.emitInput(this.fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      // beforeUpload(file) {
      //   let _self = this;
      //   return new Promise((resolve, reject) => {
      //     policy().then(response => {
      //       alert(1)
      //       _self.dataObj.policy = response.data.policy;
      //       _self.dataObj.signature = response.data.signature;
      //       _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
      //       _self.dataObj.key = response.data.dir + '/${filename}';
      //       _self.dataObj.dir = response.data.dir;
      //       _self.dataObj.host = response.data.host;
      //       resolve(true)
      //     }).catch(err => {
      //       console.log(err)
      //       reject(false)
      //     })
      //   })
      // },
      handleUploadSuccess(res, file,fileList) {
        this.fileList.push({url: res});
        this.emitInput(this.fileList);
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    }
  }
</script>
<style>

</style>


