<template>
    <div>
        <el-button style="margin-left:2%"  @click="goFirst()">返回上一级</el-button>
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
            <el-button v-show="ifAdd? true : false"  style=" margin-right:2%;margin-bottom:20px" type="primary"  @click="addMost()">创建</el-button>  
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
            fixed="right"
            label="操作"
            width="300px"
           >
            <template slot-scope="scope">


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
            ifAdd:true,

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

            tableList:[],

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

        goFirst(){
            this.$router.go(-1)
        },

        handleChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示图的长度",this.imgListLength)
            this.isChangeImg=true
        },




        // 新增一条的接口
        addServer(pamas){
            postRequest(url.boutiqueCaseDetailsInsertBoutiqueCaseDetails, pamas).then(data=> {

                

                this.dialogVisible=false
                console.log("上传到服务器成功返回",data.data)
                this.initData({
                    boutiqueCaseId:this.firstId
                })

                this.content=""
            });  
        },

        // 更新一条的接口
        upServer(pamas){
            console.log(pamas)
            
            postRequest(url.boutiqueCaseDetailsUpdateBoutiqueCaseDetailsById, pamas).then(data=> {
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.uploadNum=0
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                this.initData({
                    boutiqueCaseId:this.firstId
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

            if(this.submitTag=="add"){
                
                console.log("提交的参数1",this.ruleForm.type)
                    console.log("提交的参数2",this.content)
                
                this.addServer({
                    boutiqueCaseId:this.firstId,
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

        },


        //弹窗出现 修改
        changeRow(index, rows){
            this.isChangeImg=false
            this.dialogVisible=true;
            this.submitTag="change"
            this.changeId=rows[index].id;
            this.changeIndex=index;

            this.$nextTick(() => {

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
            postRequest(url.boutiqueCaseDetailsSelectByBoutiqueCaseId, pamas).then(data=> {
                console.log("初始化数据",data.data.data)
                if(data.data.data==undefined){
                    this.ifAdd=true
                    
                    return
                }else{
                    this.ifAdd=false
                }
                let arr=[]
                arr.push(data.data.data)
                setTimeout(() => {
                    this.tableList=arr
                }, 200);
                
                

                

                        
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

        event.quill.deleteText(80000, 4)
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
                boutiqueCaseId:this.firstId
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
        let firstId=localStorage.getItem("case_id")
        this.firstId=firstId
        this.initData({
            boutiqueCaseId:firstId
        })
        this.initQiniu()
        

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

