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
laydate(start);
laydate(end);
$(function(){
    var skipcount=0
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
            var area=AddressComponent('no',1);
            area.start();
            var car=CarLengthComponent();
            car.start();

            $('[name="ownerpaystatus"]').val("7");
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20

            this.getData();
            tradeCommonFun.selectChangeVal();

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
            "click #searchReset":"forReset"
        },
        searchSubmit:function(){
            this.getData();
        },
        forReset:function(){
            $("#searchForm")[0].reset();
            end.min=end.max=""
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
            var _this=this;
            var searchData=$("#searchForm").serializeObject();
            searchData.paysuccessdatestart=searchData.paysuccessdatestart?(searchData.paysuccessdatestart+" 00:00:00"):""
            searchData.paysuccessdateend=searchData.paysuccessdateend?(searchData.paysuccessdateend+" 23:59:59"):""
            searchData.fromprovince=searchData.fromaddress.split("-")[0];
            searchData.fromcity=searchData.fromaddress.split("-")[1];
            searchData.fromregion=searchData.fromaddress.split("-")[2]||"";
            searchData.toprovince=searchData.toaddress.split("-")[0];
            searchData.tocity=searchData.toaddress.split("-")[1];
            searchData.toregion=searchData.toaddress.split("-")[2]||"";
            delete searchData.fromaddress;
            delete searchData.toaddress;
            // searchData.nlengthmin=searchData.carlength.split("-")[0]?(searchData.carlength.split("-")[0]*1000):"";
            // searchData.nlengthmax=searchData.carlength.split("-")[1]?(parseFloat(searchData.carlength.split("-")[1])*1000):"";
            // searchData.ntonmin=parseFloat(searchData.ntonmin)?(parseFloat(searchData.ntonmin)*1000):"";
            // searchData.ntonmax=parseFloat(searchData.ntonmax)?(parseFloat(searchData.ntonmax)*1000):"";
            // searchData.faith=searchData.faith=="false"?"":searchData.faith;
            // searchData.emptyload=searchData.emptyload=="false"?"":searchData.emptyload;
            
            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)

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
                        +'<td><a href="../order/orderDetail.html?dispatchshipbillid={{d.dispatchshipbillid}}&shipbillcode={{d.shipbillcode}}&type=sendPayTheOverAgent'
                        + '" target="_blank" >{{d.fromordercode||d.ordercode}}</a></td>'
                        +'<td>{{d.outcode}}</td>'
                        +'<td>{{d | addresssplit: "from"}}-{{d | addresssplit: "to"}}</td>'
                        +'<td>{{d | goods: "goods"}}</td>'
                        +'<td>应付:{{d.feeout}}</td>'
                        +'<td>{{d.paysuccessdate}}</td>'
                        +'<td>{{d | payType:"s"}}</td>'
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

                    template.helper('payType',function(data,type){

                        var str=["线上付款","通过平台支付","线下付款"]
                         return str[data.paytype]
                    })
                    /*template.helper('btnCreate',function(data,type){
                        var str=''
                             str='<a href="javascript:void(0)" class="look-btn-xq look-btn" data-dispatchorderid="'+data.dispatchorderid+'" data-ordercode="'+data.ordercode+'">详情</a>'
                        return str
                    })*/
                    var render = template.compile(source);
                    var html = render(d);
                    $('#ajaxCont').html(html);
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
                        data.data.driverrealname=data.data.driverinfo[0]?data.data.driverinfo[0].driverrealname:''
                        data.data.drivermobilenumber=data.data.driverinfo[0].drivermobilenumber?data.data.driverinfo[0].drivermobilenumber:''
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
                        gettoken()
                    }
                }
            })
            function gettoken(){
                getJsonp({
                    url:apiUrl.generateToken,
                    callback:function(data){
                        if(data.result=="error"){
                            alertMsg(data.msg);
                            return;
                        }
                        if(data.result=="success"){
                            token=data.data.auth_token
                            window.open(cash_server+'/cashBillSite/view/cashier/expensePay.html?auth_token='+token+'&bn='+businessnumber+'&appid=1001005')
                        }
                    }
                })
            }
        },
        exportlist:function(){
            var searchData=$("#searchForm").serializeObject();
            searchData.fromprovince=searchData.fromaddress.split("-")[0];
            searchData.fromcity=searchData.fromaddress.split("-")[1]||"";
            searchData.fromregion=searchData.fromaddress.split("-")[2]||"";
            searchData.toprovince=searchData.toaddress.split("-")[0];
            searchData.tocity=searchData.toaddress.split("-")[1]||"";
            searchData.toregion=searchData.toaddress.split("-")[2]||"";
            //searchData.dispatchorderfeestatus=7
            searchData.paysuccessdatestart=searchData.paysuccessdatestart?(searchData.paysuccessdatestart+" 00:00:00"):""
            searchData.paysuccessdateend=searchData.paysuccessdateend?(searchData.paysuccessdateend+" 23:59:59"):""
            delete searchData.fromaddress;
            delete searchData.toaddress;
            delete searchData.status;
            var str='?'
            for(var x in searchData){
                str+=x+'='+searchData[x]+'&'
            }
            window.location.href=apiUrl.exportDispatchShipBillList+str

        }

    });
    new tradeFun({
        $el:$('.body-content')
    });
});

function callback(d){
    console.log(d);
}
