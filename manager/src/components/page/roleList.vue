<template>
    <div class="userList">
        <!-- 查询 -->
        <div class="search" style="opacity:0"  >
            <el-input placeholder="请输入搜索内容"   v-model="searchV" class="search-box input-with-select">
                <el-button slot="append"  icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary" style="opacity:0"  >批量删除</el-button>  
            <el-button type="primary" style="opacity:0" >创建</el-button>  
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
            prop="roleName"
            label="角色名"
            >
            </el-table-column>
            
            <el-table-column
            fixed="right"
            label="操作"
            width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small"  @click.native.prevent="rootShow(scope.$index, tableList)" >授权</el-button>
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
        width="70%"
        @close="closeDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

        <div style="overflow:hidden">
            <ul>
                <li style="margin-top:20px;border-top:none" v-for="(item1 ,index1) of permitList" :key="item1.id" >
                    <div style="background:#E5E5E5;width:100%;border-radius: 5px; border-bottom:1px solid white">
                        <table style="width:100%;">
                            
                        <thead style="">
                            <tr class="thead-tr" style="width:100%;height:40px;">
                                <th style=""> 
                                    <el-checkbox style="margin-left:15px"     @change="checkPermit1(index1,item1.isTrue)" v-model="item1.isTrue"><span style="font-size:16px;">{{item1.resourceName}}</span></el-checkbox>
                                </th>
                               
                            </tr>
                        </thead>
                            
                        <tbody style="">
                            <tr id="borderTable" style="" v-for="(item2 ,index2) of item1.subResourceVOList" :key="item2.id">
                                <td style=" margin-left:10px;margin-right:10px;">
                                    <div  style="background:white;">
                                        <div class="last-line" style="margin-top:-2px;height:45px; line-height:45px; margin-left:15px;margin-right:15px">
                                            <span style="margin-right:10px;color:#cccccc">——</span><el-checkbox style="margin-left:0px" @change="checkPermit2(index1,index2,item2.isTrue)" v-model="item2.isTrue" ><span>{{item2.resourceName}}</span></el-checkbox>
                                        </div>
                                        
                                    </div>
                                    
                                </td>
                               


                            </tr>
                            </tbody> 
                            <div style="height:30px; background:white;margin-top:-2px">
                                
                            </div>
                        </table>
                        
                    </div>
                </li>
            </ul>
           
           <div style="overflow:hidden; float:right;margin-top:10px">
               <el-button @click="cancelPermit"  style="float:right">取消</el-button> <el-button type="primary" style="float:right;margin-right:20px" @click="submitForm()">提交</el-button>
           </div>
            

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
            tagList:[],
            permitList:[],//弹窗权限头部list
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

        /****************************************************弹窗内的所有操作start*******************************************************************************/        
        // 角色资源授权弹窗出现
        rootShow(index,rows){
            this.dialogVisible=true
            this.changeId=rows[index].roleId
            console.log("=-=-=--=-=-=-=-",rows[index].roleId)
            getRequest(url.systemResourceListResourceByRoleId+rows[index].roleId, {}).then(data=> {
                console.log("查询角色资源权限",JSON.parse(JSON.stringify(data.data.data)))
                this.tagList=JSON.parse(JSON.stringify(data.data.data));   
                this.permitList=data.data.data
            
                     
            });   
        },

        // checkbox1的change事件
        checkPermit1(index,isTrue){
            // alert(index)
            if(isTrue){
                
                for(let i=0; i<this.permitList[index].subResourceVOList.length;i++){
                    
                    this.permitList[index].subResourceVOList[i].isTrue=true
                    // this.isIndeterminate=false
                    
                }
                
            }else{
                
                for(let i=0; i<this.permitList[index].subResourceVOList.length;i++){
                    
                    this.permitList[index].subResourceVOList[i].isTrue=false
                    // this.isIndeterminate=false
                    
                    
                }
            }
        },
        checkPermit2(index1,index2,isTrue){

            let chooseIdS=[]
            for(let i=0; i<this.permitList[index1].subResourceVOList.length;i++){
                if(this.permitList[index1].subResourceVOList[i].isTrue==true){
                    chooseIdS.push(this.permitList[index1].subResourceVOList[i].resourceId)
                }
            }
            console.log("chooseIdS",this.permitList[index1].subResourceVOList.length)
            if(chooseIdS.length==0){
                this.permitList[index1].isTrue=false
            }else{
                this.permitList[index1].isTrue=true
            }

        },

        // 取消授权
        cancelPermit(){
            this.dialogVisible=false
        },

        //  提交  添加父级菜单
        submitForm(formName) {
            let deletListF=[];
            let uptListF=[];
            console.log("tagList",this.tagList)
            console.log("permitList",this.permitList)
            // return
            for(let i=0;i<this.tagList.length;i++){
                for(let j=0;j<this.tagList[i].subResourceVOList.length;j++){
                    if(this.tagList[i].subResourceVOList[j].isTrue!=this.permitList[i].subResourceVOList[j].isTrue){
                        if(this.tagList[i].subResourceVOList[j].isTrue){
                            deletListF.push(this.tagList[i].subResourceVOList[j].resourceId)
                            
                        }
                        if(!this.tagList[i].subResourceVOList[j].isTrue){
                            uptListF.push(this.tagList[i].subResourceVOList[j].resourceId)
                            
                        }
                    
                    }
                }

                if(this.tagList[i].isTrue!=this.permitList[i].isTrue){
                    if(this.tagList[i].isTrue){
                        deletListF.push(this.tagList[i].resourceId)
                        
                    }
                    if(!this.tagList[i].isTrue){
                        uptListF.push(this.tagList[i].resourceId)
                        
                    }
                    
                }
            }

            console.log("当前操作的添加动作的Id",uptListF)
            console.log("当前操作的删除动作的Id",deletListF)

            if(uptListF.length!=0){
            let arrRoleUp=[]
            uptListF.forEach((v,i)=>{
                arrRoleUp.push(v)
            })
            console.log("要增加的",{roleId:this.changeId,resourceIdList:arrRoleUp})
            
            //添加的接口 
            postRequest(url.systemRoleResourceSaveRoleResource, {
                   roleResourceJson:JSON.stringify({roleId:this.changeId,resourceIdList:arrRoleUp})
                   
                }).then(data=> {
                    this.dialogVisible=false    
                    console.log("提交权限返回数据",data)
                    this.$message({
                        type: 'success',
                        message: '授权成功'
                    });
                   
            });
        }
            
        if(deletListF.length!=0){

            let arrRoleDel=[]
            deletListF.forEach((v,i)=>{
                arrRoleDel.push(v)
            })
            
            console.log("要删除的",{roleId:this.changeId,resourceIdList:arrRoleDel})
            
            
            //删除的接口 
            postRequest(url.systemRoleResourceRemoveRoleResource, {
                   roleResourceJson:JSON.stringify({roleId:this.changeId,resourceIdList:arrRoleDel})
                }).then(data=> {
                    this.dialogVisible=false 
                    this.$message({
                        type: 'success',
                        message: '授权成功'
                    });
                    console.log("删除权限返回数据",data)

                   
            });    
        }
        if(deletListF.length==0 && uptListF.length==0){
            this.$message({
                type: 'success',
                message: '请修改后提交'
            });
        }    
       
        },


/****************************************************弹窗内的所有操作over*******************************************************************************/

        // 点击弹窗的叉号
        closeDialog(){
        //   this.$refs['ruleForm'].resetFields();
        },
        // 切换页码
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },


        // 初始化表格
        initData(params){
            getRequest(url.systemRoleListRole, params).then(data=> {

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
    }
</style>