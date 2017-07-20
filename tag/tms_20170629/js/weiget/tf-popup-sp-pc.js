/**
 * @file 文件说明
 * @author XieZhendong,hzw
 * @date 17/05/23
 *
 * @params {type:pop,iframe,"",弹框的三种模式，若为iframe,内容则需要在html字段输入}
 * @param {callType:"success","fail",成功和失败}
 * @param {html:'<div>内容</div>'，当type：iframe 生效}
 * @param {otherClass:'额外样式'}
 * @param {footer:底部按钮list
 *          {
                text: '确定',
                click: function () {

                }
            }
 * }
 * new Pop({
            type:"pop",
            content:"网络不给力,请检查网络连接",
             callType:"fail"
        }).init(); 
 */
    var Pop = function(options){
        this.options = {
            title:"",
            content: '这里是内容',
            footer: [{
                text: '确定',
                click: function () {

                }
            },{
                text: '取消',
                click: function () {

                }
            }],
            otherClass:"",
            cover: true,
            coverClick: false
            //,type:"pop"
            //,callType:"success","fail"气泡
        };
        this.id = 'tfpop' + new Date().getTime();
        $.extend(this.options,options);
    };

    Pop.prototype.init = function(options){
        this.createElement();
        this.addEventListener();
        this.show();
    }

    Pop.prototype.createElement = function(){
        var arr = [],
            title = $.trim(this.options.title),
            content = this.options.content,
            footer = this.options.footer,
            btnCount = footer.length,
            documentHeight=$(window).height();

        arr.push('<div class="pop-cover '+this.options.otherClass+'" style="height:'+documentHeight+'px" id="' + this.id + '"><div class="pop-bg"></div>');

        if(this.options.type=="pop"){
            //气泡模式
            arr.push('<div class="pop-pop"><div class="tf-close"></div>');
            arr.push('<div class="pop-'+this.options.callType+'">'+this.options.content+'</div>');
        }else if(this.options.type=="iframe"){
            arr.push('<div class="tf-pop pop-iframe"><div class="tf-close"></div>');
            if(title){
                arr.push('<div class="pop-title">' + title + '</div>');
            }
            arr.push('<div class="pop-content">');
            arr.push(this.options.html);
            arr.push('</div>');
            if(btnCount>0){
                arr.push('<div class="pop-footer">');
                var style = 'left:140px;';
                $.each(footer,function(i,v){
                    if(i==0){
                        if(btnCount==1){
                            arr.push('<div class="t-c-submit pop-btn"  style="'+style+'" >' + v.text + '</div>');
                        }else{
                            arr.push('<div class="t-c-submit pop-btn"  >' + v.text + '</div>');
                        }
                    }
                    else{
                        arr.push('<div class="t-c-sub-submit pop-btn" >' + v.text + '</div>');
                    }
                })
            }
        }else{
            arr.push('<div class="tf-pop "><div class="tf-close"></div>');
            arr.push('<div class="pop-content">');
            arr.push('<p class="pop-text">' + content +'</p>');
            arr.push('</div>');
            if(btnCount>0){
                arr.push('<div class="pop-footer">');
                var style = 'left:140px;';
                $.each(footer,function(i,v){
                    if(i==0){
                        if(btnCount==1){
                            arr.push('<div class="t-c-submit pop-btn"  style="'+style+'" >' + v.text + '</div>');
                        }else{
                            arr.push('<div class="t-c-submit pop-btn"  >' + v.text + '</div>');
                        }
                    }
                    else{
                        arr.push('<div class="t-c-sub-submit pop-btn" >' + v.text + '</div>');
                    }
                })
            }

        }
        arr.push('</div>');
        arr.push('</div>');
        $('body').append($(arr.join('')));
        this.$el = $("#" + this.id);
        if(this.options.type=="pop") {
            var _this=this
            setTimeout(function(){
                _this.$el.find(".pop-pop").css("margin-right",_this.$el.find(".pop-pop").width()/-2);
            },10);
            setTimeout(function () {
                _this.$el.fadeOut(300,function(){
                    _this.$el.remove();
                });
            }, 990);
        }
    }

    Pop.prototype.addEventListener = function(){
        var _this = this,
            footer = this.options.footer;
        this.btns = this.$el.find('.pop-btn');
        this.close = this.$el.find('.tf-close');
        //点击cover是否关闭
        if(_this.options.coverClick||_this.options.footer.length==0){
            $('.pop-cover').on('click',function(ev){
                var $elem = $(ev.target);
                if($elem.hasClass('pop-cover'))
                	_this.remove();
	               // _this.hide();
	             else
	             	ev.stopPropagation();
            });
        }

        this.btns.each(function(i,v){
            var click = footer[i].click;
            if(typeof click == 'function'){
                $(v).on('click',function(){
                    click(_this);
                    if(_this.options.click=="other"){
                        return;
                    }
                    _this.remove();
                    //_this.hide();
                });
            }else{
                $(v).on('click',function(){
                	_this.remove();
                    //_this.hide();
                })
            }
        });

        this.close.click(function(){
        	_this.remove();
            //_this.hide();
        });
    }

    Pop.prototype.show = function(){
        this.$el.show();
    }


    Pop.prototype.hide = function(){
        this.$el.hide();
    }
    
    Pop.prototype.remove = function(){
        this.$el.remove();
    }

   /* $.tfpop = function(options){
       return new Pop(options);
    };*/

