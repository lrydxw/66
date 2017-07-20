/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.base = new transfar.Base();
            /*type显示类型
            *货主订单报表：ownerReport
            *货主运费支付报表：freightReport
            *承运商订单报表：agentReport
            */
            this.type = this.base.getUrlParam("type")||"ownerReport";


            /*format显示类型
            *日报表：day
            *月报表：month
            *年报表：year
            */
            this.format=this.base.getUrlParam("format")||"day"

            //模板
            this.source ='{{each data as d i}}'
                + '{{if i%2==0}}'
                + '<tr class="t-table-single">' +
                '{{else}}' +
                '<tr>' +
                '{{/if}}';//
             //表格展示的文字对象
            this.tableObj={
                //货主订单报表
                ownerReport:{
                    title:"订单报表",//页面标题
                    chartName:"订单运费折线图",//图表标题
                    th:"日期,发货数,运费总额",//表格表头
                    url:apiUrl.ownerSelectOrderfee,//请求数据源
                    tdSource:this.source+'<td>{{d.date}}</td>'+
                            '<td>{{d.orderamount}}</td>'+
                            '<td>{{d.money}}</td>'+
                            '</tr>{{/each}}',//表格html源
                    pageSize:10//分页
                },
                //货主运费支付报表
                freightReport:{
                    title:"运费支付报表",
                    chartName:"运费支付折线图",
                    th:"日期,支付订单数,支付运费金额",
                    url:apiUrl.ownerSelectOrderfee,
                    tdSource:this.source+'<td>{{d.date}}</td>'+
                            '<td>{{d.orderamount}}</td>'+
                            '<td>{{d.money}}</td>'+
                            '</tr>{{/each}}',
                    pageSize:10
                },
                //承运商订单报表
                agentReport:{
                    title:"订单报表",
                    chartName:"订单运费折线图",
                    th:"日期,订单数",
                    url:apiUrl.selectOrder,
                    tdSource:this.source+'<td>{{d.date}}</td>'+
                            '<td>{{d.orderamount}}</td>'+
                            '</tr>{{/each}}',
                    pageSize:10
                }
            };

            this.switchFormat();//根据type 显示顶部tab样式 及时间查询格式
            this.useObj=this.tableObj[this.type];//选用的页面数据对象
            this.data={};//缓存的列表数据，产品要求一次显示所有数据
            this.getData();//获取数据

        },
        events: {
            //绑定事件
            "click #searchSubmit": "searchSubmit",//查询
            "click #export": "export",//导出
        },
        searchSubmit:function(){
            //查询报表
            if($("#starttime").val()>$("#endtime").val()){
                alertMsg("结束时间要大于开始时间")
            }
            this.getData();
        },
        switchFormat: function () {
            //根据type 显示顶部tab样式 及时间查询格式
            
            var _this=this; 
            var selectHtml="",//时间选项
                startTime="",//默认开始时间
                endTime="";//默认结束时间
            //修改页面tab的url加上type参数
            $("#t-sub-title a").each(function(){
                //左侧导航选中需要匹配参数顺序 否则不显示选中
                $(this).attr("href",$(this).attr("href").split("?")[0]+"?type="+_this.type+"&"+$(this).attr("href").split("?")[1])
            });
            //设置选中tab样式
            $("#t-sub-title [format='"+this.format+"']").addClass("current");
            if(this.format=="day"){
                //日报表显示日期选择器
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
                startTime=moment().subtract(29,"days").format("YYYY-MM-DD");
                endTime=moment().format("YYYY-MM-DD");
                $(".input-option").remove();//移除selec后面的ul元素
            }else if(this.format=="month"){
                //月份选项
                for(var i=0;i<100;i++){
                    selectHtml+="<li>"+moment().subtract(i,"month").format("YYYY-MM")+"</li>"
                }
                $("#timeStart,#timeEnd").html(selectHtml)
                tradeCommonFun.selectModal();
                startTime=moment().subtract(12,"months").format("YYYY-MM");
                endTime=moment().format("YYYY-MM");
            }else if(this.format=="year"){
                for(var i=0;i<8;i++){
                    selectHtml+="<li>"+moment().subtract(i,"year").format("YYYY")+"</li>"
                }
                $("#timeStart,#timeEnd").html(selectHtml)
                tradeCommonFun.selectModal();
                startTime=moment("2016-01-01").format("YYYY");
                endTime=moment().format("YYYY");
            }
                $("#starttime").val(startTime)
                $("#endtime").val(endTime)
        },
        getData: function () {
            //获取查询数据
            var _this = this;
            var data=this.searchData();

            if(this.format=="day"&&moment(data.startdate).add("1000","days")-moment(data.enddate)<0){
                alertMsg("最多不能查询超过1000数据");
                return;
            }
            //图表原因，数据一次性获取
            data.pagesize=1000;
            data.skipcount=0;

            getJsonp({
                url: this.useObj.url,
                data:data,
                callback: function (d) {
                    if (d.result == "error") {
                        alertMsg(d.msg);
                        return;
                    }
                    _this.setTh(_this.useObj);
                    //输入订单总数
                    if(_this.type=="agentReport"){
                        $("#reportTotal").html("订单总数:"+d.data[0].orderamountsum+"单")
                    }else{
                        _this.getTotal(data.startdate,data.enddate)//获取货主的订单总数
                    }
                    _this.data=d;
                    _this.tableList({count:d.count,data:d.data.slice(0,_this.useObj.pageSize)},0)
                    _this.showTabel(d);//展示图标
                }
            });
           
        },
        tableList:function(d,page){
            //请求数据分页展示
            var _this = this;
            var render = template.compile(this.useObj.tdSource);
            var html = render(d);
            $('#ajaxCont').html(html);
            tradeCommonFun.createPage({
                    count: d.count,
                    page:page||0,
                    pageSize:_this.useObj.pageSize,
                    showPage:3,
                    callback: function (page,pageSize) {
                        _this.pageSize=pageSize
                        _this.tableList({
                            count:d.count,
                            data:_this.data.data.slice(_this.useObj.pageSize*page,_this.useObj.pageSize*page+_this.useObj.pageSize)//根据分页 截取缓存中的data
                        },page)
                    }
                });
                    //隐藏页脚的单页展示条数选项 及首页 尾页展示
                    $(".report-page span[class='prev'],.report-page a[page='0'],.report-page span[class='next']").hide()
                    $(".report-page .next").next().hide()
        },
        /*
        *@params {htmlObj} 页面静态对象
        * 
         */
        setTh:function(htmlObj){
            //更改页面标题及表格
            var thArr=htmlObj.th.split(","),thHtml="",width=442/thArr.length;
            for(var i=0,l=thArr.length;i<l;i++){
                thHtml+='<th style="width:'+width+'px;">'+thArr[i]+'</th>'
            }
            $("#tableTitle tr").html(thHtml);//表格th设置
        },
        showTabel:function(data){
            //生成图表
            var myChart = echarts.init(document.getElementById('main'),"macarons");
            var xAxis=[],chartData=[],chartDataMoney=[];

            //生成图标的x轴和y轴数据
            $.each(data.data,function(i,e){
                xAxis.push(e.date)
                chartData.push(e.orderamount)
                if(this.type!="agentReport"){
                    chartDataMoney.push(e.money)
                }
            })

            // 指定图表的配置项和数据
            var option = {
                    color: ['#3398DB'],
                    title:{
                        text:this.useObj.chartName,
                        left: 'center'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top:"10%",
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : xAxis,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:this.useObj.th.split(",")[1],
                            type:'line',
                            barWidth: '60%',
                            yAxisIndex: 0,
                            smooth: true,
                            data:chartData
                        }
                    ]
                };
                //货主的报表有两组Y轴
                if(this.type!="agentReport"){
                    option.yAxis[1]={
                            type : 'value'
                        };
                    option.series[1]={
                            name:this.useObj.th.split(",")[2],
                            type:'line',
                            barWidth: '60%',
                            yAxisIndex: 1,
                            smooth: true,
                            data:chartDataMoney
                        };
                }

            myChart.setOption(option);
            
        },
        getTotal:function(start,end){
            //获取货主的报表总数
            getJsonp({
                url:apiUrl.ownerSelectOrderfeeSum,
                data:{
                    datetype:this.type=="freightReport"?1:0,
                    startdate:start,
                    enddate:end
                },
                callback:function(data){
                    if(data.result=="success"){
                        $("#reportTotal").html("订单总数:"+data.data.sumorderamount+"单&nbsp;&nbsp;运费总额："+data.data.summoney+"元")
                    }
                }
            })
        },
        searchData:function(){
            //计算查询表单
            var data={},start=$("#starttime").val(),end=$("#endtime").val();
            //年月日参数的区分
            if(this.format=="day"){
                data={
                    statementtype:0,
                    startdate:start+" 00:00:00",
                    enddate:end+" 23:59:59"
                };
            }else if(this.format=="month"){
                data={
                    statementtype:1,
                    startdate:start+"-01 00:00:00",
                    enddate:moment(end+"-01").add("1","months").subtract(1,"days").format("YYYY-MM-DD")+" 23:59:59",
                };
            }else{
                data={
                    statementtype:2,
                    startdate:start+"-01-01 00:00:00",
                    enddate:moment(end+"-01-01").add(1,"years").subtract(1,"days").format("YYYY-MM-DD")+" 23:59:59",
                };
            }
            if(this.type!="agentReport"){
                //货主区分订单报表和运费支付报表 额外字段
                data.datetype=this.type=="freightReport"?1:0
            }
            /*data.pagesize=this.useObj.pageSize;
            data.skipcount=this.useObj.pageSize*page;*/
            return data;
        },
         export:function(){
            //导出表格
            
            var str=""
            var searchData = this.searchData();
            delete searchData.pagesize;
            delete searchData.skipcount;
            for(var x in searchData){
                str+="&"+x+"="+searchData[x]
            }
            if(this.type=="agentReport"){
                window.location.href=apiUrl.exportDispatchStatement+"?"+str.slice(1)
            }else{
                window.location.href=apiUrl.ownerExportDispatchStatement+"?"+str.slice(1)
            }
            
        }
    });
    var obj = new tradeFun({
        $el: $('body')
    });


});
