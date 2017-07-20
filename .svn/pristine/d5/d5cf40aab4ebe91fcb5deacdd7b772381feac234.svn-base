/*
 * 业务中心公用
 * */
var start1 = {
    elem: '#starttime1',
    format: 'YYYY-MM-DD hh:mm:ss',
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function (datas) {
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas //将结束日的初始值设定为开始日
    }
};
var end = {
    elem: '#endtime',
    format: 'YYYY-MM-DD hh:mm:ss',
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function (datas) {

    }
};
laydate(start1);
laydate(end);
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.getDataList('车型');
            this.getDataList('车长');
            this.searchrelat();
            tradeCommonFun.checkModal();
            tradeCommonFun.selectModal();
            // tradeCommonFun.numberInput();
            this.ajaxIng = false;
            // this.getScreen();
            // $('[name="chargetype"]').val("0");
            //填充url字段

            /*$('ul.chargetype-option').on('click','li',function(){
                var index=$(this).index()
                if(index<2){
                    $('.freightprice').hide()
                }else{
                    $('.freightprice').show()
                }
            })*/
            var ih = '',
                im = ''
            for (var i = 0; i <= 24; i++) {
                ih += '<option value=' + i + '>' + i + '</option>'
            }
            $('[name="invaliddateH"]').append(ih)
            for (var i = 0; i <= 60; i++) {
                im += '<option value=' + i + '>' + i + '</option>'
            }
            $('[name="invaliddateM"]').append(im)

            this.formUrl = apiUrl.saveGoodsSource; //apiUrl.publishGoodsSource;
            var _this = this

            //城市控件调用
            var area = AddressComponent();
            area.start();
            var car = CarLengthComponent();
            car.start();
            var _this = this;
            $("body").mouseup(function () {
                _this.releaseCheck();
            });


        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #release": 'releaseGoods',
            "keyup #releaseForm": "releaseCheck",
            "click #invaliddateshow": 'invaliddate',
            "click .normal-tips-li": 'addTips'
        },
        getDataList: function (type) {
            var _this = this;
            var successFun;
            switch (type) {
                case '车长':
                    successFun = function (data) {
                        var li = ''
                        for (var i = 0; i < data.length; i++) {
                            li += "<li>" + data[i].text + "</li>"
                        }
                        return li
                        // $('.carlen_ul').html(li)
                    }
                    break;
                case '车型':
                    successFun = function (data) {
                        _this.getData();
                        var li = ''
                        for (var i = 0; i < data.length; i++) {
                            li += "<li data-value=" + data[i].text + ">" + data[i].text + "</li>"
                        }
                        return li
                        // $('[name="cartype"]').html(li)
                    }
                    break;
            }
            getJsonp({
                url: apiUrl.selectDispatchDictionaryList,
                data: {
                    type: type,
                    status: 1,
                    sort: 'orderNo'
                },
                callback: function (data) {
                    if (data.result == "error") {
                        alertMsg(data.msg);
                        return;
                    }
                    if (data.result == "success") {
                        var li = successFun(data.data)
                        switch (type) {
                            case '车长':
                                $('.carlen_ul').html(li)
                                break;
                            case '车型':
                                $('ul[name="cartype"]').html(li)
                                //重新发货跳转 填充数据
                                break;
                        }
                    }
                }
            });
        },
        searchrelat: function () {
            getJsonp({
                url: apiUrl.selectDispatchRelationList,
                callback: function (data) {
                    if (data.result == "error") {
                        alertMsg(data.msg);
                        return;
                    }
                    if (data.result == "success") {
                        var data = data.data
                        var li = ''
                        for (var i = 0; i < data.length; i++) {
                            li += "<li data-value=" + data[i].dispatchagentid + "," + data[i].agentrealname + "," + data[i].agentpartyid + ">" + data[i].agentrealname + "</li>"
                        }
                        $('ul[name="dispatchagentid"]').html(li)
                    }
                }
            });
        },

        addTips: function (e) {

            var $this = $(e.currentTarget)
            var tips = $this.html()
            var note = $('#note').val()
            if (note.length <= 0) {
                $('#note').val(tips)
            } else {
                note = note + ',' + tips
                $('#note').val(note)
            }
        },
        //选择有效时间
        invaliddate: function () {
            $('.pos-Select').show()
            $('.true-btn-date').click(function () {
                var m = $('[name="invaliddateM"]').val()
                var h = $('[name="invaliddateH"]').val()
                $('#invaliddateshow').val(h + '小时' + m + '分')
                $('#invaliddate').val(h * 3600000 + m * 60000)
                $('.pos-Select').hide()
            })
            $('[name="invaliddateH"]').change(function () {
                if ($('[name="invaliddateH"]').val() == 24) {
                    $('[name="invaliddateM"]').val('0')
                    $('[name="invaliddateM"]').attr('disabled', 'disabled')
                } else {
                    $('[name="invaliddateM"]').removeAttr('disabled')
                }
            })
        },
        getData: function () {
            var _this = this;
            getJsonp({
                url: apiUrl.agentSelectDispatchOrderDetail,
                data: {
                    dispatchorderid: this.base.getUrlParam("dispatchorderid"),
                    ordercode: this.base.getUrlParam("ordercode")
                },
                callback: function (data) {
                    if (data.result == "error") {
                        alertMsg(data.msg);
                        return;
                    }
                    if (data.result == "success") {
                        var dataObj = data.data;
                        dataObj.ownerlinkman = "";
                        dataObj.ownerlinkphone = "";
                        dataObj.from = dataObj.fromprovince + "-" + dataObj.fromcity + (dataObj.fromregion ? ("-" + dataObj.fromregion) : "");
                        dataObj.to = dataObj.toprovince + "-" + dataObj.tocity + (dataObj.toregion ? ("-" + dataObj.toregion) : "");
                        dataObj.carlength = dataObj.carlengthmin;
                        // if(dataObj.bidtype==0){
                        dataObj.chargetype = 2;
                        //}
                        dataObj.statementvalue = dataObj.statementvalue && dataObj.statementvalue / 10000 || '';
                        if (dataObj.addedservice) {
                            dataObj.addedservice1 = true;
                            $("div[name='addedservice1']").addClass("input-check-true");
                        }
                        // if (dataObj.addedservice.indexOf(1) != -1) {
                        //     dataObj.addedservice1 = true
                        //     $("div[name='addedservice1']").addClass("input-check-true");
                        // }

                        // if (dataObj.addedservice.indexOf(2) != -1) {
                        //     dataObj.addedservice2 = true
                        //     $("div[name='addedservice2']").addClass("input-check-true");
                        // }

                        // if (dataObj.addedservice.indexOf(5) != -1) {
                        //     dataObj.addedservice3 = true
                        //     $("div[name='addedservice3']").addClass("input-check-true");
                        // }
                        for (var x in dataObj) {
                            $("[name='" + x + "']").val(dataObj[x]);
                        }
                        // console.log(dataObj);
                        $('[name="orderfeeamount"]').val(dataObj.feein);
                        $('[name="producttype"]').val("5");

                        $('[name="fromdispatchorderid"]').val(_this.base.getUrlParam("dispatchorderid"))
                        $('[name="fromordercode"]').val(_this.base.getUrlParam("ordercode"))
                        $('[name="fromdispatchgoodssourceid"]').val(_this.base.getUrlParam("dispatchgoodssourceid"))
                        $('[name="fromgoodssourcecode"]').val(_this.base.getUrlParam("goodssourcecode"))

                        tradeCommonFun.selectChangeVal();
                        _this.releaseCheck();
                    }
                }
            });
        },
        //转包
        releaseGoods: function (e) {
            // debugger;
            var _this = this;
            if (!_this.releaseTypeCheck()) {
                return
            }
            var $this = $(e.currentTarget);
            e.preventDefault();
            if (!$this.hasClass("t-c-submit-disable")) {
                var phoneReg = /(^0\d{2,3}-?\d{7,8}$)|(^1[0-9]{10}$)/;
                var phoneINput = $('[name="tradetelephonenumber"]');
                var $carLength = $("#carLength");
                var phone = phoneINput.val();

                var submitData = $("#releaseForm").serializeObject();
                var $fromAddress = $("#fromaddress"),
                    $toAddress = $("#toaddress");
                if (submitData.from.indexOf("请输入") != -1) {
                    if ($fromAddress.closest(".t-c-input-select").hasClass("t-c-input-error")) {
                        return;
                    }
                    $fromAddress.closest(".t-c-input-select").addClass("t-c-input-error");
                    $fromAddress.data("val", $fromAddress.val())
                        .val("请输入详细的发货地址")
                        .one("focus", function () {
                            $(this).closest(".t-c-input-select").removeClass("t-c-input-error");
                            $(this).val($fromAddress.data("val"));

                        });
                    return;
                }
                if (submitData.to.indexOf("请输入") != -1) {
                    if ($toAddress.closest(".t-c-input-select").hasClass("t-c-input-error")) {
                        return;
                    }
                    $toAddress.closest(".t-c-input-select").addClass("t-c-input-error");
                    $toAddress.data("val", $toAddress.val())
                        .val("请输入详细的收货地址")
                        .one("focus", function () {
                            $(this).closest(".t-c-input-select").removeClass("t-c-input-error");
                            $(this).val($toAddress.data("val"));
                        });
                    return;
                }

                //数据整理
                /* fromprovince - 省 发货地 必填
				fromcity - 市 发货地 必填
				fromregion - 区县 发货地 可为空
				toprovince - 省 送货地 必填
				tocity - 市 送货地 必填
				toregion - 区县 送货地 可为空*/
                if (submitData.goodsweight == '' && submitData.goodsvolume == '') {
                    new Pop({
                        type: "pop",
                        content: "体积或者重量必填一项",
                        callType: "fail"
                    }).init();
                    return
                }

                var date = new Date()
                var endtime = date.getTime() + (parseInt(submitData.invaliddate) ? parseInt(submitData.invaliddate) : 0)
                var nowtime = new Date(endtime)
                var $_year = nowtime.getFullYear()
                var $_month = parseInt(nowtime.getMonth()) + 1
                var $_day = nowtime.getDate()
                var a = $_year + "-" + $_month + "-" + $_day
                var $_hours = nowtime.getHours()
                var $_minutes = nowtime.getMinutes()
                var $_seconds = nowtime.getSeconds()
                var b = $_hours + ":" + $_minutes + ":" + $_seconds
                submitData.validhour = parseInt(submitData.invaliddate / 3600000)
                submitData.validminute = parseInt(parseInt(submitData.invaliddate % 3600000) / (60 * 1000))
                submitData.invaliddate = a + ' ' + b



                submitData.ownerlinkman = submitData.ownerlinkman == "0" ? "" : submitData.ownerlinkman;
                submitData.ownerlinkphone = submitData.ownerlinkphone == "0" ? "" : submitData.ownerlinkphone;
                submitData.consigneelinkman = submitData.consigneelinkman == "0" ? "" : submitData.consigneelinkman;
                submitData.consigneemobilenumber = submitData.consigneemobilenumber == "0" ? "" : submitData.consigneemobilenumber;

                submitData.useCarTime = submitData.useCarTime == "0" ? "" : submitData.useCarTime;
                // submitData.useCarTimeEnd=submitData.useCarTimeEnd=="0"?"":submitData.useCarTimeEnd;
                submitData.arrivaltime = submitData.arrivaltime == "0" ? "" : submitData.arrivaltime;

                submitData.fromprovince = submitData.from.split("-")[0];
                submitData.fromcity = submitData.from.split("-")[1];
                submitData.fromregion = submitData.from.split("-")[2] || "";
                submitData.fromdetail = submitData.fromdetail
                delete submitData.from;
                submitData.toprovince = submitData.to.split("-")[0];
                submitData.tocity = submitData.to.split("-")[1];
                submitData.toregion = submitData.to.split("-")[2] || "";
                submitData.todetail = submitData.todetail
                delete submitData.to;

                submitData.goodsname = submitData.goodsname == "0" ? "" : submitData.goodsname;
                submitData.goodsweightmin = submitData.goodsweightmin == "0" ? "" : submitData.goodsweightmin * 1000;
                submitData.goodsvolumemin = submitData.goodsvolumemin == "0" ? "" : submitData.goodsvolumemin;
                submitData.statementvalue = submitData.statementvalue == "0" ? "" : submitData.statementvalue * 10000;
                submitData.statementvalue = "";

                submitData.carlength = submitData.carlength.split("-");
                if (submitData.carlength.length > 1) {
                    submitData.carlengthmin = Math.min(parseFloat(submitData.carlength[0]), parseFloat(submitData.carlength[1]));
                } else {
                    if (submitData.carlength[0] == '') {

                        submitData.carlengthmin = ''

                    } else {
                        submitData.carlengthmin = parseFloat(submitData.carlength[0]);
                    }
                }
                // if (submitData.chargetype == 2) {
                var arr = submitData.dispatchagentid.split(',')
                submitData.bidtype = 0;
                submitData.chargetype = 0;
                submitData.dispatchagentid = arr[0];
                submitData.agentrealname = arr[1];
                submitData.agentpartyid = arr[2];
                // } else {
                //     submitData.bidtype = 1
                //     delete submitData.dispatchagentid
                // }
                delete submitData.carlength;
                if (submitData.carlengthmax > 50 || submitData.carlengthmin > 50 || $carLength.val() == "请输入正确的范围") {
                    if ($carLength.closest(".t-c-input-select").hasClass("t-c-input-error")) {
                        return;
                    }
                    $carLength.closest(".t-c-input-select").addClass("t-c-input-error");
                    $carLength.data("val", $carLength.val())
                        .val("请输入正确的范围")
                        .one("focus", function () {
                            $(this).closest(".t-c-input-select").removeClass("t-c-input-error");
                            $(this).val($carLength.data("val"));
                        });
                    return;
                }
                var addedservice = []
                if (submitData.addedservice1 == 'true') {
                    addedservice.push('2')
                }
                if (submitData.addedservice2 == 'true') {
                    addedservice.push('5')
                }
                if (submitData.addedservice3 == 'true') {
                    addedservice.push('1')
                }
                submitData.addedservice = addedservice.join()
                delete submitData.addedservice1
                delete submitData.addedservice2
                delete submitData.addedservice3
                addedservice = null
                if (_this.ajaxIng) {
                    return;
                }
                _this.ajaxIng = true;
                $('.load').show()
                submitData.bidtype = 0;
                this.modeData = submitData
                // console.log(submitData);
                getJsonp({
                    url: _this.formUrl,
                    data: submitData,
                    callback: function (data) {
                        if (data.result == "success") {
                            new Pop({
                                type: "pop",
                                content: "转包成功",
                                /*footer: [{
                                    text: '确定',
                                    click: function () {
                                        location.href="packageOrder.html?type=dispatch"
                                    }
                                }],*/
                                callType: "success",
                                cover: true
                            }).init();
                            setTimeout(function () {
                                location.href = "packageOrder.html?type=dispatch"
                            }, 3000)
                        } else {
                            new Pop({
                                content: data.msg,
                                footer: [{
                                    text: '确定',
                                    click: function () {

                                    }
                                }],
                                cover: true
                            }).init();

                        }
                        $('.load').hide()
                        _this.ajaxIng = false;
                    },
                    errorCallback: function () {
                        new Pop({
                            type: "pop",
                            content: "网络不给力,请检查网络连接",
                            callType: "fail"
                        }).init();
                        _this.ajaxIng = false;
                    }
                });
            }
        },
        releaseTypeCheck: function () {
            var check = true
            switch ($('input[name="chargetype"]').val()) {
                case '0':
                    if (!$('[name="goodsweightmin"]').val() && !$('[name="goodsvolumemin"]').val()) {
                        check = false
                        new Pop({
                            type: "pop",
                            content: "体积或者重量必填一项",
                            callType: "fail"
                        }).init();
                    }
                    break;
                case '1':
                    if (!$('[name="goodsweightmin"]').val()) {
                        check = false
                        new Pop({
                            type: "pop",
                            content: "按吨报价重量必填",
                            callType: "fail"
                        }).init();
                    }

                    break;
                case '2':
                    // if (!$('[name="goodsvolumemin"]').val()) {
                    //     check = false
                    //     new Pop({
                    //         type: "pop",
                    //         content: "按方报价体积必填",
                    //         callType: "fail"
                    //     }).init();
                    // }
                    break;
            }
            return check
        },
        releaseCheck: function () {
            var reg = /(^1[0-9]{10}$)|((^\d{1,4}-)?^\d{8}$)/;
            var $this = $("#releaseForm");
            var check = true;
            setTimeout(function () {
                $this.find("input[require='true']").each(function () {
                    if (!$(this).val()) {
                        check = false;
                    }
                });

                if (!reg.test($(".mobileCheck1").val())) {
                    check = false;
                }
                if ($(".mobileCheck2").val()) {
                    if (!reg.test($(".mobileCheck2").val())) {
                        check = false;
                    }
                }
                // if (!$("input[name='dispatchagentid']").val()) {
                //     check = false;
                // }

                if (check) {
                    $("#release").removeClass("t-c-submit-disable");
                } else {
                    $("#release").addClass("t-c-submit-disable");
                }
            }, 100);
            /*if (!$('[name="goodsweightmin"]').val() && !$('[name="goodsvolumemin"]').val()) {
                check = false;
            }*/
        }
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });
});