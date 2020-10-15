<template>
    <div class="dictionaryList">
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
            prop="dictionaryName"
            label="字典名称"
            >
            </el-table-column>

            <el-table-column
            prop="dictionaryValue"
            label="字典值"
            >
            </el-table-column>
            
            <el-table-column
            prop="sort"
            label="排序"
            >
            </el-table-column>

            <el-table-column
            prop="status"
            label="状态"
            >
            </el-table-column>
            
            <el-table-column
            fixed="right"
            label="操作"
            width="100">
                <template slot-scope="scope">
                    <!-- <el-button type="text" size="small"  @click.native.prevent="rootShow(scope.$index, tableList)" >授权</el-button> -->
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
    </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '../../utils/sessionStorage'
import url from '../../utils/url';
export default {
    data: function(){
        return {
            tableList:[],
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
        // 点击弹窗的叉号
        closeDialog(){
        //   this.$refs['ruleForm'].resetFields();
        },
        // 切换页码
        handleCurrentChange(val) {
            this.page.currentPage=val
            this.initData(this.tableParams)
            console.log(`当前页: ${val}`);
        },
        // 初始化表格
        initData(params){
            getRequest(url.systemDictionaryListDictionary, params).then(data=> {

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
    .dictionaryList{
        padding-top: 100px;
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