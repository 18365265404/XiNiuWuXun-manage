<template>
    <div class="userList">
        <!-- 查询 -->
        <div class="search">
            <el-input placeholder="请输入搜索内容"   v-model="searchV" class="search-box input-with-select">
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <!-- select操作 -->
        <div class="select-box">
            
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
            prop="brandName"
            label="品牌名称"
            >
            </el-table-column>
            
            <el-table-column
            prop="classifyStr"
            label="分类名称"
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
                    <!-- <el-button type="text" size="small"  @click.native.prevent="delet(scope.$index, tableList)" >删除</el-button> -->
                    <el-button type="text" size="small"  @click.native.prevent="upDateF(scope.$index, tableList)" >修改</el-button>
                    <el-button type="text" size="small" v-show="scope.row.statusStr=='禁用'"  @click.native.prevent="changeStatus(scope.$index, tableList,'启用')" >启用</el-button>
                    <el-button type="text" size="small" v-show="scope.row.statusStr=='启用'"  @click.native.prevent="changeStatus(scope.$index, tableList,'禁用')" >禁用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div  class="block pagination" >
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
                prop="brandName"
                
                >
                    <el-input type="text"  placeholder="请输入品牌名" v-model="ruleForm.brandName" autocomplete="off">
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


                <el-form-item  prop="selectOneV" style="width:100%" v-show="submitTag=='add' ? true : false">
                    <el-select
                    style="width:100%"
                    v-model="ruleForm.selectOneV"
                    @change="selectOneF()"

                    placeholder="请选择一级分类">
                        <el-option
                        v-for="item in selectHeadList1"
                        :key="item.classifyId"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item  prop="selectTwoV" v-show="submitTag=='add' ? true : false">
                    <el-select
                    style="width:100%"
                    v-model="ruleForm.selectTwoV"
                    @change="selectTwoF()"
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

                <el-form-item  prop="selectThreeV" v-show="submitTag=='add' ? true : false">
                    <el-select
                    @change="selectThreeF()"
                    
                    v-model="ruleForm.selectThreeV"
                    filterable
                    allow-create
                    style="width:100%"
                    placeholder="请选择三级分类">
                        <el-option
                        v-for="item in selectHeadList3"
                        :key="item.classifyId"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                </el-form-item>

            

            </el-form>

			
			
            <div style="display:flex;margin-top:10px">
                <el-button  style="width:100%" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
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
            tableList:[],
            selectHeadList1:[],
            selectHeadList2:[],
            selectHeadList3:[],
            page:{
                currentPage:1,  
                total:1000,
            },

            ruleForm:{
                brandName:"",
                sort:'',
                selectOneV:"",
                selectTwoV:"",
                selectThreeV:""
            },
            rules: {
                brandName: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                sort: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                selectOneV: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                selectTwoV: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                selectThreeV: [
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
        selectOneF(){
            this.selectHeadList2=[]
            this.selectHeadList3=[]
            this.ruleForm.selectTwoV=''
            this.ruleForm.selectThreeV=''
            console.log("selectOne的值",this.ruleForm.selectOneV)
            let  selectOneV = this.ruleForm.selectOneV
            this.initHeadSelct(selectOneV).then(data=>{
                let datas = data.data.data
                this.selectHeadList2=datas
            })
        },
        selectTwoF(){
            this.selectHeadList3=[]
            this.ruleForm.selectThreeV=''
            console.log("selectTwo的值",this.ruleForm.selectTwoV)
            let  selectTwoV = this.ruleForm.selectTwoV
            this.initHeadSelct(selectTwoV).then(data=>{
                let datas = data.data.data
                this.selectHeadList3=datas
            })
        },
        selectThreeF(){
            
            this.$forceUpdate()//强制刷新获取选择的值
        },

        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 单删除一条
        delet(index, rows){
            this.deletHttp({
                linksIds:[rows[index].linksId].join(","),
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
                arrId.push(this.multipleSelection[i].linksId)

            }


            console.log('要删除的图片',arrPictures)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.deletHttp({
                    linksIds:arrId.join(","),
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
            postRequest(url.systemLinksRemoveLinks,params).then(data=> {
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
                brandName:"",
                sort:'',
                selectOneV:"",
                selectTwoV:"",
                selectThreeV:""
            }
        },
        upDateF(index, rows){
            this.dialogVisible=true
            this.submitTag="change"
            this.changeId=rows[index].brandId;
            this.ruleForm={
                brandName:rows[index].brandName,
                sort:rows[index].sort,
                selectOneV:"0",
                selectTwoV:"0",
                selectThreeV:"0",
            }
        },
        // 启用，禁用
        changeStatus(index, rows,status){
            this.upServer({
                brandId:rows[index].brandId,
                status:rows[index].statusStr=='启用' ? '0':'1',
            })
        },

        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(this.submitTag=='add'){
                    
                    this.addServer({
                        brandName:this.ruleForm.brandName,
                        sort:this.ruleForm.sort,
                        classifyIds:`${this.ruleForm.selectTwoV},${this.ruleForm.selectThreeV}`
                    })
                }

                if(this.submitTag=='change'){

                    this.upServer({
                        brandId:this.changeId,
                        brandName:this.ruleForm.brandName,
                        sort:this.ruleForm.sort,
                    })
                }
                

            }else {

                return false;
            }
            });
        },

        // 添加
        addServer(parmas){
            postRequest(url.systemBrandSaveBrand, parmas).then(data=> {

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
            postRequest(url.systemBrandUpdateBrand, parmas).then(data=> {

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
            postRequest(url.systemBrandListBrand, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                this.tableList=datas.records
                this.page.total=datas.total
                
                console.log("初始化返回数据",data.data)     
                
            }); 
            
        },

    },
    created(){
        this.initData(this.tableParams)
        this.initHeadSelct(0).then(data=>{
            
            let datas = data.data.data

            console.log('selctOne列表',datas)
            this.selectHeadList1=datas
        })
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