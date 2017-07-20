/*
 * 业务中心公用
 * */
var map;
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        initialize: function () {
        //初始化
            var _this = this;
            tradeCommonFun.radioModal();
            tradeCommonFun.checkModal();
            this.getDataList('车长');
            this.getDataList('车型');
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
            var car = CarLengthComponent();
            car.start();
            this.getData();
            this.ajaxIng=false
            this.carlong=""
            this.submit=true;
            this.failMsg=""
            $("body").mouseup(function () {
                _this.releaseCheck();
            });

            //创建地图
            this.createMap=new MapPlungin({
                    location:false,
                    device:false,
                    dragable:true,//拖拽：false默认不可用
                    height:500,
                    width:700,
                    style:{"zIndex":"100000"},
                    align:"center",//三个参数，left,center,right, 默认center
                    vertical:"middle",//三个参数，top,middle,bottom,默认middle
                    zoom:15
            });
            this.createMap.init();
        },
        events: {
            //添加事件（基于委托，绑定动态加载元素）
            "click #searchSubmit": "searchSubmit",
            "click #addCar": "addCar",
            "click .delDItem": 'delDItem', //司机删除
            "click .updateCarTeam": 'editCar', //更新弹框
            "click #updateInfo": 'updateInfo', //更新请求
            "blur #mobilenumber": "searchDriver",//添加司机时根据手机号获取司机信息
            "change #insertOrder":"uploadFile",//批量上传
            "click .open-lbs":"openLbs",//开通定位
            "click .start-lbs":"startLbs",//打开地图查看司机定位
        },
        addCar: function (e) {
            //添加司机
            this.showFormPop({},"add",this)
        },
        searchDriver: function () {
            var mobile=$('[name="mobilenumber"]').val()
            if(!mobile)return;
            //添加司机或者编辑司机时，根据输入的手机号 获取司机信息
            var params = {
                url: apiUrl.getDriverInfoByPhone,
                data: {
                    mobilenumber:mobile
                },
                callback: function (d) {
                    if ('success' == d.result) {
                        if (d.data) {
                            $("#driverForm input").each(function () {
                                if ($(this).attr('id') != 'remark') {
                                    $(this).attr('disabled', true);
                                }
                            });
                            this.driverFormDataBind(d.data);
                        } 
                    } else {
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "fail"
                        }).init();
                    }
                }.bind(this)
            };
            getJsonp(params);
        },
       /* bgshow: function (e) {
            var $this = $(e.currentTarget);
            if ($this.hasClass('look-btn-cancel') || $this.hasClass('look-btn-cxfb')) {
                return
            } else {
                $('.pop-cl').show()
            }
        },*/
        getDataList: function (type) {
            //获取页面下拉框使用的车长和车型
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
                                _this.carlong=li
                                $("ul[name='carstruct1']").html(li)
                                tradeCommonFun.selectModal();
                                break;
                        }
                    }
                }
            });
        },
        searchSubmit: function () {
            //搜索司机列表
            this.getData()
        },

        /*
        * @param {d} object对象
         */
        driverFormDataBind: function (d) {
            //在弹出框里给司机相应信息赋值
            $('[name="realname"]').val(d.realname); //真实姓名
            $('[name="certificatenumber"]').val(d.certificatenumber); //身份证号
            $('[name="carplatenumber"]').val(d.carplatenumber); //车牌号
            //$('[name="carstruct"]').val(d.carstruct); //车型
            $(".pop-content .input-option li[data-value='"+d.carstruct+"']").click();//FIXED 外部的司机下拉框也会影响
            $('[name="carlong"]').val((d.carlong && d.carlong / 1000) || ''); // 车长
            $('[name="cardragmass"]').val((d.cardragmass && d.cardragmass / 1000) || ''); // 载重
            $('[name="remark"]').val(d.remark); // 备注
        },
        /*
        * @param {_this} 需要传递的最外层this值
        * @param {model} 需要移除的弹出框
        * @param {isGo} 是否继续添加{true|false}
         */
        insertInfo: function (_this,model,isGo) {
            //保存司机数据
            if(_this.ajaxIng){
                return
            }
            _this.releaseCheck();//校验检查
            if(!_this.submit){
                new Pop({
                    type: "pop",
                    content: _this.failMsg||"请填写完整信息",
                    callType: "fail"
                }).init();
                return;
            }
            var driverForm = {
                mobilenumber: $('[name="mobilenumber"]').val(),
                realname: $('[name="realname"]').val(),
                certificatenumber: $('[name="certificatenumber"]').val(), //身份证号
                carplatenumber: $('[name="carplatenumber"]').val(), //车牌号
                carstruct: $('[name="carstruct"]').val(), //车型
                carlong: $('[name="carlong"]').val()?((parseFloat($('[name="carlong"]').val()) * 1000).toFixed(0)):'', //车长
                cardragmass: $('[name="cardragmass"]').val()?((parseFloat($('[name="cardragmass"]').val()) * 1000).toFixed(0)):'', // 载重
                remark: $('[name="remark"]').val() // 别名
            };
            // console.log(driverForm);
            var params = {
                url: apiUrl.insertCarTeam,
                data: driverForm,
                callback: function (d) {
                     _this.ajaxIng=false
                    if (d.result == "error") {
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "fail"
                        }).init();
                        return;
                    }
                    if (d.result == 'success') {
                        new Pop({
                            type: "pop",
                            content: "新增司机成功",
                            callType: "success"
                        }).init();
                        model.remove();
                        _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                        
                        if (isGo) {
                            setTimeout(function(){
                                _this.showFormPop({},"add",_this)
                            },1000)
                        }
                    }
                }.bind(this)
            }

            _this.ajaxIng=true;
            getJsonp(params);
        },

        /*
        * @param {page} 获取指定页数的数据，起始为0
         */
        getData: function (page) {
            //获取司机列表
            var _this=this;
            var searchData = $("#searchForm").serializeObject();
            searchData.pageSize = this.pageSize;
            //区分弹窗的组件
            searchData.carlong=searchData.carlong1?(searchData.carlong1*1000):""
            searchData.carstruct=searchData.carstruct1
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
                    }
                    $('#total').html(d.data[0].nopartynumber + d.data[0].partynumber);
                    $('#noparty').html(d.data[0].nopartynumber);
                    var source = '{{each data as d i}}'
                        + '{{if i%2==0}}'
                        + '<tr class="t-table-single">' +
                        '{{else}}' +
                        '<tr>' +
                        '{{/if}}'
                        + '<td>{{d.remark?d.remark:d.realname}}{{d.type == 2?"(未认证)":""}}</td>'
                        + '<td>{{d.mobilenumber}}</td>'
                        + '<td>{{d.carplatenumber}}</td>'
                        + '<td>{{d.carlong?d.carlong/1000+"米   ":""}}&nbsp;&nbsp;{{d.carstruct||d.carstruct=="undefined"?""+d.carstruct:"   "}}&nbsp;&nbsp;{{d.cardragmass||d.cardragmass=="undefined"?""+d.cardragmass/1000+"吨":""}}</td>'
                        /*+ '<td>{{#d.isFree}}</td>'*/
                        + '<td><a href="javascript:void(0)" class="updateCarTeam" data-obj="{{d.obj}}" data-type="{{d.isParty}}">{{d.isParty}}</a>'
                        +'<a href="javascript:void(0)" data-id="{{d.contactcarteamid}}"" class="delDItem">删除</a>'
                        +'<a href="javascript:void(0)" data-id="{{d.contactcarteamid}}" data-partyId="{{d.topartyid}}" data-mobile="{{d.mobilenumber}}"" class="{{d.locClass}}">{{d.hasLocal}}</a></td>'
                        + '</tr>'
                        + '{{/each}}';
                    //接口数据整理
                    $.each(d.data,function(i,e){
                        e.isParty=e.type=="1"?"详情":"编辑"//是否会员 会员可编辑
                        e.hasLocal=e.locationstatus==true?"定位":"开通定位"//是否开通定位
                        e.locClass=e.locationstatus==true?"start-lbs":"open-lbs"//是否开通定位
                        e.isFree="<a href='javascript:' style='color:#4caf50'>空闲</a>"
                        e.obj=JSON.stringify(e)
                    })
                    var render = template.compile(source);
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
        releaseCheck: function () {
            //保存司机的字段校验
            var $this = $("#driverForm");
            var _this=this;
            this.submit= true;
            _this.submit=isMobile($("#mobilenumber").val())||
            isCarplatenumber($("input[name='carplatenumber']").val())

            if($('input[name="cardragmass"]').val()){
                if(parseFloat($('input[name="cardragmass"]').val())>100){
                    this.failMsg="载重最大不能超过100吨"
                    this.submit= false;
                }
            }
            if($("#idcard").val()){
                if(!isCertificatenumber($("#idcard").val())){
                    this.failMsg="请填写正确的身份证"
                    this.submit= false;
                }
            }
            if(!isCarplatenumber($("input[name='carplatenumber']").val())){
                this.failMsg="请填写正确的车牌"
                this.submit= false;
            }
            if(!isMobile($("#mobilenumber").val())){
                this.failMsg="请填写正确的手机号"
                this.submit= false;
            }
            $this.find("input[require='true']").each(function () {
                if (!$(this).val()) {
                    _this.submit = false;
                    _this.failMsg="";
                }
            });

        },

        /*
        * @param {page} 获取指定页数的数据，起始为0
         */
        delDItem: function (e) {
            //删除司机
            var c = $(e.target);
            //    alert(c.attr('data-id'));
            var _this = this;
            new Pop({
                content: "确认删除该司机？",
                callType: "success",
                footer: [{
                    text: '确定',
                    click: function () {
                        getJsonp({
                            url: apiUrl.cancelCarTeam,
                            data: {
                                contactcarteamid: c.attr('data-id')
                            },
                            callback: function (d) {
                                if (d.result != 'success') {
                                    alertMsg(d.msg);
                                } else {
                                     if($("#ajaxCont").find("tr").length<=1){
                                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-2)
                                        }else{
                                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                                        }
                                }
                            }
                        })
                    }
                }, {
                    text: '取消',
                    click: function () {

                    }
                }],
            }).init();
        },
        editCar: function (e) {
            //编辑司机
            var c = $(e.target);
            // console.log(c.attr('data-obj'));
            var params = JSON.parse(c.attr('data-obj'));
            // console.log(params);
            params.carlong=params.carlong?(params.carlong / 1000).toFixed(2):""
            params.cardragmass=params.cardragmass?(params.cardragmass / 1000).toFixed(2):""
            this.showFormPop(params,"edit",this,c.data("type"))
        },
        /*
        * @param {params} 编辑时司机的数据，obj,可为空
        * @param {type} 弹窗模式，编辑:edit,新增：edit
        * @param {_this} 需要传递的最外层this值
        * @param {editType} 弹窗类型 "详情"，否则可编辑
         */
        showFormPop:function(params,type,_this,editType){
            //司机弹窗
            params=params?params:{}
            editType=editType=="详情"?true:false;
            var html='\
            <form action="" id="driverForm" style="margin-top:20px;">\
                        <div>\
                            <div class="input-line">\
                                <span class="input-title release-man-number input-width3-1"><label class="icon-must">*</label>手机号</span>\
                                <input type="text" class="t-c-input input-width2" '+(editType?"readonly":"")+' name="mobilenumber" maxlength="11" require="true" id="mobilenumber" value="'+(params.mobilenumber||"")+'">\
                                <span class="input-title release-man-number input-width3-1"><label class="icon-must">*</label>司机姓名</span>\
                                <input type="text" class="t-c-input input-width2 "  '+(editType?"readonly":"")+' name="realname" maxlength="20" require="true"  value="'+(params.realname||"")+'">\
                            </div>\
                            <div class="input-line">\
                                <span class="input-title release-man-number input-width3-1">别名</span>\
                                <input type="text" class="t-c-input input-width2 "  '+(editType?"readonly":"")+' name="remark" maxlength="20" id="remark"  value="'+(params.remark||"")+'">\
                                <span class="input-title release-man-number input-width3-1">身份证号</span>\
                                <input type="text" class="t-c-input input-width2" '+(editType?"readonly":"")+' id="idcard" name="certificatenumber" maxlength="18"  value="'+(params.certificatenumber||"")+'"/>\
                            </div>\
                            <div class="input-line">\
                               <div class="carplatenumber" style="display: inline-block">\
                                    <span class="input-title input-width3-1"><label class="icon-must">*</label>车牌号</span>\
                                    <input type="text" class="t-c-input input-width2 "  '+(editType?"readonly":"")+' require="true" name="carplatenumber" maxlength="8"  value="'+(params.carplatenumber||"")+'">\
                                </div>\
                                <span class="input-title input-width3-1">载重(吨)</span>\
                                <input type="text" class="t-c-input input-width2 "  '+(editType?"readonly":"")+' name="cardragmass" maxlength="8"  value="'+(params.cardragmass||"")+'" />\
                                <input type="text" class="t-c-input input-width2 " style="display: none" name="contactcarteamid" value="'+(params.contactcarteamid||"")+'" />\
                            </div>\
                            <div class="input-line">\
                                <span class="input-title input-width3-1">车长(米)</span>\
                                <div class="t-c-input-select t-c-input-select-date">\
                                    <input type="text" class="t-c-input input-width2 '+(editType?"1":"")+'proCarSelAll input-number" data-max="50" data-reg="[^0-9\-\.]" id="carLength"\
                                     name="carlong" readonly="readonly"  value="'+(params.carlong||"")+'">\
                                    <label class="t-c-input-icon"></label>\
                                </div>\
                                <span class="input-title input-width3-1">车型</span>\
                                <div class="t-c-input-select">\
                                    <input type="text" class="t-c-input input-width2" '+(editType?"readonly":"")+' init="true" readonly="readonly" />\
                                    <label class="t-c-input-icon"></label>\
                                    <ul class="input-option" style="display: none" name="carstruct"  >'+_this.carlong+'\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </form>'
                    /*
                            <div class="input-line" style="text-align: center;margin-top:20px;">\
                                <span class="t-c-submit history-s-btn t-c-submit-disable" id="updateInfo">修改</span>\
                                <span class="t-c-submit history-s-btn t-c-submit-disable" id="insertInfo">保存</span>\
                                <span class="t-c-submit history-s-btn t-c-submit-disable" style="padding: 0 10px;" id="insertInfoGon">保存并继续添加</span>\
                            </div>\*/
            var footer=[];
            if(type=="edit"){
                footer=[{
                        text: '保存',
                        click: function (e) {
                           _this.updateInfo(_this,e)
                        }
                    },{
                        text: '取消'
                    }]
                if(editType){
                    footer=[{
                        text: '关闭'
                    }]
                }
            }else if(type=="add"){
                footer=[{
                        text: '保存',
                        click: function (e) {
                           _this.insertInfo(_this,e)
                        }
                    },{
                        text: '保存并继续添加',
                        click: function (e) {
                           _this.insertInfo(_this,e,true)
                        }
                    }]
            }
            new Pop({
                    type:"iframe",
                    click:"other",
                    html:html,
                    otherClass:"myDriver",
                    footer: footer
                }).init();
            if(!editType){
                tradeCommonFun.selectModal();
                $('input[name="carstruct"]').val(params.carstruct);
                tradeCommonFun.selectChangeVal();
            }else{
                $('[name="carstruct"]').closest(".t-c-input-select").find("input").val(params.carstruct);
                $(".pop-btn").css("left","250px")
            }
           
        },
        updateInfo: function (_this,model) {
            //保存司机
            if(_this.ajaxIng){
                return
            }
            _this.releaseCheck();//校验检查
            if(!_this.submit){
                new Pop({
                    type: "pop",
                    content: _this.failMsg||"请填写完整信息",
                    callType: "fail"
                }).init();
                return;
            }
            var driverForm = {
                mobilenumber: $('[name="mobilenumber"]').val(),
                realname: $('[name="realname"]').val(),
                certificatenumber: $('[name="certificatenumber"]').val(), //身份证号
                carplatenumber: $('[name="carplatenumber"]').val(), //车牌号
                carstruct: $('input[name="carstruct"]').val(), //车型
                carlong: $('[name="carlong"]').val()?((parseFloat($('[name="carlong"]').val()) * 1000).toFixed(0)):'', //车长
                cardragmass: $('[name="cardragmass"]').val()?((parseFloat($('[name="cardragmass"]').val()) * 1000).toFixed(0)):'', // 载重
                remark: $('[name="remark"]').val(), // 别名
                contactcarteamid: $('[name="contactcarteamid"]').val() // id
            };
            var params = {
                url: apiUrl.updateCarTeam,
                data: driverForm,
                callback: function (d) {
                    _this.ajaxIng=false;
                    if (d.result == "error") {
                        alertMsg(d.msg);
                        return;
                    }
                    if (d.result == 'success') {
                        //this.clearInfo();
                        model.remove()
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "success"
                        }).init();
                        _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                    }
                }.bind(this)
            }
            _this.ajaxIng=true;
            getJsonp(params);
        },
       /* refresh: function () {

            window.location.href = "./myDriver.html";
        },*/
        uploadFile:function(e){
            //批量上传司机
            var _this=this;
            e.preventDefault()
            var formData = new FormData($("#"+e.target.id).closest("form")[0]);
            formData.delete("keywords")
            $.ajax({
                url: apiUrl.importCarTeam,
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    $("#"+e.target.id).val("")
                    if(data.result=="error"){
                        alertMsg(data.msg)
                    }else{

                        alertMsg(data.msg)
                        _this.getData(0)
                    }
                
                },
                error: function (returndata) {
                    $("#"+e.target.id).val("")
                    alertMsg(returndata.msg)
                }
            });
        }, 
        openLbs:function(e){
            //开通定位
            var _this=this;
            if(_this.ajaxIng){
                return
            }
            var params = {
                url: apiUrl.isDredgeLocation,
                data:{
                    topartyid:$(e.currentTarget).data("partyId"),
                    mobilenumber:$(e.currentTarget).data("mobile")
                },
                callback: function (d) {
                    _this.ajaxIng=false;
                    if (d.result == "error") {
                        alertMsg(d.msg);
                        return;
                    }else{
                       alertMsg("平台已向司机发送了定位授权短信，请提醒司机回复短信'Y'。回复后，您将可以通过平台实时获取司机的地理位置信息。")
                    }
                }.bind(this)
            }
            _this.ajaxIng=true;
            getJsonp(params);
            
        },
        
        startLbs:function(e){
            //司机定位
             var _this=this;
            if(_this.ajaxIng){
                return
            }
            var params = {
                url: apiUrl.location,
                data:{
                    mobilenumber:$(e.currentTarget).data("mobile")
                },
                callback: function (d) {
                    _this.ajaxIng=false;
                    if(d.result=="success"){
                         _this.createMap.show({ data:[
                            {
                                LBSName:"司机定位",
                                time:moment(d.data.positiontime-0).format("YYYY-MM-DD HH:mm:ss"),
                                lng:d.data.longitude,
                                lat:d.data.latitude,
                                type:"位置",
                            }]});
                            setTimeout(function(){
                            _this.createMap.map.openInfoWindow(_this.createMap.infoWindow,_this.createMap.infoPonit)
                            },500)
                         $(".mapInfo").hide();
                    }else{
                        alertMsg("可能由于运营商网络问题或司机已关机，导致定位失败，请稍后重试")
                    }
                }
            }
            _this.ajaxIng=true;
            getJsonp(params);
            
        }
    });
    new tradeFun({
        $el: $('body')
    });
});
$(document).on("input propertychange",'[name="cardragmass"]',function(){
    //载重输入校验
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
})

$('[name="certificatenumber"]').bind('input propertychange', function () {
    //身份证校验
    var val = $(this).val();
    var reg3 = /^[a-zA-Z0-9]+$/g;
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


$('[name="mobilenumber"]').bind('input propertychange', function () {
    //车牌校验
    var val = $(this).val();
    var reg3 = /^\d+$/g;
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




/*function callback(d) {
    // console.log(d);
}
*/