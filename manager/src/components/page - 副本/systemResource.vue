<template>
    <div class="userMessage  content" style="">

    <!-- 搜索栏 -->
        <div class="top-search"  style="text-align: center; display:none">
            <el-input style="margin: 0 auto; width:50%;" placeholder="请输入内容"   v-model="search" class="input-with-select">
                
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>
    <!-- 批量删除 -->
        <div  class="button-add" style=" display:flex;  justify-content: space-between; overflow: hidden; margin-top:20px; margin-left:2%;">
         <el-button  style=" margin-right:5%;margin-bottom:20px;opacity:0" type="primary"  >批量删除</el-button>  
        <el-button  style=" margin-right:2%;margin-bottom:20px" type="primary"  @click="addMost()">创建</el-button>  
        </div>

        

<!-- 自定义表格 -->
        <div style="overflow-y: auto;  background:white;color:#666666;font-size:12px;margin-left:2%;margin-right:2%">
            <ul>
                <div style="display:flex; line-height:60px;color:#333333;font-size:14px;background:#EEF1F6">
                        
                        <span style="width:25%; margin-left:20px">资源名</span>
                        <span style="width:25%;">资源路径</span>
                        <span style="width:25%;"> 类型</span>
                        <span style="width:25%;">排序</span>
                        <!-- <div style="width:25%;">操作</div> -->
                    </div>
                <li style=" line-height:40px;" v-for="items in tableList" v-bind:key="items.id">
                    <div style="display:flex;height:40px;border-bottom:1px solid #cccccc;background:#FAFAFA">
                        
                        <h6 style="width:25%; margin-top:0px; margin-left:20px;font-size:18px">{{items.resourceName}}</h6>
                        <span style="width:25%;">{{items.resourceUrl}}</span>
                        <span style="width:25%;">{{items.type}}</span>
                        <span style="width:25%;">{{items.sort}}</span>
                        <!-- <div style="width:25%">
                            <el-button style="height:30px;margin-top:5px;display:none" @click.native.prevent="deleteRow(items.id)"  type="danger">删除</el-button>
                            <el-button style="margin-left:2%;margin-top:5px;height:30px;display:none" @click.native.prevent="changeRow(items.id,items.resourceSort)"  type="success">修改</el-button>
                        </div> -->
                       
                    </div>
                    <ul>
                        <li style=" border-bottom:1px solid #cccccc; display:flex"  v-for="item in items.subdirectoryList" v-bind:key="item.id">
                            <span style="display:flex; width:25%; margin-left:20px"><p style="width:30px;margin-top:20px;  border-top:1px solid #666666;margin-right:3px;"></p>{{item.resourceName}}</span>
                            <span style="width:25%;">{{item.resourceUrl}}</span>
                            <span style="width:25%;">{{item.type}}</span>
                            <span style="width:25%;">{{item.sort}}</span>
                            <!-- <div style="width:25%">
                                <el-button style="margin-top:5px;height:30px;display:none" @click.native.prevent="deleteRow(item.id)"  type="danger">删除</el-button>
                                <el-button style="margin-left:2%;margin-top:5px;height:30px;display:none" @click.native.prevent="changeRow(item.id,item.resourceSort)"  type="success">修改</el-button>
                            </div> -->
                            
                        </li>
                    
                    </ul>
                </li>

            </ul>
        </div>
<!-- 分页 -->
          <div class="block" style="overflow:hidden;display:none">

                <el-pagination
                style="float:right; margin-right:10%"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="navigatepageNums"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>

        <!-- 弹窗 -->
                <!-- 弹窗 -->
        <el-dialog
        :title="popTitle"
        :visible.sync="dialogVisible"
        width="40%"
        @close="closeDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>
        <div style="margin-bottom:10px">父目录：</div>
        <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">

            <el-form-item 
             
            prop="resourceName"
            >
                <el-input type="text" placeholder="请输入资源名" v-model.number="ruleForm.resourceName" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item    
                 
            prop="resourceUrl"
            >
                <el-input type="text"  placeholder="请输入资源路径" v-model.number="ruleForm.resourceUrl" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="resourceSort"
            >
                <el-input type="text"  placeholder="请输入排序" v-model.number="ruleForm.resourceSort" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>



            <el-form-item style="width:100%; margin:0 auto">
                <el-button style="width:100%"  type="primary" @click="submitForm('ruleForm',popTitle)" class="btn-submmit">{{submitType=="add" ? '提交' : '提交'}}</el-button>
                    
            </el-form-item>

              
            </el-form>

            <!-- 第二个表单 -->
            <div style="margin-top:30px; margin-bottom:10px">子目录：</div>  
            <el-form :model="ruleFormS" :rules="rules"   ref="ruleFormS"  size='medium'    class="demo-ruleForm">

            <el-form-item class="formCity"  prop="ResourceIdF" >
                <el-select v-model="ruleFormS.ResourceIdF" placeholder="继承父目录选择" style="width:100%">
                   <el-option
                    v-for="item in selectList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
             
            prop="resourceNameS"
            >
                <el-input type="text" placeholder="请输入资源名" v-model.number="ruleFormS.resourceNameS" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item    
                 
            prop="resourceUrlS"
            >
                <el-input type="text"  placeholder="请输入资源路径" v-model.number="ruleFormS.resourceUrlS" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="resourceSortS"
            >
                <el-input type="text"  placeholder="请输入排序" v-model.number="ruleFormS.resourceSortS" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>



            <el-form-item style="width:100%; margin:0 auto">
                <el-button style="width:100%"  type="success" @click="submitFormS('ruleFormS',popTitle)" class="btn-submmit">{{submitType=="add" ? '提交' : '提交'}}</el-button>
                    
            </el-form-item>

                 
            </el-form>


        
        </el-dialog>


        
    </div>
</template>
<script>

import url from '../../utils/url';
import {getCookie,getErr} from '../../utils/utils';
import {postRequest,uploadFileRequest} from '../../utils/api';
export default {
    data(){
// 表单验证
      var validaterName = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        var validateURL = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        var validateSort = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        var validateSortResourceIdF = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        var validaterNameS = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };


        var validateURLS = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        var validateSortS = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        var validateSortUp = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('输入框不能为空'));
        }else{
          callback();
        }

        };

        return{
            search:"",
            popTitle:"",
            submitType:"",
            popsubName:"",
            changeIndex:"",
            currentPage: 1,
            navigatepageNums:[],
            selectList:[],
            changeId:"",
            total:1,
            

            ruleForm: {
                resourceName: '',
                resourceUrl: '',
                resourceSort:'',
                
            },
            ruleFormS: {
                ResourceIdF:"",
                resourceNameS: '',
                resourceUrlS: '',
                resourceSortS:'',
                
            },
            rules: {
                    resourceName: [
                        { validator: validaterName, trigger: 'blur' }
                    ],
                    resourceUrl: [
                        { validator: validateURL, trigger: 'blur' }
                    ],
                    resourceSort: [
                        { validator: validateSort, trigger: 'blur' }
                    ],
                    resourceNameS: [
                        { validator: validaterNameS, trigger: 'blur' }
                    ],
                    resourceUrlS: [
                        { validator: validateURLS, trigger: 'blur' }
                    ],
                    resourceSortS: [
                        { validator: validateSortS, trigger: 'blur' }
                    ],
                    ResourceIdF: [
                        { validator: validateSortResourceIdF, trigger: 'blur' }
                    ],
                    resourceSortUp: [
                        { validator: validateSortUp, trigger: 'blur' }
                    ],
                    
                

            },
            dialogVisible:false,
            tableList: [],
            multipleSelection: []
        }
    },
    methods:{


        handleSelectionChange(val) {
        this.multipleSelection = val;
        },
        
        // 点击弹窗的叉号
        closeDialog(){
        this.$refs['ruleForm'].resetFields();
        },
        

        // 添加

        addMost(){
            this.dialogVisible=true;
            this.submitType="add"
            this.selectId()
        },
 //  提交  添加父级菜单
        submitForm(formName) {

        console.log("wehrjiweuiru",this.ruleForm)
        

        this.$refs[formName].validate((valid) => {
           console.log("this.ruleForm",this.ruleForm)
          if (valid) {
            postRequest(url.resourceInsertResource,{
                resourceName:this.ruleForm.resourceName,
                resourceUrl:this.ruleForm.resourceUrl,
                sort:this.ruleForm.resourceSort,
                type:0
            }).then(data=> {
                this.$refs['ruleForm'].resetFields();
                console.log("添加父级名称返回",data)
                this.selectId()
                this.initSelectAll({pageNum:this.currentPage,pageSize:""})                 
                
            })
            
          } else {

            return false;
          }
        });
       
        },
        //  提交  添加子菜单
        submitFormS(formName) {

        console.log("wehrjiweuiru",this.ruleFormS)

        this.$refs[formName].validate((valid) => {
           console.log("this.ruleForm",this.ruleFormS)
          if (valid) {
            postRequest(url.resourceInsertResource,{
                pid:this.ruleFormS.ResourceIdF,
                resourceName:this.ruleFormS.resourceNameS,
                resourceUrl:this.ruleFormS.resourceUrlS,
                sort:this.ruleFormS.resourceSortS,
                type:1
                
            }).then(data=> {
                this.$refs['ruleFormS'].resetFields();
                console.log("添加成功后2",data)
                this.initSelectAll({pageNum:this.currentPage,pageSize:"",type:"0"},{pageNum:this.currentPage,pageSize:"",type:"1"})                  

            })
            
          } else {

            return false;
          }
        });
       
        },   



// 修改
        changeRow(index, rows){
            this.dialogVisible=true;
            this.submitType="change";
            this.changeId=rows[index].id;

            this.ruleForm={
                cityName: rows[index].cityName,
                cityCode: rows[index].cityCode,
                sort:rows[index].sort,
            }
        },
    

        deletMost(){
            console.log("查看表单内的选中的条数",this.multipleSelection)
            let chooseStrId="";
            let chooseStrPictures="";
            for(let i=0;i<this.multipleSelection.length;i++){

                chooseStrId+=this.multipleSelection[i].id+","
            }
            chooseStrId = chooseStrId.substr(0, chooseStrId.length - 1);
            console.log("删除的chooseStrId",chooseStrId);
            postRequest(url.scDeleteByCity, {
                   ids:chooseStrId,
                }).then(data=> {
                    console.log("删除后打印的数据",data)
                   this.initSelectAll({pageNum:this.currentPage,pageSize:"",type:"0"},{pageNum:this.currentPage,pageSize:"",type:"1"})
                    
            });    

        }, 

       

      deleteRow(index, rows) {
        
        console.log("1111",rows[index].id)
        postRequest(url.scDeleteByCity, {
                   ids:rows[index].id,
                }).then(data=> {
                        console.log("删除后打印的数据",data)
                        this.initSelectAll({pageNum:this.currentPage,pageSize:"",type:"0"},{pageNum:this.currentPage,pageSize:"",type:"1"})
                    
        });    
        
        
      },
// f分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.initSelectAll({pageNum:this.currentPage,pageSize:"",type:"0"},{pageNum:this.currentPage,pageSize:"",type:"1"})
      },


         goSearch(){//搜索
                this.initSelectAll({pageNum:this.currentPage,pageSize:"",type:"0"},{pageNum:this.currentPage,pageSize:"",type:"1"})

            },
    selectId(){
        postRequest(url.resourceSelectByHomeDirectory, {pageNum:this.currentPage,pageSize:"",type:"0"}).then(data=> {
            console.log("select的数据11111111",data.data.data)
            this.selectList=data.data.data
                    
        });     
    },

    initSelectAll(pamas1,pamas2){
    postRequest(url.resourceSelectResourceList, pamas1).then(data=> {


        console.log("初始化话数据",data)
        let list1=data.data.data;
        this.tableList=list1


    //     postRequest(url.resourceSelectResourceList, pamas2).then(data=> {


        
    //     let list2=data.data.data;
    //     console.log("打印的数据222222",list1,list2)
    //     if(!list1 || !list2){
    //         return
    //     }
    //     list1.forEach((v1,i1) => {
    //         let list3=[]
    //         list2.forEach((v2,i2)=>{
    //             if(v1.id==v2.pid){
                    
    //                 list3.push(v2)
    //                 list1[i1]["newList"]=list3
    //             }
    //         })
    //     });
    //     this.tableList=list1
                
    // });   
                
    });   
    
    
    }   
    },
    computed:{
        formData(){
            return {

            }
        }
    },
    created(){
            this.initSelectAll({pageNum:this.currentPage,pageSize:""})                
        
    }

    
}
</script>

<style scoped>
ul li{
    list-style:none;
    border-top: 1px solid #999999;
}
</style>

