/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.type = this.base.getUrlParam("type");
            this.source = "";
            //获取当前页面的分页缓存
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20;

            this.switchStatus();

            tradeCommonFun.selectModal();
            tradeCommonFun.selectChangeVal();

            laydate({
                elem: '#starttime',
                format: 'YYYY-MM-DD',
                istime: false
            })

            laydate({
                elem: '#endtime',
                format: 'YYYY-MM-DD',
                istime: false,
                max: laydate.now()
            })

            this.getData()
            var area = AddressComponent();
            area.start();
            var car = CarLengthComponent();
            car.start();
            this.allCheck=[]
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",
            "click #searchReset": "forReset",
            "click .all-check":"checkAll",
            "click .checkbox-list":"evenCheck",
            "click #deleteBatch":"deleteBatch",
            "click .delete":"deleteOrder"
        },
        
        searchSubmit:function(){
            this.getData();
        },
        checkAll:function(e){
            //列表全选和取消全选
            var _this=this;

            $('.checkbox-list').each(function(){
                var v=$(this).attr('data-value')
                for(var i =0;i<_this.allCheck.length;i++){
                    if(v==_this.allCheck[i]){
                        _this.allCheck.splice(i,1)
                    }
                }
            })
            
            if($('.all-check').is(':checked')){
                $('#ajaxCont input[type="checkbox"]').each(function(){
                    $(this).prop('checked',true)
                })
            }else{
                $('#ajaxCont input[type="checkbox"]').each(function(){
                    $(this).prop('checked',false)
                })
            }
            $('.checkbox-list').each(function(){
                if($(this).prop('checked')){
                    _this.allCheck.push($(this).attr('data-value'))
                }
            })

        },
        evenCheck:function(e){
            //单选并添加到选中列表allCheck
            var $this=$(e.currentTarget);
            var v=$this.attr('data-value')
            if($this.is(':checked')){
               this.allCheck.push(v)
            }else{
                for(var i =0;i<this.allCheck.length;i++){
                    if(v==this.allCheck[i]){
                        this.allCheck.splice(i,1)
                    }
                }
            }
        },
        switchStatus: function () {
            //根据type字段区分页面内容
            this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'
                +'{{#d.checkBox}}'
                + '<td  class="goods-table-address"><a target="_blank" class="goods-detail-link" '
                + 'href="./orderDetail.html?id={{d.dispatchorderid}}&orderId={{d.ordercode}}&type=' + this.type + '">{{d.fromordercode||d.ordercode}}</a></td>';
        
            var source2 = '<td>{{d.outcode}}</td>' + 
            '<td>{{d.from}}--{{d.to}}</td>' + 
            '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' +
             '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
             '<td>{{d.inputdate}}</td>';
            
            switch (this.type) {
                case "dispatch":
                    $("title").html("陆鲸-货主-待调度订单")
                    $("#subTilte").html("待调度订单");
                    $("#control,#checkBox").show();
                    $("#orderStatus").val(0)
                    $("#driverInfo").hide();
                    $("#finishTime").hide();
                    this.source += '<td>{{d.outcode}}</td>' + 
            '<td>{{d.from}}--{{d.to}}</td>' + 
            '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' +
             '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
             '<td>{{d.inputdate}}</td>'+
             '<td><a href="javascript:" style="display:{{d.deletType}}" data-id="{{d.dispatchorderid}}" data-ordercode="{{d.ordercode}}" class="delete">删除</a></td>'; /*'<td style="display:{{d.noSend}}"><a href="sendCar.html?dispatchorderid={{d.dispatchorderid}}' +
                        '&ordercode={{d.ordercode}}">派车</a>' +
                        '<a href="changeOrder.html?dispatchorderid={{d.dispatchorderid}}&ordercode={{d.ordercode}}' +
                        '&dispatchgoodssourceid={{d.fromdispatchgoodssourceid}}&goodssourcecode={{d.goodssourcecode}}' + '">转包</a>' + '</td>';*/
                    break;

                case "ing":
                    $("title").html("陆鲸-货主-在途订单")
                    $("#subTilte").html("在途订单")
                    $("#orderStatus").val(1)
                    $("#finishTime").hide();
                    // $("#agentControll").hide();
                    // this.source += source2 + '<td style="display:{{d.noSend}}"><a href="#" class="isSuccess" data-dispatchorderid={{d.dispatchorderid}} data-ordercode={{d.ordercode}} data-chargetype={{d.chargetype}}>确认到达</a></td>' + '<td style="display:{{d.isSend}}">已转包</td>';
                    this.source += '<td>{{d.outcode}}</td>' + 
                    '<td style="">{{#d.driverInfo}}</td>'+
                    '<td>{{d.from}}--{{d.to}}</td>' + 
                    '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' +
                     '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
                     '<td>{{d.inputdate}}</td>';
                    break;

                case "success":
                    $("title").html("陆鲸-货主-完成订单")
                    $("#subTilte").html("完成订单")
                    $("#orderStatus").val(2)
                    //$("#agentControll").hide();
                    // $("#agentControll").hide();
                    // $("#finishTime").hide();
                    // this.source += source2;
                    // this.source += source2 + '<td style="">{{d.driverinfo[0]&&d.driverinfo[0].driverrealname||""}}<br/>{{d.driverinfo[0]&&d.driverinfo[0].drivermobilenumber||""}}</td>' + '<td>确认</td>';
                    this.source += '<td>{{d.outcode}}</td>' + 
                    '<td>{{#d.driverInfo}}</td>'+
            '<td>{{d.from}}--{{d.to}}</td>' + 
            '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' +
             '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
             '<td>{{d.inputdate}}</td>'+
             '<td>{{d.driverinfo[0]&&d.driverinfo[0]["uploaddate"]||""}}</td>' ;
                            
                    break;

            }
            this.source += '</tr>' + '{{/each}}';
        },

        
        getData: function (page) {
            //获取页面列表数据
            var _this = this;
            var searchData = $("#searchForm").serializeObject();
            
            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
            searchData.fromprovince = searchData.from.split("-")[0]
            searchData.fromcity = searchData.from.split("-")[1]
            searchData.fromregion = searchData.from.split("-")[2]
            delete searchData.from;

            searchData.toprovince = searchData.to.split("-")[0]
            searchData.tocity = searchData.to.split("-")[1]
            searchData.toregion = searchData.to.split("-")[2]
            delete searchData.to;

            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)
            var url = apiUrl.selectDispatchOrderList;
            if (searchData.bidtype == "q") {
                searchData.bidtype = "";
            }
            if (this.type == "contractor") {
                url = apiUrl.agentSelectDispatchOrderList
            }

            //获取列表
            getJsonp({
                url: url,
                data: searchData,
                callback: function (d) {
                    if (d.result == "error") {
                        alertMsg(d.msg);
                        return;
                    }
                    if (d.count == 0) {
                        $(".no-model").remove();
                        $(".modal-cont").append(tradeCommonFun.creatNodata());
                        $('#ajaxCont,.pagination').html("");
                        return;
                    } else {
                        $(".no-model").remove();
                    }
                    d = tradeCommonFun.dataMobileHandle(d, "trademobilenumber");
                    d = _this.dataTeas(d);

                    var render = template.compile(_this.source);
                    var html = render(d);
                    $('#ajaxCont').html(html);
                    tradeCommonFun.createPage({
                        count: d.count,
                        page:page||0,
                        pageSize: _this.pageSize,
                        callback: function (page,pageSize) {
                            _this.pageSize=pageSize
                            _this.getData(page)
                        }
                    });
                }
            });
        },
        /*
        * @param {d} 包含data属性的object
        * @return {d} 返回经过整理过滤的object
         */
        dataTeas: function (d) {
            //请求返回的数据整理,
            var _this=this;
            $.each(d.data, function (i, e) {
                e.from = e.fromprovince + e.fromcity + e.fromregion;
                e.to = e.toprovince + e.tocity + e.toregion;
                e.fromSub = tradeCommonFun.stringFilter(e.from, 15);
                e.toSub = tradeCommonFun.stringFilter(e.to, 15);
                if (e.carlengthmin && e.carlengthmax) {
                    e.carleng = e.carlengthmin + "-" + e.carlengthmax + "米,";
                } else {
                    e.carleng = "";
                }
                e.bidtypeWord = e.bidtype == 0 ? "派单" : "竞价";
                e.goodsSpaceW = (e.goodsweightmin ? (e.goodsweightmin + "吨") : "");
                e.goodsSpaceV = (e.goodsvolumemin ? (e.goodsvolumemin + "立方") : "");
                e.total = e.dispatchorderfee[0].totalamount + "元"
                e.obj=JSON.stringify(e.dispatchreceipt)
                e.driverInfo=e.driverinfo[0]?(
                    (e.driverinfo[0].driverrealname)+
                    (e.driverinfo[0].carplatenumber?("<br/>"+e.driverinfo[0].carplatenumber):"")+
                    (e.driverinfo[0].drivermobilenumber?("<br/>"+e.driverinfo[0].drivermobilenumber):"")
                    ):"";
                //货主货源被转包过就不显示删除按钮
                if(e.dispatchtimes>=1){
                    e.checkBox=_this.type=="dispatch"?'<td></td>':""
                    e.deletType="none";
                }else{
                    e.checkBox=_this.type=="dispatch"?'<td><input type="checkbox" class="checkbox-list"  data-value="'+e.dispatchorderid+'"></td>':""
                }
            });
            return d;
        },
        deleteBatch:function(){
            //批量删除
             var _this=this;
            
            if(this.allCheck.length<1){
                alertMsg('请勾选需删除的订单')
                return;
            }else{
                var deleteFun=function(){getJsonp({
                        url:apiUrl.batchRemoveDispatchOrder,
                        data:{
                            dispatchorderids:_this.allCheck.join(",")
                        },
                        callback:function(data){
                            if(data.result=="error"){
                                alertMsg(data.msg);
                                return;
                            }
                            if(data.result=="success"){
                                _this.allCheck=[];
                                _this.getData();
                                new Pop({
                                    type:"pop",
                                    content:"删除成功",
                                    callType:"success"
                                }).init();
                            }
                        }
                    })
                }

                this.deleteConfirm(deleteFun);
            }
        },
        forReset: function () {
            //重置
            $("#searchForm")[0].reset();
        },
        deleteOrder:function(e){
            //删除订单
            var _this=this;
           var deleteFun=function(){
                            getJsonp({
                                url:apiUrl.removeDispatchOrder,
                                data:{
                                    dispatchorderid:$(e.currentTarget).data("id"),
                                    ordercode:$(e.currentTarget).data("ordercode")
                                },
                                callback:function(data){
                                    if(data.result=="error"){
                                        alertMsg(data.msg);
                                        return;
                                    }
                                    if(data.result=="success"){
                                        if($("#ajaxCont").find("tr").length<=1){
                                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-2)
                                        }else{
                                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                                        }
                                        new Pop({
                                            type:"pop",
                                            content:"删除成功",
                                            callType:"success"
                                        }).init();
                                    }
                                }
                            })
                   }
            this.deleteConfirm(deleteFun)
        },
        /*
        * @param {callback} 点击确认后执行的函数名
         */
        deleteConfirm:function(callback){
            //确认框
             new Pop({
                    footer:[{
                            text: '确定',
                            click: function () {
                                callback();
                            }
                        },
                        {
                            text: '取消',
                            click: function () {

                            }
                        }
                    ],
                    content:"是否确认删除该订单信息?",
                    callType:"success"
                }).init();
        }
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });


});
