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
            prop="goodsName"
            label="商品名称"
            >
            </el-table-column>

            <el-table-column
            prop="stockNum"
            label="商品数量"
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
            width="250">
                <template slot-scope="scope">
                    
                    <el-button type="text" size="small"  @click.native.prevent="orderDetail(scope.$index, tableList)" >修改库存</el-button>
                    <el-switch
                    style="margin-left:20px"
                    size="small"
                    v-model="scope.row.isRoostB"
                    @change="changeRoost(scope.$index, tableList)"
                    active-text="已上架"
                    inactive-text="未上架">
                    </el-switch>
           
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
        title="修改"
        :visible.sync="dialogVisible"
        width="60%"

        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
			
                <el-form-item             
                prop="stockNum"
                >
                    <el-input type="text"  placeholder="请输入库存" v-model.number="ruleForm.stockNum" autocomplete="off">
                    <template slot="prepend"><i class="el-icon-edit"></i></template>
                    </el-input>
                </el-form-item>

            </el-form>


			
			
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
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
            searchV:'',
            tableList:[],

            qiniuH:url.qiniuH,
            dialogVisible:false,
            page:{
                currentPage:1,  
                total:1000,
            },
            ruleForm:{
                stockNum:''
            },
            rules: {
                stockNum: [
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
            }
        },
    },
    methods:{
        //上下架
        changeRoost(index, rows){
            postRequest(url.systemGooRoost, {
                isRoost:rows[index].isRoostB ? 1 : 0,
                goodsId:rows[index].goodsId
            }).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    rows[index].isRoostB=!rows[index].isRoostB
                    return
                }
                this.$message.success(data.data.message);

                this.initData(this.tableParams)
                console.log("初始化返回数据",data.data.data)     
                
            }); 
        }, 
        // 订单详情
        orderDetail(index, rows){
            this.dialogVisible=true
            this.changeId=rows[index].stockId;
            this.ruleForm={
                stockNum:rows[index].stockNum
            }
        },
        // 详情修改提交
        subPicForm(){
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {    
                    this.upServer({
                        stockId:this.changeId,
                        stockNum:this.ruleForm.stockNum,
                    })
                    

                }else {

                    return false;
                }
            });
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

        //修改请求 
        upServer(params){
            postRequest(url.systemStoUpdateStock, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                this.dialogVisible=false
                let datas = data.data.data
                this.initData(this.tableParams)
                console.log("初始化返回数据",data.data.data)     
                
            }); 
        },


        // 初始化表格
        initData(params){
            console.log('pamas',params)
            postRequest(url.systemStoListStock, params).then(data=> {

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
        console.log("upToken",upToken)
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