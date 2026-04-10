// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'fooui';
import { utils } from '../common/utils'
import { HttpClient } from '../http/httpclient';
import {I18nLoader} from '../i18n/loader';
/* ------------------- main start ---------------------- */

interface P {
  title?: string,
  content?: string,
  containerNode: any,
  id?: string
}

let floatMsgStyle = {
  position: 'fixed',
  right: 5,
  bottom: 0
}
let titleStyle = {
  height: 36,
  lineHeight: '36px',
  fontSize: '14px',
  textAlign: 'center',
  marginBottom: '20px'
}
let contentStyle = {
  width: 390,
  height: 70,
  overflow: 'hidden',
  marginBottom: '15px',
  textIndent: '24px'
}

class FloatMessage extends React.Component<P,{}> {
  static defaultProps:P = {
    title: '',
    content: '',
    containerNode: undefined
  }
  constructor( props:P ) {
    super( props );
  }

  close = ()=>{
    HttpClient.doPost( '/v1/message/isRead', {
      id: [this.props.id]
    } )
    ReactDOM.unmountComponentAtNode( this.props.containerNode )
  }

  toDetail = ()=>{
    location.href = utils.linkValue(`/msgmgmt#/details/${this.props.id}`);
    setTimeout(() => {
      location.reload(true);
    }, 100);
  }
  
  render() {
    return (
      <div className="panel floatMessageBox" style={floatMsgStyle}>
        <div className="panel-heading">
          <span>{I18nLoader.get('message.unread_message_title')}</span>
          <span className="tools pull-right">
            <a className="fa fa-times" style={{cursor:'pointer'}} onClick={this.close}></a>
          </span>
        </div>
        <div className="panel-body">
          <div style={titleStyle}>{this.props.title}</div>
          <div style={contentStyle}>{this.props.content}</div>
        </div>
        <div className="panel-footer" style={{overflow:"hidden"}}>
            <Button bsClass="pull-right btn btn-primary" onClick={this.toDetail}>{I18nLoader.get('general.view')}</Button>
        </div>
      </div>
    )
  }
}

interface O {
  title?: string,
  content?: string,
  id?: string
}

export default {
  show( opt:O ) {
    let currentContainer = document.createElement( 'div' );
    ReactDOM.render( <FloatMessage
      title={ opt.title }
      content={ opt.content }
      containerNode={ currentContainer }
      id={ opt.id }
    />, currentContainer )
    document.body.appendChild( currentContainer )
  }
}