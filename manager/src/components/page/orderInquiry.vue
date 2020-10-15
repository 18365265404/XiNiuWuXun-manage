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
            prop="orderNo"
            label="订单号"
            >
            </el-table-column>
            

            <el-table-column
            prop="receivingAddressStr"
            label="收货地址"
            >
            </el-table-column>
 
            <el-table-column
            prop="freight"
            label="运费"
            >
            </el-table-column>

            

            <el-table-column
            prop="sumPrice"
            label="总价"
            >
            </el-table-column>

            <el-table-column
            prop="remarks"
            label="备注"
            >
            </el-table-column>

            <el-table-column
            prop="consignmentStatusStr"
            label="发货状态"
            >
            </el-table-column>

            <!-- <el-table-column
            prop="evaluateStatusStr"
            label="是否评价"
            >
            </el-table-column> -->

            

            <el-table-column
            prop="logisticsStatusStr"
            label="签收状态"
            >
            </el-table-column>

            

            <el-table-column
            prop="orderStatusStr"
            label="提交状态"
            >
            </el-table-column>

            

            

            <el-table-column
            prop="tradingStatusStr"
            label="交易状态"
            >
            </el-table-column>

            <el-table-column
			prop="createTime"
			label="更新时间"
			show-overflow-tooltip>

                <template    slot-scope="scope">            
			        {{scope.row.createTime|date}}
			    </template>  
			</el-table-column>

            
            <el-table-column
            fixed="right"
            label="操作"
            width="150">
                <template slot-scope="scope">
                    
                    <el-button type="text" size="small"  @click.native.prevent="orderDetail(scope.$index, tableList)" >订单详情</el-button>
                                 
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
        title="订单详情查询"
        :visible.sync="dialogVisible"
        width="60%"

        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <!-- 详情表格 -->
            <el-table
            :data="detailList"
            border
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
                            <img :src="qiniuH+scope.row.imgUrl"    style="width:60px; height:20px" />
                            <el-popover
                            placement="right"
                            trigger="click"
                            >
                                <img :src="qiniuH+scope.row.imgUrl"    style="max-height:400px" />
                                <i slot="reference"  class="el-icon-view" style="font-size:16px"></i>
                            </el-popover>
                        </div>
                    </template>  
                </el-table-column>

                <el-table-column
                prop="goodsName"
                label="商品名"
                >
                </el-table-column>

                <el-table-column
                prop="specificationsValue"
                label="规格"
                >
                </el-table-column>

                <el-table-column
                prop="num"
                label="商品数量"
                >
                </el-table-column>

                
            </el-table>
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
        return {
            searchV:'',
            tableList:[],
            detailList:[],
            qiniuH:url.qiniuH,
            dialogVisible:false,
            page:{
                currentPage:1,  
                total:1000,
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

        // 订单详情
        orderDetail(index, rows){
            this.dialogVisible=true
            this.detailList=rows[index].list
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


        


        // 初始化表格
        initData(params){
            console.log('pamas',params)
            postRequest(url.systemOdrListOrder, params).then(data=> {

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