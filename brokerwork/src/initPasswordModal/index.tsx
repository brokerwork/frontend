require('babel-polyfill');
// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button,  Modal } from 'fooui';
import { utils } from '../common/utils'
import { HttpClient } from '../http/httpclient';
/* ------------------- main start ---------------------- */
interface P {
  containerNode?: any
}

interface S {
  isClose: boolean
}

class InitPasswordModal extends React.Component<P,S> {
  static defaultProps:P = {
    containerNode: undefined
  }
  constructor( props:P ) {
    super( props );
    this.state = {
      isClose: true
    }
  }

  toChangePassword = ()=>{
    this.setState({isClose: false});
  }
  
  render() {
    const {isClose} = this.state;
    return (
      <Modal 
        ref="initPasswordModal"
        title="初次登录提示"
        hasCancel
        show={isClose}
      >
          <div className="initPasswordModal">首次登录请尽快修改初始密码。</div>
      </Modal>
    )
  }
}

export default {
  show() {
    let currentContainer = document.createElement( 'div' );
    ReactDOM.render( <InitPasswordModal
      containerNode={ currentContainer }
    />, currentContainer )
    document.body.appendChild( currentContainer )
  }
}