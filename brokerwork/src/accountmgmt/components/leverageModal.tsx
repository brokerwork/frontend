// libs
import * as React from 'react';
import { Modal, Col, Row } from 'fooui';
import Leverage from '../model/leverage';
import { connect } from 'react-redux';
import { updateLeverage } from '../actions/batchToolActions';
import { IAccountState } from '../store/mt4store';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import { LoadingMask, Message } from 'fooui';
import { fetchAccount,selectAllAccount } from '../actions/accountTableActions';
/* ------------------- main start ---------------------- */

interface P {
  leverageArray: Array<Leverage>,
  dispatch?: Function
}

class LeverageModal extends React.Component<P,{}> {
  refs: any;
  constructor( props:any ) {
    super( props );
  }

  show = ()=>{
    this.refs.leverageModal.show()
  }

  close = ()=>{
    this.refs.leverageModal.close()
  }
  save = ()=>{
    let leverage = this.refs.LeverageSelect.value;
    let sendEmail = this.refs.sendEmail.checked;
    this.props.dispatch( updateLeverage(leverage,sendEmail) ).then((res:any)=>{
      if ( res.result ) {
        Message.success( '保存成功' );
        this.close();
        this.props.dispatch( fetchAccount() );
        this.props.dispatch( selectAllAccount(false) );
      } else {
        Message.error( I18nLoader.getErrorText(res.mcode) );
        LoadingMask.unmaskAll();
      }
    }).catch((error:any) => {
        Message.error( error.msg );;
        LoadingMask.unmaskAll()
      })
  }
  
  render() {
    return (
      <Modal 
        ref="leverageModal"
        title="修改杠杆"
        hasOk
        hasCancel
        onOk={this.save}
      >
        <div style={{width:490}} className="line-padding">
          <Row>
            <Col sm={4} style={{textAlign:'right', height: 34,lineHeight:'34px'}}>
              修改杠杆：
            </Col>
            <Col sm={8}>
              <select className="form-control" style={{width:250}} ref="LeverageSelect">
                {
                  this.props.leverageArray.map(l=>{
                    return <option value={l.zhCN}>{l.zhCN}</option>
                  })
                }
              </select>
            </Col>
          </Row>
          <Row>
            <Col sm={4} style={{textAlign:'right', height: 34,lineHeight:'34px'}}>
              发送修改杠杆邮件：
            </Col>
            <Col sm={8} style={{textAlign:'left', height: 34,lineHeight:'34px'}}>
              <input type="checkbox" className="checkbox-inline" ref="sendEmail"/>&nbsp;发送&nbsp;
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}
function mapStateToProps( state:IAccountState ) {
  return {
    leverageArray: state.addAccount.leverageArray
  }
}

export default connect<P,any,any>(mapStateToProps,undefined,undefined,{
  withRef:true
})(LeverageModal);