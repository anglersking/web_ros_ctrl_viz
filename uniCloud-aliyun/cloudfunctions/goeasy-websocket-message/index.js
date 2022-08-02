'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	
	const res = await uniCloud.httpclient.request("https://rest-hangzhou.goeasy.io/publish", {
	    method: 'POST',
	    data: {
	      appkey: 'your common key', //您的appkey
		  channel: event.channel,
		  content: 'uniCloud: '+ event.content,
		  notification_title:'GoEasy-UniCloud', //可选，通知栏提醒标题
		  notification_body:'You have a new message.'//可选，通知栏提醒内容
	    },
	    contentType: 'json', // 指定以application/json发送data内的数据
	    dataType: 'json' // 指定返回值为json格式，自动进行parse
	  });
	  
	 console.log('rest api result:',res);


	//返回数据给客户端
	return res
};
