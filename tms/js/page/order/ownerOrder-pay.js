/*
* 业务中心公用
* */
$(function(){
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base=new transfar.Base();
            this.type=this.base.getUrlParam("type");
            this.source="";
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
                        
            this.switchStatus();
            $('[name="agentpaystatus"]').val("0");
            tradeCommonFun.selectModal();
            tradeCommonFun.selectChangeVal();
            this.getData()
            var area=AddressComponent();
            area.start();
            var car=CarLengthComponent();
            car.start();
                

        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit":"searchSubmit",
            "click #searchReset":"forReset"
        },
        switchStatus:function(){
            this.source= '{{each data as d i}}'
                            +'{{if i%2==0}}'
                            +'<tr class="t-table-single">' +
                            '{{else}}' +
                            '<tr>'+
                            '{{/if}}'
                            +'<td  class="goods-table-address"><a target="_blank" class="goods-detail-link" '
                            +'href="./orderDetail.html?id={{d.dispatchorderid}}&orderId={{d.ordercode}}&type='+this.type+'">{{d.fromordercode||d.ordercode}}</a></td>'
                            +'<td>{{d.bidtypeWord}}</td>'
                            +'<td>{{d.from}}--{{d.to}}</td>'
                            +'<td>{{d.goodsname}}</td>'
                            +'<td>{{d.goodsSpaceW}}<br/>{{d.goodsSpaceV}}</td>'
                            +'<td>{{d.ownerrealname}}</td>'
                            +'<td>{{d.ownermobilenumber}}</td>';
            var partyStr = iLocalStorage.getItem('DispatchRole');
            var Role = partyStr?JSON.parse(partyStr):'';
            switch(Role){
                case "agent":
                    $("title").html("陆鲸-承运商-应收管理")
                    break;
                case "contractor":
                    $("title").html("陆鲸-总包商-应收管理")
                    break;
            }
            $(".t-table thead tr").eq(1).show();
            $("#orderStatus").val(2)
            $("#subTilte").html("应收管理")
            this.source+='<td>{{d.total }}</td>'
                            + '</tr>'
                            + '{{/each}}';
        },
        searchSubmit:function(){
            this.getData();
        },
        //自定义方法
        getData:function(page){
            var _this=this;
            var searchData=$("#searchForm").serializeObject();
            searchData.fromprovince=searchData.from.split("-")[0]
            searchData.fromcity=searchData.from.split("-")[1]
            searchData.fromregion=searchData.from.split("-")[2]
                delete searchData.from;

            searchData.toprovince=searchData.to.split("-")[0]
            searchData.tocity=searchData.to.split("-")[1]
            searchData.toregion=searchData.to.split("-")[2]
                delete searchData.to;
                
            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)
            var url=apiUrl.agentSelectDispatchOrderList

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
                    d=tradeCommonFun.dataMobileHandle(d,"trademobilenumber");
                    d=_this.dataTeas(d);
                    
                    var render = template.compile(_this.source);
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
        //数据梳理,
        dataTeas:function(d){
            $.each(d.data,function(i,e){
                e.from=e.fromprovince+e.fromcity+e.fromregion;
                e.to=e.toprovince+e.tocity+e.toregion;
                e.fromSub=tradeCommonFun.stringFilter(e.from,15);
                e.toSub=tradeCommonFun.stringFilter(e.to,15);
                if(e.carlengthmin&&e.carlengthmax){
                    e.carleng=e.carlengthmin+"-"+e.carlengthmax+"米,";
                }else{
                    e.carleng="";
                }
                // e.bidtypeWord=e.showstatus==0?"待付款":"已付款";
                e.bidtypeWord=e.showstatus
                e.goodsSpaceW=(e.goodsweightmin?(e.goodsweightmin+"吨"):"");
                e.goodsSpaceV=(e.goodsvolumemin?(e.goodsvolumemin+"立方"):"");
                e.total=e.dispatchorderfee[0].totalamount+"元"
            });
            return d;
        },
         forReset:function(){
            $("#searchForm")[0].reset();
         }
    });
    var obj = new tradeFun({
        $el:$('.body-content')
    });


});
