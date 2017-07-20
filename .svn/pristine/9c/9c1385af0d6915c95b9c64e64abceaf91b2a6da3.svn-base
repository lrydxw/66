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
            var partyStr = iLocalStorage.getItem('DispatchRole');
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20;
            this.Role = partyStr ? JSON.parse(partyStr) : '';

            this.switchStatus();
            $('[name="bidtype"]').val("q");
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

            this.getDate()
            var area = AddressComponent();
            area.start();
            var car = CarLengthComponent();
            car.start();
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "getDate",
            "click #searchReset": "forReset"
        },
        switchStatus: function () {
            this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'
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

                    $("#orderStatus").val(0)
                    $("#driverInfo").hide();
                    $("#finishTime").hide();
                    this.source += '<td>{{d.outcode}}</td>' + 
            '<td>{{d.from}}--{{d.to}}</td>' + 
            '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' +
             '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
             '<td>{{d.inputdate}}</td>'; /*'<td style="display:{{d.noSend}}"><a href="sendCar.html?dispatchorderid={{d.dispatchorderid}}' +
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

        //自定义方法
        getDate: function (page) {
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
                            _this.getDate(page)
                        }
                    });
                }
            });
        },
        //数据梳理,
        dataTeas: function (d) {
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
                    ):""
            });
            return d;
        },
       
        forReset: function () {
            $("#searchForm")[0].reset();
        }
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });


});
