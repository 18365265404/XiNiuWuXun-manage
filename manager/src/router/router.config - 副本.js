




let routes= [
    {
        path: '/',
        name:"dashboard",
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        meta: { title: '自述文件' },
        children:[
 
            
            {
                path: '/dashboard',
                name:"dashboard",
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: 'home' }
            },

            // 目录
            {
                path: '/systemUser',
                name: 'systemUser',
                component: resolve => require(['../components/page/systemUser.vue'], resolve),
                meta: { title: '用户管理' }
            },
            {
                path: '/systemRole',
                name: 'systemRole',
                component: resolve => require(['../components/page/systemRole.vue'], resolve),
                meta: { title: '角色管理' }
            },
            {
                path: '/systemResource',
                name: 'systemResource',
                component: resolve => require(['../components/page/systemResource.vue'], resolve),
                meta: { title: '资源管理' }
            },
            {
                path: '/systemDictionary',
                name: 'systemDictionary',
                component: resolve => require(['../components/page/systemDictionary.vue'], resolve),
                meta: { title: '字典管理' }
            },
            {
                path: '/unclassifiedCarousel',
                name: 'unclassifiedCarousel',
                component: resolve => require(['../components/page/unclassifiedCarousel.vue'], resolve),
                meta: { title: '轮播图' }
            },
            {
                path: '/unclassifiedBanner',
                name: 'unclassifiedBanner',
                component: resolve => require(['../components/page/unclassifiedBanner.vue'], resolve),
                meta: { title: 'Banner' }
            },
            {
                path: '/unclassifiedCustomerService',
                name: 'unclassifiedCustomerService',
                component: resolve => require(['../components/page/unclassifiedCustomerService.vue'], resolve),
                meta: { title: '客服' }
            },
            {
                path: '/unclassifiedFriendshipLink',
                name: 'unclassifiedFriendshipLink',
                component: resolve => require(['../components/page/unclassifiedFriendshipLink.vue'], resolve),
                meta: { title: '友情链接' }
            },
            {
                path: '/navigationBarAboutUs',
                name: 'navigationBarAboutUs',
                component: resolve => require(['../components/page/navigationBarAboutUs.vue'], resolve),
                meta: { title: '关于我们' }
            },
            {
                path: '/navigationBarBoutiqueCase',
                name: 'navigationBarBoutiqueCase',
                component: resolve => require(['../components/page/navigationBarBoutiqueCase.vue'], resolve),
                meta: { title: '精品案例' }
            },
            {
                path: '/case_detail',
                name: 'case_detail',
                component: resolve => require(['../components/page/case_detail.vue'], resolve),
                meta: { title: '精品案例详情' }
            },
            {
                path: '/navigationBarIntegralSoftPacking',
                name: 'navigationBarIntegralSoftPacking',
                component: resolve => require(['../components/page/navigationBarIntegralSoftPacking.vue'], resolve),
                meta: { title: '整体软装' }
            },
            {
                path: '/soft_detail',
                name: 'soft_detail',
                component: resolve => require(['../components/page/soft_detail.vue'], resolve),
                meta: { title: '整体软装详情' }
            },
            
            
            
            {
                path: '/navigationBarCompanyDynamics',
                name: 'navigationBarCompanyDynamics',
                component: resolve => require(['../components/page/navigationBarCompanyDynamics.vue'], resolve),
                meta: { title: '公司动态' }
            },
            {
                path: '/dynamic_detail',
                name: 'dynamic_detail',
                component: resolve => require(['../components/page/dynamic_detail.vue'], resolve),
                meta: { title: '公司动态详情' }
            },
            {
                path: '/navigationBarContactUs',
                name: 'navigationBarContactUs',
                component: resolve => require(['../components/page/navigationBarContactUs.vue'], resolve),
                meta: { title: '联系我们' }
            },
            {
                path: '/dataPoolWebsiteData',
                name: 'dataPoolWebsiteData',
                component: resolve => require(['../components/page/dataPoolWebsiteData.vue'], resolve),
                meta: { title: '官网数据' }
            },
            {
                path: '/dataPoolPromotionData',
                name: 'dataPoolPromotionData',
                component: resolve => require(['../components/page/dataPoolPromotionData.vue'], resolve),
                meta: { title: '推广数据' }
            },
            
            {
                path: '/unclassifiedRecommendNews',
                name: 'unclassifiedRecommendNews',
                component: resolve => require(['../components/page/unclassifiedRecommendNews.vue'], resolve),
                meta: { title: '推荐新闻' }
            },
            {
                path: '/news_detail',
                name: 'news_detail',
                component: resolve => require(['../components/page/news_detail.vue'], resolve),
                meta: { title: '新闻详情' }
            },
            
            
            // {
            //     path: '/dictionary',
            //     name: 'dictionary',
            //     component: resolve => require(['../components/page/Dictionary.vue'], resolve),
            //     meta: { title: '全部字典' }
            // },
            {
                path: '/banner',
                name: 'banner',
                component: resolve => require(['../components/page/Banner.vue'], resolve),
                meta: { title: '全部轮播图' }
            },
            {
                path: '/imageText1',
                name: 'imageText1',
                component: resolve => require(['../components/page/ImageText1.vue'], resolve),
                meta: { title: '首页文图' }
            },
            {
                path: '/imageText2',
                name: 'imageText2',
                component: resolve => require(['../components/page/ImageText2.vue'], resolve),
                meta: { title: '更多文图' }
            },
            {
                path: '/classify',
                name: 'classify',
                component: resolve => require(['../components/page/Classify.vue'], resolve),
                meta: { title: '条件管理' }
            },
            {
                path: '/weddingShop',
                name: 'weddingShop',
                component: resolve => require(['../components/page/WeddingShop.vue'], resolve),
                meta: { title: '全部婚礼婚品' }
            },
            {
                path: '/visual',
                name: 'visual',
                component: resolve => require(['../components/page/Visual.vue'], resolve),
                meta: { title: '全部视觉展示' }
            },
            {
                path: '/scheme',
                name: 'scheme',
                component: resolve => require(['../components/page/Scheme.vue'], resolve),
                meta: { title: '全部策划布置' }
            },
            {
                path: '/flower',
                name: 'flower',
                component: resolve => require(['../components/page/Flower.vue'], resolve),
                meta: { title: '全部婚礼花艺' }
            },
            {
                path: '/design',
                name: 'design',
                component: resolve => require(['../components/page/Design.vue'], resolve),
                meta: { title: '全部婚礼设计' }
            },
            {
                path: '/video',
                name: 'video',
                component: resolve => require(['../components/page/Video.vue'], resolve),
                meta: { title: '全部摄像视频' }
            },



            // 错误页面
            {
                path: '/404',
                name: '404',
                component: resolve => require(['../components/page/404.vue'], resolve),
                meta: { title: '404' }
            },
            {
                path: '/403',
                name: '403',
                component: resolve => require(['../components/page/403.vue'], resolve),
                meta: { title: '403' }
            }
        ]
    },
    {
        path: '/changePass',
        name:"changePass",
        component: resolve => require(['../components/page/ChangePass.vue'], resolve),
        meta: { title: 'denglu' }
    },
    {
        path: '/login',
        name:"login",
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '*',
        name:"404",
        redirect: '/404'
    }
]


// export default routes;
export default {routes}