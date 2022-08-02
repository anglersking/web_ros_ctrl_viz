<template>
    <view class="content">
        <view class="header">
            <view class="title">GoEasy示例 - Hello world</view>
            <view class="description">UniCloud with AccessToken</view>
        </view>
        <view class="send-box">
            <input v-model="content"/>

            <view class="send-btn">
                <button @click="clientSend">客户端发送</button>
                <button @click="uniCloudSend">服务端(UniCloud)发送</button>
            </view>

        </view>


        <view class="message-content">
            <view class="message-text" v-for="(msg, index) in messages" :key="index">{{msg}}</view>
        </view>
    </view>
</template>

<script>

    export default {
        data() {
            return {
                content: "",//发送的消息内容
                messages: [], //接收到的消息列表
                accessToken: ""
            }
        },
        onLoad() {
            let self = this;


            //向服务端uniCloud请求token, 也可以换成像您用其他语言实现的rest api
            let acessTokenPromise = uniCloud.callFunction({
                name: "goeasy-generate-accesstoken",
                data: {
                    id: "user-001",
                    channel: "protected-channel_hello"
                }
            });

            //与GoEasy建立websocket连接
            this.goEasy.connect({
                id: "user-001",
                onSuccess: function () {
                    self.unshiftMessage("GoEasy connect successfully.")
                },
                onFailed: function (error) {
                    self.unshiftMessage("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
                },
                onProgress: function (attempts) {
                    console.log("GoEasy is connecting", attempts);
                }
            });


            //要接收消息，必须要获得开发者服务器的授权
            acessTokenPromise.then((e) => {

                //拿到服务端签名的token
                this.accessToken = e.result;

                //接收消息
                this.goEasy.pubsub.subscribe({
                    channel: "protected-channel_hello",
                    accessToken: this.accessToken,
                    onMessage: function (message) {
                        self.unshiftMessage(message.content)
                    },
                    onSuccess: function () {
                        self.unshiftMessage("订阅成功")
                    },
                    onFailed: function (error) {
                        self.unshiftMessage("订阅失败，错误编码：" + error.code + " 错误信息：" + error.content);
                    }
                });

            })


        },
        methods: {

            //客户端发送消息
            clientSend() {
                if (this.content.trim() != "") {
                    let self = this;
                    let notificationBody = this.content;
                    if (this.content.length >= 50) {
                        notificationBody = this.content.substring(0, 30) + "...";
                    }
                    this.goEasy.pubsub.publish({
                        channel: "protected-channel_hello",
                        accessToken: this.accessToken,
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


            uniCloudSend() {

                let self = this;

                uniCloud.callFunction({
                    name:"goeasy-websocket-message",
                    data: {
                        channel: "protected-channel_hello",
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


            unshiftMessage(content) {
                var formattedTime = this.formatDate(new Date(), "hh:mm");
                var message = formattedTime + " " + content;
                this.messages.unshift(message);
            },
            formatDate(date, format) {
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
                    if (o.hasOwnProperty(k)) {
                        if (new RegExp("(" + k + ")").test(format))
                            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                return format;
            }
        }
    }
</script>

<style>
    .content {
        padding: 20px 20px 0 20px;
        font-family: Source Han Sans CN;
        width: 100%;
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
        font-size: 20px;
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
