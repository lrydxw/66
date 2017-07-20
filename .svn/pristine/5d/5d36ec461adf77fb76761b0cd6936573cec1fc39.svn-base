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
            this.switchStatus();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
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
            this.getData()
            var area = AddressComponent();
            area.start();
            var car = CarLengthComponent();
            car.start();
            this.uploadImg();


        },
        events: {
        //添加事件（基于委托，绑定动态加载元素）
            "click #searchSubmit": "searchSubmit",
            "click #searchReset": "forReset",
            "click .isSuccess": "isSuccess",
            "click .signMsg":"signMsg",
            "click .showBig":"showBig"
        },
        
        searchSubmit:function(){
            this.getData();
        },
        switchStatus: function () {

            //根据url的type参数展示列表  
            //dispatch  待调度
            //ing       在途中
            //success   完成订单
            //send       已转运
            this.source = '{{each data as d i}}' + '{{if i%2==0}}' + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}' + '<td  class="goods-table-address"><a  target="_blank" class="goods-detail-link" ' + 'href="./orderDetail.html?id={{d.dispatchorderid}}&orderId={{d.ordercode}}&type=' + this.type + '{{d.subtype}}">{{d.fromordercode||d.ordercode}}</a></td>'

             var source2 = '<td>{{d.outcode}}</td>' +
             '<td>{{d.from}}--{{d.to}}</td>' + 
             '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
             '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
             '<td>{{d.inputdate}}</td>';
            switch (this.type) {
                case "dispatch":
                    $("title").html("陆鲸-总包商-待调度订单")
                    $("#subTilte").html("待调度订单");
                    $("#orderStatus").val(0)
                    $("#driverInfo").hide();
                    $("#finishTime").hide();
                    $("#agent,#packageStatus").hide();
                    this.source += '<td>{{d.outcode}}</td>' +
                         '<td>{{d.from}}--{{d.to}}</td>' + 
                         '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
                         '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
                         '<td>{{d.inputdate}}</td>'+
                          '<td style="display:{{d.noSend}}"><a href="sendCar.html?dispatchorderid={{d.dispatchorderid}}' +
                        '&ordercode={{d.ordercode}}">派车</a>' +
                        '<a href="changeOrder.html?dispatchorderid={{d.dispatchorderid}}&ordercode={{d.ordercode}}' +
                        '&dispatchgoodssourceid={{d.dispatchgoodssourceid}}&goodssourcecode={{d.goodssourcecode}}' + '">转包</a>' + '</td>' +
                        '<td style="display:{{d.isSend}}">已转包</td>';
                    break;
 
                case "ing":
                    $("title").html("陆鲸-总包商-在途订单")
                    $("#subTilte").html("在途订单")
                    $("#agent,#packageStatus").hide();
                    $("#orderStatus").val(1)
                    $("#finishTime").hide();
                     this.source += '<td>{{d.outcode}}</td>' +
                    '<td style="display:{{}}">{{#d.driverInfo}}</td>' +
                     '<td>{{d.from}}--{{d.to}}</td>' + 
                     '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
                     '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
                     '<td>{{d.inputdate}}</td>' + 
                      //'<td style="display:{{d.noSend}}"><a href="#" class="isSuccess" data-dispatchorderid={{d.dispatchorderid}} data-ordercode={{d.ordercode}} data-chargetype={{d.chargetype}}>确认到达</a></td>';
                    '<td><a href="./carOrder.html?type=carOrderAgent&id={{d.fromordercode||d.ordercode}}" >查看派车单</a>'
                    break;

                case "success":
                    $("title").html("陆鲸-总包商-完成订单")
                    $("#subTilte").html("完成订单")
                    $("#orderStatus").val(2)
                    $("#agent,#packageStatus").hide();
                     this.source += '<td>{{d.outcode}}</td>' +
                            '<td>{{#d.driverInfo}}</td>'+
                             '<td>{{d.from}}--{{d.to}}</td>' + 
                             '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
                             '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
                             '<td>{{d.inputdate}}</td>' + 
                            '<td>{{d.driverinfo[0]&&d.driverinfo[0]["uploaddate"]||""}}</td>'+
                            '<td><a href="javascript:" class="signMsg" data-dispatchorderid={{d.dispatchorderid}} data-ordercode={{d.ordercode}}  data-obj="{{d.obj}}">{{d.obj.length==2?"上传附件":"编辑附件"}}</a></td>';
                    break;

                case "sendOrder":
                    $("title").html("陆鲸-总包商-已转运订单")
                    $("#subTilte").html("已转运订单")
                     $("#agentControll").hide();
                    $("#orderStatus").val(2);
                    $("#packageStatus").show();
                    $('#finishTime').hide();
                    $('#driverInfo').hide();
                    this.source += 
                    '<td>{{d.outcode}}</td>' +
                    '<td>{{d.agentrealname}}</td>' + 
                     '<td>{{d.from}}--{{d.to}}</td>' + 
                     '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
                     '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
                     '<td>{{d.inputdate}}</td>'+
                     '<td data-status={{d.status}}>{{d.statusWord}}</td>';
                     break;
            }
            this.source += '</tr>' + '{{/each}}';
        },
        /*
        * @param {page} 获取指定页数的数据，起始为0
         */
        getData: function (page) {
            //获取列表数据 继承搜索表单字段
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
            searchData.skipcount=(page||0)* this.pageSize
            var url = apiUrl.agentSelectDispatchOrderList;
            if (this.type == "sendOrder") {
                url = apiUrl.selectDispatchOrderList;
                searchData.status = ""
            }
            if (searchData.bidtype == "q") {
                searchData.bidtype = "";
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
                    d = _this.dataTeas(d);

                    if (d.count == 0) {
                        $(".no-model").remove();
                        $(".modal-cont").append(tradeCommonFun.creatNodata());
                        $('#ajaxCont,.pagination').html("");
                        return;
                    } else {
                        $(".no-model").remove();
                    }
                    d = tradeCommonFun.dataMobileHandle(d, "trademobilenumber");

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
            //请求的列表数据整理
            var _this = this;
            var status=["待派车","待运达","已完成"]
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
                e.total = (e.dispatchorderfee && e.dispatchorderfee.length > 0 && e.dispatchorderfee[0].totalamount) || 0 + "元";
               
                if (_this.type == "sendOrder") {
                    e.subtype = "&subtype=" + e.status
                }
                if (e.dispatchtimes > 0) {
                    e.noSend = "none";
                    e.isSend = ""
                } else {
                    e.noSend = "";
                    e.isSend = "none"
                }
                e.obj=JSON.stringify(e.dispatchreceipt)
                e.statusWord=status[e.status]
                e.driverInfo=e.driverinfo[0]?(
                    (e.driverinfo[0].driverrealname)+
                    (e.driverinfo[0].carplatenumber?("<br/>"+e.driverinfo[0].carplatenumber):"")+
                    (e.driverinfo[0].drivermobilenumber?("<br/>"+e.driverinfo[0].drivermobilenumber):"")
                    ):""

            });
            return d;
        },
        forReset: function () {
            //重置搜索表单
            $("#searchForm")[0].reset();
        },
        isSuccess: function (e) {
            //在途订单列表的确认到达操作
            var _this = this;
            e.preventDefault();
            if ($(e.target).data("chargetype") == 0) {
                new Pop({
                    content: "请确认货物到达！",
                    callType: "success",
                    footer: [{
                        text: '确定',
                        click: function () {
                            getJsonp({
                                url: apiUrl.uploadCar,
                                data: {
                                    dispatchorderid: $(e.target).data("dispatchorderid"),
                                    ordercode: $(e.target).data("ordercode")
                                },
                                callback: function (d) {
                                    if (d.result == "success") {
                                        new Pop({
                                            type: "pop",
                                            content: d.msg,
                                            callType: "success"
                                        }).init();
                                        $("#dealForm").closest(".pop-cover").remove();
                                        _this.getData();
                                    } else {
                                        new Pop({
                                            type: "pop",
                                            content: d.msg,
                                            callType: "fail"
                                        }).init();
                                        $("#dealForm").closest(".pop-cover").remove();
                                    }
                                }
                            });
                        }
                    }, {
                        text: '取消'
                    }]
                }).init();
            } else {
                getJsonp({
                    url: apiUrl.agentSelectDispatchOrderDetail,
                    data: {
                        dispatchorderid: $(e.target).data("dispatchorderid"),
                        ordercode: $(e.target).data("ordercode")
                    },
                    callback: function (data) {
                        if (data.result == "success") {
                            _this.showIframe(data, e)
                        } else {
                            new Pop({
                                type: "pop",
                                content: data.msg,
                                callType: "fail"
                            }).init();
                        }
                    }
                });
            }

        },
        signMsg:function(e){
            //已完成订单的编辑附件和上传附件
            var $this=$(e.currentTarget);
            var _this=this;
            
           var obj=$this.data("obj"),imgArr=(obj.receiptimgurl?obj.receiptimgurl.split(","):[]),imgHtml="",canAddImg=true
            for(var i=0;i<imgArr.length;i++){
                imgHtml+='<span class="iframe-img-list"><label></label><a href="javascript:"  class="showBig"></a><img src="'+imgArr[i]+'" /></span>'
            }
            if(imgArr.length>3){
                canAddImg=false
            }
            new Pop({
                    type:"iframe",
                    click:"other",
                    html:'<div  class="deal-form"><form id="dealForm">' +
                    '<input type="hidden" name="dispatchorderid" value="'+$this.data("dispatchorderid")+'" />'+
                    '<input type="hidden" name="ordercode"  value="'+$this.data("ordercode")+'"/>'+
                    '<div class="input-line">' +
                    '<span class="input-title">签收人:</span>' +
                    '<input type="text" class="t-c-input input-width7" value="'+(obj.receiptman||"")+'" placeholder="" name="receiptman" id="dealNumber" maxlength="20"/>' +
                    '<span class="input-title">卸货时间:</span>' +
                    '<input type="text" class="t-c-input input-width2" id="receiptdate"  value="'+(obj.receiptdate||"")+'" onClick="laydate({format: \'YYYY-MM-DD hh:mm:ss\',istime: true})" placeholder="" name="receiptdate"  />' +
                    '</div>'+
                    '<div class="input-line"  style="position:relative;">' +
                    '<span class="input-title">备注:</span>' +
                    '<textarea type="text" class="t-c-input textarea-iframe" placeholder="" name="memo" maxlength="200" >'+(obj.memo||"")+'</textarea>' +
                    '<label id="memoLength" class="memo-iframe">'+(obj.memo||"").length+'/200</label>'+
                    '</div></form>'+
                    '<div class="input-line" id="iframeImgList" style="position:relative;">' +
                    '<span class="input-title">上传单据:</span>' +
                    imgHtml+
                    '<span class="iframe-add-img" id="iframeAddImg" style="display:'+(canAddImg?"":"none")+'">+'+
                    '<form >'+
                    '<input type="file" name="filedata" id="filedata" class="iframe-add-img iframe-input">'+
                    '</form>'+
                    '</span>'+
                    '<div class="img-tips">仅支持JPG/JPEG/PNG格式的图片，且文件大小不能超过5M</div>'+
                    '</div></div>',
                    footer: [{
                        text: '保存',
                        click: function (e) {
                            var data=$("#dealForm").serializeObject();
                            data.receiptimgurl=[];
                            $("#iframeImgList .iframe-img-list").each(function(e){
                                data.receiptimgurl.push($(this).find("img").attr("src"))
                            })
                            data.receiptimgurl=data.receiptimgurl.join(",")
                             getJsonp({
                                url: apiUrl.saveDispatchReceipt,
                                data: data,
                                callback: function (data) {

                                    if (data.result == "success") {
                                         new Pop({
                                            type: "pop",
                                            content: data.msg,
                                            callType: "success"
                                        }).init();
                                         _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                                        e.remove();
                                    } else {
                                         new Pop({
                                            type: "pop",
                                            content: data.msg,
                                            callType: "fail"
                                        }).init();
                                    }
                                }
                            });
                        }
                    },{
                        text: '取消'
                    }]
                }).init();
             
            
            $("#iframeAddImg").closest(".input-line").on("click",".iframe-img-list label",function(){
                $(this).closest(".iframe-img-list").remove();
                if($(".iframe-img-list").length<4){
                    $("#iframeAddImg").show()
                }
            })
            $(".textarea-iframe").keyup(function(){
                $("#memoLength").html($(this).val().length+"/200")
            })

        },
        showIframe: function (data, e) {
            //订单为chartype为1 的 信息补录
            var _this = this;
            var dataObj = data.data;
            dataObj.from = dataObj.fromprovince + "-" + dataObj.fromcity + dataObj.fromregion + dataObj.fromtown + dataObj.fromdetail;
            dataObj.to = dataObj.toprovince + "-" + dataObj.tocity + dataObj.toregion + dataObj.totown + dataObj.todetail;
            dataObj.goodsSpecialInfo = ((dataObj.goodsweightmin ? (dataObj.goodsweightmin + "吨") : "") || (dataObj.goodsweightmax ? (dataObj.goodsweightmax + "吨") : "")) + "," +
                ((dataObj.goodsvolumemin ? (dataObj.goodsvolumemin + "立方") : "") || (dataObj.goodsvolumemax ? (dataObj.goodsvolumemax + "立方") : ""))
            dataObj.goodsSpecialInfo = dataObj.goodsSpecialInfo.replace(/,,,|,,/g, ",").replace(/(^,|,$)/g, "");

            new Pop({
                type: "iframe",
                click: "other",
                html: '<form id="dealForm" class="deal-form agent-form">' +
                '<div class="input-line" ><span class="input-title">起始地：</span><span class="input-word">' + (dataObj.from) + '</span></div>' +
                '<div class="input-line" ><span class="input-title">目的地：</span><span class="input-word">' + (dataObj.to) + '</span></div>' +
                '<div class="input-line" ><span class="input-title">运费金额：</span><span class="input-word">' + (dataObj.dispatchorderfee && e.dispatchorderfee.length > 0 && dataObj.dispatchorderfee[0].totalamount) || 0 + '</span></div>' +
                '<div class="input-line" ><span class="input-title">货物名称：</span><span class="input-word">' + (dataObj.goodsname || 0) + '</span>' +
                '<span class="input-title">货物信息：</span><span class="input-word">' + (dataObj.goodsSpecialInfo || "") + '</span></div>' +
                '<div class="input-line">' +
                '<span class="input-title">货物实际重量<label class="icon-must">*</label>：</span>' +
                '<input type="text" class="t-c-input input-width3" placeholder="" name="goodsfactweight" maxlength="8"  /><span class="hen">吨</span>' +
                '</div>' +
                '</form>',
                footer: [{
                    text: '确定',
                    click: function () {
                        var __this = this;
                        var submitData = $("#dealForm").serializeObject();

                        if (!submitData.goodsfactweight || !parseInt(submitData.goodsfactweight)) {
                            new Pop({
                                type: "pop",
                                content: "请确认实际重量",
                                callType: "fail"
                            }).init();
                            return;
                        }
                        submitData.dispatchorderid = $(e.target).data("dispatchorderid");
                        submitData.ordercode = $(e.target).data("ordercode")
                        submitData.goodsfactweight = parseFloat(submitData.goodsfactweight) * 1000;
                        getJsonp({
                            url: apiUrl.uploadCar,
                            data: submitData,
                            callback: function (d) {
                                if (d.result == "success") {
                                    new Pop({
                                        type: "pop",
                                        content: d.msg,
                                        callType: "success"
                                    }).init();
                                    $("#dealForm").closest(".pop-cover").remove();
                                    _this.getData();
                                } else {
                                    new Pop({
                                        type: "pop",
                                        content: d.msg,
                                        callType: "fail"
                                    }).init();
                                    $("#dealForm").closest(".pop-cover").remove();
                                }
                            }
                        });
                    }
                }, {
                    text: '取消'
                }],
            }).init();
        },
        uploadImg:function(){
            //编辑附件内的 图片上传
            $(document).on("change","#filedata",function(){
                       var formData = new FormData($(this).closest("form")[0]);
                    $.ajax({
                        url: apiUrl.uploadImg,
                        type: 'POST',
                        data: formData,
                        async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (returndata) {
                           // console.log("success:",returndata)
                            var $this=$("#iframeAddImg")
                            $("#filedata").val("")
                            if($(".iframe-img-list").length==3){
                                $this.hide()
                            }
                            $this.before('<span class="iframe-img-list"><label></label><a href="javascript:" class="showBig"></a><img src="'+returndata.data.imgurl+'" /></span>')
                        
                        },
                        error: function (returndata) {
                            console.log("error:",returndata)
                        }
                    });
                });
        },
        showBig:function(e){
            //编辑附件内的查看大图
            var picSrc=$(e.currentTarget).closest("span").find("img").attr("src")
            new Pop({
                type: "iframe",
                otherClass:"blow-up-img",
                html: '<img id="blowUpImg" src="'+picSrc+'">',
                footer: [ {
                    text: '关闭'
                }],
            }).init();
            var imgHeight=$("#blowUpImg").height(),imgWidth=$("#blowUpImg").width(),boxWidth=600,boxHeight=338;
            if(imgWidth>boxWidth){
                $("#blowUpImg").width(boxWidth)
            }
            if(imgHeight>boxHeight){
                $("#blowUpImg").width("")
                $("#blowUpImg").height(boxHeight)
            }
            //高度不足，上下居中
            if($("#blowUpImg").height()<boxHeight){
                $("#blowUpImg").css("margin-top",(boxHeight-$("#blowUpImg").height())/2)
            }
            
        }
    });
    var obj = new tradeFun({
        $el: $('body')
    });


});