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
            *货主订单汇总：ownerOrder
            *货主财务汇总：ownerMoney
            *承运商订单汇总：agentOrder
            *承运商财务汇总：agentMoney
            */
            this.type = this.base.getUrlParam("type")||"ownerOrder";

            //表格展示的文字对象
            this.tableObj={
                //货主订单汇总
                ownerOrder:{
                    title:"订单汇总表",//页面标题
                    chartName:"订单数汇总图",//图表标题
                    units:"单",//图表显示的单位
                    th:"待调度订单数,在途订单数,完成订单数,待对账订单数,待付款订单数,已付款订单数,订单总数",//表格表头
                    url:apiUrl.ownerSelectSummaryOrder,//数据api
                    td:"orderamount,onorderamount,offorderamount,checkorderamount,onpayorderamount,offpayorderamount,sumorderamount"//数据返回的使用字段
                },
                //货主财务汇总
                ownerMoney:{
                    title:"财务汇总表",
                    chartName:"财务汇总图",
                    units:"元",
                    th:"待对账金额,待付款金额,已付款金额",
                    url:apiUrl.ownerSelectSummaryOrderfee,
                    td:"checkmoney,onpaymoney,offpaymoney"
                },
                //承运商订单汇总
                agentOrder:{
                    title:"订单汇总表",
                    chartName:"订单汇总图",
                    units:"单",
                    th:"待调度订单数,在途订单数,完成订单数,订单总数",
                    url:apiUrl.selectSummaryOrder,
                    td:"orderamount,onorderamount,offorderamount,sumorderamount"
                },
                //承运商财务汇总
                agentMoney:{
                    title:"财务汇总表",
                    chartName:"财务汇总图",
                    units:"元",
                    th:"应收金额,已收金额,待收金额,待对账金额,待付款金额,已付款金额",
                    url:apiUrl.selectSummaryOrderfee,
                    td:"summoney,offmoney,onmoney,checkmoney,onpaymoney,offpaymoney"
                }
            };
            this.useObj=this.tableObj[this.type];//选用的页面数据对象
            this.chartDate=[];//图表实用数据
            
            this.getData()

        },
        getData: function (page) {
            //获取页面数据
            var _this = this;
            
            getJsonp({
                url: this.useObj.url,
                callback: function (data) {
                    if (data.result == "error") {
                        alertMsg(data.msg);
                        return;
                    }
                    _this.changeHtml(_this.useObj,data.data);
                    _this.showTabel();
                }
            });
        },
        /*
        *@params {htmlObj} 页面静态对象
        * 
         */
        changeHtml:function(htmlObj,data){
            //更改页面标题及表格
            var thArr=htmlObj.th.split(","),thHtml="",width=950/thArr.length;
            var tdArr=htmlObj.td.split(","),tdHtml="";
            for(var i=0,l=thArr.length;i<l;i++){
                thHtml+='<th style="width:'+width+'px;">'+thArr[i]+'</th>'
                tdHtml+='<td>'+data[tdArr[i]]+'</td>';
                this.chartDate.push(data[tdArr[i]])
            }


            $("#subTilte").html(htmlObj.title);
            $("#tableTitle tr").html(thHtml);
            $("#ajaxCont").html(tdHtml);
        },
        showTabel:function(){
            //生成图表
            var myChart = echarts.init(document.getElementById('main'));
            var tableObj=this.useObj

            // 指定图表的配置项和数据
            var option = {
                    color: ['#3398DB'],
                    title:{
                        text:tableObj.chartName,
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
                            data : tableObj.th.split(","),
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
                            name:tableObj.units,
                            type:'bar',
                            barWidth: '60%',
                            data:this.chartDate
                        }
                    ]
                };

            myChart.setOption(option);
            
        }
    });
    var obj = new tradeFun({
        $el: $('body')
    });


});
