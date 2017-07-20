/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            // this.topartyId = "";
            this.base = new transfar.Base();
            this.type = this.base.getUrlParam("type");
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
            this.getDate();
            this.chooseSingle();
            tradeCommonFun.selectModal();
            this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'
                + '<td>{{d.carplatenumber}}</td>'
                + '<td>{{d.realname}}</td>'
                + '<td>{{d.mobilenumber}}</td>'
                + '<td>{{d.carstruct}}</td>'
                + '<td>{{(d.carlong&&d.carlong/1000)||""}}</td>'
                + '<td ><a href="javascript:" class="send-car" data-name={{d.realname}} data-contactcarteamid={{d.contactcarteamid}} data-type={{d.type}} data-tid={{d.topartyid?d.topartyid:""}}>派给他</a></td>'
                + '</tr>'
                + '{{/each}}';
            this.getCarLength();

            var car = CarLengthComponent();
            car.start();
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",
            "click .send-car": "sendCar"
        },
        searchSubmit:function(){
            this.getDate()
        },
        getCarLength: function () {
            var _this = this
            var successFun = function (data) {
                var li = ''
                for (var i = 0; i < data.length; i++) {
                    li += "<li>" + data[i].text + "</li>"
                }
                return li
                // $('.carlen_ul').html(li)
            }
            getJsonp({
                url: apiUrl.selectDispatchDictionaryList,
                data: {
                    type: "车长",
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
                        $('.carlen_ul').html(li)
                    }
                }
            });
            getJsonp({
                url: apiUrl.selectDispatchDictionaryList,
                data: {
                    type: "车型",
                    status: 1,
                    sort: 'orderNo'
                },
                callback: function (data) {
                    successFun = function (data) {
                        var li = ''
                        for (var i = 0; i < data.length; i++) {
                            li += "<li data-value=" + data[i].text + ">" + data[i].text + "</li>"
                        }
                        return li
                        // $('[name="cartype"]').html(li)
                    }
                    if (data.result == "error") {
                        alertMsg(data.msg);
                        return;
                    }
                    if (data.result == "success") {
                        var li = successFun(data.data)
                        $('ul[name="carstruct"]').html(li)
                        tradeCommonFun.selectChangeVal();
                    }
                }
            });
        },

        //自定义方法
        getDate: function (page) {

            var _this = this;
            var searchData = $("#searchForm").serializeObject();
            searchData.carlong=searchData.carlong?(searchData.carlong*1000):""
            searchData.pageSize = this.pageSize;

            searchData.skipCount = this.pageSize*(page||0)
            var url = apiUrl.selectDispatchDriverList;

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
                        d.data.forEach(function (e) {
                            e.carlong ? e.carlong : "";
                        });
                    }
                    // console.log(d.data);
                    d = tradeCommonFun.dataMobileHandle(d, "trademobilenumber");
                    d = _this.dataTeas(d);
                    var render = template.compile(_this.source);
                    var html = render(d);
                    $('#ajaxCont').html(html);
                    tradeCommonFun.checkModal();
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
        sendCar: function (e) {

           /* var drvierList = [];
            if ($(e.target).hasClass("t-c-submit-disable")) return;
            $("tbody div[name='chooseCar']").each(function (i, e) {
                if ($(e).next("input").val() == "true") {
                    drvierList.push($(e).data("tid"));
                }
            });
            if (drvierList[0] == "") {
                alertMsg('请邀请司机注册为陆鲸会员');
                return;
            }
            console.log(drvierList);*/
            getJsonp({
                url: apiUrl.assignCar,
                data: {
                    dispatchorderid: this.base.getUrlParam("dispatchorderid"),
                    ordercode: this.base.getUrlParam("ordercode"),
                    driverpartyid: $(e.currentTarget).data("tid")  //dispatchdriverId
                    ,contactcarteamid: $(e.currentTarget).data("contactcarteamid")
                },
                callback: function (d) {
                    if (d.result == "success") {
                        new Pop({
                            type: "confirm",
                            content: "成功派单给"+$(e.currentTarget).data("name"),
                            callType: "success",
                            footer: [{
                                text: '确定',
                                click: function () {
                                    var partyStr = iLocalStorage.getItem('DispatchRole');
                                    var Role = partyStr ? JSON.parse(partyStr) : '';
                                    switch (Role) {
                                        case "agent":
                                            location.href = "agentOrder.html?type=dispatch"
                                            break;
                                        case "contractor":
                                            location.href = "packageOrder.html?type=dispatch"
                                            break;
                                    }
                                    //window.history.back();
                                }
                            }],
                        }).init();
                    } else {
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "fail"
                        }).init();

                    }
                }
            });
        },
        chooseSingle: function () {

            /* $("th .input-check").click(function(){
                 var checkValue=$(this).next("input").val();
                 if(checkValue=="false"){
                     $(this).closest("table").find("tbody").find("[name='chooseCar']:not('.input-check-true')").click();
                 }else{
                     $(this).closest("table").find("tbody").find(".input-check-true").click();
                 }
             }); *///全选功能
            $("#ajaxCont").on("click", "div[name='chooseCar']", function () {
                $(this).closest("tbody").find("div[name='chooseCar']").removeClass("input-check-true").next("input").val("false")
                $(this).addClass("input-check-true").next("input").val("true")
                $("#sendCar").removeClass("t-c-submit-disable")
            })
            // tradeCommonFun.checkModal();
        },
        //数据梳理,
        dataTeas: function (d) {
            //  debugger;
            $.each(d.data, function (i, e) {
                e.carlong ? e.carlong / 1000 : "";
                /*   e.from=e.fromprovince+"-"+e.fromcity+(e.fromregion?"-"+e.fromregion:"");
                   e.to=e.toprovince+"-"+e.tocity+(e.toregion?"-"+e.toregion:"");
                   e.fromSub=tradeCommonFun.stringFilter(e.from,15);
                   e.toSub=tradeCommonFun.stringFilter(e.to,15);
                   if(e.carlengthmin&&e.carlengthmax){
                       e.carleng=e.carlengthmin+"-"+e.carlengthmax+"米,";
                   }else{
                       e.carleng="";
                   }
                   e.bidtypeWord=e.bidtype==0?"派单":"竞价";
                   e.goodsSpaceW=(e.goodsweightmin?(e.goodsweightmin+"吨"):"");
                   e.goodsSpaceV=(e.goodsvolumemin?(e.goodsvolumemin+"立方"):"");
                   e.total=e.dispatchorderfee[0].totalamount+"元"*/
            });
            return d;
        }
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });


});
