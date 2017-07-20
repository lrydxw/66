;(function($){
	var Placeholder = function(options) {
		this.height = 36;
        this.paddingL = 0
		this.$body = $('body');
		this.initialize();
	};
	Placeholder.prototype = {
		initialize: function() {
			this.setPlaceholderStatus();
		},

		setPlaceholderStatus: function() {
			var _this = this;
			setTimeout(function() {
				_this.getTemplate();
				_this.setPlaceholderStatus();
			}, 200);
		},

		getTemplate: function() {
			var _this = this;

            $('[placeholder]').each(function(e) {
				var $el = $(this);
                _this.height=$el.css('line-height')
                _this.paddingL=(parseInt($el.css('padding-left'))||0)+(parseInt($el.css('text-indent'))||0)+(parseInt($el.css('margin-left'))||0)+"px";
				var $inputBox;
				var $placeholder = $el.next('.tx_placeholder');
				if(!$placeholder.length&&$el.attr("placeholder")) {
					var placeholderValue = $el.attr('placeholder');
					$el.attr('placeholder', '');
					$inputBox = $('<div style="position:relative;display:inline-block;*display:inline; *zoom:1;overflow:hidden;"></div>');
					$placeholder = $('<span class="tx_placeholder" style="text-indent:1px;cursor:text;display:none;padding-left:'+_this.paddingL+';position:absolute;left:0px;top:0;line-height:'+(_this.height)+';*line-height:'+ (_this.height)+'!important;">'+placeholderValue +'</span>');

					$el.wrap($inputBox);
					$el.after($placeholder);
					$el.css("float","left");
					$el.bind('focus', function() {
						$el.attr('is-focus', 'true');
						$placeholder.css({
							display: 'none'
						});
					});

					$el.bind('blur', function() {
						$el.attr('is-focus', '');
					});

					$placeholder.bind('mousedown', function() {
						$el.focus();
					});
				}
				else {
					$inputBox = $el.parent();
				}
				
				if($el.attr('is-focus')) {
					return;
				}
				if($el.val()) {
					$placeholder.css({
						display: 'none'
					});
				}
				else {
					$placeholder.css({
						display: 'block'
					});
				}
			});
		}
	};
	
	var ua = navigator.userAgent.toLowerCase();
	var reTrident = /\btrident\/([0-9.]+)/;
	var reMsie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
	var version;
	if (!reMsie.test(ua)) {
		return false;
	}
	$(document).ready(function() {
		new Placeholder();
	});
})(jQuery);