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

            <el-form-item class="formCity" label="城市选择：" prop="cityV" >
                <el-select
                v-model="formInline.cityV"
                @change="goSearch()"
                filterable
                allow-create
                
                placeholder="请选择文章标签">
                    <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.provinceName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>
        
        </div>
        

        <!-- 批量删除 -->
        <div  class="button-add" style=" display:flex;  justify-content: space-between; overflow: hidden; margin-top:20px; margin-left:2%;">
            <el-button  style=" margin-right:5%;margin-bottom:20px; opacity:0" type="primary"  >批量删除</el-button>  
            <el-button v-show="tableList.length>=2 ? false : true"  style=" margin-right:2%;margin-bottom:20px;display:none" type="primary"  @click="addMost()">创建</el-button>  
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
            prop="imgTex"
            label="文章和图片"

            show-overflow-tooltip>
            

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
                @click.native.prevent="changeRow(scope.$index, tableList)"
                type="success"
                size="small">
                更新
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
            width="80%"
            @close="closeDialog"
            :modal-append-to-body='false'
            :close-on-click-modal="false"
            center>
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
			
			
            <div style="display:flex; margin-top:10px">
                <el-button style="margin-left:0;width:100%" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
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
                showUrl:''
            },
            typeList:[],
            uploadNum:0,
            imgListLength:'',
            isChangeImg:false,

            tableList:[1,2],

            formInline:{
                cityV:""
            },

            ruleForm:{
                type:"",

            },
            content:null,
            editorOption:{
            
                        placeholder: '请输入文章和图片（编辑器内容）'
            },

            rules: {

                type: [
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
        handleChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示图的长度",this.imgListLength)
            this.isChangeImg=true
        },




        // 新增一条的接口
        addServer(pamas){
            postRequest(url.aboutUsInsertAboutUs, pamas).then(data=> {

                

                this.dialogVisible=false
                console.log("上传到服务器成功返回",data.data)
                this.initData({
                    pageSize:"10",
                    pageNum:this.currentPage,
                })

                this.content=""
            });  
        },

        // 更新一条的接口
        upServer(pamas){
            postRequest(url.aboutUsUpdateAboutUsById, pamas).then(data=> {
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.uploadNum=0
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                this.initData({
                    pageSize:"10",
                    pageNum:this.currentPage,
                })
                this.content=""
                
            });  
        },
        // 新增酒店
        
        addMost(){
            this.content=""
            this.dialogVisible=true;
            this.upfileList=[]
            this.submitTag="add"

            
        },
        //提交
        subPicForm(){
            
            
            this.$refs["ruleForm"].validate((valid) => {
                
                if (valid) {

                    if(this.submitTag=="add"){
                        
                        console.log("提交的参数1",this.ruleForm.type)
                         console.log("提交的参数2",this.content)
                        
                        this.addServer({
                            type:this.ruleForm.type,
                            imgTex:this.content
                        })
                    }
                    if(this.submitTag=="change"){
                        
                        console.log("提交的参数1",this.changeId)
                         console.log("提交的参数2",this.content)
                        
                        this.upServer({
                            id:this.changeId,
                            imgTex:this.content
                        })
                    }

                    
                    
                    
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

            this.$nextTick(() => {
            this.ruleForm={
                type : rows[index].type,



            }
            this.content=rows[index].imgTex
            }); 
            
            this.oldPamas={
                imgName:rows[index].imgName,
                title:rows[index].title,
                content:rows[index].content,
                
                oldImgName:rows[index].imgName,
                
                id:rows[index].id
            }
            this.upfileList=[{url:this.qiniu.showUrl+rows[index].imgName}]
            

        },  
        // 单删除
        deleteRow(index, rows) {

           
        console.log("deleteRow",rows[index].id,rows[index].bannerUrl)
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

                postRequest(url.aboutUsDeleteAboutUsById, {
                    id:rows[index].id,

                }).then(data=> {


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
            let arrId=[];
            let arrPictures=[];
            for(let i=0;i<this.multipleSelection.length;i++){
                arrId.push(this.multipleSelection[i].id)
                arrPictures.push(this.multipleSelection[i].imgName)

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
                    postRequest(url.aboutUsDeleteAboutUsById, {
                        ids:arrId,
                        imgName:arrPictures,
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

                // console.log("七牛初始化配置",data.data.data.uploadToken)
                this.qiniu={
                    showUrl:data.data.data.domain,
                    token:data.data.data.uploadToken,
                }
                        
            });     
        },

        initData(pamas){
            postRequest(url.aboutUsSelectAboutUsList, pamas).then(data=> {
                console.log("初始化数据",data.data)
                if(!getErr(data.data.code,data.data.message)) {
                    
                    return
                    
                }
                
                let datas=data.data.data;
                this.tableList=datas

                        
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
        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(event){//内容改变事件

        event.quill.deleteText(800, 4)
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
                // "cityId":this.formInline.cityV
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
       
        for( let i=0;i<ms_dictionary.length;i++){
            if(ms_dictionary[i].key=='ABOUT_US_TYPE'){
                this.typeList=ms_dictionary[i].dictionary
                console.log("5545454545454545", this.typeList)
                
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
    width: 100%;

}
.demo-ruleForm .el-form-item:nth-child(2n){
    
}
</style>

