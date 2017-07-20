/*
* 业务中心公用
* */
$(function () {
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {
            this.ajaxIng = false;
            /* this.setCookie();*/
            var partyStr = iLocalStorage.getItem('DispatchRole');
            var Role = partyStr ? JSON.parse(partyStr) : '';

            this.allcheck = []
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
            this.bidtype = getParamVal('type') == 'pai' ? 0 : 1
            $('[name="bidtype"]').val(this.bidtype)
            this.dataList()
            if (this.bidtype == 0) {
                $('.bulk-2').addClass('cur').siblings().removeClass('cur')
            } else {
                $('.bulk-3').addClass('cur').siblings().removeClass('cur')
            }
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #release": 'releaseGoods',
            "keyup #releaseForm": "releaseCheck",
            "click #invaliddateshow": 'invaliddate',
            "click .normal-tips-li": 'addTips',
            "click .choose-type": 'chooseType',
            "change #upload-excel": 'filename',
            "click .all-check": "allCheck",
            "click .checkbox-list": "evenCheck",
            "click .delete-excel": "deleteData",
            "click .submit-excel": "submitData",
            "click .change-excel": "changeData",
            "click .downexcel": "downExcel",
        },
        downExcel: function () {
           /* if (this.bidtype == 0) {
                window.location.href = '../../download/批量下单模板(派单).xlsx'
            } else {
                window.location.href = '../../download/批量下单模板(竞价).xls'
            }*/
             window.location.href = '../../download/批量导入货源模板.xlsx'
        },
        filename: function (e) {
            var _this = this
            var $this = $(e.currentTarget)
            var filePath = $this.val();
            var arr = filePath.split('\\');
            var fileName = arr[arr.length - 1];
            $(".showFileName").html(fileName);
            // $this.closest('form').attr('action',apiUrl.importDispatchGoodsSourceTmpList)
            // setTimeout($this.closest('form').submit()
            // ,500)
            // var submitData=$("#excel-up").serializeObject();
            var options = {
                url: apiUrl.importDispatchGoodsSourceTmpList,
                type: 'post',
                dataType: 'json',// 期望返回类型 json, xml
                success: function (data) {
                    if (data.result == 'error') {
                        alertMsg(data.code)
                    } else {
                        alertMsg(data.msg)
                        $("#upload-excel").val("")
                        _this.dataList()
                    }
                }
            };
            $("#excel-up").ajaxSubmit(options);

        },
        //自定义方法
        changeData: function () {
            var _this = this
            var d = ''

            if (this.allcheck.length >1) {
                alertMsg('只能选一个')
                return
            } else if(this.allcheck.length ==0){
                alertMsg('选一个修改')
                return
            }
            $('#ajaxCont input[type="checkbox"]').each(function () {
                if ($(this).is(':checked')) {
                    d = $(this).attr('data-data')
                }
            })
            iLocalStorage.setItem('againgoods', d, 1);
            window.location.href = "goodsRelease.html?againgoods=true&piliang=true"
        },
        submitData: function () {
            $('.load').show()
            var _this = this
            if (this.allcheck.length < 1) {
                alertMsg('请勾选需提交的货源')
                return
            } else {
                getJsonp({
                    url: apiUrl.publishDispatchGoodsSource,
                    data: {
                        dispatchgoodssourcetmpids: _this.allcheck.join(",")
                    },
                    callback: function (d) {
                        $('.load').hide()
                        if (d.result != 'success') {
                            alertMsg(d.msg)
                            return
                        } else {
                            _this.allcheck=[];
                            _this.dataList()
                            new Pop({
                                footer: [
                                    {
                                        text: '取消',
                                        click: function () {

                                        }
                                    }, {
                                        text: '确定',
                                        click: function () {
                                            $('.all-check').prop('checked', false)
                                            $('#ajaxCont input[type="checkbox"]').each(function () {
                                                $(this).prop('checked', false)
                                            })
                                            location.reload()
                                        }
                                    }
                                ],
                                type: "iframe1",
                                content: d.msg,
                                callType: "success"
                            }).init()
                            // _this.dataList()


                        }
                    }
                })
            }
        },
        deleteData: function () {
            var _this = this
           
            if (this.allcheck.length < 1) {
                alertMsg('请勾选需删除的货源')
                return
            } else {
                new Pop({
                    footer: [
                        {
                            text: '取消',
                            click: function () {

                            }
                        }, {
                            text: '确定',
                            click: function () {
                                getJsonp({
                                    url: apiUrl.deleteDispatchGoodsSourceTmp,
                                    data: {
                                        dispatchgoodssourcetmpids: _this.allcheck.join(",")
                                    },
                                    callback: function (d) {
                                        if (d.result != 'success') {
                                            alertMsg(d.msg)
                                            return
                                        } else {
                                            _this.allcheck=[];
                                            _this.dataList()
                                            new Pop({
                                                type: "pop",
                                                content: "批量删除成功",
                                                callType: "success"
                                            }).init();
                                        }
                                    }
                                })
                            }
                        }
                    ],
                    type: "iframe1",
                    content: "删除后需要重新导入，是否删除？",
                    callType: "success"
                }).init()

            }
        },
        allCheck: function (e) {
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
        evenCheck: function (e) {
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
        dataList: function (page) {
            var _this=this
            var searchData = {
                bidtype: this.bidtype
            }
            searchData.pagesize = this.pageSize;

            searchData.skipcount = this.pageSize*(page||0)
            getJsonp({
                url: apiUrl.selectDispatchGoodsSourceTmpList,
                data: searchData,
                callback: function (d) {
                    if (d.result != 'success') {
                        alertMsg(d.msg)
                        return
                    }
                    var source = '{{each data as d i}}'
                        + '{{if i%2==0}}'
                        + '<tr class="t-table-single">' +
                        '{{else}}' +
                        '<tr>' +
                        '{{/if}}'
                        + '<td>{{#d | checkCreate}}</td>'
                        + '<td>{{d.ownerlinkman}}</td>'
                        + '<td>{{d.ownerlinkphone}}</td>'
                        + '<td>{{#d | address:"from"}}</td>'
                        + '<td>{{d.fromdetail}}</td>'
                        + '<td>{{d.consigneelinkman}}</td>'
                        + '<td>{{d.consigneemobilenumber}}</td>'
                        + '<td>{{#d | address:"to"}}</td>'
                        + '<td>{{d.todetail}}</td>'
                        + '</tr>'
                        + '{{/each}}';
                    template.helper('checkCreate', function (data, type) {
                        var str = ''
                        str = "<input type='checkbox' class='checkbox-list'  data-data='" + JSON.stringify(data) + "' data-value='" + data.dispatchgoodssourcetmpid + "'>"
                        return str
                    })
                    template.helper('address', function (data, type) {
                        var str = ''
                        if (type == 'from') {
                            str = data.fromprovince + "-" + data.fromcity + (data.fromregion ? ("-" + data.fromregion) : "")
                        } else {
                            str = data.toprovince + "-" + data.tocity + (data.toregion ? ("-" + data.toregion) : "")
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
                        count: d.count,
                        page:page||0,
                        pageSize: _this.pageSize,
                        callback: function (page,pageSize) {
                            _this.pageSize=pageSize
                            _this.dataList(page)
                        }
                    });
                }
            })
        },
    });
    var obj = new tradeFun({
        $el: $('.body-content')
    });
});
function chenlei(x) {
    console.log(x)
}