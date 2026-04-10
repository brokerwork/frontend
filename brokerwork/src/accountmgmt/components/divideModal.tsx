// libs
import * as React from 'react';
import { Modal, Col, Row } from 'fooui';
import UserBelongTo from '../model/userBelongTo';
import { connect } from 'react-redux';
import { IAccountState } from '../store/mt4store';
import { divide } from '../actions/batchToolActions';
import { LoadingMask, Message } from 'fooui';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import { fetchAccount,selectAllAccount } from '../actions/accountTableActions';
/* ------------------- main start ---------------------- */

interface P {
  userBelongToArray?: Array<UserBelongTo>,
  dispatch?: Function
}

class DivideModal extends React.Component<P,{}> {
  refs: any;
  constructor( props:any ) {
    super( props );
  }

  show = ()=>{
    this.refs.divideModal.show()
  }

  close = ()=>{
    this.refs.divideModal.close()
  }

  save = ()=>{
    let belongToUserId = this.refs.belongToSelect.value;
    let belongToUserName = this.props.userBelongToArray.find( u=>u.id==belongToUserId).name;
    this.props.dispatch( divide(belongToUserId,belongToUserName) ).then((res:any)=>{
      if ( res.result ) {
        Message.success( '保存成功' );
        this.close();
        this.props.dispatch( fetchAccount() );
        this.props.dispatch( selectAllAccount(false) )
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
        ref="divideModal"
        title="划转账户"
        hasOk
        hasCancel
        onOk={this.save}
      >
        <div style={{width:490}} className="line-padding">
          <Row>
            <Col sm={4} style={{textAlign:'right', height: 34,lineHeight:'34px'}}>
              账户归属：
            </Col>
            <Col sm={8}>
              <select className="form-control" style={{width:250}} ref="belongToSelect">
              <option value="">请选择</option>
              {
                this.props.userBelongToArray.map( ub=>{
                    return <option value={ub.id}>{ub.entityNo} : {ub.name}</option>
                })
              }
              </select>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>

            </Col>
            <Col sm={8} style={{textAlign:'left', height: 34,lineHeight:'34px'}}>
              客户转移成功之后，该操作无法恢复
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

function mapStateToProps( state:IAccountState ) {
  return {
    userBelongToArray: state.editAccount.userBelongToArray
  }
}

export default connect<P,any,any>(mapStateToProps,undefined,undefined,{
  withRef:true
})(DivideModal);
