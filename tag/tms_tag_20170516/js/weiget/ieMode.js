/**
 * 
 * @authors tianyanrong
 * @date    2015-6-16
 * @description: 提示IE浏览器升级的提示条，内部定义了：1）样式，2）提示文字
 * @example: 显示在自定义的位置：1）引入JS到页面头部，2）<div id="ieMode"></div> 
 * @example: 显示在页面底部：1）引入JS到页面头部
 * @version 
 */
;(function () {
	function IEMode() {
		var ua = navigator.userAgent.toLowerCase();
		var reTrident = /\btrident\/([0-9.]+)/;
		var reMsie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
		var version;
		if (!reMsie.test(ua)) {
			return false;
		}
		var m = reTrident.exec(ua);
		if (m) {
			version = m[1].split(".");
			version[0] = parseInt(version[0], 10) + 4;
			version = version.join(".");
		} else {
			m = reMsie.exec(ua);
			version = m[1];
		}
		return parseFloat(version);
	}
	var ie = IEMode(),
		div,
		html;	

	if (ie && ie < 8) {

		html = '您现在使用的浏览器版本过低，可能会导致部分图片和信息的缺失。请立即\
					<a title="免费升级至IE8浏览器" style="color:#0088cc;" href="http://www.microsoft.com/china/windows/IE/upgrade/index.aspx" target="_blank">免费升级至IE8浏览器</a>\
					或下载使用\
					<a title="下载Chrome浏览器" style="color:#0088cc;" href="http://dlsw.baidu.com/sw-search-sp/soft/9d/14744/ChromeStandalone_V43.0.2357.124_Setup.1433905898.exe" target="_blank">Chrome浏览器</a>';

		document.attachEvent("onreadystatechange", function(){
			div = document.getElementById('iEMode');
			if(!div) {
				div = document.createElement('div');
				div.id = "iEMode";
				div.style.position = 'absolute';				
				div.style.bottom = '0px';
				div.style.left = '0px';
				document.body.style.paddingBottom = '24px';
				document.body.appendChild(div);
				window.onscroll = function () {
					div.style.bottom = - document.documentElement.scrollTop + 'px';
		        };
			}
			div.style.width = '100%';
			div.style.background = '#ffff9b';
			div.style.paddingTop = '5px';
			div.style.paddingBottom = '5px';
			div.style.fontSize = '14px';
			div.style.textAlign = 'center';
			div.innerHTML = html;
			
		});		
	}
})();