<template>
    <div class="userList">
        <!-- 查询 -->
        <div class="search">
            <el-input placeholder="请输入搜索内容"   v-model="searchV" class="search-box input-with-select">
                <el-button slot="append" @click="goSearch()" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <!-- t头部条件选择 -->
        
            <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" style="float:right;margin-right:0.5%">



            <el-form-item             
            prop="type"
            >

                <el-select
                @change="goSearch()"
                v-model="formInline.typeV"
                style="width:100%"
                filterable
                allow-create
                
                placeholder="请选择类型">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
                    </el-option>
                </el-select>

            </el-form-item>

        </el-form>
        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary"  style="opacity:0">批量删除</el-button>  
            <el-button type="primary"  style="opacity:0">创建</el-button>  
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
			style="position:relative"
			prop="gooImgUrl"
			label="图片"
			show-overflow-tooltip>
			    <template    slot-scope="scope">            
			        <div title="点击放大显示" >
			            <img :src="qiniuH+scope.row.gooImgUrl"    style="width:60px; height:20px" />
			            <el-popover
			            placement="right"
			            trigger="click"
			            >
			                <img :src="qiniuH+scope.row.gooImgUrl"    style="max-height:400px" />
			                <i slot="reference"  class="el-icon-view" style="font-size:16px"></i>
			            </el-popover>
			        </div>
			    </template>  
			</el-table-column>

            <el-table-column
            prop="goodsNo"
            label="订单号"
            >
            </el-table-column>

            <el-table-column
            prop="goodsName"
            label="商品名称"
            >
            </el-table-column>

            <el-table-column
            prop="auditStatusStr"
            label="商品状态"
            >
            </el-table-column>

            

            <el-table-column
            prop="remarks"
            label="备注"
            >
            </el-table-column>

            <el-table-column
            prop="auditTime"
            label="创建时间"
            >
            </el-table-column>

            
            <el-table-column
            fixed="right"
            label="操作"
            width="150">
                <template slot-scope="scope">
                    
                    <!-- <el-button type="text" size="small"  @click.native.prevent="change(scope.$index, tableList)" >修改</el-button> -->
                    <el-button type="text" size="small" v-show='scope.row.auditStatus==1&userRole=="质检员"'  @click.native.prevent="showAudit(scope.$index, tableList)" >审核</el-button>    
                    <el-button type="text" size="small" v-show='scope.row.auditStatus==3&userRole=="平台管理员"'  @click.native.prevent="showAudit(scope.$index, tableList)" >审核</el-button>
                     <el-button type="text" size="small" v-show='scope.row.auditStatus==2'  @click.native.prevent="showAudit(scope.$index, tableList)" >审核</el-button>        
                    <el-button type="text" size="small"  @click.native.prevent="showReport (scope.$index, tableList)" >查看报表</el-button>              
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

            <div style="width:">
                
                <el-upload
                    v-show="isShowUpImg"
                    id="elUpload"
                    :data="qiniu"
                    :limit="10"
                    multiple
                    class="upload-demo"
                    ref="uploadimg"
                    action="http://upload.qiniup.com"
                    :on-success="updateDetailSuccess"
                    :file-list="upfileList"
                    :on-change="handleChange"
                    list-type="text"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                    <el-button   slot="trigger" size="small" type="primary">上传文件</el-button>
                </el-upload>
            </div>
            

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
				
            <el-form-item label="审核状态：" autocomplete="off" >
                <el-radio-group v-model="ruleForm.auditStatus" >
                    <el-radio v-for="(item,index) in radioList" :key='index' :label="item.value">{{item.name}}</el-radio>
                    <!-- <el-radio label="0">不通过</el-radio>
                    <el-radio label="1">待检测</el-radio>
                    <el-radio label="2">已检测产生报表</el-radio>
                    <el-radio label="3">待审核</el-radio>
                    <el-radio label="4">通过</el-radio> -->
                </el-radio-group>
            </el-form-item>    

            <el-form-item             
            prop="remarks"
            >
                <el-input type="text"  placeholder="请输入审核备注" v-model.number="ruleForm.remarks" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            </el-form>


			
			
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
        
        </el-dialog>  

        <!-- 弹窗 -->
        <el-dialog
        title="查看报表（点击可查看下载）"
        :visible.sync="dialogRtVisible"
        width="60%"

        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <ul>
                <li style='text-align:center;line-height:30px' v-for="(item,index) in reportList" :key="index">文件名：
                    <a style="color:#F83244" :href='qiniuH+item' target="_blank">{{qiniuH+item}}</a>
                </li>
            </ul>

        
        </el-dialog> 

        
    </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import url from '@/utils/url';
  export default {
    
    components:{

    },

    data() {
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };

        return {

            formInline:{
                typeV:""
            },
            typeList:[{id:'1',value:'待检测'},{id:'3',value:'待审核'},{id:'4',value:'审核通过'},{id:'0',value:'审核不通过'}],
            submitTag:'add',
            searchV:'',
            tableList:[],
            reportList:[],
            radioList:[],
            dialogVisible:false,
            dialogRtVisible:false,
            upfileList:[],
            file:"",
            qiniu:{
                upUrl:'',
                token:'',

            },
            isShowUpImg:false,
            isChangeImg:false,
            qiniuH:url.qiniuH,
            uploadNum:0,
            imgListLength:'',
            userRole:'',
            page:{
                currentPage:1,  
                total:1000,
            },
            ruleForm:{
                remarks:'',
                auditStatus:'',
            },
            rules: {
                remarks: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                auditStatus: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
                
            },
            
        }
    },

    computed:{
        tableParams(){
            return {
                current:this.page.currentPage,
                search:this.searchV,
                auditStatus:this.formInline.typeV
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
        
        // 查看报表
        showReport(index, rows){
            this.dialogRtVisible=true
            
            this.changeId=rows[index].goodsId;
            this.reportList=rows[index].fileUrlList
        },
        // 审核弹窗出现
        showAudit(index, rows){
            let auditStatus =rows[index].auditStatus
            switch (auditStatus) {
                case 0://不通过
                    
                    break;

                case 1://待检测
                    this.isShowUpImg=true
                    this.radioList=[
                        {value:'2',name:'已检测产生报表'}
                    ]
                    break;
                    
                case 2://已检测产生报表
                    
                    break;
                    
                case 3://待审核
                    this.isShowUpImg=false
                    this.radioList=[
                        {value:'0',name:'不通过'},
                        {value:'4',name:'通过'}
                    ]
                    break;
                    
                case 4://通过
                    
                    break;  
            
                default:
                    break;
            }

            this.dialogVisible=true
            this.submitTag="change"
            this.isChangeImg=false
           
            console.log(rows[index].auditStatus)
            this.changeId=rows[index].goodsId;
            this.upfileList=[]
            this.ruleForm={
                remarks:rows[index].remarks,
                auditStatus:'',

            }
        },


        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                if(this.submitTag=="change" && !this.isChangeImg){
                        
                    this.addServer({
                        goodsId:this.changeId,
                        remarks:this.ruleForm.remarks,
                        auditStatus:this.ruleForm.auditStatus,
                        fileUrls:''

                    })
                }
                this.$refs.uploadimg.submit();
                

            }else {

                return false;
            }
            });
        },

        // 上传图片之前
        beforeUpload(file){
        let dates= new Date()

         return  this.qiniu.key=file.uid
           
      
        },
        // 图片改变
        handleChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示图的长度",this.imgListLength)
            this.isChangeImg=true
        },
        // 上传图片成功
        updateDetailSuccess(response, file, fileList){
            
            this.uploadNum++
            if(this.uploadNum==this.imgListLength){
                let fileKeys=[]
                for(let i=0;i<fileList.length;i++){
                    fileKeys.push(fileList[i].response.key)
                }
                
                this.addServer({
                    goodsId:this.changeId,
                    remarks:this.ruleForm.remarks,
                    auditStatus:this.ruleForm.auditStatus,
                    fileUrls:fileKeys.join(',')

                })
                
            }
        } ,

        // 添加
        addServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemAuditUpdateGoodsAudit, parmas).then(data=> {
                this.uploadNum=0
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
            console.log('pamas',params)
            postRequest(url.systemAuditListGoodsAudit, params).then(data=> {

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
        let upToken = sessionStorage.getSessionStorage('upToken')
        this.userRole=sessionStorage.getSessionStorage('userData').roleName
        console.log("this.userRole",this.userRole)
        this.qiniu={
            token:upToken
        }
    }
  }
</script>
<style lang="less" scoped>
    // #elUpload{
    //     background: red;
    //     .el-upload--text{
    //         background: blue !important;
    //     }
    // }
    #elUpload /deep/.el-upload--text{
        width: 80px;
        height: 35px;
        border: none;
    }
    
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