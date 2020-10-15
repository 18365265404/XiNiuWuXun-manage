<template>
    <div class="userList">
        <!-- 查询 -->

        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary"  style="opacity:0">批量删除</el-button>  
            <el-button type="primary" v-show="false"  @click="addMost()">创建</el-button>  
        </div>
        <div style="overflow: hidden;">
            <quill-editor 
            v-model="content" 
            ref="myQuillEditor" 
            style="min-height:200px ;background:white"
            :options="editorOption" 
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
            
            </quill-editor>
        </div>

        
        
        <div style="display:flex;margin-top:10px">
            <el-button style="width:100%"  slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
        </div>  
    </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '../../utils/sessionStorage'
import url from '../../utils/url';
  export default {
    

    data() {
        return {
            dialogVisible:false,
            submitTag:'add',
            searchV:'',
            tableList:[],
            content:null,
            editorOption:{
                placeholder: '编辑内容...'
            },
        }
    },

    computed:{
        tableParams(){
            return {

            }
        },
    },
    methods:{


        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(event){//内容改变事件

        event.quill.deleteText(800, 4)
        },



        //提交
        subPicForm(){
            if(!this.content){
                this.$message.warning('编辑器不能为空');
                return
            }
            
            if(this.submitTag=='add'){
                    
                this.addServer({
                    imgTex:this.content
                })
            }

            if(this.submitTag=='change'){

                this.upServer({
                    imgTex:this.content,
                    corporateBankingId:this.changeId
                })
            }
        },

        // 添加
        addServer(parmas){
            postRequest(url.systemCorporateBankingSaveCorporateBanking, parmas).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                this.submitTag='change'
                this.$message.success('添加成功');
                console.log("添加成功数据",data.data.data)     
                
            }); 
        },

        // 修改
        upServer(parmas){
            postRequest(url.systemCorporateBankingUpdateCorporateBanking, parmas).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                
                this.$message.success('修改成功');
                console.log("修改成功数据",data)     
                
            }); 
        },

        // 初始化表格
        initData(params){
            postRequest(url.systemCorporateBankingGetCorporateBanking, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                
                let datas = data.data.data
                console.log("初始化返回数据",datas) 
                this.content=datas.imgTex
                this.changeId=datas.corporateBankingId
                if(datas.imgTex){
                    this.submitTag='change'
                    
                }else{
                    this.submitTag='add'
                    
                }
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