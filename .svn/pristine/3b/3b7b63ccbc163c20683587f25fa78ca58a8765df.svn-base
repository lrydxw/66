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

                + '<td><input type="checkbox" class="checkbox-list"  data-name="{{d.ownerrealname}}" data-value="{{d.dispatchorderid}}" data-money={{d.feein}}></td>'
                + '<td  class="goods-table-address"><a  target="_blank" class="goods-detail-link" '
                + 'href="../order/orderDetail.html?type=unticket&id={{d.dispatchorderid}}&orderId={{d.ordercode}}">{{d.fromordercode||d.ordercode}}</a></td>'
                + '<td>{{d.outcode}}</td>' + 
                '<td>{{d.ownerrealname}}</td>'+
            '<td>{{d.from}}--{{d.to}}</td>' + 
            '<td>{{d.goodsname}}<br/>{{d.goodsSpaceW}}{{d.goodsSpaceV?"/"+d.goodsSpaceV:""}}</td>' + 
            '<td>应收:{{d.feein}}<br/>应付:{{d.feeout}}&nbsp;&nbsp;</td>' + 
            '<td>{{d.inputdate}}</td>' + 
            '<td>{{d.updatedate}}</td>'+
            '</tr>' + '{{/each}}';
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",//列表查询
            "click #searchReset": "forReset",//查询表单重置
            "click .all-check":"checkAll",//全选
            "click #uploadBill":"uploadBill",//开票
            "click .showBig":"showBig",//查看大图
            "change #filedata":"uploadImg",//上传图片
            "click .deleteImg":"deleteImg"//删除图片
        },
        searchSubmit:function(){
            //查询，直接调用会影响到this
            this.getData();
        },
        forReset: function () {
            //表单重置
            $("#searchForm")[0].reset();
        },
        checkAll:function(e){
            //列表全选和取消全选
            if($('.all-check').is(':checked')){
                $('#ajaxCont input[type="checkbox"]').each(function(){
                    $(this).prop('checked',true)
                })
            }else{
                $('#ajaxCont input[type="checkbox"]').each(function(){
                    $(this).prop('checked',false)
                })
            }

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

            //获取列表数据
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
        //列表展示数据格式调整
        dataTeas: function (d) {
            $.each(d.data, function (i, e) {
                //运输信息
                e.from = e.fromprovince + e.fromcity + e.fromregion;
                e.to = e.toprovince + e.tocity + e.toregion;

                //货物信息
                e.goodsSpaceW = (e.goodsweightmin ? (e.goodsweightmin + "吨") : "");
                e.goodsSpaceV = (e.goodsvolumemin ? (e.goodsvolumemin + "立方") : "");

               
            });
            return d;
        },
       
        uploadBill:function(e){
            //上传开票信息弹窗
            var _this=this;
            var inputCheck=$("#ajaxCont").find("input:checked"),dispatchorderids="";//选中input，element列表
            if(inputCheck.length<1){
                alertMsg('请勾选需开票订单')
                return;
            }
            var name=inputCheck.eq(0).data("name"),money=0;
            $.each(inputCheck,function(i,e){
                money+=parseFloat($(e).data("money"))
                dispatchorderids+=","+$(e).data("value")
            });
            //弹窗
            new Pop({
                    title:"上传开票信息",
                    type:"iframe",
                    otherClass:"un-ticket",
                    click:"other",
                    html:'<div  class="deal-form"><form id="dealForm">' +
                    '<input type="hidden" name="dispatchorderids" value="'+dispatchorderids.slice(1)+'">'+
                    '<div class="input-line">' +
                    '<span class="input-title">单位名称:</span>' +
                    '<input type="text" class="t-c-input input-width1" value="'+name+'" placeholder="" name="company" id="dealNumber" maxlength="100"/>' +
                    '</div>'+
                    '<div class="input-line">' +
                    '<span class="input-title">开票金额:</span>' +
                    '<input type="text" class="t-c-input input-width2"  value="'+money.toFixed(2)+'" id="receiptdate" placeholder="" name="voucheramount"  />' +
                    '<span class="input-title">开票时间:</span>' +
                    '<input type="text" class="t-c-input input-width2" id="receiptdate" value="'+laydate.now("0","YYYY-MM-DD hh:mm:ss")+'" onClick="laydate({format: \'YYYY-MM-DD hh:mm:ss\',istime: true,max:laydate.now()})" placeholder="" name="voucherdate"  />' +
                    '</div>'+
                    '</form>'+
                    '<div class="input-line" id="iframeImgList"  style="position:relative;">' +
                    '<span class="input-title">上传单据:</span>' +
                    '<span class="iframe-add-img" id="iframeAddImg" >+'+
                    '<form >'+
                    '<input type="file" name="filedata" id="filedata" class="iframe-add-img iframe-input">'+
                    '</form>'+
                    '</span>'+
                    '<div class="img-tips">仅支持JPG/JPEG/PNG格式的图片，且文件大小不能超过5M</div>'+
                    '</div></div>',
                    footer: [{
                        text: '保存',
                        click: function (pop) {
                            _this.postForm(pop);
                        }
                    },{
                        text: '取消'
                    }]
                }).init();
             
        },
        postForm:function(pop){
            //上传开票表单
            var _this=this;
            var data=$("#dealForm").serializeObject();
            data.voucherimgurl=[];//上传图片url的Arr

            $("#iframeImgList .iframe-img-list").each(function(e){
                data.voucherimgurl.push($(this).find("img").attr("src"))
            })
            //至少上传一张
            if(data.voucherimgurl.length<1){
                 new Pop({
                    type: "pop",
                    content: '请上传至少一张图片',
                    callType: "fail"
                }).init();
                return;
            }
            data.voucherimgurl=data.voucherimgurl.join(",");

            //提交开票数据
             getJsonp({
                url: apiUrl.saveVoucher,
                data: data,
                callback: function (data) {

                    if (data.result == "success") {
                         new Pop({
                            type: "pop",
                            content: data.msg,
                            callType: "success"
                        }).init();
                         //重新加载当前页面列表数据
                         _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                        pop.remove();
                    } else {
                         new Pop({
                            type: "pop",
                            content: data.msg,
                            callType: "fail"
                        }).init();
                    }
                }
            });
        },
        uploadImg:function(e){
            //  图片上传功能绑定
            var formData = new FormData($(e.currentTarget).closest("form")[0]);
            $.ajax({
                url: apiUrl.uploadImg,
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (returndata) {
                   // console.log("success:",returndata)
                    var $this=$("#iframeAddImg")
                    $("#filedata").val("")
                    if($(".iframe-img-list").length==3){
                        $this.hide()
                    }
                    $this.before('<span class="iframe-img-list"><label class="deleteImg"></label><a href="javascript:" class="showBig"></a><img src="'+returndata.data.imgurl+'" /></span>')
                },
                error: function (returndata) {
                    console.log("error:",returndata)
                }
            });
        }, 
        deleteImg:function(e){
            //删除已上传的图片
             $(e.currentTarget).closest(".iframe-img-list").remove();
                if($(".iframe-img-list").length<4){
                    $("#iframeAddImg").show()
                }
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
            //设置大图的高和宽
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
