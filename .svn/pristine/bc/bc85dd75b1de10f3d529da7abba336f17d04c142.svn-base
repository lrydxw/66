/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20 //缓存分页
           
            laydate({
                elem: '#starttime',
                format: 'YYYY-MM-DD',
                istime: false,
                max: laydate.now()
            })
            laydate({
                elem: '#endtime',
                format: 'YYYY-MM-DD',
                istime: false,
                max: laydate.now()
            })

            this.getData();//获取未开票订单列表

             this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'

                + '<td  class="goods-table-address"><a  target="_blank" class="goods-detail-link" '
                + 'href="../order/orderDetail.html?type=ticket&id={{d.dispatchorderid}}&orderId={{d.ordercode}}">{{d.fromordercode||d.ordercode}}</a></td>'
                + '<td>{{d.outcode}}</td>' + 
                '<td>{{d.ownerrealname}}</td>'+
            '<td>{{d.from}}--{{d.to}}</td>' + 
            '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
            '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
            '<td>{{d.voucherdate}}</td>' + 
             '<td  class="goods-table-address"><a href="javascript:" data-value="{{d.dispatchvoucherid}}" class="look-ticket">查看开票</a></td>'+
            '</tr>' + '{{/each}}';
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",
            "click #searchReset": "forReset",
            "click .signMsg":"signMsg",
            "click .look-ticket":"lookTicket",//查看开票
            "click .showBig":"showBig"//查看大图
        },
        searchSubmit:function(){
            //查询
            this.getData();
        },
        forReset: function () {
            //表单重置
            $("#searchForm")[0].reset();
        },
        
        //自定义方法
        getData: function (page) {
            var _this = this;
            var searchData = $("#searchForm").serializeObject();
             
            searchData.inputdatestart=searchData.inputdatestart?(searchData.inputdatestart+" 00:00:00"):""
            searchData.inputdateend=searchData.inputdateend?(searchData.inputdateend+" 23:59:59"):""
        
            searchData.pagesize = this.pageSize;
            searchData.skipcount = this.pageSize*(page||0)
            var url = apiUrl.agentSelectDispatchOrderList;

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
            $.each(d.data, function (i, e) {
                //运输信息
                e.from = e.fromprovince + e.fromcity + e.fromregion;
                e.to = e.toprovince + e.tocity + e.toregion;
                
                //货重 货物体积
                e.goodsSpaceW = (e.goodsweightmin ? (e.goodsweightmin + "吨") : "");
                e.goodsSpaceV = (e.goodsvolumemin ? (e.goodsvolumemin + "立方") : "");

                
            });
            return d;
        },
       
        lookTicket:function(e){
            var dispatchvoucherid=$(e.currentTarget).data("value");
            var _this=this;
            getJsonp({
                url:apiUrl.selectDispatchVoucherDetail,
                data:{
                    dispatchvoucherid:dispatchvoucherid
                },
                callback:function(data){
                    data=data.data
                    var imgArr=data.voucherimgurl.split(","),imgHtml=""
                    $.each(imgArr,function(i,e){
                        imgHtml+='<span class="iframe-img-list"><a href="javascript:"  class="showBig"></a><img src="'+e+'"></span>'
                    })
                      new Pop({
                        title:"开票信息",
                        type:"iframe",
                        otherClass:"ticket",
                        click:"other",
                        html:'<div  class="deal-form"><form id="dealForm">' +
                        '<div class="input-line">' +
                        '<span class="input-title">单位名称:</span>' +
                        '<input type="text" class="t-c-input input-width1" readonly value="'+data.company+'" placeholder="" name="realName" id="dealNumber" maxlength="100"/>' +
                        '</div>'+
                        '<div class="input-line">' +
                        '<span class="input-title">开票金额:</span>' +
                        '<input type="text" class="t-c-input input-width2" readonly value="'+data.voucheramount+'" id="receiptdate" placeholder="" name="money"  />' +
                        '<span class="input-title">开票时间:</span>' +
                        '<input type="text" class="t-c-input input-width2" readonly id="receiptdate" value="'+data.voucherdate+'" placeholder="" name="receiptdate"  />' +
                        '</div>'+
                        '</form>'+
                        '<div class="input-line" id="iframeImgList"  style="position:relative;">' +
                        '<span class="input-title">上传单据:</span>' +
                        imgHtml+
                        '</div></div>',
                        footer: [{
                            text: '取消'
                        }]
                    }).init();
                }
            })
          
        },
        showBig:function(e){
            //编辑附件内的查看大图
            var picSrc=$(e.currentTarget).closest("span").find("img").attr("src")
            new Pop({
                type: "iframe",
                otherClass:"blow-up-img",
                html: '<img id="blowUpImg" src="'+picSrc+'">',
                footer: [ {
                    text: '关闭'
                }],
            }).init();
            var imgHeight=$("#blowUpImg").height(),imgWidth=$("#blowUpImg").width(),boxWidth=600,boxHeight=338;
            if(imgWidth>boxWidth){
                $("#blowUpImg").width(boxWidth)
            }
            if(imgHeight>boxHeight){
                $("#blowUpImg").width("")
                $("#blowUpImg").height(boxHeight)
            }
            //高度不足，上下居中
            if($("#blowUpImg").height()<boxHeight){
                $("#blowUpImg").css("margin-top",(boxHeight-$("#blowUpImg").height())/2)
            }
            
        }
    });
    var obj = new tradeFun({
        $el: $('body')
    });


});
