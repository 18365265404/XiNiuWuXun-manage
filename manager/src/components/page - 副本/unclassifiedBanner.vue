<template>
    <div>

        <!-- 搜索栏 -->
        <div class="top-search" style="display:none; text-align: center">
            <el-input style="margin: 40px auto; margin-bottom:10px; width:50%;" placeholder="请输入内容"   v-model="search" class="input-with-select">
                
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <!-- 查询城市 -->
        <div style="overflow:hidden;display:none;">
            <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" style="float:right;margin-right:0.5%">

            <el-form-item             
            prop="type"
            v-show="submitTag=='add' ? true : false"
            >

                <el-select
                @change="goSearch()"
                v-model="formInline.typeV"
                style="width:100%"
                filterable
                allow-create
                
                placeholder="请选择类型">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.describe"
                    :value="item.value">
                    </el-option>
                </el-select>

            </el-form-item>

        </el-form>
        
        </div>
        

        <!-- 批量删除 -->
        <div  class="button-add" style=" display:flex;  justify-content: space-between; overflow: hidden; margin-top:20px; margin-left:2%;">
            <el-button  style=" margin-right:5%;margin-bottom:20px;opacity:0" type="primary" >批量删除</el-button>  
            <el-button  style=" margin-right:2%;margin-bottom:20px" type="primary"  @click="addMost()">创建</el-button>  
        </div>

        <el-table
            :data="tableList"
            tooltip-effect="dark"
            style="width: 96%;margin:0 auto"
            border
            :header-cell-style="{background:'#EEF1F6'}"
            size="small"
            @selection-change="handleSelectionChange">

           <el-table-column
            type="index"
            >
            </el-table-column>
			
			<el-table-column
			style="position:relative"
			prop="url"
			label="图片"

			show-overflow-tooltip>
			    <template    slot-scope="scope">            
			        <div title="点击放大显示" >
			            <img :src="qiniuH+scope.row.url"    style="width:60px; height:20px" />
			            <el-popover
			            placement="right"
			            trigger="click"
			            >
			                <img :src="qiniuH+scope.row.url"    style="max-height:400px;max-width:1200px" />
			                <i slot="reference"  class="el-icon-view" style="font-size:16px"></i>
			            </el-popover>
			        </div>
			    </template>  
			
			</el-table-column>
            


            <el-table-column
			prop="type"
			label="类型"
			show-overflow-tooltip>
			</el-table-column>

			<el-table-column
			prop="dateTime"
			label="更新时间"
			show-overflow-tooltip>

                <template    slot-scope="scope">            
			        {{scope.row.dateTime|date}}
			    </template>  
			</el-table-column>

            <el-table-column
            fixed="right"
            label="操作"
            width="300px"
           >
            <template slot-scope="scope">



                <el-button
                @click.native.prevent="deleteRow(scope.$index, tableList)"
                type="danger"
                size="small">
                删除
                </el-button>
                

                <el-button
                style="display:none"
                @click.native.prevent="changeRow(scope.$index, tableList)"
                type="success"
                size="small">
                更新
                </el-button>
                

            </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
          <div class="block" style="overflow:hidden;display:none">

                <el-pagination
                style="float:right; margin-right:10%"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="navigatepageNums"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="total"
                >
                </el-pagination>
            </div>


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
            style="margin-left:3%;margin-right:4%"
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
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（首页两张图1210*680px）</span><span>,其他（1900*396px）</span>
            </el-upload>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
				



            <el-form-item             
            prop="type"
            v-show="submitTag=='add' ? true : false"
            >

                <el-select
                
                v-model="ruleForm.type"
                style="width:100%"
                filterable
                allow-create
                
                placeholder="请选择类型">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.describe"
                    :value="item.value">
                    </el-option>
                </el-select>

            </el-form-item>


            </el-form>

			
			
            <div style="display:flex;margin-left:3%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;margin-right:4%" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        
        </el-dialog>  
    </div>
</template>

<script>

import url from '../../utils/url';
import {getCookie,getErr} from '../../utils/utils';
import {postRequest,uploadFileRequest} from '../../utils/api';
import sessionStorage from '../../utils/sessionStorage'
export default {
    data(){

        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };
        return {
            submitTag:"add",

            typeList:[],
            upfileList:[],
            file:"",
            qiniu:{
                upUrl:'',
                token:'',

            },
            qiniuH:url.qiniuH,
            uploadNum:0,
            imgListLength:'',
            isChangeImg:false,

            tableList:[],
            ruleForm:{
                type:""
            },
            formInline:{
                typeV:""
            },



            rules: {

                title: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],



            },

            dialogVisible:false,
            search:"",
            currentPage: 1,
            navigatepageNums:[],
            cityList:[],
            total:1,
            changeId:"",//中间变化的ID
            changeIndex:"",
        }
    },
    methods:{

        // 上传图片之前
        beforeUpload(file){
        let dates= new Date()

         return  this.qiniu.key=file.uid
           
      
        },
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
                
                // alert("上传好了哦")
                console.log("要传给后端的key集合",fileKeys)
                if(this.submitTag=="add"){
                    this.addServer({
                        url:fileKeys[0],
                        type:this.ruleForm.type

                    })
                }
                if(this.submitTag=="change"){
                    this.oldPamas.url=fileKeys[0]

                    console.log("`````````````````````````````",this.oldPamas)
                    
                    this.upServer(this.oldPamas)
                }
                
            }
        } ,

        // 新增一条的接口
        addServer(pamas){
            postRequest(url.bannerInsertBanner, pamas).then(data=> {
                this.uploadNum=0
                
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }

                this.initData({
                    pageSize:"10",
                    pageNum:this.currentPage,
                })
                this.initQiniu()
                
            });  
        },

        // 更新一条的接口
        upServer(pamas){
            postRequest(url.slideshowUpdate, pamas).then(data=> {
                this.uploadNum=0
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.initData({
                    pageSize:"10",
                    pageNum:this.currentPage,
                })
                
            });  
        },
        // 新增酒店
        
        addMost(){
            
            this.dialogVisible=true;
            this.upfileList=[]
            this.submitTag="add"
            this.$nextTick(() => {
                this.$refs.uploadimg.clearFiles()
            });
            
        },
        //提交
        subPicForm(){
            
            if(this.submitTag=="change" && !this.isChangeImg){
                        
                this.oldPamas.oldImgName=""
                this.oldPamas.title=this.ruleForm.title
                console.log("888888888888888888",this.oldPamas)
                this.upServer(this.oldPamas)
            }
            this.$refs.uploadimg.submit();


        },


        //弹窗出现 修改
        changeRow(index, rows){
            this.isChangeImg=false
            this.dialogVisible=true;
            this.submitTag="change"
            this.changeId=rows[index].id;
            this.changeIndex=index;

            
            this.oldPamas={
                oldUrl:rows[index].url,
                title:rows[index].title,
                oldUrl:rows[index].url,
                
                id:rows[index].id
            }
            this.upfileList=[{url:this.qiniuH+rows[index].url}]
            

        },
        // 单删除
        deleteRow(index, rows) {

           
        console.log("deleteRow",rows[index].id,rows[index].url)
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

                postRequest(url.bannerDeleteBannerById, {
                    id:rows[index].id,
                    url:rows[index].url,
                }).then(data=> {
                    console.log("删除后打印的数据",data)
                    this.dialogVisible=false
                    if(!getErr(data.data.code,data.data.message)) {
                    return
                    }
                    this.initData(this.tableData) //查询所有  
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });        
                                    
                });    
                       
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });          
            });
   
        
        
        },


        uploadFile(file){
            this.formDate.append('file', file.file);
        },

        // 点击弹窗的叉号
        closeDialog(){
            this.$refs['ruleForm'].resetFields();
        },

        goSearch(){

            console.log("this.tableData",this.tableData)
            this.initCitySelct(this.tableData)
            
        },

        initQiniu(){
            postRequest(url.initGetQiniuConfig, {}).then(data=> {

                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                console.log("七牛初始化配置",data.data.data)
                this.qiniu={
                    token:data.data.data
                }
                        
            });     
        },

        initData(pamas){
            postRequest(url.bannerSelectBannerList, pamas).then(data=> {
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }

                console.log("初始化数据",data)
                let datas=data.data.data;
                this.tableList=datas
     
                // this.navigatepageNums=datas.navigatepageNums      
                // this.currentPage=datas.pageNum 
                        
            });     
        },
        initCitySelct(){
            postRequest(url.cityGetCityListByOpen, {}).then(data=> {

                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                console.log("初始化城市select",data)
                this.cityList=data.data.data
                let allcityO={id:"",provinceName:"全部城市"}
                this.cityList.unshift(allcityO)
                console.log("初始化城市select2",this.cityList)        
            });     
        },

        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // f分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.initData({
                pageSize:"10",
                pageNum:val,
            })
        },
    },

    computed:{
        tableData(){
            return {
                "pageNum":this.currentPage,
                "pageSize":"10",
                // "userId":localStorage.getItem('ms_userId'),
                // "likeName":this.search,
                "cityId":this.formInline.cityV
            }
        },
    },

    created(){

        this.initData({
            pageSize:"10",
            pageNum:this.currentPage,
        })
        this.initQiniu()
        let ms_dictionary=sessionStorage.getSessionStorage("ms_dictionarys")
       console.log("当前的字典值1", ms_dictionary)
        for( let i=0;i<ms_dictionary.length;i++){
            if(ms_dictionary[i].key=='BANNER_TYPE'){
                this.typeList=ms_dictionary[i].dictionary
                console.log("当前的字典值2", this.typeList)
                
            }
        }
    },
}
</script>

<style scoped>
.demo-ruleForm{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.demo-ruleForm .el-form-item{
    width: 93%;
    margin-left: 3%
}
.demo-ruleForm .el-form-item:nth-child(2n){
    
}
</style>

