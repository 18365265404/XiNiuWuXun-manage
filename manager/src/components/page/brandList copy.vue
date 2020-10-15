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
            <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" >

                <el-form-item class="formCity" label="城市选择：" prop="selectOneV" >
                    <el-select
                    v-model="formInline.selectOneV"
                    @change="selectOneF()"
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

                 <el-form-item class="formCity" label="城市选择：" prop="selectTwoV" >
                    <el-select
                    v-model="formInline.selectTwoV"
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

                 <el-form-item class="formCity" label="城市选择：" prop="selectThreeV" >
                    <el-select
                    v-model="formInline.selectThreeV"
                    filterable
                    allow-create
                    
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
            prop="link"
            label="链接地址"
            >
            </el-table-column>
            

            <el-table-column
            prop="operationTime"
            label="创建时间"
            >
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

        <!-- 分页 -->
        <div style="display:none" class="block pagination" >
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
                v-show="submitTag=='add' ? true : false"
                >
                    <el-input type="text"  placeholder="请输入品牌名" v-model="ruleForm.brandName" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>
                
                <el-form-item             
                prop="sort"
                v-show="submitTag=='add' ? true : false"
                >
                    <el-input type="text"  placeholder="请输入排序" v-model="ruleForm.sort" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>

            </el-form>

			
			
            <div style="display:flex;margin-left:3%;margin-top:10px">
                <el-button  slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
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
            formInline:{
                selectOneV:"",
                selectTwoV:"",
                selectThreeV:""
            },
            ruleForm:{
                brandName:"",
                sort:'',
            },
            rules: {
                brandName: [
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
        selectOneF(){
            this.selectHeadList2=[]
            this.selectHeadList3=[]
            this.formInline.selectTwoV=''
            this.formInline.selectThreeV=''
            console.log("selectOne的值",this.formInline.selectOneV)
            let  selectOneV = this.formInline.selectOneV
            this.initHeadSelct(selectOneV).then(data=>{
                let datas = data.data.data
                this.selectHeadList2=datas
            })
        },
        selectTwoF(){
            this.selectHeadList3=[]
            this.formInline.selectThreeV=''
            console.log("selectTwo的值",this.formInline.selectTwoV)
            let  selectTwoV = this.formInline.selectTwoV
            this.initHeadSelct(selectTwoV).then(data=>{
                let datas = data.data.data
                this.selectHeadList3=datas
            })
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
                link:'',

            }
        },

        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(this.submitTag=='add'){
                    
                    this.addServer({
                        brandName:this.ruleForm.brandName,
                        link:this.ruleForm.link,
                        roleId:this.ruleForm.roleId,
                    })
                }

                if(this.submitTag=='change'){

                    this.upServer({
                        nickname:this.ruleForm.nickname,
                        tel:this.ruleForm.tel,
                    })
                }
                

            }else {

                return false;
            }
            });
        },

        // 添加
        addServer(parmas){
            postRequest(url.systemLinksSaveLinks, parmas).then(data=> {

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
            postRequest(url.systemLinksListLinks, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                this.tableList=datas
                
                console.log("初始化返回数据",data.data.data)     
                
            }); 
            
        },

    },
    created(){
        this.initData(this.tableParams)
        this.initHeadSelct(0).then(data=>{
            let datas = data.data.data
            this.selectHeadList1=datas
        })

        postRequest(url.systemGoodSaveGoods, {
            goodsJson:JSON.stringify({
                        "userId": "用户ID",
                        "firstLevelId": "一级分类ID",
                        "secondLevelId": "二级分类ID",
                        "threeLevelId": "三级分类ID",
                        "brandId": "品牌ID",
                        "gooImgList": [
                            {
                            "imgUrl": "商品图一",
                            "isDiagram": 0,
                            "sort": 0
                            },
                            {
                            "imgUrl": "商品图二",
                            "isDiagram": 1,
                            "sort": 1
                            }
                        ],
                        "goodsName": "商品名",
                        "price": 0,
                        "speList": [
                            "规格一",
                            "规格二"
                        ],
                        "weight": 0,
                        "stockNum": 99,
                        "parImgList": [
                            {
                            "imgUrl": "参数图一",
                            "sort": 0
                            },
                            {
                            "imgUrl": "参数图二",
                            "sort": 1
                            }
                        ],
                        "isFree": 0,
                        "postage": 0,
                        "spkList": [
                            {
                            "skuValue": [
                                "sku一",
                                "sku二"
                            ],
                            "spuName": "spu一"
                            },
                            {
                            "skuValue": [
                                "sku三",
                                "sku四"
                            ],
                            "spuName": "spu二"
                            }
                        ]
                        }
                        )
        }).then(data=> {

            if(data.data.status!=1){
                this.$message.success(data.data.message);
                
                return
            }
            // let datas = data.data.data
            // this.tableList=datas
            
            console.log("初始化返回数据",data)     
            
        }); 
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