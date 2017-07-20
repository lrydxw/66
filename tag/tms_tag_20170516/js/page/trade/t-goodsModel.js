/*
* 业务中心公用
* */
$(function(){
    //功能对象
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize: function () {

            if($('#ajaxCont').length>0){
                this.getDate();
            }
            this.base=new transfar.Base();

            this.type=this.base.getUrlParam("type");
            this.pageSize=JSON.parse(iLocalStorage.getItem('page')||"{}")[location.href.split("/")[(location.href.split("/").length-1)]]||20
            this.id=this.base.getUrlParam("id");
            this.formUrl=apiUrl.insertDispatchGoodsSourceModel;
            $('[name="chargetype"]').val("2");
            var ih='',im=''
            for(var i=0;i<=24;i++){
                ih+='<option value='+i+'>'+i+'</option>'
            }
            $('ul.chargetype-option').on('click','li',function(){
                var index=$(this).index()
                if(index<2){
                    $('.freightprice').hide()
                }else{
                    $('.freightprice').show()
                }
            })
            $('[name="invaliddateH"]').append(ih)
            for(var i=0;i<=60;i++){
                im+='<option value='+i+'>'+i+'</option>'
            }
            $('[name="invaliddateM"]').append(im)

            this.getType();
            //组件事件
            tradeCommonFun.radioModal();
            tradeCommonFun.checkModal();
            tradeCommonFun.selectModal();
            tradeCommonFun.numberInput();
            tradeCommonFun.selectChangeVal();
            this.ajaxIng=false;

            if(this.type=="add"){
              /*  this.setCookie();*/
            }
        },
        //添加事件（基于委托，绑定动态加载元素）
        events: {
            "click #release":'releaseGoods',
            "mouseup #releaseForm":"releaseCheck",
            "keyup #releaseForm":"releaseCheck",
            "click .delete-action":"deleteModal",
            "click #invaliddateshow":'invaliddate',
            "click .normal-tips-li":'addTips',
            "click .detail-action":'goodsAgain',
            "click .choose-type":'chooseType'
        },
        //自定义方法
        chooseType:function(e){
            var $this=$(e.currentTarget)
            $this.addClass('cur').siblings().removeClass('cur')
            var index=$this.index()
            if(index==0){
                $('[name="chargetype"]').val("2");
                $('.cyr-info').show()
                $('.chargetype-line').hide()
            }else if(index==1){
                $('[name="chargetype"]').val("0");
                $('.cyr-info').hide()
                $('.chargetype-line').show()
            }else if(index==2){
                $('[name="chargetype"]').val("1");
                $('.cyr-info').hide()
                $('.chargetype-line').show()
            }
            this.releaseCheck()
        },
        goodsAgain:function(e){
            var $this=$(e.currentTarget)
            var id=$this.attr('data-id')
            this.setValue(id)
        },
        searchrelat:function(){
            var _this=this
            getJsonp({
                url:apiUrl.selectDispatchRelationList,
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        var data=data.data
                        var li=''
                        for(var i=0;i<data.length;i++){
                            li+="<li data-value="+data[i].dispatchagentid+","+data[i].agentrealname+","+data[i].agentpartyid+">"+data[i].agentrealname+"</li>"
                        }
                        $('ul[name="dispatchagentid"]').html(li)
                        if(_this.type=="change"){
                            _this.setValue();
                        }

                    }
                }
            });

        },
        addTips:function(e){
            if(getParamVal('type')=='detail'){
                return
            }
            var $this=$(e.currentTarget)
            var tips=$this.html()
            var note=$('#note').val()
            if (note.length <= 0) {
                $('#note').val(tips)
            } else if(note.length<150){
                if(note.length+tips.length>150){
                    new Pop({
                            type: "pop",
                            content: "字数超出限制",
                            callType: "fail"
                        }).init();
                }else{
                    note = note + ',' + tips
                    $('#note').val(note)
                }
            }else{
                 new Pop({
                            type: "pop",
                            content: "字数超出限制",
                            callType: "fail"
                        }).init();
            }
        },
        getDataList:function(type){
            var _this=this
            switch (type) {
                case '车长':
                    successFun=function(data){
                        var li=''
                        for(var i=0;i<data.length;i++){
                            li+="<li>"+data[i].text+"</li>"
                        }
                        return li
                        // $('.carlen_ul').html(li)
                    }
                    break;
                case '车型':
                    successFun=function(data){
                        var li=''
                        for(var i=0;i<data.length;i++){
                            li+="<li data-value="+data[i].text+">"+data[i].text+"</li>"
                        }
                        return li
                        // $('[name="cartype"]').html(li)
                    }
                    break;
            }
            getJsonp({
                url:apiUrl.selectDispatchDictionaryList,
                data:{
                    type:type,
                    status:1,
                    sort:'orderNo'
                },
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        var li=successFun(data.data)
                        switch (type) {
                            case '车长':
                                $('.carlen_ul').html(li)
                                _this.getDataList('车型');
                                break;
                            case '车型':
                                $('ul[name="cartype"]').html(li)
                                _this.searchrelat()
                                break;
                        }
                    }
                }
            });
        },
        //选择有效时间
        invaliddate:function(){
            $('.pos-Select').show()
            $('.true-btn-date').click(function(){
                var m=$('[name="invaliddateM"]').val()
                var h=$('[name="invaliddateH"]').val()
                $('#invaliddateshow').val(h+'小时'+m+'分')
                $('#invaliddate').val(h*3600000+m*60000)
                $('.pos-Select').hide()
            })
            $('[name="invaliddateH"]').change(function(){
                if($('[name="invaliddateH"]').val()==24){
                    $('[name="invaliddateM"]').val('0')
                    $('[name="invaliddateM"]').attr('disabled','disabled')
                }else{
                    $('[name="invaliddateM"]').removeAttr('disabled')
                }
            })
        },
        getDate:function(page){
            var _this=this;

            var searchData={};
            searchData.pagesize = this.pageSize;
            searchData.skipcount = this.pageSize*(page||0)
            var url=apiUrl.selectDispatchGoodsSourceModelList;
            //获取列表
            getJsonp({
                url:url,
                data:searchData,
                callback:function(d){
                    if(d.result=="error"){
                        alertMsg(d.msg);
                        return;
                    }
                    if(d.count<1){
                        $(".no-model").show();
                        $(".t-table").addClass("t-table-no");
                        return;
                    }
                    var source= '{{each data as d i}}'
                        +'{{if i%2==0}}'
                        +'<tr class="t-table-single">' +
                        '{{else}}' +
                        '<tr>'+
                        '{{/if}}'
                        +'<td>{{d.modelname}}</td>'
                        +'<td><span class="address release-from">{{d | addresssplit: "from"}}</span></td>' +
                        '<td  class="table-no-padding"><label class="model-cross"></label></td>'
                        +'<td class="table-no-padding"><span class="address release-to">{{d | addresssplit: "to"}}</span></td>'
                        +'<td>{{d.goodsname}}</td>'
                        +'<td>{{d | carinfo}}</td>'
                        +'<td>{{d.inputdate}}</td>'
                        +'<td>'
                        +'<a href="javascript:void(0)" class="detail-action" data-id="{{d.dispatchgoodssourcemodelid}}">发货</a>'
                        +'<a href="./goodsModel-add.html?type=change&id={{d.dispatchgoodssourcemodelid}}">修改</a>'
                        +'<a href="javascript:" class="delete-action" data-id="{{d.dispatchgoodssourcemodelid}}">删除</a>'
                        +'</td>'
                        + '</tr>'
                        + '{{/each}}';
                    template.helper('addresssplit',function(data,type){
                        var str=''
                        if(type=='from'){
                            str=data.fromprovince+(data.fromcity?("-"+data.fromcity):"")+(data.fromregion?("-"+data.fromregion):"")
                        }else{
                            str=data.toprovince+(data.tocity?("-"+data.tocity):"")+(data.toregion?("-"+data.toregion):"")
                        }
                        return str
                    })
                    template.helper('carinfo',function(data,type){
                        var str=''
                        if(!data.carlengthmin&&!data.carlengthmax){
                            str=data.cartype
                        }else if(!data.carlengthmin){
                            str=data.carlengthmax+'米'+data.cartype
                        }else if(!data.carlengthmax){
                            str=data.carlengthmin+'米'+data.cartype
                        }
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
       /* //数据梳理,
        dataTeas:function(d){
            $.each(d.data,function(i,e){
                e.from=e.fromprovince+"-"+e.fromcity+(e.fromregion?"-"+e.fromregion:"");
                e.to=e.toprovince+"-"+e.tocity+(e.toregion?"-"+e.toregion:"");
                e.goodsSpecialInfo=(e.goodsname||e.goodstype)+","+(e.goodsweight?(e.goodsweight+"吨"):"")+","+e.carlengthrequire+","+e.carstructrequire;
                e.goodsSpecialInfo=e.goodsSpecialInfo.replace(/(^,|,$|,,$)/g,"");

                e.tradefacility = e.tradefacility || ("基地外" == e.site ? e.elescreen : e.site+e.elescreen);
            });
            return d;
        },*/
        //使用cookie填充数据
        setCookie:function(){
            var $releaseForm=$("#releaseForm");
            var formObject=$releaseForm.serializeObject();
            for(var x in formObject){
                $releaseForm.find('[name="'+x+'"]').val(iLocalStorage.getItem('model_'+x));
            }
        },
        //提交模板
        releaseGoods:function(e){
            var  a=''
            var _this=this;
            /*if(!_this.releaseTypeCheck()){
                return
            }*/
            var $this=$(e.currentTarget);
            var successDetail={};
            e.preventDefault();
            if(!$this.hasClass("t-c-submit-disable")){
                var submitData=$("#releaseForm").serializeObject();
                //数据整理
                /* fromprovince - 省 发货地 必填
                 fromcity - 市 发货地 必填
                 fromregion - 区县 发货地 可为空
                 toprovince - 省 送货地 必填
                 tocity - 市 送货地 必填
                 toregion - 区县 送货地 可为空*/
                /*成功提示*/
                successDetail.from=submitData.from;
                successDetail.to=submitData.to;
                successDetail.name=submitData.modelname;


                submitData.goodsweightmin=submitData.goodsweightmin?submitData.goodsweightmin*1000:"";
                // submitData.goodsvolume=submitData.goodsvolume=="0"?"":submitData.goodsvolume;
                // submitData.goodsnumber=submitData.goodsnumber=="0"?"":submitData.goodsnumber;
                submitData.statementvalue=submitData.statementvalue=="0"?"":submitData.statementvalue*10000;
                submitData.fromprovince=submitData.from.split("-")[0];
                submitData.fromcity=submitData.from.split("-")[1];
                submitData.fromregion=submitData.from.split("-")[2]||"";
                delete submitData.from;
                submitData.toprovince=submitData.to.split("-")[0];
                submitData.tocity=submitData.to.split("-")[1];
                submitData.toregion=submitData.to.split("-")[2]||"";
                delete submitData.to;
                submitData.carlengthmin=submitData.carlength.split("-")[0]?(submitData.carlength.split("-")[0]):"";
                submitData.carlengthmax=submitData.carlength.split("-")[1]?(parseFloat(submitData.carlength.split("-")[1])):"";
                submitData.validhour=parseInt(submitData.invaliddate/3600000)
                submitData.validminute=parseInt(parseInt(submitData.invaliddate%3600000)/(60*1000))
                delete submitData.carlength;
                var addedservice=[]
                if(submitData.addedservice1=='true'){
                    addedservice.push('2')
                }
                if(submitData.addedservice2=='true'){
                    addedservice.push('5')
                }
                if(submitData.addedservice3=='true'){
                    addedservice.push('1')
                }
                //if(submitData.chargetype==2){
                    var arr=submitData.dispatchagentid.split(',')
                    submitData.bidtype=0
                    submitData.chargetype=0
                    submitData.dispatchagentid=arr[0]
                    submitData.agentrealname=arr[1]
                    submitData.agentpartyid=arr[2]
               /* }else{
                    submitData.bidtype=1
                    delete submitData.dispatchagentid
                }*/


                submitData.addedservice=addedservice.join()
                delete submitData.addedservice1
                delete submitData.addedservice2
                delete submitData.addedservice3
                addedservice=null
                if(_this.ajaxIng){return;}
                _this.ajaxIng=true;
                submitData.bidtype = 0;
                getJsonp({
                    url:_this.formUrl,
                    data:submitData,
                    callback:function(data){
                        if(data.result=="success"){
                            if(_this.type=="add"){
                                var $releaseSuccess=$(".release-success");
                                $("#releaseForm").hide();
                                $releaseSuccess.show();
                                window.location.href=window.location.href+'#releasesuccess'
                               for(var x in successDetail){
                                    $releaseSuccess.find('[name="'+x+'"]').html(successDetail[x]);
                                }
                            }else{
                                new Pop({
                                    type:"pop",
                                    content:"修改成功！",
                                    callType:"success"
                                }).init();
                            }
                            //发布成功 清除缓存
                           /* for(var x in submitData){
                                iLocalStorage.removeItem("model_"+x);
                            }
                            iLocalStorage.removeItem("model_from");
                            iLocalStorage.removeItem("model_to");
                            iLocalStorage.removeItem("model_carlength");*/

                        }else{
                            new Pop({
                                type:"pop",
                                content:data.msg,
                                callType:"fail"
                            }).init();
                        }
                        _this.ajaxIng=false;
                    }
                    ,error:function(){
                        new Pop({
                            type:"pop",
                            content:"操作失败,请重试",
                            callType:"fail"
                        }).init();
                        _this.ajaxIng=false;
                    }
                })
            }
        },
        releaseTypeCheck:function(){
            var check=true
            if(!$('[name="goodsweightmin"]').val()){
                check=false
                new Pop({
                    type:"pop",
                    content:"重量必填",
                    callType:"fail"
                }).init();
            }
            return check
        },
        releaseCheck:function(){
            var reg=/(^1[0-9]{10}$)|((^\d{1,4}-)?^\d{8}$)/;
            var $this=$("#releaseForm");
            var index=$('.choose-ul').find('.cur').index()
            var _this=this;
            var check=true;
            setTimeout(function(){
                $this.find("input[require='true']").each(function(){
                    if(index==0){
                        if(!$(this).val()){
                            if($(this).attr('id')=='invaliddateshow'){
                                return true
                            }else{
                                check=false;
                            }
                        }
                    }else{
                        if(!$(this).val()){
                            if($(this).attr('id')=='cyr'){
                                return true
                            }else{
                                check=false;
                            }
                        }
                    }
                });
                if($(".mobileCheck1").val()){
                    if(!reg.test($(".mobileCheck1").val())){
                        check=false;
                    }
                }

                if(check){
                    $("#release").removeClass("t-c-submit-disable");
                }else{
                    $("#release").addClass("t-c-submit-disable");
                }
            },100);
        },
        getType:function(){
            //修改，详情，添加
            var _this=this;
            var $title=$("#modalTitle");
            var area={};
            var car={};
            switch(_this.type){
                case "change":
                    $title.html("修改模板");
                    area=AddressComponent();
                    area.start();
                    car=CarLengthComponent();
                    car.start();
                    _this.getDataList('车长');
                    $("#releaseForm").append('<input type="hidden" name="dispatchgoodssourcemodelid" value="'+_this.id+'">');
                    this.formUrl=apiUrl.updateDispatchGoodsSourceModel;
                    //城市控件调用
                    break;
               /* case "detail":
                    $title.html("模板详情");
                    $("#release").hide();
                    $("#releaseForm").find('input,textarea').attr("disabled","true")
                    $('.input-check').unbind('click')
                    this.setValue();
                    break;*/
                case "add":
                    $title.html("添加模板");
                    $('[name="goodstype"]').val("普通");
                    //城市控件调用
                    area=AddressComponent();
                    area.start();
                    car=CarLengthComponent();
                    car.start();
                    _this.getDataList('车长');
                    break;
            }
        },
        //赋值
        setValue:function(x){
            var type=''
            var _this=this;
            if(x){
                _this.id=x
                type="goods"
            }
            getJsonp({
                url:apiUrl.selectDispatchGoodsSourceModelDetail,
                data:{
                    dispatchgoodssourcemodelid:_this.id
                },
                callback:function(data){
                    if(data.result=="error"){
                        alertMsg(data.msg);
                        return;
                    }
                    if(data.result=="success"){
                        console.log(x)

                        if(type=='goods'){
                            var d=JSON.stringify(data.data)
                            iLocalStorage.setItem('againgoods',d,1);
                            window.location.href="goodsRelease.html?againgoods=true"
                            return
                        }
                        data.data.from=data.data.fromprovince+ (data.data.fromcity?("-"+data.data.fromcity):"")+(data.data.fromregion?("-"+data.data.fromregion):"");
                        data.data.to=data.data.toprovince+(data.data.tocity?("-"+data.data.tocity):"")+(data.data.toregion?("-"+data.data.toregion):"");
                        data.data.carlength=data.data.carlengthmin+(data.data.carlengthmax?("-"+data.data.carlengthmax+"米"):"");

                        for(var x in data.data){
                            if(x=='addedservice'&&data.data['addedservice']!=''){
                                $.each(data.data['addedservice'].split(','),function(i,e){
                                    if(e=='2'){
                                        $('[name="addedservice1"]').addClass('input-check-true').attr('value','true')
                                    }
                                    if(e=='5'){
                                        $('[name="addedservice2"]').addClass('input-check-true').attr('value','true')
                                    }
                                    if(e=='1'){
                                        $('[name="addedservice3"]').addClass('input-check-true').attr('value','true')
                                    }
                                });
                            }
                            if(x=='statementvalue'&&data.data['statementvalue']!=''){
                                data.data['statementvalue']=data.data['statementvalue']/10000
                            }
                            $("[name='"+x+"']").val(data.data[x]);
                            if(x=='dispatchagentid'){
                                var str1=data.data['dispatchagentid']+','+data.data['agentrealname']+','+data.data['agentpartyid']
                                $('[name="dispatchagentid"]').val(str1)
                            }
                            if(x=='producttype'){
                                $('[name="producttype"]').val(5)
                            }

                        }
                        if(data.data['bidtype']=='0'){
                            console.log(1)
                            $('.chargetype-line').hide()
                            $('[name="chargetype"]').val("2");
                            $('.choose-type:eq(0)').addClass('cur').siblings().removeClass('cur')
                            $('.cyr-info').show()
                        }
                        if(data.data['bidtype']=='1'&&(data.data['chargetype']=='0'||data.data['chargetype']=='')){
                            console.log(2)
                            $('.chargetype-line').show()
                            $('[name="chargetype"]').val("0");
                            $('.cyr-info').hide()
                            $('.choose-type:eq(1)').addClass('cur').siblings().removeClass('cur')
                        }
                        if(data.data['bidtype']=='1'&&data.data['chargetype']=='1'){
                            $('.chargetype-line').show()
                            $('[name="chargetype"]').val("1");
                            $('.cyr-info').hide()
                            $('.choose-type:eq(2)').addClass('cur').siblings().removeClass('cur')
                        }
                        $("#invaliddateshow").val(data.data['validhour']+'小时'+data.data['validminute']+'分');
                        var time=data.data['validhour']*3600000+data.data['validminute']*60000
                        $("#invaliddate").val(time)
                        tradeCommonFun.selectChangeVal();
                        _this.releaseCheck();
                    }
                }
            });
        },
        //删除模板
        deleteModal:function(e){
            var $this=$(e.currentTarget);
            var _this=this;
            var id=$this.data("id");
            new Pop({
                footer:[
                    {
                        text: '确定',
                        click: function () {
                            getJsonp({
                                url:apiUrl.deleteDispatchGoodsSourceModel,
                                data:{
                                    dispatchgoodssourcemodelid:id
                                },
                                callback:function(data){
                                    if(data.result=="success"){
                                        $this.closest("tr").remove();
                                      /*  new Pop({
                                            type:"pop",
                                            content:"删除成功！",
                                            callType:"success"
                                        }).init();*/

                                     if($("#ajaxCont").find("tr").length<=1){
                                            _this.getDate($(".pagination ").find(".current:not('.prev'):not('.next')").html()-2)
                                        }else{
                                            _this.getDate($(".pagination ").find(".current:not('.prev'):not('.next')").html()-1)
                                        }
                                    }else{
                                        new Pop({
                                            type:"pop",
                                            content:"操作失败,请重试",
                                            callType:"fail"
                                        }).init();
                                    }
                                },error:function(){
                                    new Pop({
                                        type:"pop",
                                        content:"操作失败,请重试",
                                        callType:"fail"
                                    }).init();
                                }
                            });
                        }
                    },{
                        text: '取消',
                        click: function () {

                        }
                    }
                ],
                content:"确定删除吗",
                callType:"success"
            }).init();

        }
    });
    new tradeFun({
        $el:$('.body-content')
    });
});
