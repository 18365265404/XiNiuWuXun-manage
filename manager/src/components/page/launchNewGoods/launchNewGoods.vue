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
            <el-button type="primary"  @click="deletMost()">批量删除</el-button>  
            <el-button type="primary"  @click="addMost()">创建</el-button>  
        </div>
        <!-- 表格 -->
        <el-table
        :data="tableList"
        border
        style="width: 100%"
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
            label="商品号"
            >
            </el-table-column>

            

            <el-table-column
            prop="goodsName"
            label="商品名称"
            >
            </el-table-column>

            <el-table-column
            prop="brandName"
            label="品牌名称"
            >
            </el-table-column>

            <el-table-column
            prop="firstLevelName"
            label="一级分类"
            >
            </el-table-column>
            
            <el-table-column
            prop="secondLevelName"
            label="二级分类"
            >
            </el-table-column>

            <el-table-column
            prop="threeLevelName"
            label="三级分类"
            >
            </el-table-column>

            

            <el-table-column
            prop="price"
            label="原价"
            >
            </el-table-column>

            <el-table-column
            prop="adjustedPrice"
            label="现价"
            >
            </el-table-column>

            <!-- <el-table-column
            prop="postage"
            label="邮费"
            >
            </el-table-column> -->

            <el-table-column
            prop="weight"
            label="重量"
            >
            </el-table-column>

            
            
            <!-- <el-table-column
            prop="isFreeStr"
            label="是否包邮"
            >
            </el-table-column> -->

            <el-table-column
            prop="auditStatusStr"
            label="审核状态"
            >
            </el-table-column>

            <el-table-column
            prop="remarks"
            label="审核备注"
            >
            </el-table-column>

            <el-table-column
            prop="isRoostStr"
            label="是否上架"
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
            width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="small"  @click.native.prevent="delet(scope.$index, tableList)" >删除</el-button>
                    <!-- <el-button type="text" size="small"  @click.native.prevent="change(scope.$index, tableList)" >修改</el-button> -->
                    <el-button type="text" size="small"  @click.native.prevent="showDetail(scope.$index, tableList)" >查看详情</el-button>
                    <!-- <el-button v-show="scope.row.isRoostStr=='未上架'" type="text" size="small"  @click.native.prevent="goRoost(scope.$index, tableList)" >调价</el-button> -->
                    
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

        <!-- 弹窗(新增) -->
        <el-dialog
        title="新增"
        :visible.sync="dialogAddVisible"
        width="60%"
        @close="closeAddDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <add-content @sonMethond='sonMethond($event)' ref="addChild"></add-content>
        
        </el-dialog> 

        <!-- 弹窗(修改) -->
        <el-dialog
        title="上传"
        :visible.sync="dialogUpVisible"
        width="60%"
        @close="closeUpDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <up-content @sonMethond='sonMethond($event)' :changeMsg='changeMsg' ref="upChild"></up-content>
        
        </el-dialog> 

        <!-- 弹窗(上架) -->
        <el-dialog
        title="上架"
        :visible.sync="dialogRoostVisible"
        width="60%"
        @close="closeRoostDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <roost @sonMethond='sonMethond($event)' :goDetailId='goDetailId' ref="roostChild"></roost>
        
        </el-dialog> 

        <!-- 弹窗(详情) -->
        <el-dialog
        title="详情"
        :visible.sync="dialogDetailVisible"
        width="60%"
        @close="closeDetailDialog"
        :modal-append-to-body='false'
        :close-on-click-modal="false"
        center>

            <show-content @sonMethond='sonMethond($event)' :goDetailId='goDetailId' ref="detailChild"></show-content>
        
        </el-dialog> 
        
    </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import addContent from './components/add-content.vue'
import upContent from './components/up-content.vue'
import showContent from './components/show-content.vue'
import roost from './components/roost.vue'

import url from '@/utils/url';
  export default {
    
    components:{
        addContent,
        upContent,
        showContent,
        roost
    },

    data() {
        

        return {
            dialogAddVisible:false,
            dialogUpVisible:false,
            dialogRoostVisible:false,
            dialogDetailVisible:false,
            changeMsg:{},
            goDetailId:'',
            submitTag:'add',
            searchV:'',
            tableList:[],
            roleList:[],
            
            file:"",
            qiniu:{
                upUrl:'',
                token:'',

            },
            qiniuH:url.qiniuH,
            uploadNum:0,
            imgListLength:'',
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

        // 去上架
        goRoost(index, rows){
            this.dialogRoostVisible=true;
            this.goDetailId=rows[index].goodsId
            this.$nextTick(() => {
                this.$refs.roostChild.showPopMsg()
            });
        },
        // 子组件传递过来的方法
        sonMethond(data){
            console.log("子组件传递的数据",data)
            if(data.type=='add'){
                this.dialogAddVisible=false
            }
            if(data.type=='change'){
                this.dialogUpVisible=false
            }
            if(data.type=='roost'){
                this.dialogRoostVisible=false
            }
            
            this.initData(this.tableParams) //查询所有  

        },

        // 单删除一条
        delet(index, rows){
            this.deletHttp({
                goodsIds:[rows[index].goodsId].join(","),

            })
        },
        // 多删
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
                arrId.push(this.multipleSelection[i].goodsId)

            }


            console.log('要删除的图片',arrPictures)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.deletHttp({
                    goodsIds:arrId.join(","),
                })

            })

            if(arrId.length==0){
                this.$message({
                    type: 'success',
                    message: '请选择后删除'
                });
                return
            }

            
        },

        // 删除请求
        deletHttp(params){
            postRequest(url.systemGooRemoveGoods,params).then(data=> {
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                console.log("删除后打印的数据",data)

                this.initData(this.tableParams) //查询所有    
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });        
                        
            });    
        },
        

        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 点击弹窗的叉号
        closeAddDialog(){
          this.$refs.addChild.resetForms()
        },
        closeUpDialog(){
          this.$refs.upChild.resetForms()
        },
        closeRoostDialog(){
          this.$refs.roostChild.resetForms()
        },
        
        closeDetailDialog(){
            this.$refs.detailChild.resetForms()
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

        
        // 新增
        addMost(){
            this.dialogAddVisible=true;
            this.upfileList=[]
            this.submitTag="add"
            this.ruleForm={
                title:''

            }

        },

        
        //弹窗出现 修改
        change(index, rows){
            this.dialogUpVisible=true;
            this.changeMsg=rows[index]
            this.$nextTick(() => {
                this.$refs.upChild.showPopMsg()
            });
            
            
        },
        // 查看详情
        showDetail(index, rows){
            this.dialogDetailVisible=true
            this.goDetailId=rows[index].goodsId
            this.$nextTick(() => {
                this.$refs.detailChild.showDetail()
            });
        },
        

        // 初始化表格
        initData(params){
            console.log('pamas',params)
            postRequest(url.systemGooListGoods, params).then(data=> {

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