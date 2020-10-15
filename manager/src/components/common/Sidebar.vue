<template>
    <div class="sidebar" >
        <el-menu style="overflow:hidden" class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9"  active-text-color="#20a0ff" unique-opened router>
            <template v-for="(item, index) in items">
                <!-- <template v-if="item.subdirectoryList"> -->
                    <el-submenu :index="item.resourceUrl" :key="index">
                       <template slot="title">
                           
                            <span>{{ item.resourceName }}</span>
                       </template>
                        <template v-for="subItem in item.subResourceVOList">
                            <el-submenu v-if="subItem.subdirectoryVOList" :index="subItem.resourceSort" :key="subItem.resourceSort">
                                <template slot="resourceName">{{ subItem.resourceName }}</template>
                                <el-menu-item v-for="(threeItem,index2) in subItem.subs" :key="index2" :index="threeItem.resourceSort">
                                    {{ threeItem.resourceName }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.resourceUrl" :key="subItem.resourceUrl">
                               {{ subItem.resourceName }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                <!-- </template> -->
                <!-- <template v-else>
                    <el-menu-item :index="item.resourceUrl" :key="item.resourceUrl">
                        <i :class="item.icon"></i><span slot="resourceName">{{ item.resourceName }}</span>
                    </el-menu-item>
                </template> -->
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
import sessionStorage from '../../utils/sessionStorage'
    export default {
        data() {
            return {
                collapse: false,
                items:this.$store.state.siderState
                // items: [
                //     {
                //         id: "0",
                //         pid: "0",
                //         resourceName: "系统中心",
                //         resourceSort: "0",
                //         resourceUrl: "systemCenter",
                //         subdirectoryList:[
                //            {
                //             id: "1",
                //             pid: "1",
                //             resourceName: "用户管理",
                //             resourceSort: "1",
                //             resourceUrl: "userManager"
                //            },
                //            {
                //             id: "2",
                //             pid: "2",
                //             resourceName: "角色管理",
                //             resourceSort: "2",
                //             resourceUrl: "roleManager"
                //            },
                //            {
                //             id: "3",
                //             pid: "3",
                //             resourceName: "资源管理",
                //             resourceSort: "3",
                //             resourceUrl: "resource"
                //            },
                //            {
                //             id: "4",
                //             pid: "4",
                //             resourceName: "字典管理",
                //             resourceSort: "4",
                //             resourceUrl: "dictionary"
                //            },
                           
                //         ]
                //     },
                //     {
                //         id: "1",
                //         pid: "1",
                //         resourceName: "未分类",
                //         resourceSort: "1",
                //         resourceUrl: "systemCenter1",
                        //    subdirectoryVOList
                //         subdirectoryList:[
                //            {
                //             id: "1",
                //             pid: "1",
                //             resourceName: "轮播图",
                //             resourceSort: "1",
                //             resourceUrl: "swiper"
                //            },
                //            {
                //             id: "2",
                //             pid: "2",
                //             resourceName: "Banner",
                //             resourceSort: "2",
                //             resourceUrl: "Banner"
                //            },
                //            {
                //             id: "3",
                //             pid: "3",
                //             resourceName: "客服",
                //             resourceSort: "3",
                //             resourceUrl: "service"
                //            },
                //            {
                //             id: "4",
                //             pid: "4",
                //             resourceName: "友情链接",
                //             resourceSort: "4",
                //             resourceUrl: "friendLink"
                //            },
                //            {
                //             id: "5",
                //             pid: "5",
                //             resourceName: "推荐新闻",
                //             resourceSort: "4",
                //             resourceUrl: "news"
                //            },
                           
                //         ]
                //     },
                //     {
                //         id: "2",
                //         pid: "2",
                //         resourceName: "导航栏",
                //         resourceSort: "2",
                //         resourceUrl: "systemCenter2",
                //         subdirectoryList:[
                //            {
                //             id: "1",
                //             pid: "1",
                //             resourceName: "关于我们",
                //             resourceSort: "1",
                //             resourceUrl: "aboutUs"
                //            },
                //            {
                //             id: "2",
                //             pid: "2",
                //             resourceName: "精品案例",
                //             resourceSort: "2",
                //             resourceUrl: "case"
                //            },
                //            {
                //             id: "3",
                //             pid: "3",
                //             resourceName: "整体软装",
                //             resourceSort: "3",
                //             resourceUrl: "soft"
                //            },
                //            {
                //             id: "4",
                //             pid: "4",
                //             resourceName: "公司动态",
                //             resourceSort: "4",
                //             resourceUrl: "dynamic"
                //            },
                //            {
                //             id: "5",
                //             pid: "5",
                //             resourceName: "联系我们",
                //             resourceSort: "5",
                //             resourceUrl: "contactUs"
                //            }
                           
                //         ]
                //     },
                //     {
                //         id: "3",
                //         pid: "3",
                //         resourceName: "数据池",
                //         resourceSort: "3",
                //         resourceUrl: "systemCenter3",
                //         subdirectoryList:[
                //            {
                //             id: "1",
                //             pid: "1",
                //             resourceName: "官网数据",
                //             resourceSort: "1",
                //             resourceUrl: "webData"
                //            },
                //            {
                //             id: "2",
                //             pid: "2",
                //             resourceName: "推广数据",
                //             resourceSort: "2",
                //             resourceUrl: "popData"
                //            }
                //         ]
                //     },
                   
                   
                  
                 

                // ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
            sideBarMsg(){
                 return this.$store.state.siderState
            }
        },
        created(){
                
            // // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            // bus.$on('collapse', msg => {
            //     this.collapse = msg;
            // })
            this.items=sessionStorage.getSessionStorage("ms_siderBar")
            console.log("0000000000000000",sessionStorage.getSessionStorage("ms_siderBar"))
            
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 50px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 165px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
