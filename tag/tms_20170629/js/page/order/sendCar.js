/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||10;//前端缓存分页
            this.getData();
            this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'
                + '<td><input type="checkbox" class="checkbox-list"  data-value="{{d.contactcarteamid}}_{{d.topartyid}}" data-detail="{{d.detail}}"></td>'
                + '<td>{{d.carplatenumber}}</td>'
                + '<td>{{d.realname}}</td>'
                + '<td>{{d.mobilenumber}}</td>'
                + '<td>{{d.carstruct}}</td>'
                + '<td>{{d.carlong}}</td>'
                //+ '<td ><a href="javascript:" class="send-car" data-name={{d.realname}} data-contactcarteamid={{d.contactcarteamid}} data-type={{d.type}} data-tid={{d.topartyid?d.topartyid:""}}>派给他</a></td>'
                + '</tr>'
                + '{{/each}}';
            this.allCheck=[];//选中司机id缓存
            this.driverObj={};//选中司机信息缓存
            this.ajaxIng=false;
            this.getCarLength();

            tradeCommonFun.selectModal();//下拉框加载
            var car = CarLengthComponent();//车长加载
            car.start();

            this.numberCheck();//数字校验
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",//搜索
            "click .all-check":"checkAll",//全选
            "click .checkbox-list":"evenCheck",//单个选择
            "click #sendCar":"sendCarBatch"//派车按钮，可派多辆

        },
        searchSubmit:function(){
            //搜索列表
            this.getData()
        },
        checkAll:function(e){
            //列表全选和取消全选
            var _this=this;

            $('.checkbox-list').each(function(){
                var v=$(this).attr('data-value')
                for(var i =0;i<_this.allCheck.length;i++){
                    if(v==_this.allCheck[i]){
                        _this.allCheck.splice(i,1)
                        delete _this.driverObj[v]
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
                    _this.driverObj[$(this).attr('data-value')]=$(this).attr('data-detail')
                }
            })

        },
        evenCheck:function(e){
            //单选并添加到选中列表allCheck
            var $this=$(e.currentTarget);
            var v=$this.attr('data-value')
            if($this.is(':checked')){
               this.allCheck.push(v)
               this.driverObj[v]=$this.attr('data-detail')
            }else{
                for(var i =0;i<this.allCheck.length;i++){
                    if(v==this.allCheck[i]){
                        this.allCheck.splice(i,1)
                        delete this.driverObj[v]
                    }
                }
            }
        },
        getCarLength: function () {
            //获取车长和车型字典
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

        /*
        * @param {page} 获取指定页数的数据，起始为0
         */
        getData: function (page) {
            //请求列表
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
                    //添加缓存的已勾选
                    var isCheckNum=0;//当前页选中个数
                    for(var i =0;i<_this.allCheck.length;i++){
                        if($(".checkbox-list[data-value='"+_this.allCheck[i]+"']").length>0){
                            $(".checkbox-list[data-value='"+_this.allCheck[i]+"']").prop("checked",true);
                            isCheckNum++;
                        }
                    }
                    //全选按钮是否选中
                    if(isCheckNum==_this.pageSize){
                        $(".all-check").prop("checked",true);
                    }else{
                        $(".all-check").prop("checked",false);
                    }

                    tradeCommonFun.checkModal();
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
       
        sendCarBatch:function(){
            //页面搜索栏派车按钮
            var driverHtml="";
            var _this=this;
            if(this.allCheck.length<1){
                alertMsg('请勾选需指派车辆')
                return;
            }else if(this.allCheck.length==1){
                _this.showConfirm([{
                                    driverpartyid:this.allCheck[0].split("_")[1],
                                    contactcarteamid:this.allCheck[0].split("_")[0],
                                }])
                return 
            }else if(this.allCheck.length>10){
                alertMsg('一次最多派十辆车')
                return;
            }
            //循环显示内容
            for(var i=0,l=this.allCheck.length;i<l;i++){
                driverHtml+='<div class="driver-list"><div class="input-line">' +
                    '<input type="hidden" value="'+this.allCheck[i].split("_")[0]+'" name="contactcarteamid" />' +
                    '<input type="hidden" value="'+this.allCheck[i].split("_")[1]+'" name="driverpartyid" />' +
                    '<div class="input-line pop-driver">'+
                    this.driverObj[this.allCheck[i]]+'</div>'+
                    '<span class="input-title">吨位(吨):</span>' +
                    '<input type="text" class="t-c-input input-width7" check="true" name="goodsweightmin"  maxlength="8"/>' +
                    '<span class="input-title">平方(方):</span>' +
                    '<input type="text" class="t-c-input input-width2" placeholder="" check="true" name="goodsvolumemin" maxlength="8" />' +
                    '</div>'+
                    '<div class="input-line">'+
                    '<span class="input-title">运费金额:</span>' +
                    '<input type="text" class="t-c-input input-width2" placeholder="" check="true" name="driverfeeamount" maxlength="10" />' +
                    '</div></div>'
            }
            //弹出窗口
            new Pop({
                    type:"iframe",
                    click:"other",
                    html:'<div  class="deal-form"><form id="dealForm">' +
                    driverHtml+
                    '</form>'+
                    '</div>',
                    footer: [{
                        text: '保存',
                        click: function (e) {
                            var driverObj=[]
                            $('#dealForm [name="driverpartyid"]').each(function(i,e){
                                var $driver=$(this).closest(".driver-list")
                                driverObj[i]={
                                    driverpartyid:$(this).val(),
                                    contactcarteamid:$driver.find('[name="contactcarteamid"]').val(),
                                    goodsweightmin:$driver.find('[name="goodsweightmin"]').val()*1000,
                                    goodsvolumemin:$driver.find('[name="goodsvolumemin"]').val(),
                                    driverfeeamount:$driver.find('[name="driverfeeamount"]').val()
                                }
                            })
                            _this.showConfirm(driverObj)
                        }
                    },{
                        text: '取消'
                    }]
                }).init();
            //弹窗样式调整
            $('.pop-content').css({
                "overflow":"auto",
                "margin-top":"40px",
                "margin-bottom":"6px",
                "padding":"0px"
            })
        },
        //数据梳理,
        /*
        * @param {d} 包含data属性的object
        * @return {d} 返回经过整理过滤的object
         */
        dataTeas: function (d) {
            //整理返回的数据;
            $.each(d.data, function (i, e) {
                e.carlong=e.carlong ? e.carlong / 1000 : "";
                //e.isFree="<a href='javascript:' style='color:#4caf50'>空闲</a>";
                e.detail=(e.realname||"")+" "+
                (e.mobilenumber?("，"+e.mobilenumber):"")+
                (e.carplatenumber?("，"+e.carplatenumber):"")+
                (e.carlong?("，"+e.carlong+"米"):"")+
                (e.carstruct?("，"+e.carstruct):"")+
                (e.cardragmass?("，"+(e.cardragmass/1000).toFixed(2)+"吨"):"");
            });
            return d;
        },
        numberCheck:function(){
            //派车时的输入数字校验只允许两位小数
            $(document).on("blur","[check='true']",function(){
                $(this).val((parseFloat($(this).val())||0).toFixed(2))
            })
        },
        /*
        *@params {data} 提交的object数据
         */
        postDrvier:function(data){
            //提交派车司机数据
            var _this=this;
            if(this.ajaxIng)return;
            this.ajaxIng=true;
            getJsonp({
                url: apiUrl.assignCar,
                data: {
                    dispatchorderid: this.base.getUrlParam("dispatchorderid"),
                    ordercode: this.base.getUrlParam("ordercode"),
                    driverinfo:JSON.stringify(data)
                },
                callback: function (d) {
                    _this.ajaxIng=false;
                    if (d.result == "success") {
                        _this.allCheck=[];//清空缓存;

                        var partyStr = iLocalStorage.getItem('DispatchRole');
                        var Role = partyStr ? JSON.parse(partyStr) : '';
                        new Pop({
                            type: "pop",
                            content: "派单成功",
                            callType: "success"
                        }).init();
                        setTimeout(function(){
                            switch (Role) {
                                case "agent":
                                    location.href = "agentOrder.html?type=dispatch"
                                    break;
                                case "contractor":
                                    location.href = "packageOrder.html?type=dispatch"
                                    break;
                            }
                        },1000)
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
        showConfirm:function(data){
            //派车确认框
            var _this=this;
            new Pop({
                type: "confirm",
                content: "是否确认派车？",
                callType: "success",
                footer: [{
                    text: '确定',
                    click: function () {
                        _this.postDrvier(data);
                    }
                }],
            }).init();
        }
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });


});
