/*
* 插件使用方法
* 1.在input中加入样式proCitySelAll
* 2.input必须有id值
*
* */
function AddressComponent(ishide,level){
   // if(window.localStorage){
        var wl=window.iLocalStorage
    //}
    var address_str=''
    var idname=''
    var that={
        isHideBro:ishide,
        level:level,
        province_data:ALP.DATA.areaData.province,
        city_data:ALP.DATA.areaData.city,
        county_data:ALP.DATA.areaData.county
    }
    //⬇地址组件 action!
    that.start=function(){
        that.init()
        that.mouseup()
        $('.proCitySelAll').each(function(){
            if($(this).val()!=''){
                if(that.isHideBro=='yes'){
                    $(this).siblings().hide()
                }
            }
        })

        $(document).delegate('.proCitySelAll','click',that.position)
        $(document).delegate('.provinces_dl dd','click',that.proClickCreateCity)
        $(document).delegate('.city_ul li','click',that.cityClickCreateCounty)
        $(document).delegate('.county_ul li','click',that.createData)
        $(document).delegate('.address_plug_list_icon','click',function(){
            var index=$(this).index()
            that.O_index(index)
        })
        $(document).delegate('.commonly_list li','click',function(){
            var str=$(this).attr('data-str')
            $('#'+idname).val(str)
            that.hide_set()
        })
        $(document).delegate('.proCitySelAll',($.support.opera ? "keypress": "keyup"),that.keypressSearch)
        $(document).delegate('.address_plug_close','click',function(){
            that.hide_set()
        })
        $('.select_value').delegate('','click selNext selPrev enter',function(e){
            if(e.type=='selNext'){
                var next = $(this).find("li.cur").next();
                if (next.size() > 0) {
                    next.addClass("cur").siblings().removeClass("cur");
                }
                else {
                    $(".select_value li").removeClass("cur").first().addClass("cur");
                }
            }else if(e.type=='selPrev'){
                var prev = $(this).find("li.cur").prev();
                if (prev.size() > 0) {
                    prev.addClass("cur").siblings().removeClass("cur");
                }
                else {
                    $(".select_value li").removeClass("cur").last().addClass("cur");
                }
            }else if(e.type=='enter'){
                var html=$(this).find('li.cur').html()
                that.often_address.set_add(html,idname)
                $('#'+idname).val(html)
                that.hide_set()
            }
        })
        $(document).delegate('.select_value li','click',function(){
                var html=$(this).html()
                that.often_address.set_add(html,idname)
                $('#'+idname).val(html)
                that.hide_set()
        })
    }
    //⬇关闭地址组件
    that.hide_set=function(){
        var v=$('#'+idname).val()
        if(!v){
        }else{
            if($('#'+idname).parent().hasClass('adderror')){
                return
            }
            var val=v.split('-')
            if(that.level==1){

            }else{
                if(val.length<2|| val[1]==''){
                    $('#'+idname).parent().addClass('adderror')
                    $('#'+idname).val(v+'-请输入市区')
                    return
                }
            }

        }
//        that.often_address.set_add(address_str,idname)
        $('.address_plug_contain').hide()
        $('.input_value').hide()
        address_str=''
    }
    //⬇地址组件 页面切换
    that.O_index=function(x){
        if($('#'+idname).parent().hasClass('adderror')){
            $('#'+idname).parent().removeClass('adderror')
        }
        $('.address_plug_list_icon').eq(x).addClass('hover').siblings().removeClass('hover')
        $('.tab_div').eq(x).show().siblings().hide()
    }
    //⬇地址组件 模板
    that.template=function(){
        var address_template=
            '<div class="input_value">\
                <ul class="select_value"></ul>\
            </div>\
            <div class="address_plug_contain">\
                <div class="address_plug_list">\
                    <a href="javascript:void(0)" class="address_plug_list_icon list_icon1 hover">省<i class="star">*</i></a>\
                    <a href="javascript:void(0)" class="address_plug_list_icon list_icon2">市<i class="star">*</i></a>\
                    <a href="javascript:void(0)" class="address_plug_list_icon list_icon3">区县</a>\
                    <a href="javascript:void(0)" class="address_plug_close close-btn">\
                        <img src="../../css/img/p-close-btn.png"  width="12" height="12" alt=""/>\
                    </a>\
                </div>\
                <div class="address_select clearfix">\
                    <div class="AllProvinces tab_div">\
                        <div class="Commonly_address clearfix" id="oftenaddress">\
                            <ul class="commonly_list"></ul>\
                            <div class="middle-line">\
                                <span>以上是最近选择</span>\
                            </div>\
                        </div>\
                        <div class="provinces clearfix">\
                            <dl class="provinces_dl clearfix">\
                                <dt>A-G</dt>\
                            </dl>\
                            <dl class="provinces_dl clearfix">\
                                <dt>H-K</dt>\
                            </dl>\
                            <dl class="provinces_dl clearfix">\
                                <dt>L-S</dt>\
                            </dl>\
                            <dl class="provinces_dl clearfix">\
                                <dt>T-Z</dt>\
                            </dl>\
                        </div>\
                    </div>\
                    <div class="Allcity tab_div">\
                        <ul class="city_ul clearfix">\
                        </ul>\
                    </div>\
                    <div class="Allcounty tab_div">\
                        <ul class="county_ul clearfix">\
                        </ul>\
                    </div>\
                </div>\
            </div>';
        return address_template
    }
    //⬇地址组件 初始化 载入dom并填充首页数据
    that.init=function(){
        $('body').append(that.template())

        that.firstPage()
    }
    //⬇地址组件 首页填充数据函数
    that.firstPage=function(){
        var province_arr=["A-G","H-K","L-S","T-Z"];
        for(var i in that.province_data){
            var AZ=that.province_data[i]
            var html=[]
            for(var j in AZ){
                var dd='<dd data-num='+j+'>'+AZ[j]+'</dd>'
                html.push(dd)
            }
            for(var x=0;x<province_arr.length;x++){
                if(province_arr[x]==i){
                    $('.provinces_dl').eq(x).append(html.join(''))
                    break
                }
            }
        }
    }
    //⬇地址组件点击定位
    that.position=function(){
        that.hide_set()
        if(that.isHideBro=='yes'){
            $(this).siblings().hide()
        }

        search_style=$(this).attr('data-style')
        idname=$(this).attr('id')
        that.often_address.write_arr(idname)
        that.O_index(0)
        var o2 = $(this).offset();
        var l2 = o2.left;
        var t2 = o2.top;
        var h2 = $(this).height();
        $(".address_plug_contain").css("top", t2 + h2 +10).css("left", l2-2).toggle();
        $('.input_value').hide()
        $(".address_plug_contain").show()
    }
    //⬇️判断是否点击别的区域 如果是关闭地址组件
    that.mouseup=function(){
        $(document).mouseup(function(e){
            var _con = $('.address_plug_contain,.inputgoods,.input_value')
            if(!_con.is(e.target) && _con.has(e.target).length === 0){
                if($('#'+idname).val()==''){
                    $('#'+idname).siblings().show()
                }
                that.hide_set()
            }
        })
    }
    //⬇️点击省份生成相对应城市
    that.proClickCreateCity=function(){
        var province_index=$(this).attr('data-num')
        if(province_index==$('.Allcity').attr('data-num')){
            that.O_index(1)
            return true
        }
        $('.city_ul').find('li').remove()
        $('.provinces_dl dd').removeClass('hover')
        $(this).addClass('hover')
        provinces_address_str=$(this).html()
        that.O_index(1)
        var correspond_city=that.city_data[province_index]
        var html=[]
        for(var city_index in correspond_city){
            var li='<li data-num='+city_index+'>'+correspond_city[city_index]+'</li>'
            html.push(li)
        }
        $('.Allcity').attr('data-num',province_index)
        $('.city_ul').append(html.join(''))
        address_str=provinces_address_str
        $('#'+idname).val(address_str)
    }
    //⬇️点击城市生成相对应区县
    that.cityClickCreateCounty=function(){
        var city_index=$(this).attr('data-num')
        if(city_index==$('.Allcounty').attr('data-num')){
            that.O_index(2)
            return true
        }
        $('.county_ul').find('li').remove()
        $(this).addClass('hover').siblings().removeClass('hover')
        city_address_str='-'+$(this).html()
        address_str=provinces_address_str+city_address_str
        $('#'+idname).val(address_str)
        that.O_index(2)
        if(search_style=='checkgoods'){
            that.hide_set()
            return true;
        }
        var correspond_county=that.county_data[city_index]
        var html=[]
        for(var county_index in correspond_county){
            var li='<li data-num='+county_index+'>'+correspond_county[county_index]+'</li>'
            html.push(li)
        }
        $('.Allcounty').attr('data-num',city_index)
        $('.county_ul').append(html.join(''))
    }
    //⬇️点击区县填充数据
    that.createData=function(){
        county_address_str='-'+$(this).html()
        $(this).addClass('hover').siblings().removeClass('hover')
        address_str=provinces_address_str+city_address_str+county_address_str
        $('#'+idname).val(address_str)
        that.often_address.set_add(address_str,idname)
        that.hide_set()
    }
    //⬇️历史数据
    that.often_address={
        html:'',
        set_add:function(s,n){ //往本地常用地址数组里添加值
            if(!wl.getItem(n)){
                wl.setItem(n,'')
            }
            var localarr=wl.getItem(n).split(',')
            for(var i in localarr){     //去重
                if(s==localarr[i]){
                    return true
                }
            }
            if(localarr.length>6){
                localarr.unshift(s)
                localarr.pop()
            }else{
                localarr.unshift(s)
            }
            wl.setItem(n,localarr.join(','))
        },
        write_arr:function(n){
            var thatOften=$('#oftenaddress')
            if(!wl.getItem(n)){
                thatOften.hide()
                wl.setItem(n,'')
                return true;
            }else{
                thatOften.show()
            }
            that.often_address.html=''
            thatOften.find('.commonly_list').find('li').remove()
            var localarr=wl.getItem(n).split(',')
            for(var i=0;i<localarr.length;i++){
                if(localarr[i]!=''){
                    var str=localarr[i].split('-');
                    if(str.length<2) continue;
                    var li='<li data-str="'+localarr[i]+'">'+str[str.length-2]+str[str.length-1]+'</li>'
                    that.often_address.html+=li
                }
            }
            thatOften.find('.commonly_list').append(that.often_address.html)
        }
    }
    //模糊查询
    that.keypressSearch=function(event){
        $(".select_value").show()
        var o2 = $(this).offset();
        var l2 = o2.left;
        var t2 = o2.top;
        var h2 = $(this).height();
        var htmlarr=[]
        $(".input_value").css("top", t2 + h2 +10 - 1).css("left", l2).show();
        $('.address_plug_contain').hide()

        lastKeyPressCode = event.keyCode;
        switch (lastKeyPressCode) {
            case 40:
                $(".select_value").trigger("selNext");
                return false;
                break;
            case 38:
                $(".select_value").trigger("selPrev");
                return false;
                break;
            case 13:
                $(".select_value").trigger("enter");
                return false;
                break;
            case 32:
                $(".select_value").trigger("enter");
                return false;
                break;
        }


        v = $.trim($(this).val());
        if (v == "" || v == null) {
            return false;
        }
        outerfor:
            for(var i= 0,k=area_yasuo.length;i<k;i++){
                var shi=area_yasuo[i].ctList
                for(var j= 0;j<shi.length;j++){
                    var qu=shi[j].cnList
                    for(var l=0;l<qu.length;l++){
                        if(v.toLowerCase()===qu[l].fullpinyin.substring(0,v.length)){
                            var li="<li data-code=>"+area_yasuo[i].name+"-"+shi[j].name+"-"+qu[l].name+"</li>"
                            htmlarr[htmlarr.length]=li
                            if (htmlarr.length > 9) {
                                break outerfor
                            }
                            continue
                        }
                        if(v===qu[l].name.substring(0,v.length)){
                            var li="<li data-code=>"+area_yasuo[i].name+"-"+shi[j].name+"-"+qu[l].name+"</li>"
                            htmlarr[htmlarr.length]=li
                            if (htmlarr.length > 9) {
                                break outerfor
                            }
                            continue
                        }
                        if(v.toLowerCase()===qu[l].simplepinyin.substring(0,v.length)){
                            var li="<li data-code=>"+area_yasuo[i].name+"-"+shi[j].name+"-"+qu[l].name+"</li>"
                            htmlarr[htmlarr.length]=li
                            if (htmlarr.length > 9) {
                                break outerfor
                            }
                            continue
                        }
                    }
                    if(v.toLowerCase()===shi[j].fullpinyin.substring(0,v.length)){
                        var li="<li data-code=>"+area_yasuo[i].name+"-"+shi[j].name+"</li>"
                        htmlarr[htmlarr.length]=li
                        if (htmlarr.length > 9) {
                            break outerfor
                        }
                        continue
                    }
                    if(v===shi[j].name.substring(0,v.length)){
                        var li="<li data-code=>"+area_yasuo[i].name+"-"+shi[j].name+"</li>"
                        htmlarr[htmlarr.length]=li
                        if (htmlarr.length > 9) {
                            break outerfor
                        }
                        continue
                    }
                    if(v.toLowerCase()===shi[j].simplepinyin.substring(0,v.length)){
                        var li="<li data-code=>"+area_yasuo[i].name+"-"+shi[j].name+"</li>"
                        htmlarr[htmlarr.length]=li
                        if (htmlarr.length > 9) {
                            break outerfor
                        }
                        continue
                    }
                }
            }
        if (htmlarr == "" || htmlarr == null) {
            $(".select_value").html("<li class='none'>对不起,没有找到该城市</li>");
            return false;
        }else {
            $(".select_value").html(htmlarr.join("")).find("li:first").addClass("cur");
        }
    }
    return that
}