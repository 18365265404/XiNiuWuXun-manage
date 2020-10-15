<template>
    <div class="userList">
        <!-- 查询 -->
        <div class="search" style="opacity:0">
            <el-input placeholder="请输入搜索内容"   v-model="searchV" class="search-box input-with-select">
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary"  @click="deletMost()">批量删除</el-button>  
            <el-button type="primary"  @click="addMost()">创建</el-button>  
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

 
            <el-table-column
            prop="link"
            label="链接地址"
            >
            </el-table-column>

            <el-table-column
			prop="operationTime"
			label="更新时间"
			show-overflow-tooltip>

                <template    slot-scope="scope">            
			        {{scope.row.operationTime|date}}
			    </template>  
			</el-table-column>

            
            <el-table-column
            fixed="right"
            label="操作"
            width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small"  @click.native.prevent="delet(scope.$index, tableList)" >删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 弹窗 -->
        <el-dialog
        title="上传"
        :visible.sync="dialogVisible"
        width="60%"
        @close="closeDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            
            <el-upload
            
                :data="qiniu"
                :limit="1"
                multiple
                class="upload-demo"
                ref="uploadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="updateDetailSuccess"
                :file-list="upfileList"
                :on-change="handleChange"
                :before-upload="beforeUpload"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（1200*425px）</span>
            </el-upload>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium' style="margin-top:10px"    class="demo-ruleForm">
				

            <el-form-item             
            prop="link"
            >
                <el-input type="text"  placeholder="请输入图片跳转链接" v-model.number="ruleForm.link" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>



            </el-form>


			
			
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        
        </el-dialog>   
    </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '../../utils/sessionStorage'
import url from '../../utils/url';
  export default {
    

    data() {
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };

        return {
            dialogVisible:false,
            submitTag:'add',
            searchV:'',
            tableList:[],
            roleList:[],
            upfileList:[],
            file:"",
            qiniu:{
                upUrl:'',
                token:'',

            },
            qiniuH:url.qiniuH,
            uploadNum:0,
            imgListLength:'',
            page:{
                currentPage:1,  
                total:1000,
            },
            ruleForm:{
                link:''
            },
            rules: {
                link: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
            },
        }
    },

    computed:{
        tableParams(){
            return {
                

            }
        },
    },
    methods:{

        // 单删除一条
        delet(index, rows){
            this.deletHttp({
                carouselIds:[rows[index].carouselId].join(","),
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
                arrId.push(this.multipleSelection[i].carouselId)
                arrPictures.push(this.multipleSelection[i].imgUrl)

            }


            console.log('要删除的图片',arrPictures)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.deletHttp({
                    carouselIds:arrId.join(","),
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
            postRequest(url.systemCarouselRemoveCarousel,params).then(data=> {
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                console.log("删除后打印的数据",data)
                this.dialogVisible=false
                this.initData(this.tableParams) //查询所有    
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });        
                        
            });    
        },

        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                this.$refs.uploadimg.submit();
                

            }else {

                return false;
            }
            });
        },

        // 上传图片之前
        beforeUpload(file){
        let dates= new Date()

         return  this.qiniu.key=file.uid
           
      
        },
        // 图片改变
        handleChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示图的长度",this.imgListLength)
            this.isChangeImg=true
        },
        // 上传图片成功
        updateDetailSuccess(response, file, fileList){
            
            this.uploadNum++
            if(this.uploadNum==this.imgListLength){
                let fileKeys=[]
                for(let i=0;i<fileList.length;i++){
                    fileKeys.push(fileList[i].response.key)
                }
                
                this.addServer({
                    imgUrl:fileKeys[0],
                    link:this.ruleForm.link

                })
                
            }
        } ,

        // 添加
        addServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemCarouselSaveCarousel, parmas).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                this.initData(this.tableParams)
                this.$refs['ruleForm'].resetFields();
                this.dialogVisible=false
                console.log("添加成功数据",data.data.data)     
                
            }); 
        },

        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 点击弹窗的叉号
        closeDialog(){
          this.$refs['ruleForm'].resetFields();
        },
        // 切换页码
        handleCurrentChange(val) {
            this.page.currentPage=val
            this.initData(this.tableParams)
            console.log(`当前页: ${val}`);
        },
        
        // 搜索
        goSearch(){
            this.initData(this.tableParams)
        },

        
        // 新增
        addMost(){
            this.dialogVisible=true;
            this.upfileList=[]
            this.submitTag="add"
            this.ruleForm={
                link:''

            }

        },
        

        

        // 初始化表格
        initData(params){
            postRequest(url.systemCarouselListCarousel, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                this.tableList=datas
                console.log("初始化返回数据",data.data)     
                
            }); 
            
        },

    },
    created(){
        this.initData(this.tableParams)
        let upToken = sessionStorage.getSessionStorage('upToken')
        console.log("upToken",upToken)
        this.qiniu={
            token:upToken
        }
    }
  }
</script>
<style lang="less" scoped>
    .userList{
        .search{
            width: 100%;
            margin-top: 50px;
            display: flex;
            justify-content: center;
            .search-box{
                width: 40%;
                
            }
        }
        .btn-box{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin: 30px 0 10px 0;
        }
    }
</style>