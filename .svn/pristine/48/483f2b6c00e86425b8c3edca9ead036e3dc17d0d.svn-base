var data=[{}]
$(function(){
	//功能对象
	var objfun = transfar.Base.extend({
	    //初始化
	    initialize: function () {
	        //用于列表
	        this.loadData = {};
	        this.loadData.data = [];//记录已加载数据 结构与返回data一致
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
	        this.getData();
	        this.allcheck=[]
	        //用于详情
	       // this.initData();
		   //this.render(r);
	    },
	    //添加事件（基于委托，绑定动态加载元素）
	    events: {
	        'click .li-btn': 'getData',
	        'click .month-btn': 'initData',
	        "change #insertOrder":"uploadFile",
	        "click #saveOrder":"commit",
            "click .all-check":"allCheck",
            "click .checkbox-list":"evenCheck",
            "click .delete":"deletefun"
	    },
	    //自定义方法
	    //demo方法 详情型
	    initData:function(){
	    	var _this = this;//_this方便callback中调用
	    	var param = {};
		    param.url = apiUrl.xxx;
		    param.data ={
		    	'xxid':xxid
		    }
		    param.callback = function(data){
		        if(data.result != 'success'){
		            alertMsg(data.msg);
		            return;
		        }else{
		        	if(!data.data){
		        		return;
		        	}
		        	var r = data.data;
		        	//具体实现
		        	_this.render(r);
		        	//artTemplate模板加载数据
		        	//尽量用js模板加template()方法形式
		        }
		    }
		    param.errorCallback = function(){
		    	alertMsg(commonMsg.net_error);
		    }
		    getJsonp(param);
	    },
		  getData: function (page) {
            var _this = this;
		  	var source= '{{each data as d i}}'
                            +'{{if i%2==0}}'
                            +'<tr class="t-table-single">' +
                            '{{else}}' +
                            '<tr>'+
                            '{{/if}}'
                            +'<td><input type="checkbox" class="checkbox-list"  data-value="{{d.dispatchordertmpid}}"></td>'
                            +'<td>{{d.ownerlinkman}}</td>'
                            +'<td>{{d.ownerlinkphone}}</td>'
                            +'<td>{{d.from}}</td>'
                            +'<td>{{d.fromdetail}}</td>'
                            +'<td>{{d.consigneelinkman}}</td>'
                            +'<td>{{d.consigneemobilenumber}}</td>'
                            +'<td>{{d.to}}</td>'
                            +'<td>{{d.todetail}}</td>'
                            +'<td><a href="./addOrder.html?type=change&id={{d.dispatchordertmpid}}" target="_blank">修改</a><a href="javascript:" class="delete" data-id="{{d.dispatchordertmpid}}">删除</a></td>'
                            + '</tr>'
                            + '{{/each}}';
            var data = {
	            'skipcount': this.pageSize*(page||0),
	            'pagesize' : this.pageSize
	        }
            //获取列表
            getJsonp({
                url: apiUrl.selectDispatchOrderTmpList,
                data: data,
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

                    d=_this.dataTeas(d);
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
                            _this.getData(page)
                        }
                    });
                }
            });
        },
        //数据梳理,
        dataTeas:function(d){
            $.each(d.data,function(i,e){
                e.from=e.fromprovince+"-"+e.fromcity+(e.fromregion?"-"+e.fromregion:"");
                e.to=e.toprovince+"-"+e.tocity+(e.toregion?"-"+e.toregion:"");
                e.fromSub=tradeCommonFun.stringFilter(e.from,15);
                e.toSub=tradeCommonFun.stringFilter(e.to,15);
                if(e.carlengthmin&&e.carlengthmax){
                    e.carleng=e.carlengthmin+"-"+e.carlengthmax+"米,";
                }else{
                    e.carleng="";
                }
                e.goodsSpecialInfo=(e.goodsname||e.goodstype)+","+((e.goodsweight?(e.goodsweight+"吨"):"")||(e.goodsweightmax?(e.goodsweightmax+"吨"):""))+","+
                    e.carleng +e.carstructrequire;
                e.goodsSpecialInfo=e.goodsSpecialInfo.replace(/,,,|,,/g,",").replace(/(^,|,$)/g,"");
                e.goodsSpecialInfoSub=tradeCommonFun.stringFilter(e.goodsSpecialInfo,26);
                e.tradefacility = e.tradefacility || ("基地外" == e.site ? e.elescreen : e.site+e.elescreen);
                e.tradefacilitySub=tradeCommonFun.stringFilter(e.tradefacility,22);
            });
            return d;
        },
		dosomething:function(e){
			var domThis = $(e.currentTarget);//当前元素
		},
		uploadFile:function(e){
			var _this=this;
			e.preventDefault()
            var formData = new FormData($("#"+e.target.id).closest("form")[0]);
            $.ajax({
                url: apiUrl.importDispatchOrderTmpList,
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (d) {
                    if(d.result=="success"){
                        new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "success"
                        }).init();
                        $("#"+e.target.id).val("")
                        _this.getData(0)
                    }else{
                         new Pop({
                            type: "pop",
                            content: d.msg,
                            callType: "fail"
                        }).init();
                    }
                },
                error: function (returndata) {
                    console.log("error:",returndata)
                }
            });
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
		commit:function(){
            var _this=this
			//提交订单

            if (this.allcheck.length < 1) {
                alertMsg('请勾选需提交的订单')
                return
            } else {
    			 getJsonp({
                    url: apiUrl.saveDispatchOrder,
                    data: {
                       dispatchordertmpids:this.allcheck.join(",") 
                    },
                    callback: function (d) {
                        if (d.result == "error") {
                            alertMsg(d.msg);
                            return;
                        }
                        var listArr=_this.allcheck;
                        for(var i=0;i<listArr.length;i++){
                            $(".delete[data-id='"+listArr[i]+"']").closest("tr").remove();
                        }
                        alertMsg(d.msg);
                        _this.allcheck=[]
                        if($("#ajaxCont").find("tr").length<=1){
                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-2)
                        }else{
                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                        }

                    }
                });
            }
		},
        deletefun:function(e){
            var $this=$(e.currentTarget)
            this.deleteOrder($this.data("id"))
        },
		deleteOrder:function(ids){
            var _this=this;
            getJsonp({
                url: apiUrl.deleteDispatchOrderTmp,
                data: {
                   dispatchordertmpids:ids 
                },
                callback: function (d) {
                    if (d.result == "error") {
                        alertMsg(d.msg);
                        return;
                    }
                    var listArr=(ids+"").split(",");
                    for(var i=0;i<listArr.length;i++){
                        $(".delete[data-id='"+listArr[i]+"']").closest("tr").hide(500);
                    }
                    setTimeout(function(){
                        if($("#ajaxCont").find("tr").length<=1){
                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-2)
                        }else{
                            _this.getData($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                        }
                    },600)
                }
            });
		}
	})
	var obj = new objfun({
		$el:$('.body-content')
	});
})
