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
            //todo 分离运单和订单详情页面
            switch(this.type){
                case "dispatch":

                break;

                case "ing":
                    $("#driver").show()
                break;

                case "success":
                    $("#driver,#receipt").show()
                break;
                case "sendOrder":
                    
                break;
                default:
                    if(this.type.indexOf("Agent")!=-1){
                        $("#driver").show()
                    }
                break;
            }
            //hack 临时类型 派车单详情显示
            if(this.type=="carOrderAgent"){
                $("#driver").show()
                $(".t-h2").html("派车单详情")
                $("#otherCode .title").html("派车单号")
                $("#otherCode .dec").attr("name","shipbillcode")
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
                    //查运单的接口
                    if(this.type.indexOf("Agent")!=-1){
                        url=apiUrl.agentSelectDispatchShipBillDetail;
                        data={
                            dispatchshipbillid:this.base.getUrlParam("dispatchshipbillid"),
                            shipbillcode:this.base.getUrlParam("shipbillcode")
                        }
                        //隐藏应收
                        $("#needGet").hide()
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
                        if(!dataObj.driverinfo){
                            //运单详情的司机
                            dataObj.driverinfo=[{
                                driverrealname:dataObj.driverrealname,
                                drivermobilenumber:dataObj.drivermobilenumber,
                                carplatenumber:dataObj.carplatenumber,
                                carfactlength:dataObj.carfactlength,
                                carfacttype:dataObj.carfacttype,
                                cardragmass:dataObj.cardragmass
                            }]
                        }
                        //显示司机
                        _this.showDriver({data:dataObj.driverinfo})//
                        
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
                        //派车单详情
                        if(_this.type.indexOf("carOrderAgent")!=-1){
                            dataObj.statusWord=dataObj.status==10?"在途中":"已运达"
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
         },
        /*
        *司机信息展示
        * @param {data} 司机数据 object
        */
        showDriver:function(data){
            //司机信息展示
            var source='\{{each data as d i}}\
                        <ul class="goods-goods-detail order-order-detail">\
                            <li  style="width:50%" class="switchClass">\
                                <span class="title">车牌号:</span>\
                                <span class="dec" >{{d.carplatenumber}}</span>\
                            </li>\
                            <li  style="width:50%">\
                                <span class="title">姓名:</span>\
                                <span class="dec" >{{d.driverrealname}}</span>\
                            </li>\
                            <li  style="width:50%">\
                                <span class="title">车辆信息:</span>\
                                <span class="dec" >{{d.info}}</span>\
                            </li>\
                            <li  style="width:50%">\
                                <span class="title">手机号:</span>\
                                <span class="dec" >{{d.drivermobilenumber}}</span>\
                            </li>\
                        </ul>{{/each}}'
            //车辆信息
            for(var i=0;i<data.data.length;i++){
                var obj=data.data[i];
                obj.info=(obj.carfacttype?("，"+obj.carfacttype):"")
                +(obj.carfactlength?("，"+obj.carfactlength+"米"):"")
                +(obj.cardragmass?("，"+(obj.cardragmass/1000).toFixed(2)+"吨"):"")
                obj.info=obj.info.slice(1)
            }
            var render = template.compile(source);
            var html = render(data);
            $('#driver').append(html); 
        }
    });
    var obj = new tradeFun({
        $el:$('.body-content')
    });


});
