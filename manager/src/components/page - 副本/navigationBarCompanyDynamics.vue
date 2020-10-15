<template>
    <div>
        
        <!-- 搜索栏 -->
        <div class="top-search" style="display:block; text-align: center">
            <el-input style="margin: 40px auto; margin-bottom:10px; width:50%;" placeholder="请输入内容"   v-model="search" class="input-with-select">
                
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <!-- 查询城市 -->
        <div style="overflow:hidden;display:block;">
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
            <el-button  style=" margin-right:5%;margin-bottom:20px" type="primary"  @click="deletMost()">批量删除</el-button>  
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
            type="selection"
           >
            </el-table-column>

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
			                <img :src="qiniuH+scope.row.url"    style="max-height:400px" />
			                <i slot="reference"  class="el-icon-view" style="font-size:16px"></i>
			            </el-popover>
			        </div>
			    </template>  
			
			</el-table-column>

            <el-table-column
			style="position:relative"
			prop="title"
			label="标题"

			show-overflow-tooltip>
			
			</el-table-column>

            <el-table-column
			style="position:relative"
			prop="synopsis"
			label="简介"

			show-overflow-tooltip>
			
			</el-table-column>

            <el-table-column
			style="position:relative"
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
                @click.native.prevent="changeRow(scope.$index, tableList)"
                type="success"
                size="small">
                更新
                </el-button>

                <!-- <el-button
                @click.native.prevent="showDetail(scope.$index, tableList)"
                type="success"
                size="small">
                详情
                </el-button> -->
                <el-button
                @click.native.prevent="showTextImg(scope.$index, tableList)"
                type="success"
                size="small">
                详情
                </el-button>

            </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
          <div class="block" style="overflow:hidden;">

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
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（400*275px）</span>
            </el-upload>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
				

            <el-form-item             
            prop="title"
            >
                <el-input type="text"  placeholder="请输入标题" v-model.number="ruleForm.title" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="synopsis"
            >
                <el-input type="text"  placeholder="请输入简介" v-model.number="ruleForm.synopsis" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>


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


        <!-- 弹窗富文本 -->
            <el-dialog
            title="上传"
            :visible.sync="dialogVisible2"
            width="60%"
            @close="closeDialog2"
            :modal-append-to-body='false'
            :close-on-click-modal="false"
            center>

            <div style="overflow: hidden;">
                <quill-editor 
                v-model="content" 
                ref="myQuillEditor" 
                style="min-height:200px ;"
                :options="editorOption" 
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
                
                </quill-editor>
            </div>
			
			<div>
                <span style="color:red">提示：文章中插入的图片大小总和不得超过1MB</span>
            </div>
            <div style="display:flex; margin-top:10px">
                
                <el-button style="margin-left:0;width:100%" slot="trigger" size="small" type="primary" @click="subTextForm">提交</el-button>
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

            formInline:{
                typeV:""
            },

            ruleForm:{
                title:"",
                synopsis:"",
                type:""
            },

            rules: {

                title: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                type: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                synopsis: [
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
            content:null,
            dialogVisible2:false,
            editorOption:{
                placeholder: '请输入文章和图片（编辑器内容）'
            },
            
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

        showDetail(index, rows){
            
            this.$router.push({ path: '/dynamic_detail' })
            localStorage.setItem("dynamic_id",rows[index].id)

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
                        type:this.ruleForm.type,
                        title:this.ruleForm.title,
                        synopsis:this.ruleForm.synopsis
                        

                    })
                }
                if(this.submitTag=="change"){
                    this.oldPamas.url=fileKeys[0]
                    this.oldPamas.title=this.ruleForm.title
                    this.oldPamas.synopsis=this.ruleForm.synopsis
                    console.log("`````````````````````````````",this.oldPamas)
                    
                    this.upServer(this.oldPamas)
                }
                
            }
        } ,

        // 新增一条的接口
        addServer(pamas){
            postRequest(url.companyDynamicsInsertCompanyDynamics, pamas).then(data=> {
                this.uploadNum=0
                
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.initData(this.tableData)
                this.initQiniu()
                
            });  
        },

        // 更新一条的接口
        upServer(pamas){
            postRequest(url.companyDynamicsUpdateCompanyDynamicsById, pamas).then(data=> {
                this.uploadNum=0
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.initData(this.tableData)
                
            });  
        },
        // 新增酒店
        
        addMost(){
            
            this.dialogVisible=true;
            this.upfileList=[]
            this.submitTag="add"
            this.$nextTick(() => {
                this.$refs['ruleForm'].resetFields();
            });
            
        },
        //提交
        subPicForm(){
            this.$refs["ruleForm"].validate((valid) => {
                
                if (valid) {
            
                    if(this.submitTag=="change" && !this.isChangeImg){
                                
                        this.oldPamas.oldUrl=""
                        this.oldPamas.title=this.ruleForm.title
                        this.oldPamas.synopsis=this.ruleForm.synopsis
                        
                        console.log("888888888888888888",this.oldPamas)
                        this.upServer(this.oldPamas)
                    }
                    this.$refs.uploadimg.submit();

                }else {

                        return false;
                }
            });

        },


        //弹窗出现 修改
        changeRow(index, rows){
            this.isChangeImg=false
            this.dialogVisible=true;
            this.submitTag="change"
            this.changeId=rows[index].id;
            this.changeIndex=index;
            this.ruleForm={
               type: rows[index].type,
               title: rows[index].title,
               synopsis: rows[index].synopsis,
               
            }
            
            this.oldPamas={
                oldUrl:rows[index].url,
                title:rows[index].title,
                synopsis:rows[index].synopsis,
                
                url:rows[index].url,
                
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

                postRequest(url.companyDynamicsDeleteCompanyDynamicsByArray, {
                    ids:rows[index].id,
                    urls:rows[index].url,
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

        // 批量删除
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
                arrId.push(this.multipleSelection[i].id)
                arrPictures.push(this.multipleSelection[i].url)

            }




            if(arrId.length==0){
                this.$message({
                    type: 'success',
                    message: '请选择后删除'
                });
                return
            }

                this.$confirm('是否删除?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    postRequest(url.companyDynamicsDeleteCompanyDynamicsByArray, {
                        ids:arrId,
                        urls:arrPictures,
                        }).then(data=> {
                        if(!getErr(data.data.code,data.data.message)) {
                            return
                        }
                        console.log("删除后打印的数据",data)
                        this.dialogVisible=false
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


        // 点击弹窗的叉号
        closeDialog2(){
            this.content=''
        },

/***********************富文本的操作*****************************/ 
        // 富文本弹窗出现
        showTextImg(index, rows){
            
            this.ifTextImg=rows[index].flag
            this.textImgId=rows[index].id
            this.dialogVisible2=true
            if(this.ifTextImg){
                
                this.initTextImg(rows[index].id)
            }else{
                this.content=null
            }

        },

        //提交
        subTextForm(){
            
            var str = this.content

            console.log(this.getImgSize(str))   


            if(this.getImgSize(str)>1228.8){
                this.$message({
                    message: '您编辑的文章内容超出限制大小，请调整图片大小',
                    type: 'warning'
                });
                return
            }
            

            this.loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })

            if(this.ifTextImg==false){
                
                console.log("提交的参数1",this.ruleForm.type)
                    console.log("提交的参数2",this.content)
                
                this.addTextImg({
                    companyDynamicsId:this.textImgId,
                    imgTex:this.content
                })
            }
            if(this.ifTextImg==true){
                
                console.log("提交的参数1",this.changeId)
                    console.log("提交的参数2",this.content)
                
                this.upTextImg({
                    id:this.textImgId,
                    imgTex:this.content
                })
            }

        },

        // 新增一条富文本的接口
        addTextImg(pamas){
            postRequest(url.companyDynamicsDetailsInsertCompanyDynamicsDetails, pamas).then(data=> {

                this.loading.close()
                this.ifTextImg=true
                this.content=""
                this.dialogVisible2=false
                this.initData(this.tableData)
                console.log("新增富文本成功返回",data.data)
  
                
            });  
        },

        // 更新一条富文本的接口
        upTextImg(pamas){
            console.log(pamas)
            
            postRequest(url.companyDynamicsDetailsUpdateCompanyDynamicsDetailsById, pamas).then(data=> {
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.uploadNum=0
                this.dialogVisible2=false
                console.log("修改富文本成功返回",data)
                this.initData(this.tableData)
                this.content=""
                this.loading.close()
            });  
        },
 



        // 计算文件字节大小
        getImgSize(str) {
            //获取base64图片大小，返回KB数字
           
            
            var strLength = str.length;
            var fileLength = parseInt(strLength - (strLength / 8) * 2);

            // 由字节转换为KB
            var size = "";
            size = (fileLength / 1024).toFixed(2);
            
            
            
            return parseInt(size);

        },
        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(event){//内容改变事件

        event.quill.deleteText(80000, 4)
        },

        initTextImg(id){
            postRequest(url.companyDynamicsDetailsSelectByCompanyDynamicsId, {
                companyDynamicsId:id
            }).then(data=> {
                console.log("富文本初始化数据",data.data.data)
                this.content=data.data.data.imgTex
                
                this.textImgId=data.data.data.id
                

                        
            });     
        },



        goSearch(){
            console.log(this.tableData)
            this.initData(this.tableData)

            
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
            postRequest(url.companyDynamicsSelectCompanyDynamicsList, pamas).then(data=> {
                console.log("初始化数据",data.data)
                if(!getErr(data.data.code,data.data.message)) {
                    
                    return
                    
                }
                
                let datas=data.data.data;
                this.tableList=datas.list
                this.total= datas.total        
                this.navigatepageNums=datas.navigatepageNums      
                this.currentPage=datas.pageNum 
                        
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
            this.tableData.pageNum=val
            this.initData(this.tableData)
        },
    },

    computed:{
        tableData(){
            return {
                "pageNum":this.currentPage,
                "pageSize":"10",
                
                "likeName":this.search,
                "type":this.formInline.typeV
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
            if(ms_dictionary[i].key=='DYNAMIC_TYPE'){
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

