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



           <el-table-column
            type="index"
            >
            </el-table-column>
			
			<el-table-column
			prop="roleName"
			label="角色名"
			show-overflow-tooltip>
			</el-table-column>

            <!-- <el-table-column
			prop="dateTime"
			label="更新时间"
			show-overflow-tooltip>

                <template    slot-scope="scope">            
			        {{scope.row.dateTime|date}}
			    </template>  
			</el-table-column> -->

            <el-table-column
            fixed="right"
            label="操作"
            width="200px"
           >
            <template slot-scope="scope">




                <el-button
                @click.native.prevent="rootShow(scope.$index, tableList)"
                type="warning"
                size="small">
                授权
                </el-button>

            
                

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
            prop="roleName"
            >
                <el-input type="text"  placeholder="请输入角色名" v-model.number="ruleForm.roleName" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            



            </el-form>

			
			
            <div style="display:flex;margin-left:3%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;margin-right:4%" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        
        </el-dialog>  

        <!-- 弹窗权限 -->
        <el-dialog
        title="授权"
        :visible.sync="dialogVisible2"
        width="70%"
        center>
        <div style="overflow:hidden">
            <ul>
                <li style="margin-top:20px;border-top:none" v-for="(item1 ,index1) of permitList" :key="item1.id" >
                    <div style="background:#E5E5E5;width:100%;border-radius: 5px; border-bottom:1px solid white">
                        <table style="width:100%;">
                            
                        <thead style="">
                            <tr class="thead-tr" style="width:100%;height:40px;">
                                <th style=""> 
                                    <el-checkbox style="margin-left:15px"     @change="checkPermit1(index1,item1.flag)" v-model="item1.flag"><span style="font-size:16px;">{{item1.resourceName}}</span></el-checkbox>
                                </th>
                               
                            </tr>
                        </thead>
                            
                        <tbody style="">
                            <tr id="borderTable" style="" v-for="(item2 ,index2) of item1.subdirectoryList" :key="item2.id">
                                <td style=" margin-left:10px;margin-right:10px;">
                                    <div  style="background:white;">
                                        <div class="last-line" style="margin-top:-2px;height:45px; line-height:45px; margin-left:15px;margin-right:15px">
                                            <span style="margin-right:10px;color:#cccccc">——</span><el-checkbox style="margin-left:0px" @change="checkPermit2(index1,index2,item2.flag)" v-model="item2.flag" ><span>{{item2.resourceName}}</span></el-checkbox>
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
                roleName:"",
            },

            rules: {

                roleName: [
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
            tagList:[],
            permitList:[],//弹窗权限头部list
        }
    },
    methods:{

        /****************************************************弹窗内的所有操作start*******************************************************************************/        
        // 角色资源授权弹窗出现
        rootShow(index,rows){
            this.dialogVisible2=true
            this.changeId=rows[index].id
            console.log("=-=-=--=-=-=-=-",rows[index].id)
            postRequest(url.roleResourceSelectRoleResourceList, {
                roleId:rows[index].id
            }).then(data=> {
            // console.log("查询角色资源权限",JSON.parse(JSON.stringify(data.data.data)))
            this.tagList=JSON.parse(JSON.stringify(data.data.data));   
            this.permitList=data.data.data
            
                     
            });   
        },

        // checkbox1的change事件
        checkPermit1(index,flag){
            // alert(index)
            if(flag){
                
                for(let i=0; i<this.permitList[index].subdirectoryList.length;i++){
                    
                    this.permitList[index].subdirectoryList[i].flag=true
                    // this.isIndeterminate=false
                    
                    
                }
                
            }else{
                
                for(let i=0; i<this.permitList[index].subdirectoryList.length;i++){
                    
                    this.permitList[index].subdirectoryList[i].flag=false
                    // this.isIndeterminate=false
                    
                    
                }
            }
        },
        checkPermit2(index1,index2,flag){

            let chooseIdS=[]
            for(let i=0; i<this.permitList[index1].subdirectoryList.length;i++){
                if(this.permitList[index1].subdirectoryList[i].flag==true){
                    chooseIdS.push(this.permitList[index1].subdirectoryList[i].id)
                }
            }
            console.log("chooseIdS",this.permitList[index1].subdirectoryList.length)
            if(chooseIdS.length==0){
                this.permitList[index1].flag=false
            }else{
                this.permitList[index1].flag=true
            }
            // return
            // if(chooseIdS.length==this.permitList[index1].subdirectoryList.length){
            //     this.permitList[index1].b1=true
            // }else{
            //     this.permitList[index1].b1=false
            // }

            // if(chooseIdS.length<this.permitList[index1].subdirectoryList.length && chooseIdS.length>0){
            //     this.isIndeterminate=true
            // }else{
            //     this.isIndeterminate=false
            // }
        },

        // 取消授权
        cancelPermit(){
            this.dialogVisible2=false
        },

        //  提交  添加父级菜单
        submitForm(formName) {
            let deletListF=[];
            let uptListF=[];
            console.log("tagList",this.tagList)
            console.log("permitList",this.permitList)
            // return
            for(let i=0;i<this.tagList.length;i++){
                for(let j=0;j<this.tagList[i].subdirectoryList.length;j++){
                    if(this.tagList[i].subdirectoryList[j].flag!=this.permitList[i].subdirectoryList[j].flag){
                        if(this.tagList[i].subdirectoryList[j].flag){
                            deletListF.push(this.tagList[i].subdirectoryList[j].id)
                            
                        }
                        if(!this.tagList[i].subdirectoryList[j].flag){
                            uptListF.push(this.tagList[i].subdirectoryList[j].id)
                            
                        }
                    
                    }
                }

                if(this.tagList[i].flag!=this.permitList[i].flag){
                    if(this.tagList[i].flag){
                        deletListF.push(this.tagList[i].id)
                        
                    }
                    if(!this.tagList[i].flag){
                        uptListF.push(this.tagList[i].id)
                        
                    }
                    
                }
            }

            console.log("当前操作的添加动作的Id",uptListF)
            console.log("当前操作的删除动作的Id",deletListF)

            if(uptListF!=""){
            let arrRoleUp=[]
            uptListF.forEach((v,i)=>{
                arrRoleUp.push({roleId:this.changeId,resourceId:v})
            })
            console.log("要增加的",arrRoleUp)
            
            //添加的接口 
            postRequest(url.roleResourceInsertRoleResource, {
                   roleResources:JSON.stringify(arrRoleUp)
                   
                }).then(data=> {
                    this.dialogVisible2=false    
                    console.log("提交权限返回数据",data)
                    this.$message({
                        type: 'success',
                        message: '授权成功'
                    });
                   
            });
        }else{
            this.$message({
                type: 'success',
                message: '请修改后提交'
            });
        }
            
        if(deletListF!=""){
            let arrRoleDel=[]
            deletListF.forEach((v,i)=>{
                arrRoleDel.push({roleId:this.changeId,resourceId:v})
            })
            console.log("要删除的",JSON.stringify(arrRoleDel))
            
            // return
            //删除的接口 
            postRequest(url.roleResourceDeleteRoleResource, {
                   roleResources:JSON.stringify(arrRoleDel)
                }).then(data=> {
                    this.dialogVisible2=false 
                    this.$message({
                        type: 'success',
                        message: '授权成功'
                    });
                    console.log("删除权限返回数据",data)

                   
            });    
        }else{
            this.$message({
                type: 'success',
                message: '请修改后提交'
            });
        }    
       
        },


/****************************************************弹窗内的所有操作over*******************************************************************************/  




        // 新增一条的接口
        addServer(pamas){
            postRequest(url.roleInsertRole, pamas).then(data=> {
                this.uploadNum=0
                
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
                }
                this.initData({
                    pageSize:"10",
                    pageNum:this.currentPage,
                })

                
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
                this.addServer({
                    roleName:this.ruleForm.roleName,

                })

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

            
            this.oldPamas={
                imgName:rows[index].imgName,
                title:rows[index].title,
                oldImgName:rows[index].imgName,
                
                id:rows[index].id
            }
            this.upfileList=[{url:this.qiniuH+rows[index].imgName}]
            

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

        goSearch(){
          
            console.log("this.tableData",this.tableData)
            this.initData(this.tableData) //查询所有  
            
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
            postRequest(url.roleSelectRoleList, pamas).then(data=> {
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
    width: 93%;
    margin-left: 3%
}
.demo-ruleForm .el-form-item:nth-child(2n){
    
}
</style>

