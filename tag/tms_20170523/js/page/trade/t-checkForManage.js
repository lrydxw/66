/*
* 业务中心公用
* */
var start = {
    elem: '#starttime',
    format: 'YYYY-MM-DD',
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function(datas){
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas //将结束日的初始值设定为开始日
        var all=datas.split(' ')[0]
        var small=datas.split(' ')[1]
        var a=parseInt(all.split('-')[0])
        var b=parseInt(all.split('-')[1])-1
        var c=parseInt(all.split('-')[2])
        var nowtime=new Date(a,b,c,0,0,0)
        nowtime.setMonth(nowtime.getMonth()+3)
        nowtime=nowtime.getTime()-1000
        nowtime=new Date(nowtime)
        var $_year=nowtime.getFullYear()
        var $_month = parseInt(nowtime.getMonth())+1
        var $_day=nowtime.getDate()
        var ymd=$_year +"-"+$_month+"-"+$_day
        var $_hours=nowtime.getHours()
        var $_minutes=nowtime.getMinutes()
        var $_seconds=nowtime.getSeconds()
        var hms=$_hours +":"+$_minutes+":"+$_seconds
        end.max=ymd+' '+hms
    }
};
var end = {
    elem: '#endtime',
    format: 'YYYY-MM-DD',
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function(datas){

    }
};
var start2 = {
    elem: '#starttime2',
    format: 'YYYY-MM-DD',
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function(datas){
        end2.min = datas; //开始日选好后，重置结束日的最小日期
        end2.start = datas //将结束日的初始值设定为开始日
        var all=datas.split(' ')[0]
        var small=datas.split(' ')[1]
        var a=parseInt(all.split('-')[0])
        var b=parseInt(all.split('-')[1])-1
        var c=parseInt(all.split('-')[2])
        var nowtime=new Date(a,b,c,0,0,0)
        nowtime.setMonth(nowtime.getMonth()+3)
        nowtime=nowtime.getTime()-1000
        nowtime=new Date(nowtime)
        var $_year=nowtime.getFullYear()
        var $_month = parseInt(nowtime.getMonth())+1
        var $_day=nowtime.getDate()
        var ymd=$_year +"-"+$_month+"-"+$_day
        var $_hours=nowtime.getHours()
        var $_minutes=nowtime.getMinutes()
        var $_seconds=nowtime.getSeconds()
        var hms=$_hours +":"+$_minutes+":"+$_seconds
        end2.max=ymd+' '+hms
    }
};
var end2 = {
    elem: '#endtime2',
    format: 'YYYY-MM-DD',
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function(datas){

    }
};
laydate(start2);
laydate(end2);
laydate(start);
laydate(end);
$(function(){
    // var skipcount=0
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.type = this.base.getUrlParam("type");
           /* this.bindFn();*/
            tradeCommonFun.radioModal();
            tradeCommonFun.selectModal();
            tradeCommonFun.numberInput();
            // tradeCommonFun.checkModal();
            // this.addressAuto();
            var area=AddressComponent('no',1);;
            area.start();
            var car=CarLengthComponent();
            car.start();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20

            this.allcheck=[]
            $('[name="ownerpaystatus"]').val("0");
            this.getData();

            this.moneyReg=true;//对账时输入金额是否正确
            this.money=0;//对账金额
            tradeCommonFun.selectChangeVal();
            var _this=this;
            this.checkMoney();
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit":"searchSubmit",
            "click .look-btn":"bgshow",
            "click .close_btn":"closePopup",
            "click .look-btn-xq":"goodsinfo", //详情
            "click .backClear":'clearpopup',
            "click .details-img":'imgbig',
            "click .look-btn-fk":'checkfor',
            "click #searchExcel":'exportlist',
           /* "keyup #releaseForm":"releaseCheck",*/
            "click #searchPay":"chongzhi",
            "click .all-check":"allCheck",
            "click .checkbox-list":"evenCheck",
            "click #searchAllPay":"allpay",
            "click #searchReset":"forReset"

        },
        forReset:function(){
            $("#searchForm")[0].reset();
            end.min=end.max=end2.min=end2.max=""
        },
        searchSubmit:function(){
            this.getData()
        },
        allpay:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            
            if(this.allcheck.length<1){
                alertMsg('请勾选需对账订单')
                return
            }else{
                getJsonp({
                    url:apiUrl.batchCheckDispatchOrderFee,
                    data:{
                        dispatchorderids:this.allcheck.join(",")
                    },
                    callback:function(data){
                        if(data.result=="error"){
                            alertMsg(data.msg);
                            return;
                        }
                        if(data.result=="success"){
                            _this.allcheck=[];
                            _this.getData();
                            new Pop({
                                footer:[
                                    {
                                        text: '取消',
                                        click: function () {
                                        }
                                    },{
                                        text: '确定',
                                        click: function () {

                                        }
                                    }
                                ],
                                type:"pop",
                                content:"批量对账成功",
                                callType:"success"
                            }).init();
                        }
                    }
                })
            }
        },
        allCheck:function(e){
            var _this=this;

            $('.checkbox-list').each(function(){
                var v=$(this).attr('data-value')
                for(var i =0;i<_this.allcheck.length;i++){
                    if(v==_this.allcheck[i]){
                        _this.allcheck.splice(i,1)
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
                    _this.allcheck.push($(this).attr('data-value'))
                }
            })

        },
        evenCheck:function(e){

            var $this=$(e.currentTarget);
            var v=$this.attr('data-value')
            if($this.is(':checked')){
               this.allcheck.push(v)
            }else{
                for(var i =0;i<this.allcheck.length;i++){
                    if(v==this.allcheck[i]){
                        this.allcheck.splice(i,1)
                    }
                }
            }
        },
        bgshow:function(e){
            var $this=$(e.currentTarget);
            if($this.hasClass('look-btn-cancel')||$this.hasClass('look-btn-cxfb')||$this.hasClass('look-btn-fk')){
                return
            }else{
                $('.pop-cl').show()
            }
        },
        addressFormat:function(data,type){
            var str=''
            if(type=='from'){
                str=data.fromprovince+"-"+ data.fromcity+(data.fromregion?("-"+data.fromregion):"")
            }else{
                str=data.toprovince+"-"+ data.tocity+(data.toregion?("-"+data.toregion):"")
            }
            return str
        },
        //自定义方法
        getData:function(page){
            var _this=this
            var searchData=$("#searchForm").serializeObject();
            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)
            searchData.fromprovince=searchData.fromaddress.split("-")[0];
            searchData.fromcity=searchData.fromaddress.split("-")[1];
            searchData.fromregion=searchData.fromaddress.split("-")[2]||"";
            searchData.toprovince=searchData.toaddress.split("-")[0];
            searchData.tocity=searchData.toaddress.split("-")[1];
            searchData.toregion=searchData.toaddress.split("-")[2]||"";

            //后端需求时分秒 前端不提供时分秒选择
            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
            searchData.updatedatestart=searchData.updatedatestart?(searchData.updatedatestart+" 00:00:00"):""
            searchData.updatedateend=searchData.updatedateend?(searchData.updatedateend+" 23:59:59"):""
            delete searchData.fromaddress;
            delete searchData.toaddress;
            

            var url=apiUrl.selectDispatchOrderList;
            //获取列表
            getJsonp({
                url:url,
                data:searchData,
                callback:function(d){
                    if(d.result=="error"){
                        alertMsg(d.msg);
                        return;
                    }
                    if(d.count==0){
                        $(".no-model").remove();
                        $(".modal-cont").append(tradeCommonFun.creatNodata());
                        $('#ajaxCont,.pagination').html("");
                        return;
                    }else{
                        $(".no-model").remove();
                    }
                    // d=tradeCommonFun.dataMobileHandle(d,"mobilenumber");
                    var source= '{{each data as d i}}'
                        +'{{if i%2==0}}'
                        +'<tr class="t-table-single">' +
                        '{{else}}' +
                            '<tr>'+
                        '{{/if}}'
                        +'<td>{{#d | checkCreate}}</td>'
                        +'<td><a href="../order/orderDetail.html?id={{d.dispatchorderid}}&orderId={{d.ordercode}}&type=sendCheck'
                        + '" target="_blank" >{{d.fromordercode||d.ordercode}}</a></td>'
                        /*+'<td><a class="look-btn-xq look-btn" href="#' 
                        + '"  data-dispatchorderid="{{d.dispatchorderid}}" data-ordercode="{{d.ordercode}}">{{d.fromordercode||d.ordercode}}</a></td>'*/
                        +'<td>{{d.agentrealname}}</td>'
                        +'<td>{{d | addresssplit: "from"}}-{{d | addresssplit: "to"}}</td>'
                        +'<td>{{d | goods: "goods"}}</td>'
                        +'<td>应收:{{d.feein}}<br>应付:{{d.feeout}}</td>'
                        +'<td>{{d.dispatchorderlog[0]?d.dispatchorderlog[0].inputdate:""}}</td>'
                        +'<td>{{d.driverinfo[0]?d.driverinfo[0].uploaddate:""}}</td>'
                        +'<td>{{#d | btnCreate}}</td>'
                        + '</tr>'
                        + '{{/each}}';
                    template.helper('statusSelect', function (date,a) {
                        switch (date){
                            case '0':
                                var html='待对账'
                                return html
                                break;
                            case '2':
                                var html='待付款'
                                return html
                                break;
                            case '5':
                                var html='待收付'
                                return html
                                break;
                            case '7':
                                var html='已收付'
                                return html
                                break;
                            case '9':
                                var html='已核销'
                                return html
                                break;
                        }
                    })
                    template.helper('goods',function(data,type){
                        var str=''
                        str=data.goodsname+" "+(data.goodsvolumemin?(data.goodsvolumemin+"方 "):"")+(data.goodsweightmin?(data.goodsweightmin+"吨"):"");
                        return str
                    })
                    template.helper('addresssplit',function(data,type){
                        var str=''
                        if(type=='from'){
                             str=data.fromprovince+data.fromcity
                        }else{
                             str=data.toprovince+data.tocity
                        }
                        return str
                    })
                    template.helper('btnCreate',function(data,type){
                        var str=''
                        str='<a href="javascript:void(0)" class="look-btn-fk look-btn" data-dispatchorderid="'+data.dispatchorderid+'" data-ordercode="'+data.ordercode+'" data-amount="'+data.dispatchorderfee[0].totalamount+'">对账</a>'
                        // if(data.paytype){
                        //      str='<a href="javascript:void(0)" class="look-btn-xq look-btn" data-dispatchorderid="'+data.dispatchorderid+'" data-ordercode="'+data.ordercode+'">详情</a>' +
                        //         '<a href="javascript:void(0)" class="look-btn-fk"  data-dispatchorderid="'+data.dispatchorderid+'" data-ordercode="'+data.ordercode+'">付款</a>'
                        // }else{
                        //      str='<a href="javascript:void(0)" class="look-btn-xq look-btn" data-dispatchorderid="'+data.dispatchorderid+'" data-ordercode="'+data.ordercode+'">详情</a>'
                        // }
                        return str
                    })
                    template.helper('checkCreate',function(data,type){
                        var str=''
                            str='<input type="checkbox" class="checkbox-list"  data-value="'+data.dispatchorderid+'">'
                        return str
                    })

                    var render = template.compile(source);
                    var html = render(d);
                    $('#ajaxCont').html(html);
                    for(var i =0;i<_this.allcheck.length;i++){
                        $(".checkbox-list[data-value='"+_this.allcheck[i]+"']").prop("checked",true)
                    }
                    tradeCommonFun.createPage({
                        count:d.count,
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
        clearpopup:function(e){
            var $this=$(e.currentTarget);
            $('.dec').html('')
            $this.parents('.waybill-details').hide()
            $('.pop-cl').hide()
        },
        goodsinfo:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            var id=$this.attr('data-dispatchorderid')
            var code=$this.attr('data-ordercode')
            getJsonp({
                url:apiUrl.selectDispatchOrderDetail,
                data:{
                    dispatchorderid:id,
                    ordercode:code
                },
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        data.data.totalamount=data.data.dispatchorderfee[0].totalamount?data.data.dispatchorderfee[0].totalamount+'元':''
                        data.data.carlengthmin=data.data.carlengthmin?data.data.carlengthmin+'米':''
                        // switch(data.data.dispatchorderfee[0].sp_status){
                        //     case '0':
                        //         data.data.sp_status='待对账'
                        //     case '2':
                        //         data.data.sp_status='待确认'
                        //     case '5':
                        //         data.data.sp_status='待收付'
                        //     case '7':
                        //         data.data.sp_status='已收付'
                        //     case '9':
                        //         data.data.sp_status='已核销'
                        // }
                        data.data.goodsweight=data.data.goodsweightmin?data.data.goodsweightmin+'吨':data.data.goodsweightmax?data.data.goodsweightmax+'吨':'--'
                        data.data.goodsvolume=data.data.goodsvolumemin?data.data.goodsvolumemin+'方':data.data.goodsvolumemax?data.data.goodsvolumemax+'方':'--'
                        data.data.from=data.data.fromprovince+data.data.fromcity+(data.data.fromregion?(data.data.fromregion):"")+(data.data.fromdetail?("-"+data.data.fromdetail):"")
                        data.data.to=data.data.toprovince+data.data.tocity+(data.data.toregion?(data.data.toregion):"")+(data.data.todetail?("-"+data.data.todetail):"")
                        data.data.driverrealname=data.data.driverinfo[0].driverrealname
                        data.data.drivermobilenumber=data.data.driverinfo[0].drivermobilenumber
                        data.data.huidan=data.data.dispatchreceipt.dispatchreceiptid?'是':'否'
                        data.data.huidanimg=function(obj){
                            if(!obj.dispatchreceiptid){
                                return
                            }
                            var str=''
                            var arr=obj.receiptimgurl.split(',')
                            if(obj){
                               for(var i=0;i<arr.length;i++){
                                   str+='<img class="details-img details-img-style" src='+arr[i]+'>'
                               }
                            }
                            return str
                        }(data.data.dispatchreceipt)
                        data.data.fapiao=data.data.addedservice.match(1)?'是':'否'
                        data.data.table=function(log){
                            var table='<table class="paytable" cellpadding="1" cellspacing="1"><thead><tr><th>节点</th><th>操作时间</th><th>操作人</th></tr></thead><tbody>'
                            for(var i=0;i<log.length;i++){
                                 table+='<tr>'+
                                     '<td>'+log[i].status+'</td>'+
                                     '<td>'+log[i].inputdate+'</td>'+
                                     '<td>'+log[i].operatorname+'</td>'+
                                     '</tr>'
                            }
                            table+='</tbody></table>'
                            return table
                        }(data.data.dispatchorderlog)
                        for(var x in data.data){
                            $("#waybill-details [name='"+x+"']").html(data.data[x]);
                        }
                        $('#waybill-details').show()
                    }
                }
            });
        },
        imgbig:function(e){
            var $this=$(e.currentTarget);
            if($this.hasClass('details-img-style')){
                $this.removeClass('details-img-style')
            }else{
                $this.addClass('details-img-style')
            }
        },
        checkfor:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            var id=$this.attr('data-dispatchorderid')
            this.money=$this.attr('data-amount')
            var param={}
            var html=
                '<div >' +
                    '<div class="input-line">' +
                        '<h3>对账</h3>' +
                    '</div>'+
                    '<div class="input-line" >' +
                        '<span class="input-title" style="width:120px;">原运费金额:(元)</span>'+
                        '<input type="text" class="t-c-input input-width2"  id="Amount1"  require="true"  name="goodsname" maxlength="30" disabled />'+
                    '</div>'+
                    '<div class="input-line" style="position:relative">' +
                        '<span class="input-title" style=width:120px;">变更金额:(元)</span>'+
                        '<input type="text" class="t-c-input input-width2"  id="Amount2"  require="true"  name="goodsname" maxlength="11"/>'+
                    '</div>'+
                    '<div class="input-line" >' +
                        '<span class="input-title" style="width:120px;">变更后金额:(元)</span>'+
                        '<input type="text" class="t-c-input input-width2"  id="Amount3"  require="true"  name="goodsname"  disabled/>'+
                    '</div>'+
                    '<div class="input-line" style="text-align: left">' +
                        '<span class="input-title">备注</span>'+
                        '<textarea id="note" style="width:500px;" class="t-c-input release-remark" cols="20" rows="10" name="memo" maxlength="150"></textarea>'+
                    '</div>'+
                '</div>'
            new Pop({
                footer:[
                    {
                        text: '取消',
                        click: function () {

                        }
                    },{
                        text: '确定',
                        click: function () {
                            var amount=($('#Amount2').val()-0+($("#Amount1").val()-0))>0?$('#Amount2').val():(-$("#Amount1").val())
                            var memo=$('#note').val()
                            param.data.amount=amount
                            param.data.memo=memo
                            if(!_this.moneyReg){
                                setTimeout(function(){
                                    alertMsg("金额有误,对账失败")
                                },100)
                                return;
                            }
                            getJsonp(param)
                        }
                    }
                ],
                type:"iframe",
                html:html,
                content:"货源发布成功,是否保存为货源模板？",
                callType:"success"
            }).init()
            $('#Amount1').val(parseFloat(this.money).toFixed(2))
            
            param.url=apiUrl.checkDispatchOrderFee
            param.data={
                dispatchorderid:id,
                amount:'',
                memo:''
            }
            param.callback=function(data){
                if(data.result=="error"){
                    alertMsg(data.msg);
                    return;
                }
                if(data.result=="success"){
                    _this.getData()
                    alertMsg(data.msg)
                }
            }


        },
        paymoney:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            var id=$this.attr('data-dispatchorderid')
            var code=$this.attr('data-ordercode')
            var businessnumber=''
            var ordernumber=''
            var token=''

            getJsonp({
                url:apiUrl.payAmount,
                data:{
                    dispatchorderid:id,
                    ordercode:code
                },
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        businessnumber=data.data.businessnumber
                        ordernumber=data.data.ordernumber
                        _this.gettoken(businessnumber)
                    }
                }
            })

        },
        gettoken:function(businessnumber){
            var newWindow = window.open()
            getJsonp({
                url:apiUrl.generateToken,
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        token=data.data.auth_token
                        newWindow.location.href = cash_server+'/cashBillSite/view/cashier/expensePay.html?auth_token='+token+'&bn='+businessnumber+'&appid=1001005'

                        // window.open(cash_server+'/cashBillSite/view/cashier/expensePay.html?auth_token='+token+'&bn='+businessnumber+'&appid=1001005')
                    }
                }
            })
        },
        exportlist:function(){
            var searchData=$("#searchForm").serializeObject();
            searchData.fromprovince=searchData.fromaddress.split("-")[0];
            searchData.fromcity=searchData.fromaddress.split("-")[1]||"";
            searchData.fromregion=searchData.fromaddress.split("-")[2]||"";
            searchData.toprovince=searchData.toaddress.split("-")[0];
            searchData.tocity=searchData.toaddress.split("-")[1]||"";
            searchData.toregion=searchData.toaddress.split("-")[2]||"";

            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
            searchData.updatedatestart=searchData.updatedatestart?(searchData.updatedatestart+" 00:00:00"):""
            searchData.updatedateend=searchData.updatedateend?(searchData.updatedateend+" 23:59:59"):""
            delete searchData.fromaddress;
            delete searchData.toaddress;
            var str='?'
            for(var x in searchData){
                str+=x+'='+searchData[x]+'&'
            }
            window.location.href=apiUrl.exportDispatchOrderList+str

        },

        chongzhi:function(){
            getJsonp({
                url:apiUrl.generateToken,
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        token=data.data.auth_token
                        window.open(cash_server+'/cashBillSite/view/cashier/recharge.html?auth_token='+token+'&appid=1001005')
                    }
                }
            })
        },
        checkMoney:function(){
            var _this=this;
            //对账金额校验
            $(document).delegate('#Amount2','input propertychange',function(){
                var a=parseFloat(_this.money||0)
                var b=parseFloat($('#Amount2').val())
                var numReg=/[^0-9\-\.]/g
                var msg="",msgBox="";//错误提示

                _this.moneyReg=true
                //只能输入数字和负号和点
                if(numReg.test($('#Amount2').val())){
                   $('#Amount2').val($('#Amount2').val().replace(numReg, ""));
                }
                if(b){
                    var result=(a-0)+(b-0)
                    if(result>9999999.99){
                        _this.moneyReg=false;
                        msg="金额不能超过9999999.99"
                    }
                    if(result<0){
                        _this.moneyReg=false;
                        msg="变更后金额不能小于0";
                    }
                    if((b+"").split(".")[1]&&(b+"").split(".")[1].length>2){
                        _this.moneyReg=false;
                        msg="金额只精确到两位小数"
                    }
                     $('#Amount3').val((result==NaN?a:result).toFixed(2))
                }else{
                    //不输入变更金额可以直接对账
                    $('#Amount3').val(a)
                }
                if($("#pop-tips").length>0){
                        $("#pop-tips").remove();
                }
                if(!_this.moneyReg){
                    //展示提示文字
                    var msgBox='<label id="pop-tips" style="position:absolute;left: 0px;top:36px;color:red;width: 100%;">'+msg+'</label>'
                    $("#Amount2").closest("div").append(msgBox);
                }

            })
        }

    });
    new tradeFun({
        $el:$('.body-content')
    });
});
