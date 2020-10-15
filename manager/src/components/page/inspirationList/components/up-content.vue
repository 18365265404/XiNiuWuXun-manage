<template>
    <div>
        <!-- 列表图片 -->
            <el-upload
            
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
        changeMsg:{
            default:{}
        },
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

            uploadNum:0,

            qiniuH:url.qiniuH,
            upImgList:[],

            isChangeImg:false,
            qiniu:{
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
        // 弹窗出现显示对应的数据
        showPopMsg(){
            console.log("父级传递的值",this.changeMsg)
            let imglist=[]
            imglist.push({url:this.qiniuH+this.changeMsg.imgUrl})
            this.ruleForm={
                title:this.changeMsg.title
            }
            this.upImgList=imglist
        },
        // 关闭弹窗 清空数据
        resetForms(){
            this.upImgList=[]
            this.upImgDetailList=[]
            this.$refs['ruleForm'].resetFields();
        },
        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(!this.isChangeImg){
                        
                    
                    this.upServer({
                        inspirationId:this.changeMsg.inspirationId,
                        title:this.ruleForm.title,
                        oldImgUrl:this.changeMsg.imgUrl,
                        imgUrl:this.changeMsg.imgUrl
                    })
                }
                this.$refs.uploadimg.submit();
                

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
            this.uploadNum++
            if(this.uploadNum==this.imgListLength){
                let fileKeys=[]
                for(let i=0;i<fileList.length;i++){
                    fileKeys.push(fileList[i].response.key)
                }

                
                
                this.upServer({
                    inspirationId:this.changeMsg.inspirationId,
                    title:this.ruleForm.title,
                    oldImgUrl:this.changeMsg.imgUrl,
                    imgUrl:fileKeys[0]
                })
                
            }
        } ,


        // 修改
        upServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemInspirationUpdateInspiration, parmas).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                this.isChangeImg=false
                this.$emit('sonMethond', {type:'change',dialogVisible:false})
                console.log("修改成功数据",data.data.data)     
                
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