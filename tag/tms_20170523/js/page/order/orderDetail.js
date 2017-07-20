/*
* 业务中心公用
* */
$(function(){
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base=new transfar.Base();
            this.type=this.base.getUrlParam("type");
            this.addservArr={};//增值服务
            this.getAddserv();
            var partyStr = iLocalStorage.getItem('DispatchRole');
            this.Role = partyStr?JSON.parse(partyStr):'';
            this.switchStatus();

            
        },
        //添加事件（基于委托，绑定动态加载元素）
        switchStatus:function(){

            var localHref=location.href;
            var _this=this;
            $('#tradeMenu li').each(function(){
                if($(this).attr("dataurl").indexOf("type="+_this.type)!=-1){
                    $(this).addClass("current")
                }
            });
            switch(this.type){
                case "dispatch":

                break;

                case "ing":
                    $("#driver").show()
                break;

                case "success":
                    $("#driver,#receipt").show()
                break;
                case "send":
                    
                break;
                default:
                    if(this.type.indexOf("Agent")!=-1){
                        $("#driver").show()
                    }
                break;
            }
        },
        //货源详情
        getDetail:function(){
            var status=["待派车","待运达","已完成"],agentStatus={sendCheckAgent:"待对账",sendPayTheWaitAgent:"待付款",sendPayTheOverAgent:"已付款"}
            var orderId=this.base.getUrlParam("orderId"),
                id=this.base.getUrlParam("id")
                _this=this
                url="";

            var data={
                    dispatchorderid:id,
                    ordercode:orderId
            }
            switch(this.Role){
                case "agent":
                    url=apiUrl.agentSelectDispatchOrderDetail;
                    if(this.type.indexOf("Agent")!=-1){
                        url=apiUrl.agentSelectDispatchShipBillDetail;
                        data={
                            dispatchshipbillid:this.base.getUrlParam("dispatchshipbillid"),
                            shipbillcode:this.base.getUrlParam("shipbillcode")
                        }
                    }
                    break;
                case "owner":
                    url=apiUrl.selectDispatchOrderDetail
                    break;
                case "contractor":
                    url=apiUrl.agentSelectDispatchOrderDetail
                    if(this.type.indexOf("send")!=-1){
                        url=apiUrl.selectDispatchOrderDetail
                    }
                    break;
            }
            getJsonp({
                url:url,
                data:data,
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        var dataObj=data.data;
                        data=tradeCommonFun.dataMobileHandle(data,"trademobilenumber");
                        dataObj.from=dataObj.fromprovince+"-"+dataObj.fromcity+dataObj.fromregion+dataObj.fromtown;
                        dataObj.to=dataObj.toprovince+"-"+dataObj.tocity+dataObj.toregion+dataObj.totown;
                        dataObj.add="";
                        if(dataObj.addedservice.length>0){
                            for(var i=0,add=dataObj.addedservice.split(","),l=add.length;i<l;i++){
                                    dataObj.add+=","+_this.addservArr[add[i]];
                            }
                        }
                        dataObj.add=dataObj.add.slice(1)//回单信息

                        //司机信息
                        if(dataObj.driverinfo){
                            if(dataObj.driverinfo[0]){
                                dataObj.driverName=dataObj.driverinfo[0].driverrealname;
                                dataObj.driverPhone=dataObj.driverinfo[0].drivermobilenumber;
                                dataObj.carNumber=dataObj.driverinfo[0].carplatenumber;
                                dataObj.carInfo=dataObj.driverinfo[0].carfactlength+"米,"+dataObj.driverinfo[0].carfacttype
                            }
                        }else{
                            dataObj.driverName=dataObj.driverrealname;
                            dataObj.driverPhone=dataObj.drivermobilenumber;
                            dataObj.carNumber=dataObj.carplatenumber;
                            dataObj.carInfo=dataObj.carfactlength+"米,"+dataObj.carfacttype
                        }
                        
                        //运输信息
                        dataObj.goodsweightmin=(dataObj.goodsweightmin?dataObj.goodsweightmin+"吨":"")
                        dataObj.goodsvolumemin=(dataObj.goodsvolumemin?dataObj.goodsvolumemin+"立方":"")
                        dataObj.goodsInfo=dataObj.goodsweightmin+"  "+dataObj.goodsvolumemin
                        
                        dataObj.carlengthmin=(dataObj.carlengthmin?dataObj.carlengthmin+"米":"")

                        dataObj.receiptimgurl=""
                        if(dataObj.dispatchreceipt){

                            if(dataObj.dispatchreceipt.receiptimgurl){
                                var imgList=dataObj.dispatchreceipt.receiptimgurl.split(",")
                                for(var i=0;i<imgList.length;i++){
                                    dataObj.receiptimgurl+='<a href="'+imgList[i]+'" target="_blank"><img src="'+imgList[i]+'"></a>'
                                }
                            }
                            dataObj.receiptman=dataObj.dispatchreceipt.receiptman||""
                            dataObj.receiptdate=dataObj.dispatchreceipt.receiptdate||""
                            dataObj.receiptMemo=dataObj.dispatchreceipt.memo||""

                        }
                        dataObj.statusWord=status[dataObj.status]
                         if(_this.type.indexOf("Agent")!=-1){
                            dataObj.statusWord=agentStatus[_this.type]
                        }
                        dataObj.showOrdercode=dataObj.fromordercode||dataObj.ordercode
                        for(var x in data.data){
                            $("#modalDetail [name='"+x+"']").html(data.data[x]);
                        }
                    }
                }
            })
         },
         getAddserv:function(){
            var _this=this;
             getJsonp({
                    url:apiUrl.selectDispatchDictionaryList,
                    data:{
                        type:"增值服务",
                        status:1
                    },
                    callback:function(data){
                        for(var i=0,l=data.data.length;i<l;i++){
                            _this.addservArr[data.data[i].orderno]=data.data[i].text;
                        }
                        _this.getDetail();
           
                    }
                })
         }
    });
    var obj = new tradeFun({
        $el:$('.body-content')
    });


});
