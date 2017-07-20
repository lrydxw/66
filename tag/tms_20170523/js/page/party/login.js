$(function(){
    var tradeFun = transfar.Base.extend({
        //初始化
        initialize:function(){
            var _this=this;
            this.isRegister()
            this.type_select()
            this.reg_type='siji'
            this.writeinfo()
            this.level=''
            this.Isgoto=''//判断注册的用户 跳转到首页
            $(document).keyup(function(e){
                if(e.keyCode=="13"&&$(".login-username").is(":visible")){
                    _this.checking_login();
                }
            });
        },
        events:{
            'click .lg-submenu':'submenu',
            'click .repwd':'repwd',
            'click .back-item':'back_item',
            'click .login-btn':'checking_login',
            'click .reg_btn':'checking_reg',
            'blur .sign-username':'checking_name',
            'blur .sign-phone':'checking_phone',
            'blur .sign-pwd':'checking_Level',
            'blur .sign-number':'validateAuthCode',
            'blur .sign-messagecode':'validateIdentifyCode',
            'click .sign-message-btn':'send_code',
            'click .signinput':'clear_error',
            'keyup .login-password':'loginTips',
            'keyup .login-username': 'loginTips'

        },
        loginTips:function(){
          $(".lg-error").html("");
        },
        isRegister:function(){
            var url=getParamVal('source')
            if(url=='register'){
                $('.lg-submenu').eq(1).addClass('cur').siblings().removeClass('cur')
                $('.lg-subcont').eq(1).show().siblings().hide()
            }
            $('.forgetpwd').attr('href',com_server+"/site/partycentercs/security_forgetPwd")
        },
        submenu:function(e){
            var $this=$(e.currentTarget);
            if($this.hasClass('cur')){
                return
            }
            var index=$this.index()
            $('.lg-submenu').eq(index).addClass('cur').siblings().removeClass('cur')
            $('.lg-subcont').eq(index).show().siblings().hide()
        },
        repwd:function(e){
            var $this=$(e.currentTarget);
            if($this.hasClass('true-select')){
                $this.removeClass('true-select')
            }else{
                $this.addClass('true-select')
            }
        },
        type_select:function(){
            var _this=this;
            $(document).delegate('.select-type li','click mouseenter',function(e){
                var index=$(this).index()
                if(e.type=='click'){
                    switch (index){
                        case 0:
                            _this.reg_type='siji'
                            $('.info-title span').html('完善司机信息')
                            $('.sign-type-trade').hide()
                            break;
                        case 1:
                            _this.reg_type='gerenhuozhu'
                            $('.info-title span').html('完善个人货主信息')
                            $('.sign-type-trade').show()

                            break;
                        case 2:
                            _this.reg_type='qiyehuozhu'
                            $('.info-title span').html('完善企业货主信息')
                            $('.sign-type-trade').show()
                            break;
                    }
                    $('.rg-item').hide().eq(1).show()
                }else{
                    switch (index){
                        case 0:
                            $('.rg-tips').html('即需要个人信息认证、身份证认证、驾驶证认证、行驶证认证、真实头像认证。')
                            $('.rg-tips').show();
                            break;
                        case 1:
                            $('.rg-tips').html('即需要个人信息认证、身份证认证、真实头像认证。')
                            $('.rg-tips').show();
                            break;
                        case 2:
                            $('.rg-tips').html('即需要企业法人代表身份证认证、营业执照认证。')
                            $('.rg-tips').show();
                            break;
                    }
                }
            })
        	$(document).delegate('.select-type li','mouseout',function(e){
        		$('.rg-tips').hide();
        	})
        },
        back_item:function(){
            $('.rg-item').hide().eq(0).show()
        },
        checking_login:function(){
            var username=$.trim($('.login-username').val())
            var password=$.trim($('.login-password').val())
            if(username==''||password==''){
                new Pop({
                    type:"pop",
                    content:'用户名和密码不能为空',
                    callType:"success"
                }).init();
            }else{
                var c=CryptoJS.enc.Utf8.parse(username)
                var d=CryptoJS.enc.Utf8.parse(password)
                var base_a=CryptoJS.enc.Base64.stringify(c)
                var base_b=CryptoJS.enc.Base64.stringify(d)
                this.loginSubmit(base_a,base_b,username,password)
            }
        },
        writeinfo:function(){
            var Ncode='&clhahahawe_&*lj56pppwww&*^cwiejcoi123456sfc856963&'
            var v=iLocalStorage.getItem('lujing56remeberpwd')
            if(v){
                $('.login-username').val(v.split(Ncode)[1])
                $('.login-password').val(v.split(Ncode)[2])
                $('.repwd').addClass('true-select')
            }
        },
        errorinfo:function(c,d){
            var Ncode='&clhahahawe_&*lj56pppwww&*^cwiejcoi123456sfc856963&'
                if($('.repwd').hasClass('true-select')){
                    iLocalStorage.setItem('lujing56remeberpwd',Ncode+c+Ncode+d+Ncode,7)
                }else{
                    iLocalStorage.setItem('lujing56remeberpwd','')
                }
        },
        //图片验证码 校验
        validateAuthCode:function(){
            var _this = this;
            _this.checkCode = '';
            var code=$('.sign-number').val()
            var reg = new RegExp("(^|&|\\?)random=([^&]*)(&|$)");
            if(ret=$('.authImage').attr('src').match(reg)){
                var random=ret[2]
            }
            if(code){
                getJsonp({
                    url:apiUrl.validateAuthCode,
                    data:{
                        authCode:code,
                        random:random
                    },
                    callback:function(data){
                        if(data.result=='error'){
                            $('.sign-number').val(data.msg).addClass('input-error')
                            _this.checkCode = 'no';
                            return false
                        }else{
                        	_this.checkCode = 'ok';
                        }
                    }
                })
            }
        },
        //手机校验码 验证
        validateIdentifyCode:function(){
            var mobilenumber=$('.sign-phone').val(),
                identifycode=$('.sign-messagecode').val()
            if(mobilenumber!=''&&identifycode!=''){
                getJsonp({
                    url:apiUrl.validateIdentifyCode,
                    data:{
                        mobilenumber:mobilenumber,
                        identifycode:identifycode,
                        type:'网站-会员中心-会员注册'
                    },
                    callback:function(data){
                        if(data.result=='error'){
                            $('.sign-messagecode').val(data.msg).addClass('input-error')
                            return false
                        }
                    }
                })
            }
        },  
         loginSubmit:function(name,password,code){
            var _this=this
            getJsonp({
                tfSign:true,
                url:apiUrl.newLoginWeb,
                data:{
                    tf_ignore:"callback,_",
                    loginname:name,
                    photocaptcha:code,
                    password:password,
                    skipcode:'tradeview'
                },
                callback:function(data){
                    if(data.result=='success'){
                        var c=$(".login-username").val(),d=$(".login-password").val()
                        if(c&&d){
                            obj.errorinfo(c,d)
                        }
                        var script_url=com_server+'/passport/auth.js'
                        var script_mode=document.createElement('script')
                            script_mode.src=script_url
                            script_mode.type='text/javascript';
                        //$(document).append(script_mode)
                        document.getElementsByTagName("head")[0].appendChild(script_mode);
                        setTimeout(function(){
                            _this.loginMessage(_this)
                        },500)
                    }else{
                        if(data.code=="W51003"||data.code=="W51002"){
                            _this.loginCode(name,password,data.data)
                            return;
                        }
                        $('.lg-error').text(data.msg).show();
//                      alertMsg(data.msg)
                    }
                }
            })
        },
        loginCode:function(name,pwd,code){
            var _this=this;
                new Pop({
                        otherClass:"code-cover",
                        click:"other",
                        content:
                        '<span class="code-title">验证码：</span>' +
                        '<input type="text" class="code-input" id="loginCode" />'+
                        '<img src="data:image/jpg;base64,'+code+'" class="code-img" id="loginImg">',
                        footer: [{
                            text: '确定',
                            click: function (e) {
                                //_this.smsSendMessage(mobile,$(".code-input").val());
                                _this.loginSubmit(name,pwd,$("#loginCode").val())
                                e.remove();
                            }
                        },{
                            text: '取消'
                        }]
                    }).init();
            $("#loginImg").click(function(){
                 _this.getLoginCode();
            });
        },
        getLoginCode:function(){
             getJsonp({
                url:apiUrl.getPhotoValidCode,
                data:{
                    loginname:$(".login-username").val(),
                },
                callback:function(d){
                    if(d.result=="success"){
                       $("#loginImg").attr("src","data:image/jpg;base64,"+d.data)
                    }else{
                        alertMsg(d.msg)
                    }
                }
            })
        },
        ////密码框获得焦点  提示密码格式
        //pwd_tips:function(){
        //    $('.pwd-tips').html('6-20位字符,可使用字母,数字或符号组合')
        //},
        ////用户名获得焦点  提示用户名格式
        //name_tips:function(){
        //  $('.username-tips').html('6-20位字符,(中文,字母,数字,"_","-"),区分大小写')
        //},
        loginMessage:function(){
            var param = {};
            param.url = apiUrl.getLoginMsg;//获取登录信息
            param.data ={}
            param.callback = function(data){
                if(data.result != 'success'){
                    alertMsg(data.msg);
                    return;
                }else{
                    if(!data.data){
                        return;
                    }
                    var r = data.data;
                    var nowtime = new Date().getTime();
                    r.time = nowtime;
                    var partyStr = JSON.stringify(r);
                    iLocalStorage.setItem('partyObj',partyStr,1);
                }
                obj.isDispatchOwner()
            }
            param.errorCallback = function(){
                alertMsg(data.msg);
            }
            getJsonp(param);
        },
        isDispatchOwner:function(){
            var param = {};
            param.url = apiUrl.selectDispatchRole;//是否是货主
            param.callback = function(data){
                if(data.result != 'success'){
                    alertMsg('您不能使用陆鲸供应链项目');
                    iLocalStorage.removeItem('partyObj');
                    iLocalStorage.removeItem('session_key');
                    return;
                }else{
                    var r = data.data.role;
                    var nowtime = new Date().getTime();
                    r.time = nowtime;
                    var partyStr = JSON.stringify(r);
                    iLocalStorage.setItem('DispatchRole',partyStr,1);
                    if(r=='agent'){
                        window.location='../order/agentOrder.html?type=dispatch'
                    }else{
                        window.location='../trade/goodsRelease.html'
                    }
                }

            }
             param.errorCallback = function(){
                alertMsg(data.msg);
            }
            getJsonp(param);
        },
        clear_error:function(e){
            var $this=$(e.currentTarget)
            if($this.hasClass('input-error')){
                $this.removeClass('input-error').val('')
                if($this.hasClass('sign-pwd')){
                    $('.pwd-tips').html('')
                }
            }

        },
        checking_name:function(){
            var partyname=$('.sign-username').val()
            if(partyname.length<6||partyname.length>20){
            	$('.sign-username').val("长度需在6-20位间").addClass('input-error');
            	return;
            }
            if(partyname){
                getJsonp({
                    url:apiUrl.validatePartyName,
                    data:{
                        partyname:partyname
                    },
                    callback:function(data){
                        if(data.result=='error'){
                            $('.sign-username').val(data.msg).addClass('input-error')
                            return false
                        }
                    }
                })
            }
        },
        gotoIndex:function(a,b){

            var c=CryptoJS.enc.Utf8.parse(a)
            var d=CryptoJS.enc.Utf8.parse(b)
            var base_a=CryptoJS.enc.Base64.stringify(c)
            var base_b=CryptoJS.enc.Base64.stringify(d)
            this.loginSubmit(base_a,base_b)
            this.Isgoto='yes'
        },
    })
    var obj = new tradeFun({
        $el:$('.LoginAndRegister')
    });
})



var address=AddressComponent('no')
address.start()

function callback(d){
    localStorage.token=app_stoken= d.data.app_stoken;
}