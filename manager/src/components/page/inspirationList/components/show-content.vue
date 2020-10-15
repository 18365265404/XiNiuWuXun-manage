<template>
  <div>
        <div>
            <el-upload
                style="margin-bottom:20px"
                :data="qiniu"
                :limit="10"
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
				

            <!-- <el-form-item             
            prop="title"
            >
                <el-input type="text"  placeholder="请输入标题" v-model.number="ruleForm.title" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item> -->



            </el-form>
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary"  @click="deletMost()">批量删除</el-button>  
            <el-button type="primary"  style="opacity:0">创建</el-button>  
        </div>
        <!-- 表格 -->
        <el-table
        :data="tableList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">

            <el-table-column
            type="selection"
           >
            </el-table-column>
            <el-table-column
            type="index"
            >
            </el-table-column>

            <el-table-column
			style="position:relative"
			prop="imgUrl"
			label="图片"
			show-overflow-tooltip>
			    <template    slot-scope="scope">            
			        <div title="点击放大显示" >
			            <img :src="qiniuH+scope.row.imgUrl"    style="width:60px; height:20px" />
			            <el-popover
			            placement="right"
			            trigger="click"
			            >
			                <img :src="qiniuH+scope.row.imgUrl"    style="max-height:400px" />
			                <i slot="reference"  class="el-icon-view" style="font-size:16px"></i>
			            </el-popover>
			        </div>
			    </template>  
			</el-table-column>


            <!-- <el-table-column
            prop="operationTime"
            label="创建时间"
            >
            </el-table-column> -->
            
            <el-table-column
            fixed="right"
            label="操作"
            width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small"  @click.native.prevent="delet(scope.$index, tableList)" >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
  </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import url from '@/utils/url';
export default {
    props:{
        goDetailId:{
            default:''
        }
    },
    data(){
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };
        return {
            qiniu:{
                upUrl:'',
                token:'',
            },
            upImgList:[],
            tableList:[],
            qiniuH:url.qiniuH,
            ruleForm:{
                title:''
            },
            rules: {
                title: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
            },
            uploadNum:0
        }
    },
    methods: {
        /******************上传图片操作过程***************************/ 
        //提交
        subPicForm(){
            // this.$emit('sonMethond', 'tianjia')
            // return
            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                this.$refs.uploadimg.submit();
            }else {

                return false;
            }
            });
        },
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
                let dataArr=[]
                fileList.forEach(v => {
                    // dataArr.push(v.uid)
                    dataArr.push({inspirationId:this.goDetailId,imgUrl:v.uid})
                });
                // inspirationDetailsJson:{inspirationId:this.goDetailId,imgUrl:fileList[0]},
                this.addServer({
                    inspirationDetailsJson:JSON.stringify(dataArr),
                })
            }

        } ,

        // 添加
        addServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemInspirationDetailsSaveInspirationDetails, parmas).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                // this.initData(this.tableParams)
                // this.$refs['ruleForm'].resetFields();
                // this.dialogVisible=false
                console.log("添加成功数据",data.data.data)  
                this.upImgList=[]
                this.initDetail({
                    inspirationId:this.goDetailId
                }) 
            }); 
        },
        
        // 单删除一条
        delet(index, rows){
            this.deletHttp({
                inspirationDetailsIds:[rows[index].inspirationDetailsId].join(","),
                oldImgUrls:[rows[index].imgUrl].join(",")
            })
        },
        // 多删
        deletMost(){
            console.log("查看表单内的选中的条数",this.multipleSelection)
            if(this.multipleSelection==undefined){
                this.$message({
                    type: 'success',
                    message: '请选择后删除'
                });
                    return
            }
            let arrId=[];
            let arrPictures=[];
            for(let i=0;i<this.multipleSelection.length;i++){
                arrId.push(this.multipleSelection[i].inspirationDetailsId)
                arrPictures.push(this.multipleSelection[i].imgUrl)

            }


            console.log('要删除的图片',arrPictures)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.deletHttp({
                    inspirationDetailsIds:arrId.join(","),
                    oldImgUrls:arrPictures.join(",")
                })

            })

            if(arrId.length==0){
                this.$message({
                    type: 'success',
                    message: '请选择后删除'
                });
                return
            }

            
        },

        // 删除请求
        deletHttp(params){
            postRequest(url.systemInspirationDetailsRemoveInspirationDetails,params).then(data=> {
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                console.log("删除后打印的数据",data)

                this.initDetail({
                    inspirationId:this.goDetailId
                }) 
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });        
                        
            });    
        },
        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        showDetail(){
            console.log("父级传递的值",this.goDetailId)
            this.initDetail({
                inspirationId:this.goDetailId
            })
        },
        initDetail(params){
            postRequest(url.systemInspirationDetailsListInspirationDetails, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                this.tableList=datas
                console.log("详情初始化返回数据",data.data.data)     
                
            }); 
        },
    },
    created(){
        let upToken = sessionStorage.getSessionStorage('upToken')
        console.log("upToken",upToken)
        this.qiniu={
            token:upToken
        }
    }
}
</script>


<style scoped>
    .btn-box{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: 30px 0 10px 0;
    }
   
</style>
