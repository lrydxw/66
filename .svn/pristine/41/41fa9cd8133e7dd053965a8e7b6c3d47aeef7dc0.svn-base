/**
 * 功能：验证邮箱是否有效
 * 提示信息：未输入或输入邮箱不正确,并获取焦点！
 * @param val email
 * @param elementId htmlId
 */
function isEmail(email){
	if(!email){
		alertMsg('请输入邮箱');
		
		return false;
	}
	var reg =/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
//	邮箱严格校验，坑较多 暂不启用
//	var reg =/^(\w-*\.*)+@(qq.com|126.com|yahoo.com|yahoo.com.cn|gmail.com|hotmail.com|sina.com|21.com|msn.com|163.com|yeah.net|yahoo.cn|foxmail.com|sohu.com|sogou.com|tom.com|21cn.com|live.cn|live.com|hexun.com|139.com|189.cn|91.com|56.com|eyou.com|people.com.cn |sh.com)$/;
	if(!email.match(reg)){
        alertMsg('请输入正确格式的邮箱');
		
		return false;
    }
	return true;
}
/**
 * 功能：验证手机是否有效
 * 提示信息：未输入或输入手机号码不正确,并获取焦点！
 * @param val mobile
 * @param elementId htmlId
 */
function isMobile(mobile){
	if(!mobile){
		return false;
	}
	var reg = /^1\d{10}$/;
	if(!mobile.match(reg)){
		return false;
    }
//	reg =/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0-9])\d{8}|(170[0|5|9])\d{7}$/;
////	reg =/^1[3|4|5|7|8][0-9]\d{4,8}$/;//校验版本2
//	if(!mobile.match(reg)){
//      alertMsg('请输入正确的手机号码');
//		
//		return false;
//  }
	return true;
}
/**
 * 功能：验证电话是否有效
 * 提示信息：未输入或输入电话号码不正确,并获取焦点！
 * @param val phone
 * @param elementId htmlId
 */
function isPhone(phone){
	if(!phone){
		alertMsg('请输入电话号码');
		
		return false;
	}
	if(phone.length < 9) {
		alertMsg('请输入包含区号的电话号码');
		
		return false;
	};
	var reg = /^0\d{2,3}-?\d{7,8}$/;
	if(!phone.match(reg)){
        alertMsg('请输入正确格式的电话号码');
		
		return false;
    }
	return true;
}
/**
 * 功能：验证手机或电话是否有效
 * 提示信息：未输入或输入电话号码不正确,并获取焦点！
 * @param val phone
 * @param elementId htmlId
 */
function isPhoneOrMobile(phone){
	if(!phone){
		alertMsg('请输入联系电话');
		
		return false;
	}
	if(phone.length < 9) {
		alertMsg('请输入包含区号的电话号码或手机号码');
		
		return false;
	};
	var reg = /^0\d{2,3}-?\d{7,8}$/;
	var reg1 = /^1\d{10}$/;
	if(!(phone.match(reg)||phone.match(reg1))){
        alertMsg('请输入正确格式的联系电话');
		
		return false;
    }
	if(phone.match(reg1)){
		reg =/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0-9])\d{8}|(170[0|5|9])\d{7}$/;
		if(!phone.match(reg)){
	        alertMsg('请输入正确号段的手机号码');
			
			return false;
	    }
	}
	return true;
}
/**
 * 功能：验证车牌号码（包括挂车等车牌）是否有效
 * 提示信息：未输入或输入车牌号码不正确,并获取焦点！
 * @param val platenumber
 * @param elementId htmlId
 */
function isCarplatenumber (carplatenumber){
	if(!carplatenumber){
		
		return false;
	}
	if(carplatenumber.length > 7) {
		
		return false;
	};
	
    var reg = /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新]{1}[A-Za-z]{1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警军港澳]{1}/;
    if(!carplatenumber.match(reg)){
		
		return false;
    }
    /*
	var reg = /[a-z]/;
    if(carplatenumber.match(reg)){
        alertMsg('车牌号中的字母请大写');
		
		return false;
    }*/
    
	return true;
}
/**
 * 功能：验证身份证号码是否有效
 * 提示信息：未输入或输入身份证号不正确,并获取焦点！
 * @param val certificatenumber
 * @param elementId htmlId
 */
function isCertificatenumber(certificatenumber){
	var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙 江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖 北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西 藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国 外"};
	var iSum = 0;
	var idCardLength = certificatenumber.length;
	if(!/^\d{17}(\d|x)$/i.test(certificatenumber)&&!/^\d{15}$/i.test(certificatenumber)){
		return false;
	}
         
	if(aCity[parseInt(certificatenumber.substr(0,2))] == null){
		
		return false;
	}
	// 15位身份证转换为18位
	if (idCardLength == 15){
		var cardID17 = certificatenumber.substring(0,6)+"19"+certificatenumber.substring(6);  
		    var N = 0;  
		    var R = -1;  
		    var T = '0';//储存最后一个数字  
		    var j = 0;  
		    var vs = "10X98765432";
		    var v = new Array();
		    v.push(2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7);
		    //计数出第18位数字     
		    for (var i = 16; i >= 0; i--){  
	            N += parseInt(cardID17.substring(i, i + 1)) * v[j];  
	            j++;  
		    }  
		    R = N % 11;  
		    T = vs.charAt(R);  
		    certificatenumber = cardID17 + T;
	}

    // 判断是否大于2078年，小于1900年
    var year = certificatenumber.substring(6,10);
    if (year < 1900 || year> 2078 ){
		
		return false;
    }
    
    //判断末尾x是否是大写
    if(certificatenumber.match('x')){
    	
    	return false;
    }
    
    //18位身份证处理

	//在后面的运算中x相当于数字10,所以转换成a
	certificatenumber = certificatenumber.replace(/x$/i,"a");

	sBirthday=certificatenumber.substr(6,4)+"-"+Number(certificatenumber.substr(10,2))+"-"+Number(certificatenumber.substr(12,2));
	var d = new Date(sBirthday.replace(/-/g,"/"))
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
		if(!(1986<=d.getFullYear()&&d.getFullYear()<=1991&&sBirthday==(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + (d.getDate()+1)))){
			document.getElementById(htmlIdStr).focus();
			return false;
		}
	}
                
    // 身份证编码规范验证
	for(var i = 17;i>=0;i --)
	iSum += (Math.pow(2,i) % 11) * parseInt(certificatenumber.charAt(17 - i),11);
	if(iSum%11!=1){
		
		return false;
	}
	// 判断是否屏蔽身份证
    var words = new Array();
    words = new Array("11111119111111111","12121219121212121");

    for(var k=0;k<words.length;k++){
        if (certificatenumber.indexOf(words[k])!=-1){
        	
        	return false;
        }
    }
    
    return true;
}

//限定两位小数
$('.J_decimalValidate').bind('input propertychange',function(){
	debugger;
	var val=$(this).val();
	var reg3=/^(\d*(\.\d{1,2})?|(\d*\.))$/;
	if(!reg3.test(val)){
		var _val = parseFloat(val.slice(0,val.length-1));
		if(_val){
			$(this).val(_val);
		}
		else{
			$(this).val('');
		}
	}
})