<template>
    <div class="userList">
        <!-- 查询 -->
        <div class="search">
            <el-input placeholder="请输入搜索内容"   v-model="searchV" class="search-box input-with-select">
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        
        <div class="select-box" style="margin-right:-10px">
            <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" >

                <el-form-item class="formCity" label="一级分类:" prop="selectOneV" >
                    <el-select
                    v-model="formInline.selectOneV"
                    @change="selectOneF"
                    @visible-change='selectOneF2($event)'
                    filterable
                    allow-create
                    
                    placeholder="请选择一级分类">
                        <el-option
                        v-for="item in selectHeadList1"
                        :key="item.classifyId"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item class="formCity" label="二级分类" prop="selectTwoV" >
                    <el-select
                    v-model="formInline.selectTwoV"
                    @change="selectTwoF"
                    @visible-change='selectTwoF2($event)'
                    filterable
                    allow-create
                    
                    placeholder="请选择二级分类">
                        <el-option
                        v-for="item in selectHeadList2"
                        :key="item.classifyId"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                </el-form-item>

                
                <el-form-item>
                    <el-button @click="resetFormInline('formInline')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary"  style="opacity:0">批量删除</el-button>  
            <p style="text-align: center;font-size:20px;line-height:35px">{{typeNum}}级分类表格</p>
            <el-button type="primary"  @click="addMost()">创建</el-button>  
        </div>
        <!-- select操作 -->
        <div>
            
        </div>
        <!-- 表格 -->
        <el-table
        :data="tableList"
        border
        style="width: 100%">

            <el-table-column
            type="index"
            >
            </el-table-column>
            
            <el-table-column
            prop="classifyName"
            label="类别名称"
            >
            </el-table-column>


            <el-table-column
            prop="typeStr"
            label="分类等级"
            >
            </el-table-column>

            <el-table-column
            prop="sort"
            label="排序"
            >
            </el-table-column>

            <el-table-column
            prop="statusStr"
            label="状态"
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
                    <el-button type="text" size="small"  @click.native.prevent="changeF(scope.$index, tableList)" >修改</el-button>
                    <el-button type="text" size="small" v-show="scope.row.statusStr=='禁用'"  @click.native.prevent="changeStatus(scope.$index, tableList,'启用')" >启用</el-button>
                    <el-button type="text" size="small" v-show="scope.row.statusStr=='启用'"  @click.native.prevent="changeStatus(scope.$index, tableList,'禁用')" >禁用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block pagination" >
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="page.total"
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

            
            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
            
                <el-form-item             
                prop="classifyName"
                >
                    <el-input type="text"  placeholder="请输入类别名" v-model="ruleForm.classifyName" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>
                
                <el-form-item             
                prop="sort"
                >
                    <el-input type="text"  placeholder="请输入排序" v-model="ruleForm.sort" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>

            </el-form>

			
			
            <div style="display:flex;margin-top:10px">
                <el-button style="width:100%"  slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
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
        var validPhone=(rule, value,callback)=>{
            if (!value){
                callback(new Error('请输入电话号码'))
            }else  if (! /^1[3|4|5|7|8][0-9]\d{8}$/.test(value)){
                callback(new Error('请输入正确的11位手机号码'))
            }else {
                callback()
            }
        }
        return {
            dialogVisible:false,
            submitTag:'add',
            searchV:'',
            fatherId:0,
            tableList:[],
            selectHeadList1:[],
            selectHeadList2:[],
            selectHeadList3:[],
            typeNum:'',
            typeNum2:'',
            page:{
                currentPage:1,  
                total:1000,
            },
            formInline:{
                selectOneV:"",
                selectTwoV:"",
            },
            ruleForm:{
                classifyName:"",
                sort:'',
            },
            rules: {
                classifyName: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                sort: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],

            },
        }
    },

    computed:{
        tableParams(){
            return {
                current:this.page.currentPage,
                search:this.searchV
            }
        },
    },
    methods:{
        selectOneF2(blV){
            if(!blV){
                return
            }
            this.initHeadSelct(0).then(data=>{
                let datas = data.data.data
                this.selectHeadList1=datas
            })
        },
        selectTwoF2(blV){
            if(!blV){
                return
            }
            console.log("selectOne的值",this.formInline.selectOneV)
            let  selectOneV = this.formInline.selectOneV
            this.initHeadSelct(selectOneV).then(data=>{
                let datas = data.data.data
                this.selectHeadList2=datas
            })
        },

        // 搜素select清空
        resetFormInline(formName) {
            this.$refs[formName].resetFields();
            this.fatherId=0
            this.initData(this.tableParams)
        },
        selectOneF(){
            this.page.currentPage=1
            this.selectHeadList2=[]
            this.formInline.selectTwoV=''
            this.fatherId=this.formInline.selectOneV

            this.initData(this.tableParams)
        },
        selectTwoF(){
            this.page.currentPage=1
            this.fatherId=this.formInline.selectTwoV
            console.log("selectTwo的值",this.formInline.selectTwoV)
            this.initData(this.tableParams)
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
            this.submitTag="add"
            this.ruleForm={
                classifyName:"",
                sort:'',
            }
        },
        // 修改
        changeF(index, rows){
            this.dialogVisible=true
            this.submitTag="change"
            this.changeId=rows[index].classifyId;
            this.ruleForm={
                classifyName:rows[index].classifyName,
                sort:rows[index].sort,
                
            }
        },

        // 启用，禁用
        changeStatus(index, rows,status){
            this.upServer({
                classifyId:rows[index].classifyId,
                status:rows[index].statusStr=='启用' ? '0':'1',
            })
        },

        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(this.submitTag=='add'){
                    
                    this.addServer({
                        classifyName:this.ruleForm.classifyName,
                        sort:this.ruleForm.sort,
                        type:this.typeNum2,
                        fatherId:this.fatherId
                    })
                }

                if(this.submitTag=='change'){

                    this.upServer({
                        classifyName:this.ruleForm.classifyName,
                        sort:this.ruleForm.sort,
                        classifyId:this.changeId
                    })
                }
                

            }else {

                return false;
            }
            });
        },

        // 添加
        addServer(parmas){
            postRequest(url.systemClassifySaveClassify, parmas).then(data=> {

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

        // 修改
        upServer(parmas){
            postRequest(url.systemClassifyUpdateClassify,parmas).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                this.initData(this.tableParams)
                this.$refs['ruleForm'].resetFields();
                this.dialogVisible=false
                console.log("修改成功返回数据",data.data.data)     
                
            }); 
        },

        // 初始化头部下拉框
        initHeadSelct(num){

             return new Promise((resolve, reject) => {
                postRequest(url.systemClassifyListClassifyByFatherId, {
                    fatherId:num
                }).then(data=> {

                    if(data.data.status!=1){
                        this.$message.success(data.data.message);
                        
                        return
                    }
                    
                    resolve(data)
                    
                });   
                    
                    
            })
              
        },

        // 初始化表格
        initData(params){
            let selectArrO=[this.formInline.selectOneV,this.formInline.selectTwoV]
            console.log('selectArrO',selectArrO)
            let selectArrN=[]
            selectArrO.forEach((v,i)=>{
                if(v!=''){
                    selectArrN.push(v)
                }
            })
            this.typeNum2=selectArrN.length 
            switch (selectArrN.length) {
                case 0:
                    this.typeNum='一'  
                    break;

                case 1:
                    this.typeNum='二' 
                    break;
                    
                case 2:
                    this.typeNum='三' 
                    break;    
            
                default:
                    break;
            }
            
            postRequest(url.systemClassifyListClassify, {
                current:params.current,
                search:params.search,
                fatherId:this.fatherId
            }).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                this.tableList=datas.records
                this.page.total=datas.total
                console.log("初始化返回数据",data.data.data)      
                
            }); 
            
        },

    },
    created(){
        this.initData(this.tableParams)
        

        
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
        .select-box{
            display: flex;
            flex-direction: row-reverse;
            padding-top: 20px;
        }
    }
</style>