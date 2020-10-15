<template>
    <div>
        <!-- 列表图片 -->
            <div>灵感图片</div>
            <el-upload
                style="margin-bottom:20px"
                :data="qiniu"
                :limit="1"
                multiple
                class="upload-demo"
                ref="uploadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="upImgSuccess"
                :file-list="upImgList"
                :on-change="imgChange"
                :before-upload="upBefore"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（380*270px）</span>
            </el-upload>

            <div style="margin:10px 0; line-height:30px; border-bottom:1px solid #cccccc">灵感详情图片</div>    
            <el-upload
                style="margin-bottom:20px"
                :data="qiniuDetail"
                :limit="5"
                multiple
                class="upload-demo"
                ref="upDetailloadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="upImgDetailSuccess"
                :file-list="upImgDetailList"
                :on-change="imgDetailChange"
                :before-upload="upDetailBefore"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（380*270px）</span>
            </el-upload>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
				

            <el-form-item             
            prop="title"
            >
                <el-input type="text"  placeholder="请输入标题" v-model.number="ruleForm.title" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>



            </el-form>


			
			
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
    </div>
</template>
<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import url from '@/utils/url';
export default {

    props:{
        dialogVisible:{
            type:Boolean,
            default:false
        }
    },
    data () {
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };
        return {
            getSuccessImgList:[],
            getSuccessDetailImgList:[],
            uploadNum:0,
            upDetailloadNum:0,
            qiniuH:url.qiniuH,
            upImgList:[],
            upImgDetailList:[],
            ifUpImg:false,
            qiniu:{
                upUrl:'',
                token:'',
            },
            qiniuDetail:{
                upUrl:'',
                token:'',
            },
            
            ruleForm:{
                title:''
            },
            rules: {
                title: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
            },
            
        }
    },
    methods:{
        // 关闭弹窗 清空数据
        resetForms(){
            this.upImgList=[]
            this.upImgDetailList=[]
            this.$refs['ruleForm'].resetFields();
        },
        //提交
        subPicForm(){
            // this.$emit('sonMethond', 'tianjia')
            // return
            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                this.$refs.uploadimg.submit();
                this.$refs.upDetailloadimg.submit();
                

            }else {

                return false;
            }
            });
        },

/*****************************主图上传操作过程****************************************/        
        // 上传主图片之前
        upBefore(file){
            let dates= new Date()
            return  this.qiniu.key=file.uid
        },
        // 主图片改变
        imgChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示主图的长度",this.imgListLength)
            this.isChangeImg=true
        },
        // 上传主图片成功
        upImgSuccess(response, file, fileList){
            console.log("55555555555555555",fileList)
            // this.getSuccessImgList.push
            

            this.uploadNum++
            if(this.uploadNum==this.imgListLength){
                fileList.forEach(v => {
                    this.getSuccessImgList.push(v.uid)
                });
            }
            if(this.uploadNum+this.upDetailloadNum==this.imgListLength+this.imgDetailListLength){
                
                console.log("图片的总数量",this.upDetailloadNum+this.uploadNum)
                this.addServer({
                    imgUrl:this.getSuccessImgList[0],
                    inspirationDetailsJson:JSON.stringify(this.getSuccessDetailImgList),
                    title:this.ruleForm.title
                })
                
            }
        } ,
/*****************************详情图上传操作过程****************************************/        
        // 上传详情图片之前
        upDetailBefore(file){
            let dates= new Date()
            return  this.qiniuDetail.key=file.uid
        },
        // 详情图片改变
        imgDetailChange(file, fileList) {
            this.imgDetailListLength=fileList.length
            console.log("显示详情图的长度",this.imgDetailListLength)
            this.isChangeImg=true
        },
        // 上传详情图片成功
        upImgDetailSuccess(response, file, fileList){
            console.log('fileList',fileList)
            
            this.upDetailloadNum++
            if(this.upDetailloadNum==this.imgDetailListLength){
                fileList.forEach(v => {
                    this.getSuccessDetailImgList.push({imgUrl:v.uid})
                });
            }
            if(this.uploadNum+this.upDetailloadNum==this.imgListLength+this.imgDetailListLength){
                
                console.log("图片的总数量",this.upDetailloadNum+this.uploadNum)
                console.log("key的值",this.getSuccessDetailImgList)
                
                this.addServer({
                    imgUrl:this.getSuccessImgList[0],
                    inspirationDetailsJson:JSON.stringify(this.getSuccessDetailImgList),
                    title:this.ruleForm.title
                })
                
            }
        } ,

        // 添加
        addServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemInspirationSaveInspiration, parmas).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                // this.initData(this.tableParams)
                // this.$refs['ruleForm'].resetFields();
                // this.dialogVisible=false
                console.log("添加成功数据",data.data.data)  
                
                this.$emit('sonMethond', {type:'add',dialogVisible:false})
            }); 
        },
    },
    created(){

        let upToken = sessionStorage.getSessionStorage('upToken')
        console.log("upToken",upToken)
        this.qiniu={
            token:upToken
        }
        this.qiniuDetail={
            token:upToken
        }

        
    }

}
</script>