/**************到控制层**************/
apiServer.goodssourcecs = com_server+'/tradeView/goodssourcecs';//货源
apiServer.tradecs = com_server+'/tradeView/tradecs';//成交
apiServer.goodssourcemodelcs = com_server+'/tradeView/goodssourcemodelcs';//成交
apiServer.partycs = com_server+'/tradeView/partycs';//会员
apiServer.partyproductrolecs = com_server+'/tradeView/partyproductrolecs';//会员订购
apiServer.operatorparametercs = com_server+'/tradeView/operatorparametercs';//操作员参数
apiServer.logincs = com_server+'/tradeView/logincs';//登录
apiServer.certificatecs = com_server+'/tradeView/certificatecs';//公安系统校验
apiServer.carcs = com_server+'/tradeView/carcs';//网上车场
apiServer.feedbackcs = com_server+'/tradeView/feedbackcs';//意见反馈
/**************完整url**************/
//货源goodssourcecs
apiUrl.selectOwnerGoodsSourceList=apiServer.goodssourcecs+"/selectOwnerGoodsSourceList?app_stoken="+app_stoken;//货主查询自己在屏/撤销的货源
apiUrl.selectGoodsSourceListByConditions=apiServer.goodssourcecs+"/selectGoodsSourceListByConditions?app_stoken="+app_stoken;//查询货源列表
apiUrl.getGoodsSourceTotal=apiServer.goodssourcecs+"/getGoodsSourceTotal?app_stoken="+app_stoken;//查询发货量
apiUrl.publishGoodsSource=apiServer.goodssourcecs+"/publishGoodsSource?app_stoken="+app_stoken;//发布货源
apiUrl.removeGoodsSourceByIdAndOnlyCode=apiServer.goodssourcecs+"/removeGoodsSourceByIdAndOnlyCode?app_stoken="+app_stoken;//撤下货源
apiUrl.repeatGoodsSourceByIdAndOnlyCode=apiServer.goodssourcecs+"/repeatGoodsSourceByIdAndOnlyCode?app_stoken="+app_stoken;//重发货源
apiUrl.deleteGoodsSourceByIdAndOnlyCode=apiServer.goodssourcecs+"/deleteGoodsSourceByIdAndOnlyCode?app_stoken="+app_stoken;//删除货源
apiUrl.selectGoodsSourceDetailByIdAndOnlyCode=apiServer.goodssourcecs+"/selectGoodsSourceDetailByIdAndOnlyCode?app_stoken="+app_stoken;//货源详情
apiUrl.selectGoodsNoByProvince=apiServer.goodssourcecs+"/selectGoodsNoByProvince?app_stoken="+app_stoken;//查询所有省份的货源数目
apiUrl.selectGoodsSourceListWithoutLogin=apiServer.goodssourcecs+"/selectGoodsSourceListWithoutLogin?app_stoken="+app_stoken;//快速找货

//成交tradecs
apiUrl.selectOwnerTradeList=apiServer.tradecs+"/selectOwnerTradeList?app_stoken="+app_stoken;//货主查询自己成交/待确认的订单
apiUrl.getTradeTotal=apiServer.tradecs+"/getTradeTotal?app_stoken="+app_stoken;//查询交易量
apiUrl.selectTradeByIdAndTradeNumber=apiServer.tradecs+"/selectTradeByIdAndTradeNumber?app_stoken="+app_stoken;//成交订单详情
apiUrl.selectUnConfirmedTradeByIdAndTradeNumber=apiServer.tradecs+"/selectUnConfirmedTradeByIdAndTradeNumber?app_stoken="+app_stoken;//待确认订单详情
apiUrl.selectTradeForPrint=apiServer.tradecs+"/selectTradeForPrint?app_stoken="+app_stoken;//打单详情
apiUrl.cancelTradeByOwner=apiServer.tradecs+"/cancelTradeByOwner?app_stoken="+app_stoken;//货主取消订单
apiUrl.ownerPreDeal=apiServer.tradecs+"/ownerPreDeal?app_stoken="+app_stoken;//货主发起成交
apiUrl.selectDriverTradeList=apiServer.tradecs+"/selectDriverTradeList?app_stoken="+app_stoken;//司机查询自己成交的订单

//成交goodssourcemodelcs
apiUrl.selectGooodsSourceModelList=apiServer.goodssourcemodelcs+"/selectGooodsSourceModelList?app_stoken="+app_stoken;//查询货源模板列表
apiUrl.insertGooodsSourceModel=apiServer.goodssourcemodelcs+"/insertGooodsSourceModel?app_stoken="+app_stoken;//新增货源模板
apiUrl.selectGoodsSourceModelById=apiServer.goodssourcemodelcs+"/selectGoodsSourceModelById?app_stoken="+app_stoken;//货源模板详情
apiUrl.updateGoodsSourceModel=apiServer.goodssourcemodelcs+"/updateGoodsSourceModel?app_stoken="+app_stoken;//修改货源模板
apiUrl.deleteGoodsSourceModelById=apiServer.goodssourcemodelcs+"/deleteGoodsSourceModelById?app_stoken="+app_stoken;//删除货源模板

//会员partycs
apiUrl.validateMobileNumber=apiServer.partycs+"/validateMobileNumber?app_stoken="+app_stoken;//校验手机号是否已使用
apiUrl.validatePartyName=apiServer.partycs+"/validatePartyName?app_stoken="+app_stoken;//校验用户名是否已使用
apiUrl.validateAuthCode=apiServer.partycs+"/validateAuthCode?app_stoken="+app_stoken;//校验图片验证码是否正确
apiUrl.validateIdentifyCode=apiServer.partycs+"/validateIdentifyCode?app_stoken="+app_stoken;//校验手机验证码是否正确
apiUrl.smsSendMessage=apiServer.partycs+"/smsSendMessage?app_stoken="+app_stoken;//发送手机验证码
apiUrl.validateIdentifyCodeAndRegister=apiServer.partycs+"/validateIdentifyCodeAndRegister?app_stoken="+app_stoken;//校验验证码并登录
apiUrl.authImage=apiServer.partycs+"/authImage?app_stoken="+app_stoken;//生成图片验证码
apiUrl.selectDriverInfoByKeywordsAndCarPlateNumber=apiServer.partycs+"/selectDriverInfoByKeywordsAndCarPlateNumber?app_stoken="+app_stoken;//司机身份验证
apiUrl.selectAuthDriverInfoByKeywords=apiServer.partycs+"/selectAuthDriverInfoByKeywords?app_stoken="+app_stoken;//获取认证司机信息(用于货主发起成交)
apiUrl.selectPartyPermissionByPartyId=apiServer.partycs+"/selectPartyPermissionByPartyId?app_stoken="+app_stoken;//司机身份验证详情
apiUrl.validateMobileNumber20160308=apiServer.partycs+"/validateMobileNumber20160308?app_stoken="+app_stoken;//校验手机号是否已使用
apiUrl.selectBusinessPermissionByPartyId=apiServer.partycs+"/selectPartyBusinessPermissionByPartyId?app_stoken="+app_stoken;//认证状态查询

//会员订购partyproductrolecs
apiUrl.selectPartyProductRoleByUserNameAndProductId=apiServer.partyproductrolecs+"/selectPartyProductRoleByUserNameAndProductId?app_stoken="+app_stoken;//查询会员所有角色(未登录)
apiUrl.updatePartyProductRoleByProductIdAndBusinessRoleId=apiServer.partyproductrolecs+"/updatePartyProductRoleByProductIdAndBusinessRoleId?app_stoken="+app_stoken;//选定会员角色
apiUrl.insertPartyProductRole20160302=apiServer.partyproductrolecs+"/insertPartyProductRole20160302?app_stoken="+app_stoken;//新增会员角色
apiUrl.selectPartyProductRoleByPartyIdAndProductId20160302=apiServer.partyproductrolecs+"/selectPartyProductRoleByPartyIdAndProductId20160302?app_stoken="+app_stoken;//查询会员所有角色(已登录)

//操作员参数operatorparametercs
apiUrl.updateOperatorParameterByPartyIdAndOperator=apiServer.operatorparametercs+"/updateOperatorParameterByPartyIdAndOperator?app_stoken="+app_stoken;//修改货代信息
apiUrl.selectOperatorParameterByPartyIdAndOperator=apiServer.operatorparametercs+"/selectOperatorParameterByPartyIdAndOperator?app_stoken="+app_stoken;//查询货代信息

//登录logincs
apiUrl.getLoginMsg=apiServer.logincs+"/getLoginMsg?app_stoken="+app_stoken;//获取登录信息
apiUrl.getMainIpNew=apiServer.logincs+"/getMainIpNew?app_stoken="+app_stoken;//获取网站链接ip地址

//网上车场carcs
apiUrl.parklist=apiServer.carcs+"/selectParkcarList?app_stoken="+app_stoken;//网上车场
apiUrl.selectParkcarListWithoutLogin=apiServer.carcs+"/selectParkcarListWithoutLogin?app_stoken="+app_stoken;//快速找车

//意见反馈feedbackcs
apiUrl.insertFeedBack=apiServer.feedbackcs+"/insertFeedBack?app_stoken="+app_stoken;//保存意见反馈

//公安系统校验
apiUrl.checkIdCardAuth=apiServer.certificatecs+"/checkIdCardAuth?app_stoken="+app_stoken;//验证身份证
apiUrl.checkDriverCardAuth=apiServer.certificatecs+"/checkDriverCardAuth?app_stoken="+app_stoken;//验证驾驶证
apiUrl.checkVechileCardAuth=apiServer.certificatecs+"/checkVechileCardAuth?app_stoken="+app_stoken;//验证行驶证

