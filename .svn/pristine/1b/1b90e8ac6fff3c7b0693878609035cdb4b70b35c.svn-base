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
        // start2.min = datas; //开始日选好后，重置结束日的最小日期
        // start2.start = datas //将结束日的初始值设定为开始日
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas //将结束日的初始值设定为开始日
        // var all=datas.split(' ')[0]
        // var small=datas.split(' ')[1]
        // var a=parseInt(all.split('-')[0])
        // var b=parseInt(all.split('-')[1])-1
        // var c=parseInt(all.split('-')[2])
        // var d=parseInt(small.split(':')[0])
        // var e=parseInt(small.split(':')[1])
        // var f=parseInt(small.split(':')[2])
        // var nowtime=new Date(a,b,c,d,e,f)
        // nowtime.setMonth(nowtime.getMonth()+3)
        // nowtime=nowtime.getTime()-1000
        // nowtime=new Date(nowtime)
        // var $_year=nowtime.getFullYear()
        // var $_month = parseInt(nowtime.getMonth())+1
        // var $_day=nowtime.getDate()
        // var ymd=$_year +"-"+$_month+"-"+$_day
        // var $_hours=nowtime.getHours()
        // var $_minutes=nowtime.getMinutes()
        // var $_seconds=nowtime.getSeconds()
        // var hms=$_hours +":"+$_minutes+":"+$_seconds
        // end.max=ymd+' '+hms
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
// laydate(start2);
laydate(end);
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.modelSelect();
            tradeCommonFun.radioModal();
            tradeCommonFun.checkModal();
            tradeCommonFun.selectModal();
            // tradeCommonFun.numberInput();
            this.ajaxIng = false;
            this.modelList=[];
            /* this.setCookie();*/
            var partyStr = iLocalStorage.getItem('DispatchRole');
            var Role = partyStr ? JSON.parse(partyStr) : '';
            //if (Role == 'owner') {
                this.getModalList();
                this.pop = new Pop({
                    footer: [
                        {
                            text: '取消',
                            click: function () {
                                new Pop({
                                    footer: [
                                        {
                                            text: '取消',
                                            click: function () {
                                            }
                                        }, {
                                            text: '确定',
                                            click: function () {

                                            }
                                        }
                                    ],
                                    type: "pop",
                                    content: "货源发布成功",
                                    callType: "success"
                                }).init();
                            }
                        }, {
                            text: '确定',
                            click: function () {
                                obj.addModal()
                            }
                        }
                    ],
                    type: "iframe-mode",
                    content: "货源发布成功,是否保存为货源模板？",
                    callType: "success"
                });
           /* } else {
                $('.choose-modal').hide()
                $('.input-check:eq(2)').hide()
                this.pop = new Pop({
                    footer: [
                        {
                            text: '取消',
                            click: function () {
                            }
                        }, {
                            text: '确定',
                            click: function () {

                            }
                        }
                    ],
                    type: "pop",
                    content: "货源发布成功",
                    callType: "success"
                });
            }*/
            this.searchrelat()


            // this.getScreen();
            $('[name="chargetype"]').val("2");
            $('.cyr-info').show()

            $('[name="producttype"]').val("5");
            var ih = '', im = ''
            for (var i = 0; i <= 24; i++) {
                ih += '<option value=' + i + '>' + i + '</option>'
            }
            $('[name="invaliddateH"]').append(ih)
            for (var i = 0; i <= 60; i++) {
                im += '<option value=' + i + '>' + i + '</option>'
            }
            $('[name="invaliddateM"]').append(im)

            tradeCommonFun.selectChangeVal();
            this.formUrl = apiUrl.saveGoodsSource; //apiUrl.publishGoodsSource;
            this.modeData = ''; //发布成功以后存下的货源数据 用于添加模板
            var _this = this;
            //this.pop.init();

            //城市控件调用
            var area = AddressComponent();
            area.start();
            var car = CarLengthComponent();
            car.start();

            // this.addlistenValue()

            this.releaseCheck();
            var _this = this;
            $("body").mouseup(function () {
                _this.releaseCheck();
            });
            $(document).mouseup(function (e) {
                var _con = $('.select-modal')
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    $(".select-option").hide()
                }
            })

        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #release": 'releaseGoods',
            "keyup #releaseForm": "releaseCheck",
            "click #invaliddateshow": 'invaliddate',
            "click .normal-tips-li": 'addTips',
            "click .choose-type": 'chooseType',
            'click #cancel': 'cancel',

        },
        searchrelat: function () {
            var _this = this
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
                    _this.getDataList('车长');
                    _this.getDataList('车型');
                }
            });

        },
        getDataList: function (type) {
            var _this = this
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
                                // console.log(1)
                                _this.againfill();
                                break;
                        }
                    }
                }
            });
        },
        // addlistenValue:function(){
        //     $(document).delegate('#statementvalue','input',function(){
        //         var str=$(this).val()
        //         var val=$('input[name="producttype"]').val()
        //         if(val==5){
        //             $('[name="freightprice"]').val(str)
        //         }else if(val==6){
        //             $('[name="freightprice"]').val(str)
        //         }
        //     })
        // },
        //自定义方法
        addModal: function () {
            var nameArr=[],modelName="",_this=this;
            $.each(this.modelList,function(i,e){
                if(i==0){
                    i=""
                }
                nameArr.push("默认"+i);
            })
            var over=false;
            $.each(nameArr,function(i,e){
                var result=true;
                if(over)return
                 $.each(_this.modelList,function(q,w){
                   if(e==w){
                        result=false;
                    }
                })
                if(result){
                    modelName=e;
                    over=true;
                }
            })

            this.modeData.modelname = modelName
            delete this.modeData.useCarTime
            delete this.modeData.useCarTimeEnd
            delete this.modeData.arrivaltime
            delete this.modeData.invaliddate
            getJsonp({
                url: apiUrl.insertDispatchGoodsSourceModel,
                data: this.modeData,
                callback: function (data) {
                    if (data.result == "success") {
                        new Pop({
                            type: "pop",
                            content: "添加成功！",
                            callType: "success"
                        }).init();
                    } else {
                        new Pop({
                            type: "pop",
                            content: data.msg,
                            callType: "fail"
                        }).init();
                    }

                }
                , error: function () {
                    new Pop({
                        type: "pop",
                        content: "操作失败,请重试",
                        callType: "fail"
                    }).init();

                }
            })
        },
        addTips: function (e) {
            var $this = $(e.currentTarget)
            var tips = $this.html()
            var note = $('#note').val()
            if (note.length <= 0) {
                $('#note').val(tips)
            } else if(note.length<150){
                if(note.length+tips.length>150){
                    new Pop({
                            type: "pop",
                            content: "字数超出限制",
                            callType: "fail"
                        }).init();
                }else{
                    note = note + ',' + tips
                    $('#note').val(note)
                }
            }else{
                 new Pop({
                            type: "pop",
                            content: "字数超出限制",
                            callType: "fail"
                        }).init();
            }
            // $this.hide();
        },
        chooseType: function (e) {
            var $this = $(e.currentTarget)
            $this.addClass('cur').siblings().removeClass('cur')
            var index = $this.index()
            if (index == 0) {
                $('[name="chargetype"]').val("2");
                $('.cyr-info').show()
                $('.chargetype-line').hide()
            } else if (index == 1) {
                $('[name="chargetype"]').val("0");
                $('.cyr-info').hide()
                $('.chargetype-line').show()
            } else if (index == 2) {
                $('[name="chargetype"]').val("1");
                $('.cyr-info').hide()
                $('.chargetype-line').show()
            }
            this.releaseCheck()
        },
        modelSelect: function () {
            //选择模板
            var _this = this;
            this.$el.on("click", ".select-modal .current", function () {
                var $this = $(this);
                var parent = $this.closest(".select-modal");
                parent.find(".select-option").show();
            });
            this.$el.on("click", ".select-option li", function () {
                var $this = $(this);
                var html = $this.html();
                var parent = $this.closest(".select-modal");
                var id = $this.data("id");
                parent.find(".select-option").hide();
                parent.find(".current").html(html).data("id", id);
                getJsonp({
                    url: apiUrl.selectDispatchGoodsSourceModelDetail,
                    data: {
                        dispatchgoodssourcemodelid: id
                    },
                    callback: function (data) {
                        if (data.result == "error") {
                            alertMsg(data.msg);
                            return;
                        }
                        if (data.result == "success") {
                            data.data.from = data.data.fromprovince + "-" + data.data.fromcity + (data.data.fromregion ? ("-" + data.data.fromregion) : "");
                            data.data.to = data.data.toprovince + "-" + data.data.tocity + (data.data.toregion ? ("-" + data.data.toregion) : "");
                            data.data.carlength = data.data.carlengthmin + (data.data.carlengthmax ? ("-" + data.data.carlengthmax + "米") : "");
                            for (var x in data.data) {
                                if (x == 'addedservice' && data.data['addedservice'] != '') {
                                    $.each(data.data['addedservice'].split(','), function (i, e) {
                                        if (e == '2') {
                                            $('[name="addedservice1"]').addClass('input-check-true').attr('value', 'true')
                                        }
                                        if (e == '5') {
                                            $('[name="addedservice2"]').addClass('input-check-true').attr('value', 'true')
                                        }
                                        if (e == '1') {
                                            $('[name="addedservice3"]').addClass('input-check-true').attr('value', 'true')
                                        }
                                    });
                                }


                                if (x == 'statementvalue' && data.data['statementvalue'] != '') {
                                    data.data['statementvalue'] = data.data['statementvalue'] / 10000
                                }
                                $("[name='" + x + "']").val(data.data[x]);

                                if (x == 'dispatchagentid') {
                                    var str1 = data.data['dispatchagentid'] + ',' + data.data['agentrealname'] + ',' + data.data['agentpartyid']
                                    $('[name="dispatchagentid"]').val(str1)
                                }
                                if (x == 'producttype') {
                                    $('[name="producttype"]').val(5)
                                }
                            }
                            if (data.data['bidtype'] == '0') {
                                $('.chargetype-line').hide()
                                $('[name="chargetype"]').val("2");
                                console.log($('input[name="chargetype"]').val())
                                $('.choose-type:eq(0)').addClass('cur').siblings().removeClass('cur')
                                $('.cyr-info').show()
                            }
                            if (data.data['bidtype'] == '1' && data.data['chargetype'] == '0') {
                                $('.chargetype-line').show()
                                $('[name="chargetype"]').val("0");
                                $('.cyr-info').hide()
                                $('.choose-type:eq(1)').addClass('cur').siblings().removeClass('cur')
                            }
                            if (data.data['bidtype'] == '1' && data.data['chargetype'] == '1') {
                                $('.chargetype-line').show()
                                $('[name="chargetype"]').val("1");
                                $('.cyr-info').hide()
                                $('.choose-type:eq(2)').addClass('cur').siblings().removeClass('cur')
                            }
                            $("#invaliddateshow").val(data.data['validhour'] + '小时' + data.data['validminute'] + '分');
                            var time = data.data['validhour'] * 3600000 + data.data['validminute'] * 60000
                            $("#invaliddate").val(time)

                            tradeCommonFun.selectChangeVal();
                            _this.releaseCheck();
                        }
                    }
                });
            });
        },
        //模板列表加载
        getModalList: function () {
            var _this=this;
            getJsonp({
                url: apiUrl.selectDispatchGoodsSourceModelList,
                callback: function (data) {
                    if (data.result == "error") {
                        alertMsg(data.msg);
                        return;
                    }
                    var html = '';
                    if (data.data.length < 1) {
                        html = "亲，您还未使用过模板发货功能，快来体验一下快速发货吧！<a class='select-modal' style='width:75px;' href='./goodsModel-add.html?type=add'>立即体验</a>";
                        $("#modalHtml").html(html);
                        return;
                    } else {
                        html = '使用模板\n' +
                            '<div class="select-modal">' +
                            '<span class="current">请选择</span>' +
                            '<ul class="select-option" id="modelList" style="display: none;">' +
                            '</ul>' +
                            '</div>';
                        $("#modalHtml").html(html);
                    }

                    var htmlList = '';
                    $.each(data.data, function (i, e) {
                        htmlList += '<li data-id="' + e.dispatchgoodssourcemodelid + '">' + e.modelname + '</li>';
                        _this.modelList.push(e.modelname)
                    });
                    $("#modelList").html(htmlList);

                }, errorCallback: function () {
                    html = "暂时获取不到模板信息,请稍后再试！";
                    $("#modalHtml").html(html);
                }
            });
        },
        //使用cookie填充数据
        setCookie: function () {
            var $releaseForm = $("#releaseForm");
            var formObject = $releaseForm.serializeObject();
            for (var x in formObject) {
                $releaseForm.find('[name="' + x + '"]').val(iLocalStorage.getItem('release_' + x));
            }
        },
        //获取预输入信息
        getScreen: function () {

            getJsonp({
                url: apiUrl.selectOperatorParameterByPartyIdAndOperator,
                callback: function (data) {
                    $("[name='elescreen']").val(data.data.elescreennumber);
                    $("[name='site']").val(data.data.site);
                    $("[name='from']").val((data.data.loadingfromprovince || "") + (data.data.loadingfromcity ? ("-" + data.data.loadingfromcity) : "") + (data.data.loadingfromregion ? ("-" + data.data.loadingfromregion) : ""));
                    $("[name='trademobilenumber']").val(data.data.trademobilenumber);
                    /*缓存*/
                    /*if(!iLocalStorage.getItem('release_from')){
                        $("[name='from']").val(data.data.loadingfromprovince+"-"+data.data.loadingfromcity+(data.data.loadingfromregion?"-"+data.data.loadingfromregion:""));
                    }
                    if(!iLocalStorage.getItem('release_trademobilenumber')){
                        $("[name='trademobilenumber']").val(data.data.trademobilenumber);
                    }*/
                },
                errorCallback: function () {

                }
            })
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
        //发布信息
        releaseGoods: function (e) {
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
                //如果有电话 验证格式
                // if(phone.length>0){
                //     if(!phone.match(phoneReg)){
                //         if(phoneINput.hasClass("t-c-input-error")){
                //             return;
                //         }
                //         phoneINput.addClass("t-c-input-error")
                //             .data("val", phoneINput.val())
                //             .val("请输入正确的电话")
                //             .one("focus",function(){
                //                 $(this).removeClass("t-c-input-error").val( phoneINput.data("val"));
                //             });
                //         return;
                //     }else{
                //         phoneINput.removeClass("t-c-input-error");
                //     }
                // }
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
                // if (submitData.goodsweightmin == '' && submitData.goodsvolumemin == '') {
                //     new Pop({
                //         type: "pop",
                //         content: "体积或者重量必填一项",
                //         callType: "fail"
                //     }).init();
                //     return
                // }
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
                submitData.outcode = submitData.outcode;

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

                submitData.carlength = submitData.carlength.split("-");
                if (submitData.carlength.length > 1) {
                    submitData.carlengthmin = Math.min(parseFloat(submitData.carlength[0]), parseFloat(submitData.carlength[1]));
                    // submitData.carlengthmax=Math.max(parseFloat(submitData.carlength[1]),parseFloat(submitData.carlength[0]));
                } else {
                    if (submitData.carlength[0] == '') {

                        submitData.carlengthmin = ''
                        // submitData.carlengthmin=submitData.carlengthmax=''

                    } else {
                        submitData.carlengthmin = parseFloat(submitData.carlength[0]);
                        // submitData.carlengthmin=submitData.carlengthmax=parseFloat(submitData.carlength[0]);

                    }
                }
               // if (submitData.chargetype == 2) {
                    var arr = submitData.dispatchagentid.split(',')
                    submitData.bidtype = 0
                    submitData.chargetype = 0
                    submitData.dispatchagentid = arr[0]
                    submitData.agentrealname = arr[1]
                    submitData.agentpartyid = arr[2]
                    delete submitData.invaliddate

               /* } else {
                    submitData.bidtype = 1
                    delete submitData.dispatchagentid
                }*/
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
                if (!getParamVal('piliang')) {
                    delete submitData.dispatchgoodssourcetmpid
                }
                if (_this.ajaxIng) { return; }
                _this.ajaxIng = true;
                $('.load').show()
                submitData.bidtype = 0;
                this.modeData = submitData
                getJsonp({
                    url: _this.formUrl,
                    data: submitData,
                    callback: function (data) {
                        if (data.result == "success") {
                            //发布成功 清除缓存
                            /*   for(var x in submitData){
                                   iLocalStorage.removeItem("release_"+x);
                               }
                               iLocalStorage.removeItem("release_from");
                               iLocalStorage.removeItem("release_to");
                               iLocalStorage.removeItem("release_carlength");*/
                            $("#releaseForm input").each(function () {
                                if ($(this).attr("name") != "from" && $(this).attr("name") != "trademobilenumber"
                                    && $(this).attr("name") != "elescreen") {
                                    $(this).val("");
                                }
                            });
                            $('[name="memo"]').val('')
                            $this.addClass("t-c-submit-disable");

                            $('[name="chargetype"]').val("0");
                            $('[name="producttype"]').val("5");
                            $('[name="addedservice1"]').removeClass('input-check-true').attr('value', 'false')
                            $('[name="addedservice2"]').removeClass('input-check-true').attr('value', 'false')
                            $('[name="addedservice3"]').removeClass('input-check-true').attr('value', 'false')
                            //从先选中模板
                            //$(" #modelList [data-id='" + $("#modalHtml .current").data("id") + "']").click();

                            $('[name="vaildtype"]').val("即时货源");
                            tradeCommonFun.selectChangeVal();

                            _this.pop.init();
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
                    }
                    , errorCallback: function () {
                        new Pop({
                            type: "pop",
                            content: "网络不给力,请检查网络连接",
                            callType: "fail"
                        }).init();
                        _this.ajaxIng = false;
                    }
                })
            }
        },
        releaseTypeCheck: function () {
            var check = true
            if (!$('[name="goodsweightmin"]').val() && !$('[name="goodsvolumemin"]').val()) {
                check = false
                new Pop({
                    type: "pop",
                    content: "体积或者重量必填一项",
                    callType: "fail"
                }).init();
            }
            // switch($('input[name="chargetype"]').val()){
            //     case '0':
            //         if(!$('[name="goodsweightmin"]').val()&&!$('[name="goodsvolumemin"]').val()){
            //             check=false
            //             new Pop({
            //                 type:"pop",
            //                 content:"体积或者重量必填一项",
            //                 callType:"fail"
            //             }).init();
            //         }
            //         break;
            //     case '1':
            //         if(!$('[name="goodsweightmin"]').val()){
            //             check=false
            //             new Pop({
            //                 type:"pop",
            //                 content:"按吨报价重量必填",
            //                 callType:"fail"
            //             }).init();
            //         }
            //
            //         break;
            //     case '2':
            //         if(!$('[name="goodsvolumemin"]').val()){
            //             check=false
            //             new Pop({
            //                 type:"pop",
            //                 content:"按方报价体积必填",
            //                 callType:"fail"
            //             }).init();
            //         }
            //         break;
            // }
            return check
        },
        releaseCheck: function () {
            var reg = /(^1[0-9]{10}$)|((^\d{1,4}-)?^\d{8}$)/;
            var $this = $("#releaseForm");
            var _this = this;
            var index = $('.choose-ul').find('.cur').index();
            var check = true;
            setTimeout(function () {
                $this.find("input[require='true']").each(function () {
                    // if(index==0){
                    if (!$(this).val()) {
                        if ($(this).attr('id') == 'invaliddateshow') {
                            return true
                        } else {
                            check = false;
                        }
                    }
                    // }else{
                    //     if(!$(this).val()){
                    //         if($(this).attr('id')=='cyr'){
                    //             return true
                    //         }else{
                    //             check=false;
                    //         }
                    //     }
                    // }
                });

                /**号码校验 */
                if (!reg.test($(".mobileCheck1").val())) {
                    check = false;
                }
                if($(".mobileCheck2").val()){   
                    if (!reg.test($(".mobileCheck2").val())) {
                        check = false;
                    }
                }
                /**号码校验end */

                if (check) {
                    $("#release").removeClass("t-c-submit-disable");
                } else {
                    $("#release").addClass("t-c-submit-disable");
                }
            }, 100);
            /*if (!$('[name="goodsweightmin"]').val() && !$('[name="goodsvolumemin"]').val()) {
                check = false;
            }*/
        },
        againfill: function () {
            var getParamVal = function (e) {
                var n = new RegExp("(^|&|\\?)" + e + "=([^&]*)(&|$)");
                var ret = location.search.match(n)
                return (ret ? decodeURIComponent(ret[2]) : "")
            }
            if (getParamVal('againgoods') == 'true') {
                var data = iLocalStorage.getItem('againgoods');
                var obj = JSON.parse(data)
                obj.from = function addressformat(a, b, c) {
                    if (!c) {
                        return a + '-' + b
                    } else {
                        return a + '-' + b + '-' + c
                    }
                }(obj.fromprovince, obj.fromcity, obj.fromregion)
                obj.to = function addressformat(a, b, c) {
                    if (!c) {
                        return a + '-' + b
                    } else {
                        return a + '-' + b + '-' + c
                    }
                }(obj.toprovince, obj.tocity, obj.toregion)
                obj.statementvalue = obj.statementvalue / 10000
                obj.dispatchagentid = obj.dispatchagentid + ',' + obj.agentrealname + ',' + obj.agentpartyid
                obj.carlength=obj.carlengthmin
                for (var x in obj) {
                    $("[name='" + x + "']").val(obj[x]);
                }
                if (obj['bidtype'] == '0') {
                    $('.chargetype-line').hide()
                    $('[name="chargetype"]').val("2");
                    $('.choose-type:eq(0)').addClass('cur').siblings().removeClass('cur')
                    $('.cyr-info').show()
                }
                if (obj['bidtype'] == '1' && obj['chargetype'] == '0') {
                    console.log(2)
                    $('.chargetype-line').show()
                    $('[name="chargetype"]').val("0");
                    $('.cyr-info').hide()
                    $('.choose-type:eq(1)').addClass('cur').siblings().removeClass('cur')
                }
                if (obj['bidtype'] == '1' && obj['chargetype'] == '1') {
                    $('.chargetype-line').show()
                    $('[name="chargetype"]').val("1");
                    $('.cyr-info').hide()
                    $('.choose-type:eq(2)').addClass('cur').siblings().removeClass('cur')
                }
                $.each(obj.addedservice.split(','), function (i, e) {
                    if (e == '2') {
                        $('[name="addedservice1"]').addClass('input-check-true').attr('value', 'true')
                    }
                    if (e == '5') {
                        $('[name="addedservice2"]').addClass('input-check-true').attr('value', 'true')
                    }
                    if (e == '1') {
                        $('[name="addedservice3"]').addClass('input-check-true').attr('value', 'true')
                    }
                });
                obj['validhour'] = obj['validhour'] ? obj['validhour'] : 0
                obj['validminute'] = obj['validminute'] ? obj['validhour'] : 0
                $("#invaliddateshow").val(obj['validhour'] + '小时' + obj['validminute'] + '分');
                var time = obj['validhour'] * 3600000 + obj['validminute'] * 60000
                $("#invaliddate").val(time)
                tradeCommonFun.selectChangeVal();
                this.releaseCheck()
                return
            }
            if (getParamVal('fromaddress')) {
                $('#fromaddress').val(getParamVal('fromaddress'))
            }
            if (getParamVal('toaddress')) {
                $('#toaddress').val(getParamVal('toaddress'))
            }
            if (getParamVal('fromman')) {
                $('[name="ownerlinkman"]').val(getParamVal('fromman'))
            }
            if (getParamVal('fromphone')) {
                $('[name="ownerlinkphone"]').val(getParamVal('fromphone'))
            }
            if (getParamVal('toman')) {
                $('[name="consigneelinkman"]').val(getParamVal('toman'))
            }
            if (getParamVal('tomanphone')) {
                $('[name="consigneemobilenumber"]').val(getParamVal('tomanphone'))
            }

        },
        cancel: function () {
            //清空
            $("#releaseForm input").each(function () {
                if ($(this).attr("name") != "from" && $(this).attr("name") != "trademobilenumber"
                    && $(this).attr("name") != "elescreen") {
                    $(this).val("");
                }
            });
            $('[name="chargetype"]').val("0");
            $('[name="producttype"]').val("5");
            $('[name="addedservice1"]').removeClass('input-check-true').attr('value', 'false')
            $('[name="addedservice2"]').removeClass('input-check-true').attr('value', 'false')
            $('[name="addedservice3"]').removeClass('input-check-true').attr('value', 'false')
            $('#note').val('');
        }
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });
});

$('[name="amount"],[name="goodsweightmin"],[name="goodsvolumemin"]').bind('input propertychange', function () {
    var val = $(this).val();
    var reg3 = /^(\d{1,6}(\.\d{1,2})?|(\d*\.))$/;
    if (!reg3.test(val)) {
        var _val = parseFloat(val.slice(0, val.length - 1));
        if (_val) {
            $(this).val(_val);
        }
        else {
            $(this).val('');
        }
    }
});