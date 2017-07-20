
/******************登录 api******************/
apiServer.passport = com_server + '/passport';
apiServer.logincs = com_server + '/tradeView/logincs';
apiServer.loginwebcs=PASSPORT+"/passport/loginwebcs"

apiUrl.loginWeb = apiServer.passport + '/loginWeb?&RANDOM=' + Math.random(); //登录
apiUrl.newLoginWeb=apiServer.loginwebcs+"/loginWeb"//登入
apiUrl.getPhotoValidCode=apiServer.loginwebcs+"/getPhotoValidCode"//登入获取验证码