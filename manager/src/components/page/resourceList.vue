<template>
    <div>
        <!-- 自定义表格 -->
        <div style="overflow-y: auto;  background:white;color:#666666;font-size:12px;margin-left:2%;margin-right:2%">
            <ul>
                <div style="display:flex; line-height:60px;color:#333333;font-size:14px;background:#EEF1F6">
                        
                        <span style="width:50%; margin-left:20px">资源名</span>
                        <span style="width:50%;">资源路径</span>
                        <!-- <span style="width:25%;"> 类型</span>
                        <span style="width:25%;">排序</span> -->
                        <!-- <div style="width:25%;">操作</div> -->
                    </div>
                <li style=" line-height:40px;" v-for="items in tableList" v-bind:key="items.id">
                    <div style="display:flex;height:40px;border-bottom:1px solid #cccccc;background:#FAFAFA">
                        
                        <h6 style="width:50%; margin-top:0px; margin-left:20px;font-size:18px">{{items.resourceName}}</h6>
                        <span style="width:50%;">{{items.resourceUrl}}</span>
                        <!-- <span style="width:25%;">{{items.type}}</span>
                        <span style="width:25%;">{{items.sort}}</span> -->
                        <!-- <div style="width:25%">
                            <el-button style="height:30px;margin-top:5px;display:none" @click.native.prevent="deleteRow(items.id)"  type="danger">删除</el-button>
                            <el-button style="margin-left:2%;margin-top:5px;height:30px;display:none" @click.native.prevent="changeRow(items.id,items.resourceSort)"  type="success">修改</el-button>
                        </div> -->
                       
                    </div>
                    <ul>
                        <li style=" border-bottom:1px solid #cccccc; display:flex"  v-for="item in items.subResourceVOList" v-bind:key="item.id">
                            <span style="display:flex; width:50%; margin-left:20px"><p style="width:30px;margin-top:20px;  border-top:1px solid #666666;margin-right:3px;"></p>{{item.resourceName}}</span>
                            <span style="width:50%;">{{item.resourceUrl}}</span>
                            <!-- <span style="width:25%;">{{item.type}}</span>
                            <span style="width:25%;">{{item.sort}}</span> -->
                            <!-- <div style="width:25%">
                                <el-button style="margin-top:5px;height:30px;display:none" @click.native.prevent="deleteRow(item.id)"  type="danger">删除</el-button>
                                <el-button style="margin-left:2%;margin-top:5px;height:30px;display:none" @click.native.prevent="changeRow(item.id,item.resourceSort)"  type="success">修改</el-button>
                            </div> -->
                            
                        </li>
                    
                    </ul>
                </li>

            </ul>
        </div>
    </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '../../utils/sessionStorage'
import url from '../../utils/url';
  export default {
    methods: {
      handleClick(row) {
        console.log(row);
      }
    },

    data() {
      return {
        tableList: [{
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        }, {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }]
      }
    },
    methods:{
      initData(){
          getRequest(url.systemResourceListResource, {}).then(data=> {

            if(data.data.status!=1){
                this.$message.success(data.data.message);
                
                return
            }
            let datas = data.data.data
            this.tableList=datas
            console.log("初始化返回数据",data.data.data)     
            
        }); 
      }
    },
    created(){
      this.initData()
    },
  }
</script>