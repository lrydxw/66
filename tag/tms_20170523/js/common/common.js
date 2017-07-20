/******************测试配置*******************/
var com_server = "https://sitetest.tf56.com"; //配置主入口 测试
var com2_server = "https://sitetest.tf56.com"; //配置主入口 测试 用于旺载
var wangzai_server = "https://statictest.tf56.com/lujing/tms"; //旺载测试入口
var lujing56_server = "https://statictest.tf56.com/lujing/lujing56" // lujing56测试
//var bigdata_server="" //业务统计大数据接口测试机 本地反向代理
var cash_server = "http://cashtest.tf56.com" //支付和充值  的页面域名  生产环境是https的
var OPENAPI="https://partyopenapitest.tf56.com"
var PASSPORT="https://sitetest.tf56.com"

/******************生产配置*******************/
if (!location.href.match('test') && (location.href.match('tf56.com') || location.href.match('lujing56.com'))) {
	com_server = "https://www.tf56.com"; //配置主入口 生产
	com2_server = "https://www.lujing56.com"; //配置主入口 生产 用于旺载
	wangzai_server = "https://www.lujing56.com/tms"; //旺载生产入口
	lujing56_server = "https://www.lujing56.com/lujing56"; // lujing56生产
	//	bigdata_server="http://10.33.36.22" //业务统计大数据接口生产机
	cash_server = "https://cash.tf56.com" //支付和充值  的页面域名
	OPENAPI="https://partyopenapi.tf56.com"
	PASSPORT="https://passport.tf56.com"
}
/*if(location.href.match('localhost')){
	OPENAPI=PASSPORT=com_server=com2_server=""
}*/

/***********************host地址***********************/
var apiServer = {}; //到控制层 3.0新结构
var apiUrl = {}; //完整url 3.0新结构
var app_stoken = ''; //token 3.0新结构
//app_stoken = app_stoken?app_stoken:"a88f777108d394d52aac29f2535c3fb7";
//if(iLocalStorage&&iLocalStorage.getItem('token')){
//	app_stoken = iLocalStorage.getItem('token');
//}
var commonMsg = {};
commonMsg.net_error = '网络不给力,请检查网络连接';

//cnzz
var _czc = [];
setTimeout(function () {
	var newNode = document.createElement("script");
	newNode.src = 'https://s95.cnzz.com/z_stat.php?id=1258266082&web_id=1258266082';
	document.querySelector("head").appendChild(newNode);
	setTimeout(function () {
		_czc.push(["_setCustomVar", '包名', 'tms', 1]);
	}, 500)
}, 500)



/******************登录 api******************/
apiServer.passport = com_server + '/passport';
apiServer.logincs = com_server + '/tradeView/logincs';
apiServer.loginwebcs=PASSPORT+"/passport/loginwebcs"

apiUrl.loginWeb = apiServer.passport + '/loginWeb?&RANDOM=' + Math.random(); //登录
apiUrl.logoutWeb = apiServer.passport + "/logoutWeb?skipCode=tradeview"; //登出 删除cookie
apiUrl.getLoginMsg = apiServer.logincs + "/getLoginMsg?app_stoken=" + app_stoken; //获取登录信息
apiUrl.newLoginWeb=apiServer.loginwebcs+"/loginWeb"//登入
apiUrl.getPhotoValidCode=apiServer.loginwebcs+"/getPhotoValidCode"//登入获取验证码

/**************************头部******************************/
var topfun = transfar.Base.extend({
	//初始化
	initialize: function () {
		//      this.checkLogin();//测试
		window.location.href

		$('head').append('<meta name="renderer" content="webkit">')
			.append('<link rel="shortcut icon" href="../../css/img/favicon.ico">');

		/* this.partyObj,//会员信息
		 this.islogin=false,//是否登录

		 this.isindex=false,//是否为首页
		 this.tradeType='';//角色*/
		this.isindex = false;
		this.needlogin = false; //是否需要登录
		if (location.href.match('view/trade') || location.href.match('view/driver')) { //trade、driver目录下需要登录
			this.needlogin = true;
		}
		if (location.href.match('party/index.html')) {
			this.isindex = true;
		}
		this.data = {
			islogin: false,
			isindex: this.isindex,
			tradeType: '',
			info: [{
				title: '您好！欢迎访问传化陆鲸',
				url: ''
			}, {
				title: '登录',
				url: '../party/login.html'
			},
			// {title:'注册',url:'../party/login.html?source=register'},
			{
				title: '',
				url: ''
			},
			],
			list: [{
				title: '返回首页',
				url: lujing56_server + '/view/party/index.html'
			}, {
				title: '会员中心',
				url: com_server + '/site/partycentercs/partyCenterIndex',
				open: 1
			}, {
				title: '收单宝',
				url: com_server + '/billSiteView/logincs/index_main',
				open: 1
			}, {
				title: '我的钱包',
				url: com_server + '/myWallet/view/index/index.html',
				open: 1
			}],
			indexUrl: [
				'', //移动端下载
				'http://down.tf56.com:5683/lujing/last/lujing.zip', //桌面端下载
				'../trade/goodsRelease.html' //业务中心 货主
			],
			imgClass: 'bt-allparty' //bt-allparty bt-owner bt-driver
		};
		this.checkRole();

		//用于详情
		this.initData();
	},
	//添加事件（基于委托，绑定动态加载元素）
	events: {
		'click .d-click': 'goUrl',
		'click .month-btn': 'initData',
		'click .logout': 'logout'
	},
	//自定义方法
	//demo方法 详情型
	initData: function () {
		var source = '<div class="bt-fdiv">' +
			'<div class="bt-div1">' +
			'<div class="bt-info">' +
			'<span>{{info[0].title}}</span>' +
			'<span class="font-blue font-bold d-click" urlOpen="{{info[1].open}}" dataurl="{{info[1].url}}">{{info[1].title}}</span>' +
			// '<span class="font-blue font-bold {{if info[2].addclass }}{{info[2].addclass}}{{else}}d-click{{/if}}" urlOpen="{{info[2].open}}" dataurl="{{info[2].url}}">{{info[2].title}}</span>'+
			'<span class="font-blue font-bold {{if info[2].addclass }}{{info[2].addclass}}{{else}}d-click{{/if}}" urlOpen="{{info[2].open}}" dataurl="{{info[2].url}}">{{info[2].title}}</span>' +
			'</div>' +
			'<div class="bt-menu" style="display:none;">' +
			'<ul>' +
			'{{if islogin }}' +
			'{{each list as value index}}' +
			' <li class="d-click {{if isindex&&index==0 }}hid{{/if}}" dataurl="{{value.url}}" urlOpen="{{value.open}}">{{value.title}}</li>' +
			'{{/each}}' +
			'{{/if}}' +
			'{{if isindex||!islogin }}' +
			'<span class="bt-menuafter">' +
			'<span>服务时间：07:30-20:00（节假日照常服务）</span>' +
			'<span class="font-blue ">400-866-5566</span>' +
			'</span>' +
			'{{/if}}' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="bt-bdiv">' +
			'<div class="bt-div1 bt-ownerdiv">' +
			'<div class="d-click {{imgClass}}"  dataurl=' + lujing56_server + '/view/party/index.html>' +
			'<i class="iconfont bt-icon1">&#xe631;</i>' +
			'<i class="iconfont bt-icon2">&#xe632;</i>' +
			'<i class="iconfont bt-icon3">&#xe633;</i>' +
			'<span class="driver-span">司机</span>' +
			'<span class="owner-span">货主</span>' +
			'</div>' +
			'{{if isindex }}' +
			'<div class="bt-btn">' +
			'<span class="font-blue">首页</span>' +
			'<span class="d-cl-click d-click">移动端下载</span>' +
			'<span class="d-click" dataurl="{{indexUrl[1]}}">桌面端下载</span>' +
			'{{if tradeType.match("司机")&&tradeType.match("货主")}}' +
			'<span class="d-click" id="ownerTrade" dataurl="' + lujing56_server + '/view/trade/goodsRelease.html">货主中心</span>' +
			'<span class="d-click" id="driverTrade" dataurl="' + lujing56_server + '/view/driver/driverTrade.html">司机中心</span>' +
			'{{else if tradeType==""}}' +
			'<span class="d-click {{if !islogin }}hid{{/if}}" dataurl="{{list[1].url}}">会员中心</span>' +
			'{{else}}' +
			'<span class="yw-btn d-click {{if !islogin }}hid{{/if}}" dataurl="{{indexUrl[2]}}">业务中心</span>' +
			'{{/if}}' +
			'</div>' +
			'{{else if islogin}}' +
			'<div class="bt-service">' +
			'<span>服务时间：07:30-20:00（节假日照常服务）</span>' +
			'<span class="font-blue font-bold">400-866-5566</span>' +
			'</div>' +
			'{{/if}}' +
			'</div>' +
			'</div>';
		var render = template.compile(source);
		var html = render(this.data);
		$('.body-top').html(html);

	},
	checkRole: function () {
		var _this = this;
		var partyStr = iLocalStorage.getItem('partyObj');
		var obj = partyStr ? JSON.parse(partyStr) : '';
		var hour = 0;
		if (obj && obj.time) {
			var nowtime = new Date().getTime();
			hour = (nowtime - obj.time) / (1000 * 60 * 60);
			if (hour <= 24) {
				this.partyObj = obj;
			}
		}
		if (partyStr && hour < 24) {

			this.data.islogin = true;
			this.data.info = [{
				title: '您好！欢迎访问传化陆鲸',
				url: ''
			}, {
				title: this.partyObj.username_all,
				url: com_server + '/site/partycentercs/partyCenterIndex',
				open: 1
			}, {
				title: '退出',
				url: '',
				addclass: 'logout'
			}]
			//角色判断
			var partyPR = iLocalStorage.getItem('partyProductRole');
			if (partyPR) {
				var PrObj = JSON.parse(partyPR);
				for (var i = 0; i < PrObj.length; i++) {
					var r = PrObj[i];
					if (r.businessroleid == 1) {
						if (!this.data.tradeType.match('司机')) {
							this.data.tradeType = this.data.tradeType + '司机';
						}
					}
					if (r.businessroleid == 2 || r.businessroleid == 3) {
						if (!this.data.tradeType.match('货主')) {
							this.data.tradeType = this.data.tradeType + '货主';
						}
					}
					if (r.isselected == 1) {
						if (r.businessroleid == 1) {
							this.data.tradeType = '司机';
							break;
						}
						if (r.businessroleid == 2 || r.businessroleid == 3) {
							this.data.tradeType = '货主';
							break;
						}
					}
				}
			}
			//此处有坑(订购) to-do
			if (this.data.tradeType.match('司机') && this.data.tradeType.match('货主')) {
				this.data.imgClass = 'bt-allparty';
			} else if (this.data.tradeType.match('司机')) {
				this.data.imgClass = 'bt-driver';
				this.data.indexUrl[2] = lujing56_server + '/view/driver/driverTrade.html';
			} else if (this.data.tradeType.match('货主')) {
				this.data.imgClass = 'bt-owner';
			}
			//需要校验登录状态 延时校验以免影响操作
			if (this.needlogin) {
				setTimeout(this.checkLogin, 500); //检查登录状态
			}
		} else {
			//没有party信息，校验是否是登录状态
			setTimeout(function () {
				_this.backstage()
			}, 500); //检查登录状态
			if (this.needlogin) {
				//接口会提示 不需要重复提示
				//      		alertMsg('登录后才能操作！');
			}
		}

	},
	logout: function (e) {
		var domThis = $(e.currentTarget); //当前元素
		iLocalStorage.removeItem('partyObj');
		iLocalStorage.removeItem('partyProductRole');
		//退出登录
		var param = {};
		param.url = apiUrl.logoutWeb;
		param.callback = function (data) {
			window.location.href = wangzai_server + '/view/party/login.html';
		}
		param.errorCallback = function () {
			//	    	window.location.href = '../party/index.html';
		}
		getJsonp(param);
		setTimeout(function () {
			window.location.href = wangzai_server + '/view/party/index.html';
		}, 500);
	},
	goUrl: function (e) {
		var _this = this;
		var domThis = $(e.currentTarget); //当前元素
		var dataurl = domThis.attr('dataurl');
		var urlOpen = domThis.attr('urlOpen');
		var partyProductRoleObj = {};
		if (domThis.attr("id") == "ownerTrade") {
			new Pop({
				content: '确认使用货主后台吗？',
				footer: [{
					text: '确定',
					click: function () {
						_this.changeRole(3, dataurl)
					}
				}, {
					text: '取消'
				}],
				cover: true,
				coverClick: false
			}).init()
			return;
		}
		if (domThis.attr("id") == "driverTrade") {
			new Pop({
				content: '确认使用司机后台吗？',
				footer: [{
					text: '确定',
					click: function () {
						_this.changeRole(1, dataurl)
					}
				}, {
					text: '取消'
				}],
				cover: true,
				coverClick: false
			}).init()
			return;
		}
		if (dataurl && dataurl != '#') {
			if (urlOpen == 1) {
				window.open(dataurl);
			} else {
				window.location.href = dataurl;
			}
		}
	},
	changeRole: function (id, url) {
		getJsonp({
			url: apiUrl.updatePartyProductRoleByProductIdAndBusinessRoleId,
			data: {
				productid: 1,
				businessroleid: id
			},
			callback: function (data) {
				if (data.result == "success") {
					partyProductRoleObj = JSON.parse(iLocalStorage.getItem('partyProductRole'));
					$.each(partyProductRoleObj, function (i, e) {
						if (id == 1) {
							if (e.businessroleid == 1) {
								e.isselected = 1;
							}
						} else {
							if (e.businessroleid == 2 || e.businessroleid == 3) {
								e.isselected = 1;
							}
						}
					});
					iLocalStorage.setItem("partyProductRole", JSON.stringify(partyProductRoleObj));
					location.href = url;
				} else {
					alertMsg("选择角色失败，请刷新重试");
				}
			}
		});
	},
	backstage: function () {
		var _this = this;
		var param = {};
		param.url = apiUrl.getLoginMsg; //获取登录信息
		param.data = {}
		param.callback = function (data) {
			if (data.result == 'success') {
				if (!data.data) {
					return;
				}
				var r = data.data;
				var nowtime = new Date().getTime();
				r.time = nowtime;
				var partyStr = JSON.stringify(r);
				iLocalStorage.setItem('partyObj', partyStr);
				_this.partyProductRole();
			}
		}
		param.errorCallback = function () {
			if (typeof Pop == 'function') {
				var dPop = $('.pop-cover').css('display');
				if (dPop == 'block') {
					return;
				}
				var pop = new Pop({
					footer: [{
						text: '确定',
						click: function () {

						}
					}],
					content: commonMsg.net_error
				});
				pop.init();
			} else {
				alert(commonMsg.net_error)
			}
		}
		getJsonp(param);
	},
	partyProductRole: function () {
		var _this = this;
		var param = {};
		param.url = apiUrl.selectPartyProductRoleByPartyIdAndProductId20160302; //获取订购信息
		param.data = {
			productid: 1
		}
		param.callback = function (data) {
			if (data.result != 'success') {
				alertMsg(data.msg);
				return;
			} else {
				if (!data.data) {
					return;
				}
				var li = data.data;
			 	for(var i =0;i<li.length;i++){
                	var n = li[i];
                	delete n.partyproductroleid;
                	delete n.partyid;
                	delete n.productid;
                }
				var partyStr = JSON.stringify(li);
				iLocalStorage.setItem('partyProductRole', partyStr, 1);

				_this.checkRole();

				_this.initData();
			}
		}
		param.errorCallback = function () {
			alertMsg(data.msg);
		}
		getJsonp(param);
	},
	checkLogin: function (e) {
		var nowtime = new Date().getTime();
		var partyObj = this.partyObj || (topobj && topobj.partyObj);
		if (partyObj && partyObj.time) {
			var mintue = (nowtime - partyObj.time) / (1000 * 60);
			if (mintue < 5) {
				return;
			}
		}
		var param = {};
		param.url = apiUrl.getLoginMsg; //获取登录信息  
		param.data = {}
		param.callback = function (data) {
			if (data.result != 'success') {
				/*if(typeof Pop == 'function'){
					var dPop= $('.pop-cover').css('display');
					if(dPop=='block'){
						return;
					}

					var pop=new Pop({
						footer:[
							{
								text: '确定',
								click: function () {

								}
							}
						],
						content:data.msg
					});
					pop.init();
				}else{
					alert(data.msg)
				}*/
			} else {
				if (!data.data) {
					return;
				}
				var r = data.data;
				var nowtime = new Date().getTime();
				r.time = nowtime;
				var partyStr = JSON.stringify(r);
				iLocalStorage.setItem('partyObj', partyStr);
			}
		}
		param.errorCallback = function () {
			if (typeof Pop == 'function') {
				var dPop = $('.pop-cover').css('display');
				if (dPop == 'block') {
					return;
				}

				var pop = new Pop({
					footer: [{
						text: '确定',
						click: function () {

						}
					}],
					content: commonMsg.net_error
				});
				pop.init();
			} else {
				alert(commonMsg.net_error)
			}
		}
		getJsonp(param);
	}
})
var topobj = new topfun({
	$el: $('.body-top')
});
/**************************菜单******************************/
var menufun = transfar.Base.extend({
	//初始化
	initialize: function () {
		//选取角色DispatchRole 来加载不同的左边栏
		//agent==经纪人(FBA) owner==货主 contractor==代理(总包商)
		this.menudata = {
			//'list': [],
			'list1': [{
				title: "订单管理",
				url: "#",
				list: [{
					title: "新增订单",
					url: '../order/addOrder.html'
				}, {
					title: "待调度订单",
					url: '../order/agentOrder.html?type=dispatch'
				}, {
					title: "在途订单",
					url: '../order/agentOrder.html?type=ing'
				}, {
					title: "完成订单",
					url: '../order/agentOrder.html?type=success'
				}]
			}, {
				title: "运力管理",
				url: "#",
				list: [{
					title: "我的司机",
					url: '../driver/myDriver.html'
				}]
			}, {
				title: "财务管理",
				url: "#",
				list: [{
					title: "待对账订单",
					url: '../trade/checkForManageAgent.html?type=sendCheckAgent'
				}, {
					title: "待付款订单",
					url: '../trade/payTheWaitAgent.html?type=sendPayTheWaitAgent'
				}, {
					title: "应收管理",
					url: '../order/ownerOrder-pay.html?type=ownerOrder'
				}, {
					title: "已付款订单",
					url: '../trade/payTheOverAgent.html?type=sendPayTheOverAgent'
				}/*, {
					title: "批量待支付管理",
					url: '../trade/payTheWaitAllAgent.html'
				}*/]
			}

			],
			'list2': [{
				title: "发货管理",
				url: "#",
				list: [{
					title: "新增货源",
					url: '../trade/goodsRelease.html'
				}, {
					title: "模板管理",
					url: '../trade/goodsModel.html'
				}]
			}, 
			{
				title: "订单管理",
				url: "#",
				list: [{
					title: "待调度订单",
					url: '../order/ownerOrder.html?type=dispatch'
				}, {
					title: "在途订单",
					url: '../order/ownerOrder.html?type=ing'
				}, {
					title: "完成订单",
					url: '../order/ownerOrder.html?type=success'
				}]
			},
			{
				title: "运力管理",
				url: "#",
				list: [{
					title: "我的承运商",
					url: '../driver/driverProviders.html'
				}]
			},
			// {title:"业务统计",url:"#",list:[
			// 	{title:"发货量统计",url:'../trade/goodsReleaseCount.html'}
			// 	// {title:"账单管理",url:'../trade/goodsTradeCount.html'}
			// ]},
			{
				title: "财务管理",
				url: "#",
				list: [{
					title: "待对账订单",
					url: '../trade/checkForManage.html?type=sendCheck'
				}, {
					title: "待付款订单",
					url: '../trade/payTheWait.html?type=sendPayTheWait'
				}, {
					title: "已付款订单",
					url: '../trade/payTheOver.html?type=sendPayTheOver'
				}/*, {
					title: "批量待支付管理",
					url: '../trade/payTheWaitAll.html'
				}*/]
			}

			],
			'list3': [{
				title: "货源管理",
				url: "#",
				list: [{
					title: "新增货源",
					url: '../trade/goodsRelease.html'
				}, {
					title: "模板管理",
					url: '../trade/goodsModel.html'
				}]
			}, 
			{
				title: "订单管理",
				url: "#",
				list: [{
					title: "待调度订单",
					url: '../order/packageOrder.html?type=dispatch'
				}, {
					title: "在途订单",
					url: '../order/packageOrder.html?type=ing'
				}, {
					title: "完成订单",
					url: '../order/packageOrder.html?type=success'
				}, {
					title: "已转运订单",
					url: '../order/packageOrder.html?type=send'
				}]
			}, {
				title: "运力管理",
				url: "#",
				list: [{
					title: "我的司机",
					url: '../driver/myDriver.html'
				}, {
					title: "我的承运商",
					url: '../driver/driverProviders.html'
				}]
			}, {
				title: "财务管理",
				url: "#",
				list: [{
					title: "待对账订单",
					url: '../trade/checkForManage.html?type=sendCheck'
				}, {
					title: "待付款订单",
					url: '../trade/payTheWait.html?type=sendPayTheWait'
				}, {
					title: "应收管理",
					url: '../order/ownerOrder-pay.html?type=ownerOrder'
				}, {
					title: "已付款订单",
					url: '../trade/payTheOver.html?type=sendPayTheOver'
				}/*, {
					title: "批量待支付管理",
					url: '../trade/payTheWaitAll.html'
				}*/]
			}

			],
		};
		var partyStr = iLocalStorage.getItem('DispatchRole');
		var Role = partyStr ? JSON.parse(partyStr) : '';
		switch (Role) {
			case "agent":
				this.menudata.list = this.menudata.list1
				break;
			case "owner":
				this.menudata.list = this.menudata.list2
				break;
			case "contractor":
				this.menudata.list = this.menudata.list3
				break;
		}
		//用于详情
		this.initData();
	},
	//添加事件（基于委托，绑定动态加载元素）
	events: {
		'click .d-click': 'goUrl',
		'click .month-btn': 'initData'
	},
	//自定义方法
	//demo方法 详情型
	initData: function () {
		var localHref = location.href;
		var source = '{{each list as value i}}' +
			'<p class="d-click" dataurl="{{value.url}}">{{value.title}}</p>' +
			'<ul>' +
			'{{each value.list as value1 i1}}' +
			'<li class="d-click" dataurl="{{value1.url}}">{{value1.title}}</li>' +
			'{{/each}}' +
			'</ul>' +
			'{{/each}}';
		var render = template.compile(source);
		var html = render(this.menudata);
		$('#tradeMenu').html(html);
		//打开收起菜单
		$('#tradeMenu p').on('click', function () {
			var dn = $(this).next().css('display');
			if (dn == 'block') {
				$(this).next().slideUp();
			} else {
				$(this).next().slideDown();
			}
		});
		$('#tradeMenu li').each(function () {
			if (localHref.indexOf($(this).attr("dataurl").replace(/\.\.\/[a-zA-Z]+\//g, "")) != -1 || localHref.replace(/\-[a-zA-Z]+/g, "").indexOf($(this).attr("dataurl").replace(/\.\.\/[a-zA-Z]+\//g, "")) != -1) {
				$(this).addClass("current")
			}
		});

	},
	goUrl: function (e) {
		var domThis = $(e.currentTarget); //当前元素
		var dataurl = domThis.attr('dataurl');
		if (dataurl && dataurl != '#') {
			window.location.href = dataurl;
		}
	}
})
var menuobj = new menufun({
	$el: $('.body-menu')
});

/**************************页脚******************************/
var footerfun = transfar.Base.extend({
	//初始化
	initialize: function () {
		this.data = {
			list: [{
				title: "新手指南",
				url: "#",
				list: [{
					title: "新手注册",
					url: lujing56_server + '/view/help/g-regProcess.html'
				}, {
					title: "会员认证",
					url: lujing56_server + '/view/help/g-vipConfirm.html'
				}, {
					title: "关于放心付",
					url: lujing56_server + '/view/help/g-giveCord.html'
				}, {
					title: "常见问题",
					url: lujing56_server + '/view/help/g-freAskedQuestion.html'
				}]
			}, {
				title: "陆鲸货主",
				url: "#",
				list: [{
					title: "新增货源",
					url: lujing56_server + '/view/party/goodsSendGoods.html'
				}]
			}, {
				title: "陆鲸司机",
				url: "#",
				list: [{
					title: "查找货源",
					url: lujing56_server + '/view/party/goodsGoodsQuick.html'
				}]
			}, {
				title: "联系合作",
				url: "#",
				list: [{
					title: "关于我们",
					url: lujing56_server + '/view/help/c-aboutUs.html'
				}, {
					title: "联系我们",
					url: lujing56_server + '/view/help/c-callUs.html'
				}, {
					title: "合作加盟",
					url: lujing56_server + '/view/help/c-joinInCooperation.html'
				}, {
					title: "意见反馈",
					url: lujing56_server + '/view/help/c-feedback.html'
				}]
			}],
			flink: [{
				title: "友情链接",
				url: "#",
				list: [{
					title: "易货嘀 ",
					url: 'http://www.ehuodi.com/view/login/index.html'
				}, {
					title: "运宝网",
					url: "http://www.tf56.com/"
				}, {
					title: "易货保",
					url: 'http://www.tf56.com/eciView/logincs/homepage'
				}]
			}]
		};
		//用于详情
		this.initData();
	},
	//添加事件（基于委托，绑定动态加载元素）
	events: {
		'click .d-click': 'goUrl',
		'click .month-btn': 'initData'
	},
	//自定义方法
	//demo方法 详情型
	initData: function () {
		var source = '<div class="bf-con">' +
			'<div class="bf-menu">' +
			'<i class="bf-i">' +
			'<i class="iconfont bt-icon4">&#xe631;</i>' +
			'<i class="iconfont bt-icon5">&#xe632;</i>' +
			'</i>' +
			'<div class="bf-link">' +
			'{{each list as value i}}' +
			'<div class="bf-item">' +
			'<p dataurl="{{value.url}}">{{value.title}}</p>' +
			'{{each value.list as value1 i1}}' +
			'<span class="d-click" dataurl="{{value1.url}}">{{value1.title}}</span>' +
			'{{/each}}' +
			'</div>' +
			'{{/each}}' +
			'</div>' +
			'<div class="bf-flink">' +
			'{{each flink as value i}}' +
			'<p dataurl="{{value.url}}">{{value.title}}</p>' +
			'{{each value.list as value1 i1}}' +
			'<span class="d-click" dataurl="{{value1.url}}">{{value1.title}}</span>' +
			'{{/each}}' +
			'{{/each}}' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="bf-bottom">' +
			'<p>copyright 2012-2016 All Right Reserved.浙ICP备17009598号-1</p>' +
			'<div style="width:250px;margin:0 auto; padding-bottom:10px;">' +
			'<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902000155" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="../../css/img/ghs.png" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#b4bbc9;width:auto;">浙公网安备 33010902000155号</p></a>' +
			'</div>' +
			'</div>';
		var render = template.compile(source);
		var html = render(this.data);
		$('.body-footer').html(html);

	},
	goUrl: function (e) {
		var domThis = $(e.currentTarget); //当前元素
		var dataurl = domThis.attr('dataurl');
		if (dataurl && dataurl != '#') {
			if (dataurl == '../trade/goodsRelease.html') {
				if (!topobj.islogin) {
					alertMsg('登录后才能发货！');
					return;
				}
				if (!topobj.tradeType.match('货主')) {
					alertMsg('您不是货主角色！');
					return;
				}
			}
			window.open(dataurl);
		}
	}
})
var footerobj = new footerfun({
	$el: $('.body-footer')
});