/*
 * 业务中心公用
 * */
var map;
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            //组件事件

            this.getData();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",
            "click .delAgent": "delAgent",
            "click #addAgent": 'addAgent',
            "click .close_btn": "closePopup",
            "click .clearInfo": "clearInfo",
            "click #searchAgent": "searchAgent",
            "click .addAgentItem": "addAgentItem"
        },
        searchSubmit:function(){
            this.getData();
        },
        getData: function (page) {
            var searchData = $("#searchForm").serializeObject();
            var _this=this;

            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)

            var url = apiUrl.selectDispatchRelationList;
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
                    // d=tradeCommonFun.dataMobileHandle(d,"mobilenumber");
                    var source = '{{each data as d i}}'
                        + '{{if i%2==0}}'
                        + '<tr class="t-table-single">' +
                        '{{else}}' +
                        '<tr>' +
                        '{{/if}}'
                        + '<td>{{d.agentrealname}}</td>'
                        + '<td>{{d.agentlinkname}}</td>'
                        + '<td>{{d.agentmobilenumber}}</td>'
                        // + '<td>{{d.inputdate}}</td>'
                        + '<td><a href="javascript:void(0)" class="delAgent" data-id={{d.dispatchrelationid}}>删除</a></td>'
                        + '</tr>'
                        + '{{/each}}';

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
        delAgent: function (e) {
            var c = $(e.target);
            var _this = this;
            new Pop({
                content: "确认删除该承运商？",
                callType: "success",
                footer: [{
                    text: '确定',
                    click: function () {
                        getJsonp({
                            url: apiUrl.deleteDispatchRelation,
                            data: {
                                dispatchrelationid: c.attr('data-id')
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
        refresh: function () {
            window.location.href = "./driverProviders.html";
        },
        addAgent: function () {
            $('#popup2').show();
        },
        addAgentItem: function (e) {
            var c = $(e.target);
            var _this = this;
            getJsonp({
                url: apiUrl.insertDispatchRelation,
                data: {
                    dispatchagentid: c.attr('data-dispatchagentid')
                },
                callback: function (d) {
                    if ('success' != d.result) {
                        alertMsg(d.msg);
                        return;
                    }
                    //关闭
                    // _this.closePopup();
                    _this.refresh();
                }
            })
        },
        clearInfo: function () {
            $("#agentFrom input").each(function () {
                $(this).val("");
            });
            $("#ajaxCont2").html('');
        },
        closePopup: function (e) {
            var $this = $(e.currentTarget);
            $this.parents('.popup').hide()
            $('.pop-cl').hide();
            this.clearInfo();
        },
        searchCheck: function () {
            return $('[name="keywords2"]').val() == "" ? false : true;
        },
        searchAgent: function () {
            if (!this.searchCheck()) {
                alertMsg('请输入企业/个人名');
                return;
            }
            var paegSize = 10;
            var keywords = $('[name="keywords2"]').val();
            var params = {
                url: apiUrl.selectDispatchAgentList,
                data: {
                    realname: keywords,
                    skipcount: 0,
                    pagesize: 100
                },
                callback: function (d) {
                    if ('success' != d.result) {
                        alertMsg(d.msg)
                        return;
                    }
                    // if (d.count == 0) {
                    //     $(".no-model").remove();
                    //     $(".popup2").append(tradeCommonFun.creatNodata());
                    //     $('#ajaxCont2,#Pagination2').html("");
                    //     return;
                    // } else {
                    //     $(".no-model").remove();
                    // }
                    var source = '{{each data as d i}}'
                        + '{{if i%2==0}}'
                        + '<tr class="t-table-single">' +
                        '{{else}}' +
                        '<tr>' +
                        '{{/if}}'
                        + '<td>{{d.realname}}</td>'
                        + '<td>{{d.mobilenumber}}</td>'
                        + '<td><a href="javascript:void(0)" class="addAgentItem" data-dispatchagentid ={{d.dispatchagentid}} >添加</a></td>'
                        + '</tr>'
                        + '{{/each}}';
                    var render = template.compile(source);
                    var html = render(d);
                    $('#ajaxCont2').html(html);
                    // tradeCommonFun.createPage({
                    //     count: d.count,
                    //     pageSize: paegSize,
                    //     callback: function (skipcount) {
                    //         searchData.skipcount = skipcount;
                    //         getJsonp({
                    //             url: url,
                    //             data: searchData,
                    //             callback: function (d) {
                    //                 var html = render(d);
                    //                 $('#ajaxCont2').html(html);
                    //             }
                    //         });
                    //     }
                    // });
                }
            };
            getJsonp(params);
        }
    });
    new tradeFun({
        $el: $('.body-content')
    });
});

function callback(d) {
    console.log(d);
}
