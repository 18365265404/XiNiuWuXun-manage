<template>
    <div>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
				

            <el-form-item             
            prop="adjustedPrice"
            >
                <el-input type="text"  placeholder="请输入最新价格" v-model.number="ruleForm.adjustedPrice" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>



            </el-form>


			
			
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
    </div>
</template>
<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import url from '@/utils/url';
export default {

    props:{
        goDetailId:{
            default:{}
        },
        dialogVisible:{
            type:Boolean,
            default:false
        }
    },
    data () {
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };
        return {   
            ruleForm:{
                adjustedPrice:''
            },
            rules: {
                adjustedPrice: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
            },
            
        }
    },
    methods:{
        // 弹窗出现显示对应的数据
        showPopMsg(){
            console.log("父级传递的值",this.goDetailId)

        },
        // 关闭弹窗 清空数据
        resetForms(){

            this.$refs['ruleForm'].resetFields();
        },
        //提交
        subPicForm(){

            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                this.addServer({
                    goodsId:this.goDetailId,
                    isRoost:1,
                    adjustedPrice:this.ruleForm.adjustedPrice,
                })
                

            }else {

                return false;
            }
            });
        },
        addServer(parmas){
            postRequest(url.systemGooRoost, parmas).then(data=> {
                
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                this.$message.success('上架成功');
                this.$emit('sonMethond', {type:'roost',dialogVisible:false})
                console.log("上架成功数据",data.data.data)  
                
                
            }); 
        },





    },
    created(){

        
    }

}
</script>