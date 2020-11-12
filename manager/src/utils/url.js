// 接口汇总
//服务器地址
// const server = 'http://192.168.1.98:8100/'; //测试式地址
const server = 'http://47.100.237.163:8100/'; //正式地址

// 七牛
const qiniuH='http://img.xiniuwuxun.com/'//正式地址
// const qiniuH='http://test.huashenghl.com/'//测式地址

// 刷新token
const oauthTokenGetNewAccessToken='oauth/token/getNewAccessToken'

// 登录
const systemUserGoLogin = 'system/user/goLogin'; 

// 退出登录
const systemUserOutLogin = 'system/user/outLogin'; 
// 修改密码
const systemUserUpdateUser = 'system/user/updateUser/'; 

// 用户列表    
const systemUserSaveUser  = 'system/user/saveUser'; //增 
const systemUserupdateUser  = 'system/user/updateUser/'; //修改 账户锁定、解锁状态切换
const systemUserListUser = 'system/user/listUser';   //查



// 角色
const systemRoleListRole = 'system/role/listRole'; //查询
const systemResourceListResourceByRoleId = 'system/resource/listResourceByRoleId/';   //授权列表查询
const systemRoleResourceSaveRoleResource = 'system/roleResource/saveRoleResource/';   //授权增加
const systemRoleResourceRemoveRoleResource = 'system/roleResource/removeRoleResource/';   //授权删除

// 字典列表
const systemDictionaryListDictionary = 'system/dictionary/listDictionary'; //查询

// 资源列表
const systemResourceListResource = 'system/resource/listResource'; //查询


/**********平台管理***********/ 
// 轮播图列表
const systemCarouselSaveCarousel = 'system/carousel/saveCarousel'; //增
const systemCarouselRemoveCarousel = 'system/carousel/removeCarousel'; //删
const systemCarouselListCarousel = 'system/carousel/listCarousel'; //查

// 友情链接列表
const systemLinksSaveLinks = 'system/links/saveLinks'; //增
const systemLinksRemoveLinks = 'system/links/removeLinks'; //删
const systemLinksListLinks = 'system/links/listLinks'; //查

// 创建备案信息
const systemRecordInformationSaveRecordInformation = 'system/recordInformation/saveRecordInformation'; //增
const systemRecordInformationRemoveRecordInformation = 'system/recordInformation/removeRecordInformation'; //删
const systemRecordInformationListRecordInformation = 'system/recordInformation/listRecordInformation'; //查

// 品牌列表
const systemBrandSaveBrand = 'system/brand/saveBrand'; //增
const systemClassifyListClassifyByFatherId = 'system/classify/listClassifyByFatherId'; // 根据父分类ID查询分类
const systemBrandUpdateBrand = 'system/brand/updateBrand'; //品牌状态启用、禁用切换(就是修改)
const systemBrandListBrand = 'system/brand/listBrand'; //查询

// 分类列表
const systemClassifySaveClassify = 'system/classify/saveClassify';//增
const systemClassifyUpdateClassify = 'system/classify/updateClassify';//修改
const systemClassifyListClassify = 'system/classify/listClassify';//查

// 灵感
const systemInspirationSaveInspiration = 'system/inspiration/saveInspiration';//增
const systemInspirationRemoveInspiration = 'system/inspiration/removeInspiration';//删
const systemInspirationUpdateInspiration = 'system/inspiration/updateInspiration';//改
const systemInspirationListInspiration = 'system/inspiration/listInspiration';//查

// 灵感详情
const systemInspirationDetailsSaveInspirationDetails = 'system/inspirationDetails/saveInspirationDetails';//增
const systemInspirationDetailsRemoveInspirationDetails = 'system/inspirationDetails/removeInspirationDetails';//删
const systemInspirationDetailsListInspirationDetails = 'system/inspirationDetails/listInspirationDetails';//查

// 对公业务
const systemCorporateBankingSaveCorporateBanking = 'system/corporateBanking/saveCorporateBanking';//增
const systemCorporateBankingUpdateCorporateBanking = 'system/corporateBanking/updateCorporateBanking';//修改
const systemCorporateBankingGetCorporateBanking = 'system/corporateBanking/getCorporateBanking';//查

// 商品管理
// 发布新商品
const systemGooSaveGoods = 'system/goo/saveGoods';//增
const systemGooRemoveGoods = 'system/goo/removeGoods';//删除

const systemGooListGoods = 'system/goo/listGoods';//查
const systemBrandListBrandByClassifyId = 'system/brand/listBrandByClassifyId';//选择所属品牌

const systemSpuSaveSpuSku = 'system/spu/saveSpuSku';//增，创建spu
const systemSpuListSpuSku = 'system/spu/listSpuSku';//查看spu

// 商品管理
// 商品详情
const systemGoodsImgSaveGoodsImg = 'system/goodsImg/saveGoodsImg';//增商品图片
const systemParameterImgSaveParameterImg = 'system/parameterImg/saveParameterImg';//增详情商品图片（参数图片）
const systemGoodsImgRemoveGoodsImg = 'system/goodsImg/removeGoodsImg';//删除商品图片
const systemParameterImgRemoveParameterImg = 'system/parameterImg/removeParameterImg';//删除商品详情图片

const systemGooUpdateGoods = 'system/goo/updateGoods';//修改商品详情
const systemGooGetGoodsDetatls = 'system/goo/getGoodsDetatls';//查看详情



// 上架审核
const systemAuditListGoodsAudit = 'system/audit/listGoodsAudit';//查
const systemAuditUpdateGoodsAudit = 'system/audit/updateGoodsAudit';//修改库存

// 订单管理
const systemOdrListOrder = 'system/odr/listOrder';//查
const systemConsigUpdateStatusByOrderId = 'system/consig/updateStatusByOrderId';//发货

// 库存管理
const systemGooRoost = 'system/goo/roost';//上架
const systemStoUpdateStock = 'system/sto/updateStock';//修改
const systemStoListStock = 'system/sto/listStock';//查


export default{

    server,
    qiniuH,
    oauthTokenGetNewAccessToken,
    systemUserGoLogin,
    systemUserOutLogin,
    systemUserUpdateUser,
    systemUserListUser,
    systemRoleListRole,
    systemUserSaveUser,
    systemUserupdateUser,
    systemResourceListResourceByRoleId,
    systemRoleResourceSaveRoleResource,
    systemRoleResourceRemoveRoleResource,
    systemDictionaryListDictionary,
    systemResourceListResource,
    systemCarouselSaveCarousel,
    systemCarouselRemoveCarousel,
    systemCarouselListCarousel,
    systemLinksSaveLinks,
    systemLinksRemoveLinks,
    systemLinksListLinks,
    systemRecordInformationSaveRecordInformation,
    systemRecordInformationRemoveRecordInformation,
    systemRecordInformationListRecordInformation,
    systemBrandSaveBrand,
    systemClassifyListClassifyByFatherId,
    systemBrandUpdateBrand,
    systemBrandListBrand,
    systemClassifySaveClassify,
    systemClassifyUpdateClassify,
    systemClassifyListClassify,
    systemInspirationSaveInspiration,
    systemInspirationRemoveInspiration,
    systemInspirationUpdateInspiration,
    systemInspirationListInspiration,
    systemInspirationDetailsSaveInspirationDetails,
    systemInspirationDetailsRemoveInspirationDetails,
    systemInspirationDetailsListInspirationDetails,
    systemCorporateBankingSaveCorporateBanking,
    systemCorporateBankingUpdateCorporateBanking,
    systemCorporateBankingGetCorporateBanking,
    systemGooSaveGoods,
    systemGooRemoveGoods,
    systemGooListGoods,
    systemBrandListBrandByClassifyId,
    systemSpuSaveSpuSku,
    systemSpuListSpuSku,
    systemGooGetGoodsDetatls,
    systemGooUpdateGoods,
    systemGoodsImgSaveGoodsImg,
    systemGoodsImgRemoveGoodsImg,
    systemParameterImgSaveParameterImg,
    systemParameterImgRemoveParameterImg,
    systemGooRoost,
    systemAuditListGoodsAudit,
    systemAuditUpdateGoodsAudit,
    systemOdrListOrder,
    systemConsigUpdateStatusByOrderId,
    systemStoUpdateStock,
    systemStoListStock
    
    // systemGoodSaveGoods
}
