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

var start1 = {
    elem: '#starttime1',
    format: 'YYYY-MM-DD',
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function(datas){
        end1.min = datas; //开始日选好后，重置结束日的最小日期
        end1.start = datas //将结束日的初始值设定为开始日
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
        end1.max=ymd+' '+hms
    }
};
var end1 = {
    elem: '#endtime1',
    format: 'YYYY-MM-DD',
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function(datas){

    }
};
laydate(start1);
laydate(end1);
laydate(start);
laydate(end);
$(function(){
    // var skipcount=0
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
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
            $('[name="ownerpaystatus"]').val("5");

            this.allcheck=[]//勾选的运单列表
            this.getData();
            tradeCommonFun.selectChangeVal();
            var _this=this;
            $("body").mouseup(function(){
                _this.releaseCheck();
            });
            this.isok=true
            this.getUnPay();

        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit":"searchSubmit",
            "click .look-btn":"bgshow",
            "click .close_btn":"closePopup",
            "click .backClear":'clearpopup',
            "click .details-img":'imgbig',
            "click .look-btn-fk":'paymoney',//付款
            "click #searchExcel":'exportlist',
            "keyup #releaseForm":"releaseCheck",
            "click #searchPay":"chongzhi",
            "click .all-check":"allCheck",
            "click .checkbox-list":"evenCheck",
            "click #searchAllPay":"allpay",//批量付款
            "click #searchReset":"forReset",
            "click #searchPayOffline":"offline"//线下付款

        },
        searchSubmit:function(){
            this.getData();
        },
        forReset:function(){
            $("#searchForm")[0].reset();
            end.min=end.max=end1.min=end1.max=""
        },
        allpay:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            if(this.allcheck.length<1){
                alertMsg('请勾选需付款订单')
                return
            }else{
                if(!this.isok) return
                this.isok=false
                getJsonp({
                    url:apiUrl.agentBatchPayAmount,
                    data:{
                        dispatchshipbillids:this.allcheck.join(",")
                    },
                    callback:function(data){
                        _this.isok=true
                        if(data.result=="error"){
                            alertMsg(data.msg);
                            return;
                        }
                        if(data.result=="success"){
                            businessnumber=data.data.businessnumber
                            ordernumber=data.data.ordernumber
                            _this.gettoken(businessnumber)
                            _this.allcheck=[];
                            _this.getData();
                        }
                    }
                })
            }
        },
        allCheck:function(e){
            var _this=this

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
            /*var x=parseInt(this.skipcount/10)
            if($this.is(':checked')){
                if(this.allcheck[x]&&this.allcheck[x].length>0){
                    this.allcheck[x].push(v)
                }else{
                    this.allcheck[x]=[]
                    this.allcheck[x].push(v)
                }
            }else{
                for(var i =0;i<this.allcheck[x].length;i++){
                    if(v==this.allcheck[x][i]){
                        this.allcheck[x].splice(i,1)
                    }
                }
            }*/
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
            if($this.hasClass('look-btn-cancel')||$this.hasClass('look-btn-cxfb')){
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

            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
            searchData.checkdatestart=searchData.checkdatestart?(searchData.checkdatestart+" 00:00:00"):""
            searchData.checkdateend=searchData.checkdateend?(searchData.checkdateend+" 23:59:59"):""
            delete searchData.fromaddress;
            delete searchData.toaddress;
            // searchData.nlengthmin=searchData.carlength.split("-")[0]?(searchData.carlength.split("-")[0]*1000):"";
            // searchData.nlengthmax=searchData.carlength.split("-")[1]?(parseFloat(searchData.carlength.split("-")[1])*1000):"";
            // searchData.ntonmin=parseFloat(searchData.ntonmin)?(parseFloat(searchData.ntonmin)*1000):"";
            // searchData.ntonmax=parseFloat(searchData.ntonmax)?(parseFloat(searchData.ntonmax)*1000):"";
            // searchData.faith=searchData.faith=="false"?"":searchData.faith;
            // searchData.emptyload=searchData.emptyload=="false"?"":searchData.emptyload;

            
            var url=apiUrl.selectDispatchShipBillList;
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
                        +'<td><a href="../order/orderDetail.html?dispatchshipbillid={{d.dispatchshipbillid}}&shipbillcode={{d.shipbillcode}}&type=sendPayTheWaitAgent'
                        + '" target="_blank" >{{d.fromordercode||d.ordercode}}</a></td>'
                        +'<td>{{d.driverrealname}}<br>{{d.drivermobilenumber}}<br>{{d.carplatenumber}}</td>'
                        +'<td>{{d | addresssplit: "from"}}-{{d | addresssplit: "to"}}</td>'
                        +'<td>{{d | goods: "goods"}}</td>'
                        +'<td>应付:{{d.feeout}}</td>'
                        +'<td>{{d.uploaddate}}</td>'
                        +'<td>{{d.checkdate}}</td>'
                        +'<td>{{#d | btnCreate}}</td>'
                        + '</tr>'
                        + '{{/each}}';
                   
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
                             str=
                                '<a href="javascript:void(0)" class="look-btn-fk"  data-dispatchshipbillid="'+data.dispatchshipbillid+'" data-shipbillcode="'+data.shipbillcode+'">在线付款</a>'
                        
                        return str
                    })
                    template.helper('checkCreate',function(data,type){
                        var str=''
                            str='<input type="checkbox" class="checkbox-list"  data-value="'+data.dispatchshipbillid+'">'
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
        
        imgbig:function(e){
            var $this=$(e.currentTarget);
            if($this.hasClass('details-img-style')){
                $this.removeClass('details-img-style')
            }else{
                $this.addClass('details-img-style')
            }
        },
        paymoney:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            var id=$this.data('dispatchshipbillid'),shipbillcode=$this.data('shipbillcode')
            var businessnumber=''
            var ordernumber=''
            var token=''

            getJsonp({
                url:apiUrl.agentPayAmount,
                data:{
                    dispatchshipbillid:id,
                    shipbillcode:shipbillcode
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
            // var newWindow = window.open()
            getJsonp({
                url:apiUrl.generateToken,
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        token=data.data.auth_token
                        // newWindow.location.href = cash_server+'/cashBillSite/view/cashier/expensePay.html?auth_token='+token+'&bn='+businessnumber+'&appid=1001005'

                        window.open(cash_server+'/cashBillSite/view/cashier/expensePay.html?auth_token='+token+'&bn='+businessnumber+'&appid=1001005')
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
            delete searchData.dispatchorderfeestatus
            
            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
            searchData.checkdatestart=searchData.checkdatestart?(searchData.checkdatestart+" 00:00:00"):""
            searchData.checkdateend=searchData.checkdateend?(searchData.checkdateend+" 23:59:59"):""
            // searchData.inputdatestart=searchData.inputdatestart?"":searchData.inputdatestart;
            // searchData.inputdateend=searchData.inputdateend?"":searchData.inputdateend;

            delete searchData.fromaddress;
            delete searchData.toaddress;
            delete searchData.status;
            var str='?'
            for(var x in searchData){
                str+=x+'='+searchData[x]+'&'
            }
            window.location.href=apiUrl.exportDispatchShipBillList+str

        },
        releaseCheck:function(){
            // setTimeout(function(){
            //     if($('[name="updatedatestart"]').val()||$('[name="updatedateend"]').val()){
            //         if($('[name="updatedatestart"]').val()&&$('[name="updatedateend"]').val()){
            //             var a=$('[name="updatedatestart"]').val()
            //             var b=$('[name="updatedateend"]').val()
            //             a.split(' ')
            //         }else{
            //             new Pop({
            //                 type:"pop",
            //                 content:"时间必须两个都填写",
            //                 callType:"fail"
            //             }).init();
            //             return
            //         }
            //     }
            //
            // },100);

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
        offline:function(){
            var _this=this;
             if(this.allcheck.length<1){
                alertMsg('请勾选需付款订单')
                return
            }else{
                if(!this.isok) return
                this.isok=false
                getJsonp({
                    url:apiUrl.agentBatchPayAmountOffline,
                    data:{
                        dispatchshipbillids:this.allcheck.join(",")
                    },
                    callback:function(data){
                        _this.isok=true
                        if(data.result=="error"){
                            alertMsg(data.msg);
                        }else{
                            alertMsg(data.msg);
                            _this.getData(0)
                             _this.allcheck=[];
                        }
                    }
                })
            }
        },
         getUnPay:function(){
            //获取当前用户未支付的订单
            var html="";
            getJsonp({
                url:apiUrl.agentSelectDispatchBatchOrderList,
                data:{
                    pagesize:2000,
                    skipcount:0,
                    status:0
                },
                callback:function(d){
                    if(d.result=="success"&&d.count>0){
                        $("#unPay").html('<a class="un-pay" href="./payTheWaitAllAgent.html">您有 '+d.count+ '笔费用未完成付款，点击继续付款</a>')
                    }
                    
                }
            })
        },
    });
    new tradeFun({
        $el:$('.body-content')
    });
});
