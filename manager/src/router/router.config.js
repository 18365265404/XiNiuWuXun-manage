




let routes= [
    {
        path: '/',
        name:"dashboard",
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name:"login",
        component: resolve => require(['../components/page/Login.vue'], resolve)
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
                meta: { title: 'dashboard' }
            },
            // 系统管理目录
            {
                path: '/resourceList',
                name:"resourceList",
                component: resolve => require(['../components/page/resourceList.vue'], resolve),
                meta: { title: '资源列表' }
            },
            {
                path: '/dictionaryList',
                name:"dictionaryList",
                component: resolve => require(['../components/page/dictionaryList.vue'], resolve),
                meta: { title: '字典列表' }
            },
            {
                path: '/bugFeedbackList',
                name:"bugFeedbackList",
                component: resolve => require(['../components/page/bugFeedbackList.vue'], resolve),
                meta: { title: 'BUG反馈列表' }
            },
            {
                path: '/userList',
                name:"userList",
                component: resolve => require(['../components/page/userList.vue'], resolve),
                meta: { title: '用户列表' }
            },
            {
                path: '/roleList',
                name:"roleList",
                component: resolve => require(['../components/page/roleList.vue'], resolve),
                meta: { title: '角色列表' }
            },
            
            // 财务管理
            {
                path: '/topUpBalance',
                name:"topUpBalance",
                component: resolve => require(['../components/page/topUpBalance.vue'], resolve),
                meta: { title: '余额充值' }
            },
            {
                path: '/balanceChangeCheck',
                name:"balanceChangeCheck",
                component: resolve => require(['../components/page/balanceChangeCheck.vue'], resolve),
                meta: { title: '余额变动核对' }
            },
            {
                path: '/refundSettlement',
                name:"refundSettlement",
                component: resolve => require(['../components/page/refundSettlement.vue'], resolve),
                meta: { title: '退款、清算' }
            },
            {
                path: '/invoiceList',
                name:"invoiceList",
                component: resolve => require(['../components/page/invoiceList.vue'], resolve),
                meta: { title: '开票列表' }
            },
            

            // 平台管理
            {
                path: '/carouselList',
                name:"carouselList",
                component: resolve => require(['../components/page/carouselList.vue'], resolve),
                meta: { title: '轮播图列表' }
            },
            {
                path: '/linksList',
                name:"linksList",
                component: resolve => require(['../components/page/linksList.vue'], resolve),
                meta: { title: '友情链接列表' }
            },
            {
                path: '/recordInformation',
                name:"recordInformation",
                component: resolve => require(['../components/page/recordInformation.vue'], resolve),
                meta: { title: '备案信息' }
            },
            {
                path: '/brandList',
                name:"brandList",
                component: resolve => require(['../components/page/brandList.vue'], resolve),
                meta: { title: '品牌列表' }
            },
            {
                path: '/classifyList',
                name:"classifyList",
                component: resolve => require(['../components/page/classifyList.vue'], resolve),
                meta: { title: '分类列表' }
            },
            {
                path: '/supplierList',
                name:"supplierList",
                component: resolve => require(['../components/page/supplierList.vue'], resolve),
                meta: { title: '供应商列表' }
            },
            {
                path: '/inspirationList',
                name:"inspirationList",
                component: resolve => require(['../components/page/inspirationList/inspirationList.vue'], resolve),
                meta: { title: '灵感列表' }
            },
            {
                path: '/corporateBanking',
                name:"corporateBanking",
                component: resolve => require(['../components/page/corporateBanking.vue'], resolve),
                meta: { title: '对公业务' }
            },
            {
                path: '/xnwxSynopsis',
                name:"xnwxSynopsis",
                component: resolve => require(['../components/page/xnwxSynopsis.vue'], resolve),
                meta: { title: '犀牛物讯简介' }
            },

            // 商品管理
            {
                path: '/launchNewGoods',
                name:"launchNewGoods",
                component: resolve => require(['../components/page/launchNewGoods/launchNewGoods.vue'], resolve),
                meta: { title: '发布新商品' }
            },
            {
                path: '/groundingAudit',
                name:"groundingAudit",
                component: resolve => require(['../components/page/groundingAudit.vue'], resolve),
                meta: { title: '上架审核' }
            },
            {
                path: '/goodsList',
                name:"goodsList",
                component: resolve => require(['../components/page/goodsList.vue'], resolve),
                meta: { title: '商品列表' }
            },
            {
                path: '/evaluateList',
                name:"evaluateList",
                component: resolve => require(['../components/page/evaluateList.vue'], resolve),
                meta: { title: '评价列表' }
            },

            // 订单管理
            {
                path: '/orderInquiry',
                name:"orderInquiry",
                component: resolve => require(['../components/page/orderInquiry.vue'], resolve),
                meta: { title: '订单查询' }
            },
            {
                path: '/orderDelivery',
                name:"orderDelivery",
                component: resolve => require(['../components/page/orderDelivery.vue'], resolve),
                meta: { title: '订单发货' }
            },
            {
                path: '/refundInquiry',
                name:"refundInquiry",
                component: resolve => require(['../components/page/refundInquiry.vue'], resolve),
                meta: { title: '退款查询' }
            },

            
            // 库存管理
            {
                path: '/stockInquiry',
                name:"stockInquiry",
                component: resolve => require(['../components/page/stockInquiry.vue'], resolve),
                meta: { title: '库存查询' }
            },
            {
                path: '/warehouseOutAnalysis',
                name:"warehouseOutAnalysis",
                component: resolve => require(['../components/page/warehouseOutAnalysis.vue'], resolve),
                meta: { title: '出库分析' }
            },

            
            // 售后管理
            {
                path: '/refundAfterSale',
                name:"refundAfterSale",
                component: resolve => require(['../components/page/refundAfterSale.vue'], resolve),
                meta: { title: '退款售后' }
            },
            {
                path: '/retAddressList',
                name:"retAddressList",
                component: resolve => require(['../components/page/retAddressList.vue'], resolve),
                meta: { title: '退货地址列表' }
            },
            {
                path: '/afterSalesContactList',
                name:"afterSalesContactList",
                component: resolve => require(['../components/page/afterSalesContactList.vue'], resolve),
                meta: { title: '售后联系电话列表' }
            },


            {
                path: '/404',
                name: '403',
                component: resolve => require(['../components/page/404.vue'], resolve),
                meta: { title: '404' }
            },
            
            
 
            
            

            
        ],
        
    },
    {
        path: '/changePass',
        name:"changePass",
        component: resolve => require(['../components/page/ChangePass.vue'], resolve),
        meta: { title: 'denglu' }
    },
    
    {
        path: '*',
        name:"404",
        redirect: '/404'
    },
]


// export default routes;
export default {routes}