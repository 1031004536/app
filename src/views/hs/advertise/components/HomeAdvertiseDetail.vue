<template> 
    <el-card class="form-container" shadow="never">
        <el-form :model="homeAdvertise" :rules="rules" ref="homeAdvertiseFrom" label-width="150px" size="small">
            <el-form-item label="广告名称：" prop="adName">
                <el-input v-model="homeAdvertise.adName" class="input-width"></el-input>
            </el-form-item>
            <el-form-item label="广告位置：">
                <el-select v-model="homeAdvertise.optionId" placeholder="请选择广告位置">
                    <el-option v-for="type in typeOptions" :key="type.value" :label="type.name" :value="type.optionId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类目：" v-if="homeAdvertise.optionId == 2">
                <el-select v-model="homeAdvertise.eventId" placeholder="请选择类目">
                    <el-option v-for="type in recommendCategoryOptions" :key="type.recommendCategoryId" :label="type.categoryName" :value="type.recommendCategoryId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="homeAdvertise.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="到期时间：" prop="endTime">
                <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="homeAdvertise.endTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="广告图片：">
                <single-upload v-model="homeAdvertise.pic"></single-upload>
            </el-form-item>
            <el-form-item label="广告链接：" prop="url">
              <el-select v-model="homeAdvertise.url"  class="input-width">
                <el-option
                v-for="type in urlOptions"
                :key="type.value"
                :label="type.name"
                :value="type.optionId"
                >

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="sort">
              <el-input  placeholder="请输入相关页面ID或页面链接"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input placeholder="请输入大于等于0的正整数"></el-input>
            </el-form-item>
            <el-form-item label="广告备注：">
                <el-input class="input-width" type="textarea" :rows="5" placeholder="请输入内容" v-model="homeAdvertise.note">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
                <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
    import SingleUpload from '@/components/Upload/singleUpload'
    import {
        createHomeAdvertise,
        getHomeAdvertise,
        updateHomeAdvertise,
        option,
        optionA
    } from '@/api/homeAdvertise'
 import {get} from '@/api/util'
    const defaultHomeAdvertise = {
        adName: null,
        eventId: null,
        type: null,
        optionId: null,
        pic: null,
        startTime: null,
        endTime: null,
        status: 0,
        url: null,
        note: null,
        sort: 0,

    };
    export default {
        name: 'HomeAdvertiseDetail',
        components: {
            SingleUpload
        },
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                homeAdvertise: null,
                recommendCategoryOptions:null,
                rules: {
                    adName: [{
                            required: true,
                            message: '请输入广告名称',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 140,
                            message: '长度在 2 到 140 个字符',
                            trigger: 'blur'
                        }
                    ],
                    url: [{
                        required: true,
                        message: '请输入广告链接',
                        trigger: 'blur'
                    }],
                    startTime: [{
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'blur'
                    }],
                    endTime: [{
                        required: true,
                        message: '请选择到期时间',
                        trigger: 'blur'
                    }],
                    pic: [{
                        required: true,
                        message: '请选择广告图片',
                        trigger: 'blur'
                    }]
                },
                typeOptions: null,
                urlOptions: null,
            }
        },
        created() {
            option().then(response => {
                this.typeOptions = response;
            });
            optionA().then(response => {
                this.urlOptions = response;
            });
            get('/recommendCategory/recommendOption',{"parentId":0}).then(response=>{
                this.recommendCategoryOptions = response
            })
            if (this.isEdit) {
                getHomeAdvertise(this.$route.query.adId).then(response => {
                    this.homeAdvertise = response;
                });
            } else {
                this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
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
                                this.homeAdvertise.adId = this.$route.query.adId;
                                createHomeAdvertise(this.homeAdvertise).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success',
                                        duration: 1000
                                    });
                                    this.$router.back();
                                });
                            } else {
                                createHomeAdvertise(this.homeAdvertise).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                        duration: 1000,
                                    });
                                    this.$router.go(-1)
                                });
                            }
                        });

                    } else {
                        this.$message({
                            message: '验证失败',
                            type: 'error',
                            duration: 1000
                        });
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
            }
        }
    }
</script>
<style scoped>
    .input-width {
        width: 70%;
    }
</style>
