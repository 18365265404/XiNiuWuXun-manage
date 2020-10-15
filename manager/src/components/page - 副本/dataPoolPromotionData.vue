<template>
    <div>

        <!-- 搜索栏 -->
        <div class="top-search" style="display:block; text-align: center">
            <el-input style="margin: 40px auto; margin-bottom:10px; width:50%;" placeholder="请输入内容"   v-model="search" class="input-with-select">
                
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <!-- 查询城市 -->
        <div style="overflow:hidden;display:block;">
            <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" style="margin-right:2%">

            <el-select
                v-model="formInline.statusV"
                @change="goSearch()"
                style="width:180px;float:right"
                filterable
                allow-create
                
                placeholder="请选择状态">
                    <el-option
                    v-for="item in statusList"
                    :key="item.type"
                    :label="item.describe"
                    :value="item.value">
                    </el-option>
            </el-select>


            <el-select
                v-model="formInline.typeV"
                @change="goSearch()"
                style="width:180px;float:right"
                filterable
                allow-create
                
                placeholder="请选择类型">
                    <el-option
                    v-for="item in typeList"
                    :key="item.type"
                    :label="item.name"
                    :value="item.type">
                    </el-option>
            </el-select>

            

            

        </el-form>
        
        </div>
        

        <!-- 批量删除 -->
        <div  class="button-add" style=" display:flex;  justify-content: space-between; overflow: hidden; margin-top:20px; margin-left:2%;">
            <el-button  style=" margin-right:5%;margin-bottom:20px" type="primary"  @click="deletMost()">批量删除</el-button>  
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
            type="selection"
           >
            </el-table-column>

           <el-table-column
            type="index"
            >
            </el-table-column>

            <el-table-column
			prop="phone"
			label="电话"

			show-overflow-tooltip>
			</el-table-column>

            <el-table-column
			prop="project"
			label="工装项目"

			show-overflow-tooltip>
			</el-table-column>

            <el-table-column
			prop="area"
			label="面积"
			show-overflow-tooltip>
			</el-table-column>
			
			<el-table-column
			prop="address"
			label="所在区域"
			show-overflow-tooltip>
			</el-table-column>

            

            

            <el-table-column
			prop="type"
			label="类型"
			show-overflow-tooltip>
			</el-table-column>

            

            <el-table-column
			prop="status"
			label="数据状态"

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
            width="180px"
           >
            <template slot-scope="scope">



                <el-button
                @click.native.prevent="deleteRow(scope.$index, tableList)"
                type="danger"
                size="small">
                删除
                </el-button>

                <el-button
                @click.native.prevent="changeRow(scope.$index, tableList)"
                type="success"
                size="small">
                改状态
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
            prop="phone"
            >
                <el-input type="text"  placeholder="请输入电话" v-model.number="ruleForm.phone" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>


            

            <el-form-item             
            prop="project"
            >
                <el-input type="text"  placeholder="请输入工装项目" v-model.number="ruleForm.project" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="area"
            >
                <el-input type="text"  placeholder="请输入面积" v-model.number="ruleForm.area" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="address"
            >
                <el-input type="text"  placeholder="请输入所在区域" v-model.number="ruleForm.address" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            

            <el-form-item             
            prop="type"
            v-show="submitTag=='add' ? true : false"
            >

                <el-select
                
                v-model="ruleForm.type"
                style="width:100%"
                filterable
                allow-create
                
                placeholder="请选择类型">
                    <el-option
                    v-for="item in typeList"
                    :key="item.type"
                    :label="item.name"
                    :value="item.type">
                    </el-option>
                </el-select>

            </el-form-item>


            </el-form>

			
			
            <div style="display:flex;margin-left:3%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;margin-right:4%" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        
        </el-dialog>  

        <!-- 弹窗 -->
        <el-dialog
        title="改状态"
        :visible.sync="dialogVisible2"
        width="60%"
        center>
            <div style="display: flex;justify-content: center">
                <el-radio-group v-model="radio" @change="changeStatus">
                    
                    <el-radio v-for="(item,index) in statusList" :key="index"  style="margin-left:15px" :label="item.value">{{item.describe}}</el-radio>
                    
                </el-radio-group>
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
            radio:0,
            tableList:[],

            formInline:{
                typeV:"",
                statusV:""
            },

            ruleForm:{
                address:"",
                project:"",
                area:"",
                phone:"",
                type:"",

            },

            rules: {

                address: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                project: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                area: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                
                phone: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                type: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],

                



            },
            typeList:[],
            statusList:[],
            dialogVisible:false,
            dialogVisible2:false,
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





        // 新增一条的接口
        addServer(pamas){
            postRequest(url.apnInsertApn, pamas).then(data=> {
                this.uploadNum=0
                
                this.dialogVisible=false
                console.log("上传到服务器成功返回",data)
                if(!getErr(data.data.code,data.data.message)) {
                    return
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
                
                if(this.submitTag=="add"){
                    this.addServer({
                        address:this.ruleForm.address,
                        project:this.ruleForm.project,
                        area:this.ruleForm.area,
                        type:this.ruleForm.type,
                        phone:this.ruleForm.phone
                    })
                }

               
                

            }else {

                return false;
            }
        });
        },
        


        //预约状态弹窗出现
        changeRow(index, rows){
            this.changeId=rows[index].id
            switch (rows[index].status) {
                case '未联系':
                    this.radio=0
                    break;
                case '已联系有效':
                    this.radio=1
                    break;
                case '已联系无效':
                    this.radio=2
                    break; 
                case '已联系待跟进':
                    this.radio=3
                    break;
                case '确认有效':
                    this.radio=4
                    break;    
                case '确认无效':
                    this.radio=5
                    break;                  
            
                default:
                    break;
            }
            
            this.dialogVisible2=true
            

        },
        //修改预约状态
        changeStatus(val){
            postRequest(url.apnUpdateApnById, {
                id:this.changeId,
                status:val
            }).then(data=> {

                this.dialogVisible2=false
                console.log("修改预约状态",data.data)
                this.initData(this.tableData) //查询所有
            });    
        },
        // 单删除
        deleteRow(index, rows) {

           
        console.log("deleteRow",rows[index].id,rows[index].url)
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

                postRequest(url.apnDeleteApnByIds, {
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
                    postRequest(url.apnDeleteApnByIds, {
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
            postRequest(url.apnSelectApnList, pamas).then(data=> {
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
            this.initData(this.tableData) //查询所有  
        },
    },

    computed:{
        tableData(){
            return {
                "pageNum":this.currentPage,
                "pageSize":"10",
                // "userId":localStorage.getItem('ms_userId'),
                "likeName":this.search,
                "type":this.formInline.typeV,
                "status":this.formInline.statusV
            }
        },
    },

    created(){

        this.initData({
            pageSize:"10",
            pageNum:this.currentPage,
        })
        this.initQiniu()

        let ms_dictionary=sessionStorage.getSessionStorage("ms_dictionarys")
        console.log("当前的字典值1", ms_dictionary)
        for( let i=0;i<ms_dictionary.length;i++){
            if(ms_dictionary[i].key=='APN_STATUS'){
                this.statusList=ms_dictionary[i].dictionary
                console.log("当前的字典值2", this.statusList)
                
            }
        }
        this.typeList=[
            {type:"0",name:"查看报价"},
            {type:"1",name:"预约工装"},
        ]
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

