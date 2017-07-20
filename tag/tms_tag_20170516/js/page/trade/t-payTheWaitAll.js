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
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
            this.getDate();
            this.allcheck=[]//勾选的运单列表
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
            tradeCommonFun.selectChangeVal();
            this.isok=true;
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit":"getDate",
            "click .look-btn":"bgshow",
            "click .close_btn":"closePopup",
            "click .look-btn-fk":'paymoney', //支付
            "click .look-btn-orderxq":"orderinfo", //订单详情
            "click .look-btn-cancel":"ordercancel", //取消
            "click .backClear":'clearpopup',
            "click .all-check":"allCheck",
            "click .checkbox-list":"evenCheck",
            "click .details-img":'imgbig',
            "click #searchReset":"forReset",
            "click #searchPayOffline":"offline"

        },
        forReset:function(){
            $("#searchForm")[0].reset();
        },
        bgshow:function(e){
            var $this=$(e.currentTarget);
            if($this.hasClass('look-btn-cancel')||$this.hasClass('look-btn-cxfb')){
                return
            }else{
                $('.pop-cl').show()
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
        //自定义方法
        getDate:function(page){
            var searchData=$("#searchForm").serializeObject();
            var _this=this;

            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)
            searchData.status=0
            var url=apiUrl.selectDispatchBatchOrderList;
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
                    var source= '{{each data as d i}}'
                        +'{{if i%2==0}}'
                        +'<tr class="t-table-single">' +
                        '{{else}}' +
                            '<tr>'+
                        '{{/if}}'
                        +'<td><input type="checkbox" class="checkbox-list"  data-value="{{d.dispatchbatchorderid}}" /></td>'
                        +'<td>{{#d | info }}</td>'
                        +'<td>{{d.torealname}}</td>'
                        +'<td>{{d.tomobilenumber}}</td>'
                        +'<td>{{d.amount}}</td>'
                        +'<td>{{#d | btnCreate}}</td>'
                        + '</tr>'
                        + '{{/each}}';
                    template.helper('btnCreate',function(data,type){
                        var str='<a href="javascript:void(0)" class="look-btn-fk"  data-dispatchbatchorderid="'+data.dispatchbatchorderid+'" data-ordernumber="'+data.ordernumber+'">支付</a>'+
                             '<a href="javascript:void(0)" style="display:inline-block" class="look-btn-cancel look-btn" data-dispatchbatchorderid="'+data.dispatchbatchorderid+'">取消</a>'
                        return str
                    })
                    template.helper('info',function(data,type){
                        var str=''
                        str='<a href="javascript:void(0)" class="look-btn-orderxq look-btn" data-dispatchbatchorderid="'+data.dispatchbatchorderid+'" >'+data.ordernumber+'</a>'
                        return str
                    })
                    var render = template.compile(source);
                    var html = render(d);
                    $('#ajaxCont').html(html);
                    tradeCommonFun.createPage({
                        count:d.count,
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
        clearpopup:function(e){
            var $this=$(e.currentTarget);
            $('.dec').html('')
            $this.parents('.waybill-details').hide()
            $('.pop-cl').hide()
        },
        ordercancel:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            var id=$this.attr('data-dispatchbatchorderid')
            getJsonp({
                url:apiUrl.deleteDispatchBatchOrder,
                data:{
                    dispatchbatchorderid:id
                },
                callback:function(d) {
                    if (d.result == "error") {
                        alertMsg(d.msg);
                        return;
                    }else if(d.result=='success'){
                        _this.getDate()
                        new Pop({
                            type:"pop",
                            content:d.msg,
                            callType:"success"
                        }).init();
                    }
                }
            })
        },
        orderinfo:function(e){
            var _this=this
            var $this=$(e.currentTarget);
            var id=$this.attr('data-dispatchbatchorderid')
            var searchData={}
            searchData.pagesize=10;
            searchData.status=2
            delete searchData.ownerpaystatus
            searchData.skipcount=skipcount
            searchData.dispatchbatchorderid=id
            getJsonp({
                url:apiUrl.selectDispatchOrderList,
                data:searchData,
                callback:function(d){
                    if(d.result=="error"){
                        alertMsg(d.msg);
                        return;
                    }
                    // if(d.count==0){
                    //     $(".no-model").remove();
                    //     $(".modal-cont").append(tradeCommonFun.creatNodata());
                    //     $('#ajaxCont,.pagination').html("");
                    //     return;
                    // }else{
                    //     $(".no-model").remove();
                    // }
                    var source= '{{each data as d i}}'
                        +'{{if i%2==0}}'
                        +'<tr class="t-table-single">' +
                        '{{else}}' +
                        '<tr>'+
                        '{{/if}}'
                        +'<td>{{d.fromordercode||d.ordercode}}</td>'
                        +'<td>{{d.driverinfo[0].uploaddate}}</td>'
                        +'<td>{{d.dispatchorderfee[0].totalamount}}</td>'
                        + '</tr>'
                        + '{{/each}}';
                    var render = template.compile(source);
                    var html = render(d);
                    $('#ajaxCont2').html(html);
                    tradeCommonFun.createPage({
                        id:'Pagination2',
                        count:d.count,
                        pageSize:10,
                        callback:function(skipcount){
                            searchData.skipcount=skipcount;
                            getJsonp({
                                url:url,
                                data:searchData,
                                callback:function(d){
                                    // d=tradeCommonFun.dataMobileHandle(d,"mobilenumber");
                                    var html = render(d);
                                    $('#ajaxCont2').html(html);
                                }
                            });
                        }
                    });
                    $('#waybill-details').show()
                }
            })

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
            var id=$this.attr('data-dispatchbatchorderid')
            var businessnumber='DispatchBatchOrder-'+id
            var ordernumber=$this.attr('data-ordernumber')
            var token=''
            function gettoken(){
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

                        }
                    }
                })
            }
            gettoken()
        },
        exportlist:function(){
            var searchData=$("#searchForm").serializeObject();
            searchData.fromprovince=searchData.fromaddress.split("-")[0];
            searchData.fromcity=searchData.fromaddress.split("-")[1]||"";
            searchData.fromregion=searchData.fromaddress.split("-")[2]||"";
            searchData.toprovince=searchData.toaddress.split("-")[0];
            searchData.tocity=searchData.toaddress.split("-")[1]||"";
            searchData.toregion=searchData.toaddress.split("-")[2]||"";
            searchData.dispatchorderfeestatus=7
            searchData.paysuccessdatestart=searchData.paysuccessdatestart==""?"":searchData.paysuccessdatestart;
            searchData.paysuccessdateend=searchData.paysuccessdateend==""?"":searchData.paysuccessdateend;
            delete searchData.fromaddress;
            delete searchData.toaddress;
            delete searchData.status;
            var str='?'
            for(var x in searchData){
                str+=x+'='+searchData[x]+'&'
            }
            window.location.href=apiUrl.exportDispatchOrderList+str

        },
        offline:function(){
            var _this=this;

             if(this.allcheck.length<1){
                alertMsg('请勾选需付款交易单')
                return
            }else{
                if(!this.isok) return
                this.isok=false
                getJsonp({
                    url:apiUrl.payDispatchBatchOrdersOffline,
                    data:{
                        dispatchbatchorderids:this.allcheck.join(",")
                    },
                    callback:function(data){
                        _this.isok=true
                        if(data.result=="error"){
                            alertMsg(data.msg);
                        }else{
                            alertMsg(data.msg);
                            if($("#ajaxCont").find("tr").length<=1){
                                _this.getDate($(".pagination ").find(".current:not('.prev'):not('.next')").html()-2)
                            }else{
                                _this.getDate($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                            }
                             _this.allcheck=[];
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

function callback(d){
    console.log(d);
}
