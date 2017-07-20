/**
 * @file 文件说明
 * @author XieZhendong
 * @date 15/10/23
 */
;(function(){
    var Pop = function(options){
        this.options = {
            title: '',
            content: '这里是内容',
            footer: [],
            cover: true,
            coverClick: false
        };
        this.id = 'tfpop' + new Date().getTime();
        this.init(options);
    };

    Pop.prototype.init = function(options){
        $.extend(this.options,options);
        this.createElement();
        this.addEventListener();
        this.show();
    }

    Pop.prototype.createElement = function(){
        var arr = [],
            title = $.trim(this.options.title),
            content = this.options.content,
            footer = this.options.footer,
            btnCount = footer.length;
        arr.push('<div class="pop-cover" id="' + this.id + '">');
        arr.push('<div class="tf-pop">');
        arr.push('<div class="pop-content">');
        if(title){
            arr.push('<div class="pop-title">' + title + '</div>');
            arr.push('<p class="pop-text has-title">' + content +'</p>');
        }
        else{
            arr.push('<p class="pop-text">' + content +'</p>');
        }
        arr.push('</div>');
        if(btnCount>0){
            arr.push('<div class="pop-footer">');
            var style = 'float:left;width: ' + (100/btnCount).toFixed(2) + '%;';
            $.each(footer,function(i,v){
                if(i==0){
                    arr.push('<div class="pop-btn thin-border thin-border-top" style="'+ style +'">' + v.text + '</div>');
                }
                else{
                    arr.push('<div class="pop-btn thin-border thin-border-top thin-border-left" style="'+ style +'">' + v.text + '</div>');
                }
            })
        }
        arr.push('</div>');
        arr.push('</div>');
        $('body').append($(arr.join('')));
        this.$el = $("#" + this.id);
    }

    Pop.prototype.addEventListener = function(){
        var _this = this,
            footer = this.options.footer;
        this.btns = this.$el.find('.pop-btn');
        //点击cover是否关闭
        if(_this.options.coverClick||_this.options.footer.length==0){
            $('.pop-cover').on('click',function(ev){
                var $elem = $(ev.target);
                if($elem.hasClass('pop-cover'))
	                _this.hide();
	             else
	             	ev.stopPropagation();
            });
        }

        this.btns.each(function(i,v){
            var click = footer[i].click;
            if(typeof click == 'function'){
                $(v).on('click',function(){
                    _this.hide();
                    click();
                });
            }else{
                $(v).on('click',function(){
                    _this.hide();
                })
            }
        });
    }

    Pop.prototype.show = function(){
        this.$el.show().addClass('tf-fadeIn-short');
    }


    Pop.prototype.hide = function(){
        this.$el.hide().addClass('tf-fadeOut-short');
    }

    $.tfpop = function(options){
       return new Pop(options);
    };

})();