<template>
    <div class="header">
        
        <div class="logo" style="font-size:18px;">犀牛物讯系统</div>
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i style="font-size:18px" class="el-icon-menu"></i>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen" style="margin-top:-16px">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell" v-show="false">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div v-show="false" style="margin-top:-20px" class="user-avator"><img src="../../assets/img/img.jpg"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown style="margin-top:-20px" class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link" style="font-size:18px;">
                        {{userData.nickname}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-button style="display:block; border:none;outline: none;" @click="changePWord()">修改密码</el-button>
                       
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
    import sessionStorage from '@/utils/sessionStorage'
    import url from '@/utils/url';
    import bus from '../common/bus';
    // import sessionStorage from '../../utils/sessionStorage'
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2
            }
        },
        computed:{
            userData(){
                let username = sessionStorage.getSessionStorage('userData');
                console.log("userData",username)
                return username ? username : this.name;
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){

                    postRequest(url.systemUserOutLogin, {}).then(data=> {

                        if(data.data.status!=1){
                            this.$message.success(data.data.message);
                            
                            return
                        }
                        this.$message.success('退出成功');
                        localStorage.removeItem('ms_username')
                    
                        sessionStorage.removeSessionStorage('ms_userId')
                        sessionStorage.removeSessionStorage('ms_token')
                        this.$router.push('/login');
                    }); 
                    
                }
            },

            // 修改密码
            changePWord(){
                // alert()
                this.$router.push('/changePass');
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                // this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        margin-left: -70px;
        cursor: pointer;
        line-height: 50px;
    }
    .header .logo{
        float: left;
        width: 215px;
        margin-left: 20px;
        line-height: 50px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
