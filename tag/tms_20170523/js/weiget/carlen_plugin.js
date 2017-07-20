/**
 * Created by chenlei on 16/3/22.
 */

function CarLengthComponent(){
    var v=''
    var that={}
    var idname=''
    that.arr=['4.2','6.8','7.2','7.6','9.6','10.5','12','13','16','17.5','20','22']
    that.start=function(){
        that.init()
        $(document).delegate('.proCarSelAll','click',that.position)
        $(document).delegate('.carlen_ul li','click',that.createData)
        $(document).delegate('.carlen_ul li','mouseenter',that.chain)
        $(document).delegate('.carlength_plug_close','click',function(){
            that.hide_set()
        })
        that.mouseup()

    }
    that.init=function(){
        $('body').append(that.template())
    }
    that.template=function(){
        var li=''
        var carLengthTemplate=
            '<div class="carlength_plug_contain">\
                <a href="javascript:void(0)" class="close-btn carlength_plug_close"></a>\
                <div class="carlen-tips">车长单位：米</div>\
                <ul class="carlen_ul">{{ len_val }}</ul>\
            </div>';
        for(var i=0;i<that.arr.length;i++){
            li+='<li>'+that.arr[i]+'</li>'
        }
        return carLengthTemplate.replace('{{ len_val }}',li)
    }

    //⬇️点击车厂填充数据
    that.createData=function(){
        var len=$('.carlen_ul').find('li.cur').length
        if(len==0){


            $('#'+idname).val($(this).html())
            that.hide_set()
            // $(this).addClass('cur') 单选修改
        }else if(len==1){
            //if($(this).hasClass('cur')){
            //
            //    $(this).removeClass('cur');
            //}else{
                $(this).addClass('cur');
                $.each($('.carlen_ul li'),function(i){
                    if($(this).hasClass('cur')){
                        v+=$(this).html()+'-'
                    }
                })
               var new_v= v.split('-')
               if(new_v[1]==''){
                   v=new_v[0]+'-'+new_v[0]+'-'
               }
                $('#'+idname).val(v.substr(0, v.length-1)+'米')
            //}

            that.hide_set()
        }
    }
    that.chain=function(){
        var arr=[]
        var start_index=$('.carlen_ul').find('li.cur').index()
        var end_index=$(this).index()
        if(start_index<0){
            return
        }
        if(start_index>end_index){
            arr=[end_index,start_index]
        }else {
            arr = [start_index, end_index]
        }
        $('.carlen_ul li').removeClass('car')
        for(var i=arr[0];i<=arr[1];i++){
            $('.carlen_ul li').eq(i).addClass('car')
        }

    }
    //⬇车长组件点击定位
    that.position=function(){
        idname=$(this).attr('id')
        $(this).siblings('.span_tips').hide()
        var o2 = $(this).offset();
        var l2 = o2.left;
        var t2 = o2.top;
        var h2 = $(this).height();
        $(".carlength_plug_contain").css("top", t2 + h2 +12).css("left", l2-2).toggle();
        $('.input_value').hide()
        $('#'+idname).parent().removeClass('adderror')
        $(".carlength_plug_contain").show()
    }
    //⬇️判断是否点击别的区域 如果是关闭车长控件
    that.mouseup=function(){
        $(document).mouseup(function(e){
            var _con = $('.carlength_plug_contain')
            if(!_con.is(e.target) && _con.has(e.target).length === 0){
                if($('#'+idname).val()==''){
                    $('#'+idname).siblings().show()
                }
                that.hide_set()
            }
        })
    }
    //⬇关闭车长组件
    that.hide_set=function(){
        v=''
        if($('#'+idname).parent().hasClass('adderror')){
            return
        }
        $('.carlen_ul li').removeClass('car')
        $('.carlen_ul li').removeClass('cur')
        $('.carlength_plug_contain').hide()
    }
    return that
}