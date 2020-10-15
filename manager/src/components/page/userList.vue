<template>
    <div class="userList">
        <!-- 查询 -->
        <div class="search">
            <el-input placeholder="请输入搜索内容"   v-model="searchV" class="search-box input-with-select">
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary" style="opacity:0"  >批量删除</el-button>  
            <el-button type="primary"  @click="addMost()">创建</el-button>  
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
            
            prop="username"
            label="用户名"
            >
            </el-table-column>

            <el-table-column
            prop="nickname"
            label="昵称"
            >
            </el-table-column>

            <el-table-column
            prop="roleName"
            label="角色名"
            >
            </el-table-column>

            <el-table-column
            prop="tel"
            label="电话"
            >
            </el-table-column>

            <el-table-column
            prop="typeStr"
            label="类型"
            >
            </el-table-column>
            
            <el-table-column
            prop="isSystemStr"
            label="是否是系统"
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
                    <el-button type="text" size="small"  @click.native.prevent="changeUser(scope.$index, tableList)" >修改</el-button>
                    <el-button type="text" size="small"  @click.native.prevent="changelock(scope.$index, tableList)" >{{scope.row.statusStr=='解锁' ? '锁定':'解锁'}}</el-button>
                    <el-button type="text" size="small"  @click.native.prevent="resetPass(scope.$index, tableList)" >重置密码</el-button>
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
                prop="username"
                v-show="submitTag=='add' ? true : false"
                >
                    <el-input type="text"  placeholder="请输入用户名" v-model="ruleForm.username" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>
                
                <el-form-item             
                prop="password"
                v-show="submitTag=='add' ? true : false"
                >
                    <el-input type="text"  placeholder="请输入密码" v-model="ruleForm.password" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>

                <el-form-item             
                prop="nickname"
                >
                    <el-input type="text"  placeholder="请输入昵称" v-model="ruleForm.nickname" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>

                <el-form-item             
                prop="tel"
                >
                    <el-input type="text"  placeholder="请输入电话" v-model="ruleForm.tel" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>

                

                <el-form-item             
                prop="roleId"
                v-show="submitTag=='add' ? true : false"
                >

                    <el-select
                    v-model="ruleForm.roleId"
                    style="width:100%"
                    filterable
                    allow-create
                    
                    placeholder="请选择角色">
                        <el-option
                        v-for="item in roleList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                        </el-option>
                    </el-select>

                </el-form-item>




            </el-form>

			
			<div style="display:flex;width:100%;margin-top:10px">
                <el-button style='width:100%'  slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
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
                username:"",
                password:'',
                nickname:"",
                tel:"",
                roleId:"",

            },
            rules: {
                username: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                password: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                nickname: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                tel: [
                    { validator: validPhone, trigger: 'blur' }
                ],
                roleId: [
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
        // 锁定、解锁
        changelock(index, rows){
            this.changeId=rows[index].userId; 
            this.upServer({
                status:rows[index].statusStr=="解锁" ? '0':'1'
            })
        },
        // 重置密码
        resetPass(index, rows){
            this.changeId=rows[index].userId; 
            this.upServer({
                isReset:1
            })
        },
        
        // 新增
        addMost(){
            this.dialogVisible=true;
            this.submitTag="add"
            this.ruleForm={
                username:"",
                password:'',
                nickname:"",
                tel:"",
                roleId:"",

            },
            this.initRole({current:1})
        },
        changeUser(index, rows){
            this.dialogVisible=true
            this.submitTag="change"
            this.changeId=rows[index].userId;
            this.ruleForm={
                username:'0',
                password:'0',
                nickname:rows[index].nickname,
                tel:rows[index].tel,
                roleId:'0',
            }
        },
        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(this.submitTag=='add'){
                    
                    this.addServer({
                        username:this.ruleForm.username,
                        password:this.ruleForm.password,
                        nickname:this.ruleForm.nickname,
                        tel:this.ruleForm.tel,
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
            postRequest(url.systemUserSaveUser, parmas).then(data=> {

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
            patchRequest(url.systemUserupdateUser+this.changeId, parmas).then(data=> {

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
        // 初始化表格
        initData(params){
            getRequest(url.systemUserListUser, params).then(data=> {

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
        // 初始化角色
        initRole(params){
            getRequest(url.systemRoleListRole, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                this.roleList=datas.records

                console.log("角色返回数据",data.data.data)     
                
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