<template>
    <div class="userMessage  content">

        
        <el-table
            ref="multipleTable"
            :data="tableList"
            tooltip-effect="dark"
            style="width: 96%;margin:0 auto;margin-top:80px"
            border
            :header-cell-style="{background:'#EEF1F6'}"
            size="small"
            >

           <el-table-column
            type="index"
            >
            </el-table-column>

           


            

            <el-table-column
            prop="key"
            label="键"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            prop="value"
            label="值"
            show-overflow-tooltip>
            </el-table-column>
    



            <el-table-column
            prop="describe"
            label="描述"
            show-overflow-tooltip>
            <template    slot-scope="scope">            
                <!-- <ul style="display:flex; flex-wrap:wrap">
                    <li v-for="(item) in scope.row.dictionary" :key="item.id" style="margin-right:10px">
                       
                    </li>
                </ul>     -->
                 {{scope.row.describe}}
            </template>  

    
            </el-table-column>

            <el-table-column
            prop="status"
            label="状态"
            show-overflow-tooltip>
            </el-table-column>


            <el-table-column
            prop="sort"
            label="排序"
            show-overflow-tooltip>
            </el-table-column>



        </el-table>
<!-- 分页 -->
          <div class="block" style="overflow:hidden">

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





        
    </div>
</template>
<script>

import url from '../../utils/url';
import {getCookie} from '../../utils/utils';
import {postRequest} from '../../utils/api';
export default {
    data(){



    

        return{
           
            currentPage: 1,
            navigatepageNums:[],
            tableList:[],
            total:1,
        }
    },
    methods:{
// f分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.tableData.pageNum=val
            this.initData(this.tableData)
        },

        initData(pamas){
            postRequest(url.dictionarySelectDictionaryList, pamas).then(data=> {
                let datas=data.data.data;
                this.tableList=datas.list
                this.total= datas.total        
                this.navigatepageNums=datas.navigatepageNums      
                this.currentPage=datas.pageNum

                   
            });
        },
 
    },
    computed:{
        tableData(){
            return {
                "pageNum":this.currentPage,
                "pageSize":"10",
                
            }
        },
    },
    created(){
        this.initData({
            pageSize:"10",
            pageNum:this.currentPage,
        })
        
    }

    
}
</script>

<style scoped>
.check-content{
    width: 90%;
    margin-left: 5%;

}
.checkul{
    margin-top: 20px;
    display: flex;
    justify-content: space-between
}
</style>
