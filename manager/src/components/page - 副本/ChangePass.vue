<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">修改密码</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">

                <el-form-item prop="passwordO">
                    <el-input type="password" placeholder="请输入旧密码" v-model="ruleForm.passwordO" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="passwordN">
                    <el-input type="password" placeholder="请输入新密码" v-model="ruleForm.passwordN" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>                
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
                </div>
                <p class="login-tips"></p>
            </el-form>
        </div>
    </div>
</template>

<script>

import sessionStorage from '../../utils/sessionStorage'
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import url from '../../utils/url';

    export default {
        data: function(){
            return {
                ruleForm: {

                    passwordN: '',
                    passwordO: ''
                },
                rules: {

                    passwordN: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    passwordO: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' }
                    ]
                },
               
                   
                    
                
            }
        },
        methods: {
            submitForm(formName) {
                // alert(localStorage.getItem('ms_username2'))
                // alert(JSON.parse(sessionStorage.getItem('ms_userId')))
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let userDate = sessionStorage.getSessionStorage('userData')
                        patchRequest(url.systemUserUpdateUser+userDate.userId, {
                            oldPassword:this.ruleForm.passwordO,
                            newPassword:this.ruleForm.passwordN,
                            
                        }).then(data=> {
                            if(data.data.status!=1){
                                // Message.success({message: data.data.message});
                                this.$message.success(data.data.message);
                                return
                            }
                            this.$message.success({message: data.data.message});
                            this.$router.push("/dashboard")
                            
                            
                        }); 
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        created(){

        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: #000000
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>