// libs
import * as React from 'react';
import { Modal, Col, Row } from 'fooui';
import AccountGroup from '../model/accountGroup';
import { IAccountState } from '../store/mt4store';
import { connect } from 'react-redux';
import { LoadingMask, Message } from 'fooui';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import { fetchAccount, selectAllAccount } from '../actions/accountTableActions';
import { updateAccountGroup } from '../actions/batchToolActions';
/* ------------------- main start ---------------------- */

interface P {
  accountGroupArray?: Array<AccountGroup>,
  dispatch?: Function
}

class AccountGroupModal extends React.Component<P,{}> {
  refs: any;
  constructor( props:any ) {
    super( props );
  }

  show = ()=>{
    this.refs.accountGroupModal.show()
  }

  close = ()=>{
    this.refs.accountGroupModal.close()
  }

  save = ()=>{
    let acctGroup = this.refs.acctGroupSelect.value;
    this.props.dispatch( updateAccountGroup(acctGroup) ).then((res:any)=>{
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
        ref="accountGroupModal"
        title="修改账户组"
        hasOk
        hasCancel
        onOk={this.save}
      >
        <div style={{width:490}} className="line-padding">
          <Row>
            <Col sm={4} style={{textAlign:'right', height: 34,lineHeight:'34px'}}>
              账户组：
            </Col>
            <Col sm={8}>
              <select className="form-control" style={{width:250}} ref="acctGroupSelect">
              {
                this.props.accountGroupArray.map( (item, index)=>{
                        return <option key={index} value={item.zhCN}>{item.zhCN}</option>
                } )
              }
              </select>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>

            </Col>
            <Col sm={8} style={{textAlign:'left', height: 34,lineHeight:'34px'}}>
              账户组修改之后，该操作无法恢复
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

function mapStateToProps( state:IAccountState ) {
  return {
    accountGroupArray: state.editAccount.accountGroupArray
  }
}

export default connect<P,any,any>(mapStateToProps,undefined,undefined,{
  withRef:true
})(AccountGroupModal);
