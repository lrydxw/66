/**************到控制层**************/

apiServer.dispatchOwner = com2_server + '/dispatchView/owner/dispatchOwner'; //dispathowner
apiServer.dispatchRole = com2_server + '/dispatchView/dispatchRole'; //dispatchRole
apiServer.dispatchGoodsSource = com2_server + '/dispatchView/owner/dispatchGoodsSource'; //dispatchGoodsSource
apiServer.dispatchOrder = com2_server + '/dispatchView/owner/dispatchOrder'; //dispatchOrder
apiServer.dispatchBatchOrder = com2_server + '/dispatchView/owner/dispatchBatchOrder'; //dispatchOrder
apiServer.dispatchShipBill = com2_server + '/dispatchView/owner/dispatchShipBill'; //dispatchShipBill
apiServer.dispatchDictionary = com2_server + '/dispatchView/dispatchDictionary'; //dispatchDictionary
apiServer.dispatchGoodsSourceModel = com2_server + '/dispatchView/owner/dispatchGoodsSourceModel'; //dispatchGoodsSourceModel
apiServer.dispatchshipbillcs = com2_server + '/dispatchView/owner/dispatchshipbillcs'; //dispatchshipbillcs
apiServer.areaCity = com2_server + '/dispatchView/areaCity'; //areaCity
apiServer.reportDataService = com2_server + '/dispatchView/owner/reportDataService'; //大数据的统计发货接口
apiServer.dispatchdictionarycs = com2_server + '/dispatchView/dispatchDictionary';//字典信息
apiServer.agent = com2_server + "/dispatchView/agent";//经纪人列表
apiServer.owner = com2_server + "/dispatchView/owner";//经纪人列表
apiServer.dispatchRelation = com2_server + "/dispatchView/owner/dispatchRelation";
apiServer.dispatchGoodsSourceTmp = com2_server + "/dispatchView/owner/dispatchGoodsSourceTmp";
apiServer.dispatchGoodsSourceTmp2 = "/dispatchView/owner/dispatchGoodsSourceTmp";
apiServer.dispatchAgent = com2_server + "/dispatchView/owner/dispatchAgent";
apiServer.agentDispatchShipBill=com2_server+"/dispatchView/agent/dispatchShipBill"
apiServer.agentDispatchBatchOrder=com2_server+"/dispatchView/agent/dispatchBatchOrder"
/**************完整url**************/
//上传图片
apiUrl.uploadImg="/dispatchView/fileupload/uploadImg"
//dispathowner
apiUrl.isDispatchOwner = apiServer.dispatchOwner + "/isDispatchOwner";//是否是货主

apiUrl.payDispatchBatchOrdersOffline = apiServer.owner + "/dispatchBatchOrder/payDispatchBatchOrdersOffline";//待支付 线下付款







//dispatchGoodsSource
apiUrl.saveGoodsSource = apiServer.dispatchGoodsSource + "/saveGoodsSource";//发货
apiUrl.selectDispatchGoodsSourceList = apiServer.dispatchGoodsSource + "/selectDispatchGoodsSourceList";//货源列表
apiUrl.selectDispatchGoodsSourceDetail = apiServer.dispatchGoodsSource + "/selectDispatchGoodsSourceDetail";//货源详情
apiUrl.selectDispatchShipBillDetailList = apiServer.dispatchGoodsSource + "/selectDispatchShipBillDetailList";//查看运单
apiUrl.cancelGoodsSource = apiServer.dispatchGoodsSource + "/cancelGoodsSource";//取消发货

//dispatchRole
apiUrl.selectDispatchRole = apiServer.dispatchRole + "/selectDispatchRole";//查询旺载角色

//dispatchOrder
apiUrl.insertDispatchOrder = apiServer.dispatchOrder + "/insertDispatchOrder";//选择中标
apiUrl.selectDispatchOrderList = apiServer.dispatchOrder + "/selectDispatchOrderList";//查询订单列表
apiUrl.selectDispatchOrderDetail = apiServer.dispatchOrder + "/selectDispatchOrderDetail";//查询订单列表
apiUrl.payAmount = apiServer.dispatchOrder + "/payAmount";//获取支付页面需要的businessnumber

apiUrl.generateToken = apiServer.dispatchOrder + "/generateToken";//获取支付页面需要的token
apiUrl.exportDispatchOrderList = apiServer.dispatchOrder + "/exportDispatchOrderList";// 导出接口 待付款列表不传,已付款列表传7
apiUrl.batchPayAmount = apiServer.dispatchOrder + "/batchPayAmount";// 货主批量支付生成预订单
apiUrl.batchPayAmountOffline = apiServer.dispatchOrder + "/batchPayAmountOffline";//线下支付
apiUrl.checkDispatchOrderFee = apiServer.dispatchOrder + "/checkDispatchOrderFee";// 对账
apiUrl.batchCheckDispatchOrderFee = apiServer.dispatchOrder + "/batchCheckDispatchOrderFee";// 批量对账



//dispatchBatchOrder
apiUrl.selectDispatchBatchOrderList = apiServer.dispatchBatchOrder + "/selectDispatchBatchOrderList";//批量支付订单列表查询
apiUrl.deleteDispatchBatchOrder = apiServer.dispatchBatchOrder + "/deleteDispatchBatchOrder";//批量支付订单取消

//运单相关
apiUrl.selectDispatchShipBillDetail = apiServer.dispatchShipBill + "/selectDispatchShipBillDetail";//查看运单
apiUrl.selectLbsTrack = apiServer.dispatchShipBill + "/selectLbsTrack";//地图轨迹LBS
//数据字段
apiUrl.selectDispatchDictionaryList = apiServer.dispatchDictionary + "/selectDispatchDictionaryList";//数据字段
//模板相关
apiUrl.insertDispatchGoodsSourceModel = apiServer.dispatchGoodsSourceModel + "/insertDispatchGoodsSourceModel";//新增模板
apiUrl.selectDispatchGoodsSourceModelList = apiServer.dispatchGoodsSourceModel + "/selectDispatchGoodsSourceModelList";//模板列表查询
apiUrl.selectDispatchGoodsSourceModelDetail = apiServer.dispatchGoodsSourceModel + "/selectDispatchGoodsSourceModelDetail";//模板详情查询
apiUrl.deleteDispatchGoodsSourceModel = apiServer.dispatchGoodsSourceModel + "/deleteDispatchGoodsSourceModel";//删除模板
apiUrl.updateDispatchGoodsSourceModel = apiServer.dispatchGoodsSourceModel + "/updateDispatchGoodsSourceModel";//修改模板

//大数据接口--业务统计
apiUrl.getFahuo = apiServer.reportDataService + "/getFahuo";//发货统计
apiUrl.getFahuoCountavg = apiServer.reportDataService + "/getFahuoCountavg";//发货统计日均
apiUrl.getDuizhang = apiServer.reportDataService + "/getDuizhang";//账单管理
apiUrl.getDuizhangmemo = apiServer.reportDataService + "/getDuizhangmemo";//对账单明细
apiUrl.getDuizhangExcel = apiServer.reportDataService + "/getDuizhangExcel";//账单管理导出
apiUrl.getDuizhangmemoExcel = apiServer.reportDataService + "/getDuizhangmemoExcel";//对账单明细导出
//地图轨迹LBS



//dispatchdictionarycs 字典
apiUrl.selectDispatchDictionaryList = apiServer.dispatchdictionarycs + "/selectDispatchDictionaryList";//字典列表


//经纪人
apiUrl.agentSelectDispatchOrderList = apiServer.agent + "/dispatchOrder/selectDispatchOrderList";//经纪人订单列表
apiUrl.agentSelectDispatchOrderDetail = apiServer.agent + "/dispatchOrder/selectDispatchOrderDetail";//经纪人订单详情
apiUrl.selectDispatchDriverList = apiServer.agent + "/dispatchDriver/selectDispatchDriverList";//经纪人车队
apiUrl.insertDispatchDriverInfo = apiServer.agent + "/dispatchDriver/insertDispatchDriverInfo";//新增司机
apiUrl.selectDispatchDriverInfo = apiServer.agent + "/dispatchDriver/selectDispatchDriverInfo";//根据身份证号查询司机和车信息
apiUrl.selectDispatchCar = apiServer.agent + "/dispatchDriver/selectDispatchCar";//根据车牌号查询车信息
apiUrl.assignCar = apiServer.agent + "/dispatchShipBill/assignCar"//派车
apiUrl.uploadCar = apiServer.agent + "/dispatchShipBill/uploadCar";//卸货
apiUrl.saveOrder = apiServer.agent + "/dispatchOrder/saveOrder";//新增订单
apiUrl.getDriverInfoByPhone = apiServer.agent + "/dispatchDriver/getDriverInfoByPhone";//根据号码查询司机信息
apiUrl.insertCarTeam = apiServer.agent + "/dispatchDriver/insertCarTeam";//添加会员(非会员)司机
apiUrl.cancelCarTeam = apiServer.agent + "/dispatchDriver/cancelCarTeam";//取消熟车关系
apiUrl.updateCarTeam = apiServer.agent + "/dispatchDriver/updateCarTeam";//修改司机信息


apiUrl.importDispatchOrderTmpList ="/dispatchView/agent/dispatchOrderTmp/importDispatchOrderTmpList";//导入批量订单excel
apiUrl.selectDispatchOrderTmpList = apiServer.agent + "/dispatchOrderTmp/selectDispatchOrderTmpList";//临时订单列表
apiUrl.selectDispatchOrderTmpDetail = apiServer.agent + "/dispatchOrderTmp/selectDispatchOrderTmpDetail";//临时订单详情
apiUrl.deleteDispatchOrderTmp = apiServer.agent + "/dispatchOrderTmp/deleteDispatchOrderTmp";//删除临时的订单
apiUrl.saveDispatchOrder = apiServer.agent + "/dispatchOrderTmp/saveDispatchOrder";//提交临时批量订单


apiUrl.saveDispatchReceipt=apiServer.agent +"/dispatchreceipt/saveDispatchReceipt";

apiUrl.importCarTeam="/dispatchView/agent/dispatchDriver/importCarTeam";//导入司机

//经纪人运单

apiUrl.agentSelectDispatchShipBillDetail=apiServer.agentDispatchShipBill+'/selectDispatchShipBillDetail';//运单详情接口
apiUrl.selectDispatchShipBillList=apiServer.agentDispatchShipBill+'/selectDispatchShipBillList';//运单列表
apiUrl.checkDispatchShipBillFee=apiServer.agentDispatchShipBill+'/checkDispatchShipBillFee';//对账接口
apiUrl.batchCheckDispatchShipBillFee=apiServer.agentDispatchShipBill+'/batchCheckDispatchShipBillFee';//批量对账接口
apiUrl.agentPayAmount=apiServer.agentDispatchShipBill+'/payAmount';//付款
apiUrl.agentBatchPayAmount=apiServer.agentDispatchShipBill+'/batchPayAmount';//批量付款
apiUrl.agentBatchPayAmountOffline=apiServer.agentDispatchShipBill+'/batchPayAmountOffline';//批量线下付款
apiUrl.exportDispatchShipBillList=apiServer.agentDispatchShipBill+'/exportDispatchShipBillList';//已付款列表导出接口


apiUrl.agentSelectDispatchBatchOrderList=apiServer.agentDispatchBatchOrder+'/selectDispatchBatchOrderList';//批量待付款列表
apiUrl.agentPayDispatchBatchOrdersOffline=apiServer.agentDispatchBatchOrder+'/payDispatchBatchOrdersOffline';//批量待付款列表批量线下支付接口
apiUrl.agentDeleteDispatchBatchOrder=apiServer.agentDispatchBatchOrder+'/deleteDispatchBatchOrder';//取消批量待付款接口


//查询承运人列表
apiUrl.selectDispatchRelationList = apiServer.dispatchRelation + "/selectDispatchRelationList";//查询承运人列表
apiUrl.deleteDispatchRelation = apiServer.dispatchRelation + "/deleteDispatchRelation";//删除承运人
apiUrl.insertDispatchRelation = apiServer.dispatchRelation + "/insertDispatchRelation";//添加承运人


//总包商

//临时货源
apiUrl.importDispatchGoodsSourceTmpList = apiServer.dispatchGoodsSourceTmp2 + "/importDispatchGoodsSourceTmpList";//批量导入临时货源--导入excel
apiUrl.selectDispatchGoodsSourceTmpList = apiServer.dispatchGoodsSourceTmp + "/selectDispatchGoodsSourceTmpList";//临时货源列表
apiUrl.selectDispatchGoodsSourceTmpDetail = apiServer.dispatchGoodsSourceTmp + "/selectDispatchGoodsSourceTmpDetail";//临时货源详情
apiUrl.publishDispatchGoodsSource = apiServer.dispatchGoodsSourceTmp + "/publishDispatchGoodsSource";//临时货源发布
apiUrl.deleteDispatchGoodsSourceTmp = apiServer.dispatchGoodsSourceTmp + "/deleteDispatchGoodsSourceTmp";//临时货源删除

apiUrl.selectDispatchAgentList = apiServer.dispatchAgent + "/selectDispatchAgentList";


//货主

apiUrl.removeDispatchOrder=apiServer.dispatchOrder+'/removeDispatchOrder'//删除订单
apiUrl.batchRemoveDispatchOrder=apiServer.dispatchOrder+'/batchRemoveDispatchOrder'//批量删除订单





