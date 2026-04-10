// 用法:
// message.success(content:string)
// message.error(content:string)
// message.info(content:string)
// message.warning(content:string)
import React from 'react';
import { render as domRender } from 'react-dom';
import { Icon } from 'antd';
import './index.less';
class Message extends React.Component{
    render() {
      return (
        <span className={this.props.type}>
          {this.props.value}
          <Icon type="close" onClick={this.props.clickClose}/>
        </span>
      )
    }
}
let top = -70;
let index = -1;
let messageObj = {
  init(type,value) {
    //内容单例模式
    const list = document.getElementsByClassName('message-fixed')
    if(list.length>0)
      if([].some.call(list,(e=>(e.innerText == value)))) return false
    let messageDom = document.createElement('div')
    messageDom.setAttribute('class','message-fixed')
    domRender(<Message type={type} value={value} clickClose={this.close}></Message>,messageDom)
    document.getElementById('root').appendChild(messageDom)
    top += 80
    index += 1
    setTimeout(()=>{
      document.getElementsByClassName('message-fixed')[index].style.top = top + "px"
    },100)
   
    setTimeout(()=>{
        this.close(index)
    },window.location.href.indexOf('localhost')===-1?2e3:2e5)
  },
  close(e) {
    let messageNode
    if(typeof e === 'number'){
      messageNode = document.getElementsByClassName('message-fixed')[e]
    }else{
      messageNode = e.target.parentNode.parentNode
    }
    messageNode.style.top = '-70px'
    setTimeout(()=>{
      messageNode.parentNode.removeChild(messageNode)
    },300)
    top -= 80
    index -= 1
  }
}
let message = {
  info(value){
    messageObj.init('info',value)
  },
  warning(value){
    messageObj.init('warning',value)
  },
  success(value){
    messageObj.init('success',value)
  },
  error(value){
    messageObj.init('error',value)
  }
}
export default message