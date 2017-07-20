/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20;//本地分页存储
            $("#starttime").val(moment().subtract(0,"month").format("YYYY-MM"));//设置默认查询日期
            this.source = '{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}'
                + '<td  class="goods-table-address">{{d.date}}</td>'+ 
            '<td>{{d.agentrealname}}</td>' + 
            '<td>{{d.agentmobilenumber}}</td>' + 
            '<td>{{d.orderamount}}</td>' + 
            '<td>{{d.money}}</td>'+
            '</tr>{{/each}}';//模板
            this.creatMonth();

            this.getData()
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #searchSubmit": "searchSubmit",
            "click #export": "export",
        },
        searchSubmit:function(){
            //查询
            this.getData();
        },
        creatMonth:function(){
             //月份选项
            var monthNow=new Date(),selectHtml="";
            for(var i=0;i<100;i++){
                selectHtml+="<li>"+moment().subtract(i,"month").format("YYYY-MM")+"</li>"
            }
            $("#timeStart,#timeEnd").html(selectHtml)
            tradeCommonFun.selectModal();
        },
        //自定义方法
        getData: function (page) {
            var _this = this;
            var searchData = $("#searchForm").serializeObject();
          
            //时间参数修改
            if(searchData.time){
                searchData.startdate=searchData.time+"-01"
                searchData.enddate=moment(searchData.time).add("1","months").subtract(1,"days").format("YYYY-MM-DD")
            }
            delete searchData.time;
            searchData.pagesize = this.pageSize;
            searchData.skipcount = this.pageSize*(page||0)
            
            //获取列表
            getJsonp({
                url: apiUrl.ownerSelectOrder,
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
      
        export:function(){
            //导出表格
            var str=""
            var searchData = $("#searchForm").serializeObject();
            if(searchData.time){
                searchData.startdate=searchData.time+"-01"
                searchData.enddate=moment(searchData.time).add("1","months").subtract(1,"days").format("YYYY-MM-DD")
            }
            delete searchData.time;
            for(var x in searchData){
                str+="&"+x+"="+searchData[x]
            }
            window.location.href=apiUrl.ownerExportDispatchStatement+"?"+str.slice(1)
        }
    });
    var obj = new tradeFun({
        $el: $('body')
    });


});
