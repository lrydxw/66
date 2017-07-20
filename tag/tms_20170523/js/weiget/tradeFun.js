/*
 * 业务中心公用
 * data:2016/3/5
 * by:hanzw
 * */
//功能对象
jQuery.prototype.serializeObject = function () {
	var obj = new Object();
	$.each(this.serializeArray(), function (index, param) {
		if (!(param.name in obj)) {
			obj[param.name] = param.value;
		}
	});
	return obj;
};
var tradeCommonFun = {
	$el: $('.body-content'),
	createPage: function (opt) {
		var _this=this;
		var option = {
			id: "pagination",
			pageSize: "20",
			showPage: 5,
			page:0
		};
		opt = $.extend(option, opt);
		var dirObj = $("." + opt.id);
		if (opt.count < 1) return;
		dirObj.each(function(){
			var obj=$(this);
			obj.pagination(opt.count, {
				num_edge_entries: 1,
				num_display_entries: opt.showPage,
				items_per_page: opt.pageSize,
				current_page:opt.page,
				prev_text: "<",
				next_text: ">",
				callback: function (i) {
					var html = "<a href='#' page='0'>首页</a>";
					var htmlfoot = "<a href='#' page='" + Math.ceil(opt.count / opt.pageSize - 1) + "'>尾页</a>";
					if (i == 0) {
						html = "<span class='prev' >首页</span>"
					}
					if (i == Math.ceil(opt.count / opt.pageSize - 1)) {
						htmlfoot = "<span class='next'>尾页</span>";
					}
					htmlfoot+='\<span class="total">共'+opt.count+'条</span>\
								<div class="t-c-input-select">\
									<input type="text" class="t-c-input" value="'+opt.pageSize+'"  init="true" readonly="readonly" />\
									<label class="t-c-input-icon"></label>\
									<ul class="input-option" style="display: none" name="pageSize">\
									<li data-value="10">10</li>\
									<li data-value="20">20</li>\
									<li data-value="30">30</li>\
									<li data-value="40">40</li>\
									<li data-value="50">50</li>\
									</ul>\
								</div>'
					
					obj.prepend(html).append(htmlfoot).find("a").click(function (e) {
						e.preventDefault();
						var $this = $(this),
							page = 0;
						if (!$this.hasClass("prev") && !$this.hasClass("next")) {
							//首位页
							if ($this.attr("page")) {
								page = parseInt($this.attr("page"));
								if (page == 0) {
									obj.find("a").eq(2).click();
								} else {
									obj.find("a").eq(-3).click();
								}
								return;
							} else {
								page = parseInt($this.html() - 1);
							}
							opt.callback(page,opt.pageSize);
						} else {
							opt.callback(parseInt(obj.find(".current:not('.prev'):not('.next')").html() - 1),opt.pageSize);
						}
					});
					_this.selectModal();
					_this.selectChangeVal();
					$(".pagination .input-option li").click(function(){
						if(opt.pageSize!=$(this).data("value")){
							var page=0,pageSize=$(this).data("value");
							$(".pagination .current").each(function(){
								var $this=$(this)
								if(!$this.hasClass("prev") && !$this.hasClass("next")){
									page=$this.html()-1;
								}
							})
							if(opt.count<(page*pageSize)){
								page=parseInt(opt.count/pageSize)
							}

							if(opt.count==(page*pageSize)){
								page=0
							}
							var pageObj=JSON.parse(iLocalStorage.getItem("page")||"{}");
							pageObj[location.href.split("/")[(location.href.split("/").length-1)]]=pageSize
							iLocalStorage.setItem("page",JSON.stringify(pageObj))
							opt.callback(page,pageSize);
							//opt.callback(parseInt(dirObj.find(".current:not('.prev'):not('.next')").html() - 1) * $(this).data("value"));
						}
					})
				}
			})
		})
		
	},//手机号修改
	dataMobileHandle: function (d, key) {
		if (!d.data.length) {
			var trademobilenumber = "";
			if (d.data[key]) {
				for (var j = 0; j < d.data[key].length; j++) {
					var gg = d.data[key][j];
					var x = parseInt(gg.x);
					var y = parseInt(gg.y);
					trademobilenumber += '<i class="number-img" style="background-position:-' + x + 'px -' + y + 'px;"></i>'
				}
				d.data[key] = trademobilenumber;
			}
		} else {
			$.each(d.data, function (i, e) {
				var trademobilenumber = "";
				if (e[key]) {
					for (var j = 0; j < e[key].length; j++) {
						var gg = e[key][j];
						var x = parseInt(gg.x);
						var y = parseInt(gg.y);
						trademobilenumber += '<i class="number-img" style="background-position:-' + x + 'px -' + y + 'px;"></i>'
					}
					e[key] = trademobilenumber;
				}
			});
		}
		return d;
	},
	//个位数转0
	smallTen: function (num) {
		return num < 10 ? ("0" + num) : num;
	},
	//自定义方法
	bindFn: function () {
		//按钮点击事件
		this.$el.on("mousedown", ".t-c-submit", function () {
			if (!$(this).hasClass("t-c-submit-disable")) {
				$(this).css("background-color", "#0075cd");
			}
		});
		this.$el.on("mouseup", ".t-c-submit", function () {
			if (!$(this).hasClass("t-c-submit-disable")) {
				$(this).css("background-color", "");
			}
		});
	},
	//radio绑定事件
	/*
	* 格式
	* <div class="t-radio"  radio="expression" data-chec="true">
	 即时货源<span class="t-radio-tips">（当晚12时前或次日12时前有效）</span>
	 </div>
	 */
	radioModal: function () {
		$(".t-radio").each(function () {
			var radio = $(this).attr("radio");
			if ($(this).closest("form").find('[name="' + radio + '"]').length < 1) {
				var value = $(".t-radio[radio='" + radio + "'][data-chec='true']").data("value");
				$(this).after('<input type="hidden" name="' + radio + '" value="' + value + '">');
			}
		}).click(function () {
			var $this = $(this);
			if (!$this.data("chec")) {
				$(".t-radio[radio='" + $this.attr("radio") + "']").data("chec", false).addClass("t-radio-false");
				$this.data("chec", true).removeClass("t-radio-false");
				$("[name='" + $this.attr("radio") + "']").val($this.data("value"));
			}
		});

	},
	//复选框
	checkModal: function () {
		$(".input-check").each(function (i, e) {
			var name = $(this).attr("name"),
				checkValue = $(this).hasClass("input-check-true") ? "true" : "false";
			$(this).after('<input type="hidden" name="' + name + '" value="' + checkValue + '" />');
		}).click(function () {
			if ($(this).hasClass("input-check-true")) {
				$(this).removeClass("input-check-true").next("input").val("false");
			} else {
				$(this).addClass("input-check-true").next("input").val("true");
			}
		});
	},
	//模拟下拉框
	/*格式
	 <div class="t-c-input-select t-c-input-error">
		   <input type="text" class="t-c-input input-width1 " placeholder="选择/输入城市名称"  require="true" init="true" />
		 <ul class="input-option" style="display: none" name="address" value="5米" >
			 <li data-value="5米">5米</li>
			 <li data-value="7米">7米</li>
			 <li data-value="12米">12米</li>
		 </ul>
	 </div>
	* */
	selectModal: function () {
		$(".t-c-input-select input").focus(function (e) {
			e.preventDefault();
			$(".input-option").hide().closest(".t-c-input-select");
			$(this).closest(".t-c-input-select").addClass("t-c-input-select-current").find(".input-option").show();
			setTimeout(function () {
				$(document).one("click", function (e) {
					if ($(e.currentTarget.activeElement).closest(".t-c-input-select").length < 1) {
						$(".input-option").hide()
					}
				});
			}, 300);

		}).keydown(function (e) {
			if ($(this).attr("init")) {
				e.preventDefault();
			}
		}).blur(function () {
			var $this = $(this);
			$this.closest(".t-c-input-select").removeClass("t-c-input-select-current")
		});

		$(".t-c-input-icon").click(function () {
			$(this).closest(".t-c-input-select").find("input").trigger("focus").trigger("click");
		});

		//模拟下拉框选择
		$(document).on("click", ".input-option li", function () {
			var $this = $(this);
			$this.closest(".t-c-input-select").find(".t-c-input").val($this.html())
			$this.closest(".t-c-input-select").find("input[type='hidden']").val($this.data("value"));
			$this.closest(".t-c-input-select").find(".input-option").hide()
		});
		$(".t-c-input-select").each(function (i, e) {
			if (!$(this).hasClass("t-c-input-select-date")&&$('input[name="' + $(this).find(".input-option").attr("name") + '"]').length<1) {
				$(this).css("z-index", 100 - i).append('<input type="hidden" name="' + $(this).find(".input-option").attr("name") + '" value="' + ($(this).find(".input-option").data("value") || '') + '" >');
			}
		});
	},
	//下拉框赋值
	selectChangeVal: function () {
		$(".t-c-input-select").each(function () {
			if ($(this).find("input[name='" + $(this).find(".input-option").attr("name") + "']").val()) {

				$(this).find(".input-option li[data-value='" + $(this).find("input[name='" + $(this).find(".input-option").attr("name") + "']").val() + "']").click()
			}
		});
		$(".t-radio").each(function () {
			if ($("[name='" + $(this).attr("radio") + "']").val()) {
				$(".t-radio[data-value='" + $("[name='" + $(this).attr("radio") + "']").val() + "']").click();
			}
		});
	},
	//暂无数据
	creatNodata: function (msg) {
		var msg = msg || "抱歉！暂时没找到数据！";
		var html = '<div class="no-model" style="">' +
			'<label class="no-model-icon"><img class="icon" src="../../css/img/t-no-model-icon.png" alt=""></label>' + msg +
			'</div>';
		return html;
	},
	//数字输入框
	numberInput: function () {
		var reg = new RegExp();
		$(".input-number").keyup(function () {
			reg = /[^0-9\.]+/g;
			// reg = /^(\d{1,6}(\.\d{1,2})?|(\d*\.))$/g;
			if ($(this).data("reg")) {
				reg = new RegExp($(this).data("reg"), "g")
			}
			if ($(this).data("max")) {
				if (parseInt($(this).data("max")) < parseInt($(this).val())) {
					$(this).val($(this).val().slice(0, -1));
				}
			}
			if (reg.test($(this).val())) {
				$(this).val($(this).val().replace(reg, ""));
			}
		});
	},
	//底部下载浮动条
	floatBottom: function () {
		$("#downApp").click(function () {
			if ($('.floatbox').hasClass('shrink')) {
				$('.floatbox').removeClass('shrink')
			} else {
				$('.floatbox').addClass('shake')
				setTimeout(function () {
					$('.floatbox').removeClass('shake')
				}, 1000)


			}
		});
		$(".right-move").click(function () {
			if ($('.floatbox').hasClass('shrink')) {
				$('.floatbox').removeClass('shrink')
			} else {
				$('.floatbox').addClass('shrink')
			}
		});

		$("#downApp").click(function () {

		});
	},
	stringFilter: function (str, len) {
		if (str.length > len) {
			return str.substr(0, len) + "..."
		} else {
			return str
		}
	},
	payRec: function () {
		var reg = new RegExp();
		$(".input-amount").keyup(function () {
			reg = /^(\d{1,6}(\.\d{1,2})?|(\d*\.))$/g;
			if ($(this).data("reg")) {
				reg = new RegExp($(this).data("reg"), "g");
			}
			var val = $(this).val();
			if (!reg.test(val)) {
				var _val = parseFloat(val.slice(0, val.length - 1));
				if (_val) {
					$(this).val(_val);
				}
				else {
					$(this).val('');
				}
			}
		});
	}
};

$(function () {
	tradeCommonFun.bindFn();
});
