'use strict';

let jwt = require('jsonwebtoken');

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);

	//应用的Secret key，登陆GoEasy->应用详情->Professional keys->Secret Key
	let secretKey = 'your secret key';

	let id = event.id;
	let protectedChannel = event.channel;

	let payload = {
		id: id,  //发送方，必须与connect GoEasy时传入的id一致
		channel: protectedChannel, //接收方，授权的channel
		w: true, //写权限，是否允许发送（publish）
		r: true //读权限，是否允许接收（subscriber）
	};

	let options = {
		expiresIn: "3h"  //token的有效时间，最长不能超过3小时，为了安全，GoEasy不接受有效时间大于3小时的access token
	};

	//用秘钥签名，生成token
	let accessToken = jwt.sign(payload, secretKey, options);	
	
	//返回数据给客户端
	return accessToken
};
