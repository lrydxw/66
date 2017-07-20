/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.status = this.base.getUrlParam("status")||"all";//三种类型 全部：all,在途中：doing,到达:arrive
            
            this.switchType();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20//分页缓存
            $("#orderId").val(this.base.getUrlParam("id"))
            this.getData();
            this.ajaxIng=false;
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",
            "click #searchReset": "forReset",
            "click .arrive":"arrive",//确认到达
            "click .open-lbs":"openLbs"//开通定位
        },
        searchSubmit:function(){
            //查询
            this.getData();
        },
        forReset: function () {
            //重置
            $("#searchForm")[0].reset();
        },
        switchType: function () {
            //根据url的type参数区分页面显示
            $("#t-sub-title [status='"+this.status+"']").addClass("current")
            this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'
                + '<td  class="goods-table-address"><a  target="_blank" class="goods-detail-link" '
                + 'href="./orderDetail.html?dispatchshipbillid={{d.dispatchshipbillid}}&shipbillcode={{d.shipbillcode}}&type=carOrderAgent'+
                '">{{d.shipbillcode}}</a></td>'+
                '<td>{{d.fromordercode||d.ordercode}}</td>' + 
                '<td>{{d.from}}--{{d.to}}</td>' + 
                '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
                '<td>应付:{{d.feeout||"0.00"}}</td>' + 
                '<td>{{#d.driverInfo}}</td>' +
                '<td>派车时间:<br>{{d.inputdate}}<br>{{#d.status==50?("到达时间:<br>"+d.uploaddate):""}}</td>' +
                '<td>{{#d.local}}{{#d.control}}</td>'+
                '</tr>{{/each}}';
        },
        //自定义方法
        getData: function (page) {
            var _this = this;
            var searchData = $("#searchForm").serializeObject();
           
            if(this.status=="doing"){
                searchData.status=10
            }else if(this.status=="arrive"){
                searchData.status=50
            }

            searchData.pagesize = this.pageSize;
            searchData.skipcount = this.pageSize*(page||0)

            var url = apiUrl.selectDispatchShipBillList;
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
                        //暂无数据
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
        //数据梳理,
        dataTeas: function (d) {
            var _this=this;
            $.each(d.data, function (i, e) {
                //运输信息
                e.from = e.fromprovince + e.fromcity + e.fromregion;
                e.to = e.toprovince + e.tocity + e.toregion;
                e.fromSub = tradeCommonFun.stringFilter(e.from, 15);
                e.toSub = tradeCommonFun.stringFilter(e.to, 15);

                //车长
                if (e.carlengthmin && e.carlengthmax) {
                    e.carleng = e.carlengthmin + "-" + e.carlengthmax + "米,";
                } else {
                    e.carleng = "";
                }
                //载重
                e.goodsSpaceW = (e.goodsweightmin ? (e.goodsweightmin + "吨") : "");
                e.goodsSpaceV = (e.goodsvolumemin ? (e.goodsvolumemin + "立方") : "");

                //司机信息
                e.driverInfo=
                    (e.driverrealname)+
                    (e.carplatenumber?("<br/>"+e.carplatenumber):"")+
                    (e.drivermobilenumber?("<br/>"+e.drivermobilenumber):"")
                
                //操作
                e.control=e.status==50?"已到达":"<a href='javascript:;' data-dispatchshipbillid='"+e.dispatchshipbillid+
                "' data-shipbillcode='"+e.shipbillcode+
                "' class='arrive' >确认到达</a>"
                //locationstatus 定位状态=0：没定位，1：定位中,2:终止定位(卸货)
                switch(e.locationstatus){
                    case "0":
                        e.local="<a href='javascript:;' class='open-lbs'"+
                        " data-drivermobilenumber='"+e.drivermobilenumber+"' data-shipbillcode='"+e.shipbillcode+
                        "' data-dispatchshipbillid='"+e.dispatchshipbillid+"' >开始定位</a><br>"
                        break;
                    case "1":
                        e.local="定位中<br>"
                        break;
                    case "2":
                        e.local=""
                        break;
                    default:
                        e.local=""
                        break;
                }
                //已到达运单不显示定位状态
                if(e.status==50){
                    e.local=""
                }
                
            });
            return d;
        },
        arrive:function(e){
            //确认到达
            var _this=this;
            
            if(this.ajaxIng)return;
            this.ajaxIng=true;
            getJsonp({
                url: apiUrl.uploadCar,
                data: {
                    dispatchshipbillid: $(e.target).data("dispatchshipbillid"),
                    shipbillcode: $(e.target).data("shipbillcode"),
                    //drivermobilenumber:$(e.target).data("drivermobilenumber")
                },
                callback: function (d) {
                    _this.ajaxIng=false;
                    if (d.result == "success") {
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "success"
                        }).init();
                        _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
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
        openLbs:function(e){
            //开始定位
             var _this=this;
            if(this.ajaxIng)return;
            this.ajaxIng=true;
            getJsonp({
                url: apiUrl.startLocation,
                data: {
                    //drivermobilenumber:$(e.target).data("drivermobilenumber"),
                    dispatchshipbillid: $(e.target).data("dispatchshipbillid"),
                    shipbillcode:$(e.target).data("shipbillcode")
                },
                callback: function (d) {
                    _this.ajaxIng=false;
                    if (d.result == "success") {
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "success"
                        }).init();
                        _this.getData();
                    } else {
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "fail"
                        }).init();
                    }
                }
            });
        }
       
    });
    var obj = new tradeFun({
        $el: $('body')
    });


});
