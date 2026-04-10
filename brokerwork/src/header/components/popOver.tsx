// libs
import * as React from 'react';
import * as moment from 'moment';
import { HttpClient } from '../../http/httpclient';
import { Message } from 'fooui';
import {I18nLoader} from '../../i18n/loader';
/* ------------------- main start ---------------------- */

interface IMessage {
  id?: string,
  createDate?: number,
  title?: string,
  content?: string,
  fromName?: string
}
interface P {
  defaultMessages?: Array<IMessage>,
  onMarkRead?: (id:string, unreadCount:number)=>void
}

interface S {
  messages?: Array<IMessage>,
  show?: boolean
}

const MESSAGE_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss'

let messageItemRowStyle = {
  overflow: 'hidden',
  margin: '5px 15px'
}

let flStyle = {
  float: 'left'
}

let msgItemEllipsisStyle = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  height: '20px',
  lineHeight: '20px',
  textAlign: 'center',
  fontSize: '20px'
}
let senderStyle = {
  float: 'left',
  textOverflow: 'ellipsis',
  width: '40%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontSize: '12px'
}

let msgTitleStyle = {
  float: 'left',
  textOverflow: 'ellipsis',
  width: '80%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontSize: '12px'
}

let frStyle = {
  float: 'right'
}

let createDateStyle = {
  float: 'right',
  fontSize: '12px'
}
let checkStyle = {
  float: 'right',
  color: '#1fb5ad',
  cursor: 'pointer'
}

let messageItemStyle = {
  height: '55px',
  backgroundColor: '#fafafa',
  margin: '10px auto',
  borderRadius: '4px',
  overflow: 'hidden'
}
let emptyMessageItemStyle = {
  width: '270px',
  backgroundColor: '#fafafa',
  margin: '15px auto',
  borderRadius: '4px',
  overflow: 'hidden',
  textAlign: 'center',
  height: '30px',
  lineHeight: '30px'
}

let nonListStyle = {
  listStyle: 'none',
  margin: 0,
  padding: 0
}

let linktoallStyle = {
  float: 'right',
  color: '#1fb5ad'
}

function linkValue(str:string){
  if (location.href.indexOf('localhost') != -1){
    return str.replace(/(#.*$)/, function(match){
      return '?$Path=/dev' + match;
    })
  }
  return str;
}

class PopOver extends React.Component<P,S> {
  static defaultProps:P = {
    defaultMessages:[]
  }
  deferHideTimeout: number
  constructor( props:P ) {
    super( props );
    this.state = {
      messages: this.props.defaultMessages,
      show: false
    }
  }

  addMessage = (messages:Array<IMessage>)=>{
    this.setState( {
      messages: this.state.messages.concat( messages )
    } )
  }

  markRead = (id:string)=>{
    HttpClient.doPost( '/v1/message/isRead', {
      id: [id]
    } ).then(res=>{
      if( res.result ) {
        let newMessages = this.state.messages.filter( m=>m.id !== id);
        this.setState( {
          messages: newMessages
        } )

        if ( this.props.onMarkRead ) {
          this.props.onMarkRead( id, newMessages.length )
        }
      } else {
        Message.error( I18nLoader.getErrorText(res.mcode) );
      }
    })

  }

  renderItem = ( msg:IMessage, index: number )=>{
    return (
      <li style={nonListStyle} key={index}>
        <div style={messageItemStyle}>
          <div style={messageItemRowStyle}>
            <span style={msgTitleStyle} title={msg.title}>{msg.title}</span>
            <i 
              className="fa fa-check"
              onClick={()=>{this.markRead(msg.id)}}
              style={checkStyle}
            ></i>
          </div>
          <div style={messageItemRowStyle}>
            <span style={senderStyle} title={msg.fromName}>{msg.fromName}</span>
            <span style={createDateStyle}>{moment(msg.createDate).format(MESSAGE_DATE_FORMAT)}</span>
          </div>
        </div>
      </li>
    );
  }

  renderEmptyItem = ()=>{
    return (
      <li style={nonListStyle}>
        <div style={emptyMessageItemStyle}>
          {I18nLoader.get('message.no_message')}
        </div>
      </li>
    )
  }

  show = ()=>{
    if ( this.deferHideTimeout ) {
      clearTimeout( this.deferHideTimeout )
    }
    this.setState( {
      show: true
    } )
  }

  deferHide = ()=>{
    if ( this.deferHideTimeout ) {
      clearTimeout( this.deferHideTimeout )
    }
    this.deferHideTimeout = setTimeout(()=>{
      this.hide()
    }, 200);
  }

  hide = ()=>{
    this.setState( {
      show: false
    } )
  }

  render() {
    let mainStyle = {
      display: this.state.show ? 'block' : 'none',
      width: '298px',
      top: '45px',
      right: '-14px',
      left: 'auto',
      padding: '10px'
    }
    return (
      <div className="dropdown-menu header-popover" style={mainStyle}>
        <div style={{overflow:'hidden'}}>
          <span style={flStyle}>{I18nLoader.get('message.unread_message_title')}</span>
          <a href={linkValue("/msgmgmt#/")} style={linktoallStyle}>{I18nLoader.get('message.unread_message_all')}</a>
        </div>
        <div style={{maxHeight:'335px', overflow:'hidden', position:'relative'}}>
          <ul style={nonListStyle}>
            {
              this.state.messages.length > 0 ? 
                this.state.messages.map(this.renderItem) :
                this.renderEmptyItem()
            }
          </ul>
          {
            this.state.messages.length > 5? 
              <div style={msgItemEllipsisStyle}>...</div> :
              undefined
          }
        </div>
      </div>
    )
  }
}


export default PopOver;
