#### 第一步通过 import 将组件引入页面
##### import yaokong from "../../components/wf-yaokong/wf-yaokong.vue"
#### 第二部将组件注册到页面中
##### comments:{ yaokong } 
#### 界面中使用组件
##### <wf-yaokong @btn_click="btn_click"></wf-yaokong>
#### 事件监听
##### ##### btn-click有一个参数，值分别是top , left , right , bottom , center
