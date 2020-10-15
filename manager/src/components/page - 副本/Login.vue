 <template>
    <div class="login-wrap">

        <vue-particles
                color="#dedede"
                :particleOpacity="0.7"
                :particlesNumber="80"
                shapeType="circle"
                :particleSize="4"
                linesColor="#dedede"
                :linesWidth="1"
                :lineLinked="true"
                :lineOpacity="0.4"
                :linesDistance="150"
                :moveSpeed="3"
                :hoverEffect="true"
                hoverMode="grab"
                :clickEffect="true"
                clickMode="push"
            >
        </vue-particles>
        <div class="ms-login">
            <div class="ms-title">上海迅驰空间设计系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips"></p>
            </el-form>
        </div> 
    </div>
</template>

<script>

import {getRequest,postRequest,putRequest,deleteRequest} from '@/utils/api';
import sessionStorage from '../../utils/sessionStorage'
import url from '../../utils/url';
import bus from '../../utils/eventBus';
import {Message, Alert} from 'element-ui'
import {setCookie,getCookie,delCookie,getErr} from '../../utils/utils';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                sideBarMsg:[
                    
                ]
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    


                    if (valid) {

                        postRequest(url.systemUserGoLogin, {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        }).then(data=> {
                            
                            
                           
                            if(data.data.status!=1){
                                Message.success({message: data.data.message});
                                
                                return
                            }
                            
                            console.log("请求返回数据",data.data.data)     
                            sessionStorage.putSessionStorage('accessToken',data.data.data.accessToken)
                            sessionStorage.putSessionStorage('refreshToken',data.data.data.refreshToken)
                            sessionStorage.putSessionStorage('userId',data.data.data.user.userId)
                            sessionStorage.putSessionStorage('userData',data.data.data.user)

                            sessionStorage.putSessionStorage('ms_siderBar',data.data.data.resource)
                            this.$store.commit('userData',data.data.data.user)
                            this.$store.dispatch('siderBar',data.data.data.resource)
                            Message.success({message: data.data.message});
        
                            
                            console.log("获取url",this.oldUrl)
                            if(this.oldUrl=='/reset'||this.oldUrl=='/changepw'||this.oldUrl=='/register'){
                                this.$router.push("/");
                            }else{
                                this.$router.push("/dashboard")
                            }
                            
                        });     

                        // localStorage.setItem('ms_username',this.ruleForm.username);
                        
                        // postRequestLogin(url.loginGoLogin, {
                        //     username: this.ruleForm.username,
                        //     password: this.ruleForm.password
                        // }).then(data=> {
                             
                        //         // if(!getErr(data.data.code,data.data.message)) {
                        //         //     return
                        //         // }
                        //         console.log("login成功数据",data.data)
                        //         if(data.data.status!=1){
                                    
                        //             Message.error({message: data.data.message});
                        //             return
                        //         }
                                
                                
                        //         sessionStorage.putSessionStorage('ms_userId',data.data.data.user.id)
                        //         sessionStorage.putSessionStorage('ms_token',data.data.data.token)
                        //         localStorage.setItem('ms_username2',data.data.data.user.nickname+`（${data.data.data.user.roleName}）`);
                        //         sessionStorage.putSessionStorage('ms_siderBar',data.data.data.resource)
                        //         this.$store.dispatch('siderBar',data.data.data.resource)
                        //         this.initDic()
                        //         Message.success({message: "登陆成功  "});
                                
                                    
                                   
                        // })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            initDic(){
                // postRequest(url.initGetDictionaryList, {
                   
                // }).then(data=> {
                     
                //         console.log("字典数据数据",data.data.data)
                //         sessionStorage.putSessionStorage('ms_dictionarys',data.data.data);
                //         this.$router.push('/');   
                            
                            
                // })

            }
        },
        created(){
        
            // postRequest(url.initGetDictionaryList, {}).then(data=> {
            //     this.tableList=data.data.data
            //     sessionStorage.putSessionStorage('ms_dictionary',this.tableList)

                   
            // });
        
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/bg.jpg);
        background-size: 100% 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        
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