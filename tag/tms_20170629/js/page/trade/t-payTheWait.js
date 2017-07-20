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
            "click .look-btn-xq":"goodsinfo", //详情
            "click .backClear":'clearpopup',
            "click .details-img":'imgbig',
            "click .look-btn-fk":'paymoney',
            "click #searchExcel":'exportlist',
            "keyup #releaseForm":"releaseCheck",
            "click #searchPay":"chongzhi",
            "click .all-check":"allCheck",
            "click .checkbox-list":"evenCheck",
            "click #searchAllPay":"allpay",
            "click #searchReset":"forReset",
            "click #searchPayOffline":"offline"

        },
        searchSubmit:function(){
            this.getData();
        },
        forReset:function(){
            $("#searchForm")[0].reset();
            end.min=end.max=end1.min=end1.max=""
        },
        getUnPay:function(){
            //获取当前用户未支付的订单
            var html="";
            getJsonp({
                url:apiUrl.selectDispatchBatchOrderList,
                data:{
                    pagesize:2000,
                    skipcount:0,
                    status:0
                },
                callback:function(d){
                    if(d.result=="success"&&d.count>0){
                        $("#unPay").html('<a class="un-pay" href="./payTheWaitAll.html">您有 '+d.count+ '笔费用未完成付款，点击继续付款</a>')
                    }
                }
            })
        },
        allpay:function(e){
            var _this=this
            var $this=$(e.currentTarget);
           /* var str=''
            for(var i=0;i<this.allcheck.length;i++){
                str+=this.allcheck[i].join(',')+','
            }
            var arr=str.split(',')
            var str1=''
            for(var j=0;j<arr.length;j++){
                if(arr[j]){
                    str1+=arr[j]+','
                }
            }*/
            if(this.allcheck.length<1){
                alertMsg('请勾选需付款订单')
                return
            }else{
                if(!this.isok) return
                this.isok=false
                getJsonp({
                    url:apiUrl.batchPayAmount,
                    data:{
                        dispatchorderids:this.allcheck.join(",")
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
            searchData.status=2;
            // searchData.ownerpaystatus=5;

            searchData.fromprovince=searchData.fromaddress.split("-")[0];
            searchData.fromcity=searchData.fromaddress.split("-")[1];
            searchData.fromregion=searchData.fromaddress.split("-")[2]||"";
            searchData.toprovince=searchData.toaddress.split("-")[0];
            searchData.tocity=searchData.toaddress.split("-")[1];
            searchData.toregion=searchData.toaddress.split("-")[2]||"";
            /*searchData.updatedatestart=searchData.updatedatestart==""?"":searchData.updatedatestart;
            searchData.updatedateend=searchData.updatedateend==""?"":searchData.updatedateend;*/
           /* searchData.inputdatestart=searchData.inputdatestart==""?"":searchData.inputdatestart;
            searchData.inputdateend=searchData.inputdateend==""?"":searchData.inputdateend;*/

            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
            searchData.updatedatestart=searchData.updatedatestart?(searchData.updatedatestart+" 00:00:00"):""
            searchData.updatedateend=searchData.updatedateend?(searchData.updatedateend+" 23:59:59"):""
            delete searchData.fromaddress;
            delete searchData.toaddress;
            // searchData.nlengthmin=searchData.carlength.split("-")[0]?(searchData.carlength.split("-")[0]*1000):"";
            // searchData.nlengthmax=searchData.carlength.split("-")[1]?(parseFloat(searchData.carlength.split("-")[1])*1000):"";
            // searchData.ntonmin=parseFloat(searchData.ntonmin)?(parseFloat(searchData.ntonmin)*1000):"";
            // searchData.ntonmax=parseFloat(searchData.ntonmax)?(parseFloat(searchData.ntonmax)*1000):"";
            // searchData.faith=searchData.faith=="false"?"":searchData.faith;
            // searchData.emptyload=searchData.emptyload=="false"?"":searchData.emptyload;

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
                        +'<td><a href="../order/orderDetail.html?id={{d.dispatchorderid}}&orderId={{d.ordercode}}&type=sendPayTheWait'
                        + '" target="_blank" >{{d.fromordercode||d.ordercode}}</a></td>'
                        +'<td>{{d.agentrealname}}</td>'
                        +'<td>{{d | addresssplit: "from"}}-{{d | addresssplit: "to"}}</td>'
                        +'<td>{{d | goods: "goods"}}</td>'
                        +'<td>应收:{{d.feein}}<br>应付:{{d.feeout}}</td>'
                        +'<td>{{d.dispatchorderlog[0]?d.dispatchorderlog[0].inputdate:""}}</td>'
                        //+'<td>{{d.driverinfo[0]?d.driverinfo[0].uploaddate:""}}</td>'
                        +'<td>{{d.updatedate}}</td>'
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
                        if(data.paytype){
                             str=
                                '<a href="javascript:void(0)" class="look-btn-fk"  data-dispatchorderid="'+data.dispatchorderid+'" data-ordercode="'+data.ordercode+'">付款</a>'
                        }
                        return str
                    })
                    template.helper('checkCreate',function(data,type){
                        var str=''
                        if(data.paytype){
                            str='<input type="checkbox" class="checkbox-list"  data-value="'+data.dispatchorderid+'">'
                        }
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
            searchData.updatedatestart=searchData.updatedatestart?(searchData.updatedatestart+" 00:00:00"):""
            searchData.updatedateend=searchData.updatedateend?(searchData.updatedateend+" 23:59:59"):""
            // searchData.inputdatestart=searchData.inputdatestart?"":searchData.inputdatestart;
            // searchData.inputdateend=searchData.inputdateend?"":searchData.inputdateend;

            delete searchData.fromaddress;
            delete searchData.toaddress;
            delete searchData.status;
            var str='?'
            for(var x in searchData){
                str+=x+'='+searchData[x]+'&'
            }
            window.location.href=apiUrl.exportDispatchOrderList+str

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
                    url:apiUrl.batchPayAmountOffline,
                    data:{
                        dispatchorderids:this.allcheck.join(",")
                    },
                    callback:function(data){
                        _this.isok=true
                        if(data.result=="error"){
                            alertMsg(data.msg);
                        }else{
                            alertMsg(data.msg);
                             _this.allcheck=[];
                            _this.getData(0)
                        }
                    }
                })
            }
        }

    });
    new tradeFun({
        $el:$('.body-content')
    });
});
