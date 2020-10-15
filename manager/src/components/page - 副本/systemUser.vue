<template>
    <div>

        <!-- 搜索栏 -->
        <div class="top-search" style="display:block; text-align: center">
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
            <el-button  style=" margin-right:5%;margin-bottom:20px;opacity:0" type="primary"  >批量删除</el-button>  
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

            <!-- <el-table-column
            type="selection"
           >
            </el-table-column> -->

           <el-table-column
            type="index"
            >
            </el-table-column>

            <el-table-column
			prop="username"
			label="用户名"

			show-overflow-tooltip>
			</el-table-column>
			
			<el-table-column
			prop="nickname"
			label="昵称"

			show-overflow-tooltip>
			</el-table-column>

            <el-table-column
			prop="phone"
			label="电话"

			show-overflow-tooltip>
			</el-table-column>

            <el-table-column
			prop="roleName"
			label="角色名"

			show-overflow-tooltip>
			</el-table-column>

            

            <el-table-column
			prop="status"
			label="状态"

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
            width="360px"
           >
            <template slot-scope="scope">

                <el-button
                @click.native.prevent="changeRow(scope.$index, tableList)"
                type="success"
                size="small">
                更新
                </el-button>

                <el-button
                @click.native.prevent="resetPass(scope.$index, tableList)"
                type="success"
                size="small">
                重置密码
                </el-button>

                <el-button
                @click.native.prevent="changeStatus(scope.$index, tableList)"
                type="success"
                size="small">
                {{scope.row.status=="正常" ? '锁定' : '正常'}}
                </el-button>

                <!-- <el-button
                @click.native.prevent="changePass(scope.$index, tableList)"
                type="success"
                size="small">
                修改密码
                </el-button> -->

                <!-- <el-button
                @click.native.prevent="deleteRow(scope.$index, tableList)"
                type="danger"
                size="small">
                删除
                </el-button> -->
                

            </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
          <div class="block" style="overflow:hidden;display:block">

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

            
            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
            
            <el-form-item             
            prop="username"
            v-show="submitTag=='add' ? true : false"
            >
                <el-input type="text"  placeholder="请输入用户名" v-model.number="ruleForm.username" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>


            <el-form-item             
            prop="nickname"
            >
                <el-input type="text"  placeholder="请输入昵称" v-model.number="ruleForm.nickname" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="phone"
            >
                <el-input type="text"  placeholder="请输入电话" v-model.number="ruleForm.phone" autocomplete="off">
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
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>

            </el-form-item>




            </el-form>

			
			
            <div style="display:flex;margin-left:3%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;margin-right:4%" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        
        </el-dialog>  

        <!-- 弹窗修改状态 -->
            <!-- <el-dialog
            title="上传"
            :visible.sync="dialogVisible3"
            width="60%"
            
            :modal-append-to-body='false'
            :close-on-click-modal="false"
            center>

            </el-dialog>  -->

        <!-- 弹窗修改密码 -->
            <el-dialog
            title="上传"
            :visible.sync="dialogVisible2"
            width="60%"
            @close="closeDialog2"
            :modal-append-to-body='false'
            :close-on-click-modal="false"
            center>

            
            <el-form :model="ruleForm2" :rules="rules"   ref="ruleForm2"  size='medium'    class="demo-ruleForm">
            
            <el-form-item             
            prop="oldPassword"
            
            >
                <el-input type="text"  placeholder="请输入旧密码( 默认密码：88888888)" v-model.number="ruleForm2.oldPassword" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>


            <el-form-item             
            prop="newPassword"
            >
                <el-input type="text"  placeholder="请输入新密码" v-model.number="ruleForm2.newPassword" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>



            </el-form>

			
			
            <div style="display:flex;margin-left:3%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;margin-right:4%" slot="trigger" size="small" type="primary" @click="subPicForm2">提交</el-button>
            </div>
        
        </el-dialog>  
    </div>
</template>

<script>

import url from '../../utils/url';
import {getCookie,getErr} from '../../utils/utils';
import {postRequest,uploadFileRequest} from '../../utils/api';
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
                cityV:""
            },

            ruleForm:{
                nickname:"",
                phone:"",
                username:"",
                roleId:"",

            },
            ruleForm2:{

                newPassword:"",
                oldPassword:"",

            },

            rules: {

                nickname: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                phone: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                username: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                
                roleId: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                oldPassword: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],



            },

            dialogVisible:false,
            dialogVisible2:false,
            search:"",
            currentPage: 1,
            navigatepageNums:[],
            cityList:[],
            total:1,
            changeId:"",//中间变化的ID
            changeIndex:"",
            roleList:[],
        }
    },
    methods:{





        // 新增一条的接口
        addServer(pamas){
            postRequest(url.userInsertUser, pamas).then(data=> {
                this.uploadNum=0
                
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.initData(this.tableData) //查询所有  

                
            });  
        },

        // 修改一条的接口
        upServer(pamas){
            postRequest(url.userUpdateUserById, pamas).then(data=> {
                
                
                this.dialogVisible=false
                this.dialogVisible2=false
                console.log("上传到服务器成功返回",data)
                if(data.data.status!=1) {
                    return
                }
                if(this.btnName=='reset'){
                    this.$message({
                        type: 'success',
                        message: '密码重置成功'
                    });
                }

                if(this.btnName=='changePs'){
                    this.$message({
                        type: 'success',
                        message: '密码修改成功'
                    });

                }
                if(this.btnName=='changeStatus'){
                    this.$message({
                        type: 'success',
                        message: '状态修改成功'
                    });

                }

                
                this.initData(this.tableData) //查询所有  

                
            });  
        },

        // 新增
        
        addMost(){
            
            this.dialogVisible=true;
            this.upfileList=[]
            this.submitTag="add"

            
        },
        //提交
        subPicForm(){

        this.$refs["ruleForm"].validate((valid) => {
                
            if (valid) {    
                if(this.submitTag=='add'){
                    this.addServer({
                        nickname:this.ruleForm.nickname,
                        phone:this.ruleForm.phone,
                        username:this.ruleForm.username,
                        
                        roleId:this.ruleForm.roleId
                    })
                }

                if(this.submitTag=='change'){
                    this.upServer({
                        nickname:this.ruleForm.nickname,
                        phone:this.ruleForm.phone,
                        status:"",
                        oldPassword:"",
                        newPassword:"",
                        flag:"",
                        id:this.changeId
                    })
                }
                

            }else {

                return false;
            }
        });
        },

        //提交修改密码
        subPicForm2(){

        this.$refs["ruleForm2"].validate((valid) => {
                
            if (valid) {    
                this.upServer({
                    nickname:"",
                    phone:"",
                    status:"",
                    oldPassword:this.ruleForm2.oldPassword,
                    newPassword:this.ruleForm2.newPassword,
                    flag:"0",
                    id:this.changeId
                })
                

            }else {

                return false;
            }
        });
        },
        
        // 重置密码
        resetPass(index, rows){
            this.changeId=rows[index].id;
            this.btnName='reset'
            this.upServer({
                nickname:"",
                phone:"",
                status:"1",
                oldPassword:"",
                newPassword:"",
                flag:"1",
                id:rows[index].id
            })
        },
        // 修改状态
        changeStatus(index, rows){
            let cStatus=rows[index].status=="正常" ? '1':'0'

            this.changeId=rows[index].id;
            this.btnName='changeStatus'
            this.upServer({
                nickname:rows[index].nickname,
                phone:rows[index].phone,
                status:cStatus,
                oldPassword:"",
                newPassword:"",
                flag:"",
                id:rows[index].id
            })
        },
        // 修改密码
        changePass(index, rows){
            this.dialogVisible2=true;
            this.changeId=rows[index].id;
            this.btnName='changePs'
        },

        //弹窗出现 修改
        changeRow(index, rows){
            
            this.dialogVisible=true;
            this.submitTag="change"
            this.changeId=rows[index].id;
            this.changeIndex=index;

            this.ruleForm={
                nickname:rows[index].nickname,
                phone:rows[index].phone,
                username:rows[index].username,
                roleId:rows[index].roleId,
            }
            

            

        },
        // 单删除
        deleteRow(index, rows) {

           
        console.log("deleteRow",rows[index].id,rows[index].url)
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

                postRequest(url.reservedInformationDeleteReservedInformationByArray, {
                    ids:rows[index].id,

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
                    postRequest(url.reservedInformationDeleteReservedInformationByArray, {
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
          this.$refs['ruleForm2'].resetFields();
        },

        goSearch(){
          
            console.log("this.tableData",this.tableData)
            this.initData(this.tableData) //查询所有  
            
        },

        initRole(){
            postRequest(url.roleSelectAllRole, {}).then(data=> {

                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                console.log("查询所有角色",data.data.data)
                this.roleList=data.data.data
                        
            });     
        },

        initData(pamas){
            postRequest(url.userSelectUserList, pamas).then(data=> {
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }

                console.log("初始化数据",data)

                
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
                "likeName":this.search,
                // "cityId":this.formInline.cityV
            }
        },
    },

    created(){

        this.initData({
            pageSize:"10",
            pageNum:this.currentPage,
        })

        this.initRole()
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

