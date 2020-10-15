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
            <el-button type="primary"  style="opacity:0">批量删除</el-button>  
            <el-button type="primary" v-show="tableList.length==0"  @click="addMost()">创建</el-button>  
        </div>
        <!-- 表格 -->
        <el-table
        :data="tableList"
        border
        style="width: 100%"        
        >


            <el-table-column
            type="index"
            >
            </el-table-column>
            
            <el-table-column
            
            prop="designation"
            label="链接名称"
            >
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
                prop="designation"
                v-show="submitTag=='add' ? true : false"
                >
                    <el-input type="text"  placeholder="请输入链接名" v-model="ruleForm.designation" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>
                
                <el-form-item             
                prop="link"
                v-show="submitTag=='add' ? true : false"
                >
                    <el-input type="text"  placeholder="请输入链接地址" v-model="ruleForm.link" autocomplete="off">
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
            roleList:[],
            page:{
                currentPage:1,  
                total:1000,
            },
            ruleForm:{
                designation:"",
                link:'',


            },
            rules: {
                designation: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                link: [
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
        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 单删除一条
        delet(index, rows){
            this.deletHttp({
                recordInformationId:rows[index].recordInformationId,
            })
        },


        // 删除请求
        deletHttp(params){
            postRequest(url.systemRecordInformationRemoveRecordInformation,params).then(data=> {
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                console.log("删除后打印的数据",data)
                this.dialogVisible=false
                this.initData(this.tableParams) 
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
                designation:"",
                link:'',

            }
        },

        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(this.submitTag=='add'){
                    
                    this.addServer({
                        designation:this.ruleForm.designation,
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
            postRequest(url.systemRecordInformationSaveRecordInformation, parmas).then(data=> {

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

        // 初始化表格
        initData(params){
            postRequest(url.systemRecordInformationListRecordInformation, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let list =[]
                let datas = data.data
                console.log("初始化返回数据",datas.data) 
                if(datas.data==null){
                    this.tableList=[]
                    return
                }
                list.push(datas.data)
                this.tableList=list

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
    }
</style>