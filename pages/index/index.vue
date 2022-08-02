<template>
	<view class="content">
		<view class="header">
			<view class="title">The car control</view>
			<view class="description">Start</view>
		</view>
		<view class="flex echart-box">
			<view class="flex-1">
				<best-gauge :config="gaugeOption0"></best-gauge>
			</view>
			<view class="flex-1">
				<best-gauge :config="gaugeOption1"></best-gauge>
			</view>
					
		</view>
		<view class="uni-title">设置线速度单位(km/h)</view>
		<view>
			<slider value="0" max="200" min="-200"@change="sliderChange1" show-value />
		</view>
		<view class="uni-title">设置角速度单位(km/h)</view>
		<view>
			<slider  value="0" max="200" min="-200" @change="sliderChange2" show-value />
		</view>
		
    <view class="flex echart-box">
	   <wf-yaokong @btn_click="btn_click"></wf-yaokong>
	</view>
	
		<!--view class="send-box">
			<input v-model="content"/>
			<view class="send-btn">
				<button @click="clientSend">客户端发送</button>
				<button @click="uniCloudSend">服务端发送</button>
			</view>

		</view-->
		<view class="message-content">
			<view class="message-text" v-for="(msg, index) in messages" :key="index">{{msg}}</view>
		</view>
	</view>
</template>

<script>
	import bestGauge from '../../components/best-gauge/best-gauge.vue'
	import yaokong from "../../components/wf-yaokong/wf-yaokong.vue"
	export default {
		data() {
			let _width = uni.upx2px(350);
			
			return {
				linearsend:0,
			    angularsend:0,
				gaugeOption0:{
					id: 'gaugeId0',
					status: 1,//设备是否在线 0 离线 1在线
					value: 0,
					unit: 'Km/h',
					min: 0,
					max: 200,	
					name: '当前线速度',
					detail: {//数值单位设置
						title: {//name字体位置设置
							color:'#888888',
							fontSize: uni.upx2px(24),
							fontWeight:'500',
							offsetCenter:[0,uni.upx2px(-40)],
							textAlign:'center'
						},
						value: {
							color:'#323232',
							fontSize: uni.upx2px(48),
							fontWeight:'bold',
							offsetCenter:[-40,uni.upx2px(40)],//距离圆心直径偏移
							textAlign:'center'
						},
						unit: {
							color:'#323232',
							fontSize: uni.upx2px(22),
							fontWeight:'bold',
							offsetCenter:[-20,uni.upx2px(40)],//距离圆心直径偏移
							textAlign:'center'
						}
					},
					axisTickLength: 2//该属性与axisTick互斥，存在axisTickLength并大于0，axisTick就无效
				},
				gaugeOption1: {
					id: 'gaugeId1',
					bgColor:'rgba(255,255,255,1)',
					startAngle: 0.75,
					endAngle: 0.25,
					width: _width,
					status: 1,//设备是否在线 0 离线 1在线
					padding: 10,
					min: 0,
					max: 200,	
					value: 0,
					unit: 'Km/h',
					name: '当前角速度',
					detail: {//数值单位设置
						title: {//name字体位置设置
							color:'#888888',
							fontSize: uni.upx2px(24),
							fontWeight:'500',
							offsetCenter:[0,uni.upx2px(-40)],
							textAlign:'center'
						},
						value: {
							color:'#323232',
							fontSize: uni.upx2px(48),
							fontWeight:'bold',
							offsetCenter:[-40,uni.upx2px(40)],//距离圆心直径偏移
							textAlign:'center'
						},
						unit: {
							color:'#323232',
							fontSize: uni.upx2px(22),
							fontWeight:'bold',
							offsetCenter:[-20,uni.upx2px(40)],//距离圆心直径偏移
							textAlign:'center'
						}
					},
					axisTick:[//轴刻度线
						{
							width: uni.upx2px(25),//轴长
							number: 6,//轴数量（相当于几等分）
							color: '#369c96,#d5d5d5',//轴颜色(第一个值--指针之前的颜色，之后的颜色)
							subNumber: 10,//一个大刻度分成几个小刻度
							subHeight:1,
							subWidth:  uni.upx2px(25),
							padding: uni.upx2px(10)//刻度距离边距
						},
						{
							width: uni.upx2px(10),//轴长
							number: 6,//轴数量（相当于几等分）
							color: '#d5d5d5',//轴颜色(第一个值--指针之前的颜色，之后的颜色)
							subNumber: 10,//一个大刻度分成几个小刻度
							subHeight:1,
							subWidth:  uni.upx2px(6),
							padding: uni.upx2px(25)//刻度距离边距
						}
					]
				},
				content: "",//发送的消息内容
				messages: [] //接收到的消息列表
			}
		},
		onLoad() {
			
			var socketOpen = false;
			var socketMsgQueue = [];
			
			console.log("start..");
			uni.connectSocket({
			  url: 'ws://10.8.117.97:5000'
			});
			uni.onSocketOpen(function (res) {
			  console.log('WebSocket连接已打开！'); 
			  socketOpen = true;
			  for (var i = 0; i < socketMsgQueue.length; i++) {
			    sendSocketMessage(socketMsgQueue[i]);
			  }
			  socketMsgQueue = [];
			});
			 //console.log('收到服务器内容：');
			/*
			function sendSocketMessage(msg) {
			  if (socketOpen) {
			    uni.sendSocketMessage({
			      data: "masdadasdasg"
			    });
			  } else {
			    socketMsgQueue.push("asdad");
			  }
			}*/
			uni.onSocketMessage(function (res) {
			  console.log('收到服务器内容：' + res.data);
			 //
			});
			
		
			
			let self = this;

			//与GoEasy建立websocket连接
			/*
			this.goEasy.connect({
				id:"user-001",
				onSuccess: function(){
					self.unshiftMessage("GoEasy connect successfully.")
				},
				onFailed: function(error){
					self.unshiftMessage("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
				},
				onProgress: function(attempts){
					console.log("GoEasy is connecting", attempts);
				}
			});



            //订阅goeasy websocket消息
			this.goEasy.pubsub.subscribe({
				channel: "channel_hello",
				onMessage: function (message) {
					self.unshiftMessage(message.content)
				},
				onSuccess: function () {
					self.unshiftMessage("订阅成功")
				},
				onFailed: function (error) {
					self.unshiftMessage("订阅失败，错误编码："+error.code+" 错误信息："+error.content);
				}
			});*/
		},
		methods: {
			btn_click(type)
			{
				
				console.log(type)
				if(type=='top')
				{
					console.log(this.linearsend);
					uni.sendSocketMessage({
						data:"{\"linear\":{\"x\":"+JSON.stringify(this.linearsend) +",\"y\":"+ "0"+ ",\"z\":"+"0"+"},\"angular\":{\"x\":"+"0" +",\"y\":"+ "0"+ ",\"z\":"+'0'+"}}"
					});
					let that=this;
					uni.onSocketMessage(function (res) {
					  console.log('收到服务器内容：' + res.data);
					  that.unshiftMessage("ROS-订阅反馈：" + res.data);
					 /* var linear =res.data.split('linear ')[1].split('\nangular ')[0].split('\n')
					  var angular=res.data.split('angular ')[1].split('\n')
					  
								
					  console.log('线速度',linear);
					  console.log('角速度',angular);
					  console.log("最终解析",Number(linear[1].split(': ')[1]))
					  let gaugeOption0 = JSON.parse(JSON.stringify(that.gaugeOption0))
					  
					  gaugeOption0.value =parseFloat(linear[1].split(': ')[1]);
					  					 
					  that.gaugeOption0 = gaugeOption0;
					  
					  let gaugeOption1 = JSON.parse(JSON.stringify(that.gaugeOption1))
					  
					  gaugeOption1.value =parseFloat(angular[1].split(': ')[1]);
					  					 
					  that.gaugeOption1 = gaugeOption1;
					  */
					});
				}
				if(type=='bottom')
				{
					
					console.log(this.linearsend);
					uni.sendSocketMessage({
						data:"{\"linear\":{\"x\":-"+JSON.stringify(this.linearsend) +",\"y\":"+ "0"+ ",\"z\":"+"0"+"},\"angular\":{\"x\":"+"0" +",\"y\":"+ "0"+ ",\"z\":"+'0'+"}}"
					});
					let that=this;
					uni.onSocketMessage(function (res) {
					  console.log('收到服务器内容：' + res.data);
					 /* var linear =res.data.split('linear ')[1].split('\nangular ')[0].split('\n')
					  var angular=res.data.split('angular ')[1].split('\n')
					  
								
					  console.log('线速度',linear);
					  console.log('角速度',angular);
					  console.log("最终解析",Number(linear[1].split(': ')[1]))
					  let gaugeOption0 = JSON.parse(JSON.stringify(that.gaugeOption0))
					  
					  gaugeOption0.value =parseFloat(linear[1].split(': ')[1]);
					  					 
					  that.gaugeOption0 = gaugeOption0;
					  
					  let gaugeOption1 = JSON.parse(JSON.stringify(that.gaugeOption1))
					  
					  gaugeOption1.value =parseFloat(angular[1].split(': ')[1]);
					  					 
					  that.gaugeOption1 = gaugeOption1;*/
					  
					});
					
					
				}
				if(type=='left')
				{
					console.log(this.linearsend);
					uni.sendSocketMessage({
						data:"{\"linear\":{\"x\":"+"0" +",\"y\":"+ JSON.stringify(this.linearsend)+ ",\"z\":"+"0"+"},\"angular\":{\"x\":"+"0" +",\"y\":"+ "0"+ ",\"z\":"+'0'+"}}"
					});
					let that=this;
					uni.onSocketMessage(function (res) {
					  console.log('收到服务器内容：' + res.data);
					  /*var linear =res.data.split('linear ')[1].split('\nangular ')[0].split('\n')
					  var angular=res.data.split('angular ')[1].split('\n')
					  
								
					  console.log('线速度',linear);
					  console.log('角速度',angular);
					  console.log("最终解析",Number(linear[1].split(': ')[1]))
					  let gaugeOption0 = JSON.parse(JSON.stringify(that.gaugeOption0))
					  
					  gaugeOption0.value =parseFloat(linear[1].split(': ')[1]);
					  					 
					  that.gaugeOption0 = gaugeOption0;
					  
					  let gaugeOption1 = JSON.parse(JSON.stringify(that.gaugeOption1))
					  
					  gaugeOption1.value =parseFloat(angular[1].split(': ')[1]);
					  					 
					  that.gaugeOption1 = gaugeOption1;*/
					  
					});
					
				}
				if(type=='right')
				{
					console.log(this.linearsend);
					uni.sendSocketMessage({
						data:"{\"linear\":{\"x\":"+"0" +",\"y\":-"+ JSON.stringify(this.linearsend)+ ",\"z\":"+"0"+"},\"angular\":{\"x\":"+"0" +",\"y\":"+ "0"+ ",\"z\":"+'0'+"}}"
					});
					let that=this;
					uni.onSocketMessage(function (res) {
					  console.log('收到服务器内容：' + res.data);
					/*  var linear =res.data.split('linear ')[1].split('\nangular ')[0].split('\n')
					  var angular=res.data.split('angular ')[1].split('\n')
					  
								
					  console.log('线速度',linear);
					  console.log('角速度',angular);
					  console.log("最终解析",Number(linear[1].split(': ')[1]))
					  let gaugeOption0 = JSON.parse(JSON.stringify(that.gaugeOption0))
					  
					  gaugeOption0.value =parseFloat(linear[1].split(': ')[1]);
					  					 
					  that.gaugeOption0 = gaugeOption0;
					  
					  let gaugeOption1 = JSON.parse(JSON.stringify(that.gaugeOption1))
					  
					  gaugeOption1.value =parseFloat(angular[1].split(': ')[1]);
					  					 
					  that.gaugeOption1 = gaugeOption1;*/
					  
					});
					
				}
				if(type=='center')
				{
					console.log(this.linearsend);
					uni.sendSocketMessage({
						data:"{\"linear\":{\"x\":"+JSON.stringify(this.linearsend) +",\"y\":"+ JSON.stringify(this.linearsend) + ",\"z\":"+"0"+"},\"angular\":{\"x\":"+"0" +",\"y\":"+ "0"+ ",\"z\":"+JSON.parse(this.angularsend)+"}}"
					});
					let that=this;
					uni.onSocketMessage(function (res) {
					  console.log('收到服务器内容：' + res.data);
					 /* var linear =res.data.split('linear ')[1].split('\nangular ')[0].split('\n')
					  var angular=res.data.split('angular ')[1].split('\n')
					  
								
					  console.log('线速度',linear);
					  console.log('角速度',angular);
					  console.log("最终解析",Number(linear[1].split(': ')[1]))
					  let gaugeOption0 = JSON.parse(JSON.stringify(that.gaugeOption0))
					  
					  gaugeOption0.value =parseFloat(linear[1].split(': ')[1]);
					  					 
					  that.gaugeOption0 = gaugeOption0;
					  
					  let gaugeOption1 = JSON.parse(JSON.stringify(that.gaugeOption1))
					  
					  gaugeOption1.value =parseFloat(angular[1].split(': ')[1]);
					  					 
					  that.gaugeOption1 = gaugeOption1;*/
					  
					});
				}
				
			},
			update:function(){
				let gaugeOption0 = JSON.parse(JSON.stringify(this.gaugeOption0))
				let gaugeOption1 = JSON.parse(JSON.stringify(this.gaugeOption1))
				gaugeOption0.value = this.getRandom(gaugeOption0.max);
				gaugeOption1.value = this.getRandom(gaugeOption1.max);
				this.gaugeOption0 = gaugeOption0;
				
				this.gaugeOption1 = gaugeOption1;
			},
			getRandom:function(max){
				max = max || 100;
				let _random = (Math.random() * max).toFixed(1);
				return _random * 1;
			},

           sliderChange1(e) {
                       console.log('value ciansu 发生变化：' + e.detail.value)
					   this.linearsend=e.detail.value
					 
					  
                   },
				   
		   sliderChange2(e) {
				               console.log('value jiaosu发生变化：' + e.detail.value)
							   this.angularsend=e.detail.value;
							  /* let gaugeOption1 = JSON.parse(JSON.stringify(this.gaugeOption1))
							   
							   gaugeOption1.value = e.detail.value;
							   console.log(e.detail.value)
							   					 
							   this.gaugeOption1= gaugeOption1;*/
				           },
			//客户端发送
			clientSend() {
				console.log(this.linearsend);
				uni.sendSocketMessage({
					data:"{\"linear\":{\"x\":"+JSON.stringify(this.linearsend) +",\"y\":"+ JSON.stringify(this.linearsend) + ",\"z\":"+"0"+"},\"angular\":{\"x\":"+"0" +",\"y\":"+ "0"+ ",\"z\":"+JSON.parse(this.angularsend)+"}}"
				});
				let that=this;
				uni.onSocketMessage(function (res) {
				  console.log('收到服务器内容：' + res.data);
				  var linear =res.data.split('linear ')[1].split('\nangular ')[0].split('\n')
				  var angular=res.data.split('angular ')[1].split('\n')
				  
			
				  console.log('线速度',linear);
				  console.log('角速度',angular);
				  console.log("最终解析",Number(linear[1].split(': ')[1]))
				  let gaugeOption0 = JSON.parse(JSON.stringify(that.gaugeOption0))
				  
				  gaugeOption0.value =parseFloat(linear[1].split(': ')[1]);
				  					 
				  that.gaugeOption0 = gaugeOption0;
				  
				  let gaugeOption1 = JSON.parse(JSON.stringify(that.gaugeOption1))
				  
				  gaugeOption1.value =parseFloat(angular[1].split(': ')[1]);
				  					 
				  that.gaugeOption1 = gaugeOption1;
				  
				});
				if(this.content.trim() != "") {
					let self = this;
					let notificationBody = this.content;
					if(this.content.length >= 50){
						notificationBody = this.content.substring(0,30)+"...";
					}
					this.goEasy.pubsub.publish({
                        channel: "channel_hello",
                        message: 'client: ' + this.content,
                        //只要接收端APP参数以及GoEasy控制台参数正确配置，并且allowNotification为true，就可以接收通知栏提醒
                        //若不需要通知栏提醒，可以直接删掉notification
                        notification: {
                            title: "收到一条新消息",
                            body: notificationBody      // 字段最长50字符
                        },
                        onSuccess: function () {
                            self.content = ''; //清空发送消息内容
                        },
                        onFailed: function (error) {
                            self.unshiftMessage("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
                        }
                    });

				}
			},


			//服务端UniCloud发送
			uniCloudSend(){

                let self = this;
                uniCloud.callFunction({
                    name:"goeasy-websocket-message",
                    data: {
                        channel: "channel_hello",
                        content: this.content
                    },
                    success(data) {
                        if(data.result.status===200){
                            this.content="";
                        }else{
                            self.unshiftMessage("uniCloud发送失败，code：" + data.result.data.code + " error：" + data.result.data.content);
                        }
                    },
					fail(e) {
						console.log("call unicloud fail:",e)
					}
                });
			},



			//展示消息
			unshiftMessage(content) {
				var formattedTime = this.formatDate(new Date(), "hh:mm");
				var message = formattedTime +" "+ content;
				this.messages.unshift(message);
			},
			formatDate(date, format){
				var o = {
					"M+": date.getMonth() + 1,
					"d+": date.getDate(),
					"h+": date.getHours(),
					"m+": date.getMinutes(),
					"s+": date.getSeconds(),
					"q+": Math.floor((date.getMonth() + 3) / 3),
					"S": date.getMilliseconds()
				};
				if (/(y+)/.test(format))
					format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				for (var k in o)
					if(o.hasOwnProperty(k)){
						if (new RegExp("(" + k + ")").test(format))
							format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					}
				return format;
			}
		}
	}
</script>

<style>
	.flex-1{position: relative;-webkit-box-flex:  1;-ms-flex:  1;flex:  1;width: 50%;}
	.content {
		padding: 20px 20px 0 20px;
		font-family: Source Han Sans CN;
		width:100%;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #D02129;
		margin-top: 50px;
	}

	.header .title {
		height: 25px;
		line-height: 25px;
		font-size: 24px;
	}

	.header .description {
		height: 25px;
		line-height: 25px;
		font-size: 28px;
		font-weight: bold;
		margin-top: 10px;
	}

	.send-box {
		display: flex;
		flex-direction: column;
		height: 40px;
		margin-top: 32px;
		margin-bottom: 32px;
	}

	.send-box input {
		flex-grow: 1;
		background: #EFEFEF;
		border: 1px solid #C8C7CC;
		border-radius: 6px;
		padding: 8px;
	}
     .flex{display: -webkit-box;display: -ms-flexbox;display: flex;}
	.send-box button {
		color: #D02129;
		margin-top: 9px;
		font-size: 15px;
		height: 40px;
		line-height: 40px;
	}

	.send-btn {
		display: flex;
		justify-content: space-between;

	}

	.message-content {
		min-height: 300px;
		background: #FFFFFF;
		border: 1px solid #DADADA;
		margin-top: 26px;
	}

	.message-text {
		padding: 4px 11px;
	}
</style>
