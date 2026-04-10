// libs
import * as React from 'react';
import { Button, Modal } from 'fooui';
import { connect } from 'react-redux';
import { IAccountState } from '../store/mt4store';
// action
import { fetchAccount, selectAllAccount, deleteAccount } from '../actions/accountTableActions';
import { initDivide, initAccountGroup, initLeverage } from '../actions/batchToolActions';
// ui
import DivideModal from './divideModal';
import LeverageModal from './leverageModal';
import AccountGroupModal from './accountGroupModal';
import { DeleteConfirm } from '../../customermgmt/components/deleteConfirm';
import PrivilegeHelper from '../../common/privilegeHelper';

/* ------------------- main start ---------------------- */
interface P {
  show?: boolean,
  selectedCount?: number,
  dispatch?: Function
}
class BatchTools extends React.Component<P, {}> {
  refs: any;
  constructor(props: P) {
    super(props);
  }

  unselectAccountList = () => {
    this.props.dispatch(selectAllAccount(false))
  }

  showDivideModal = () => {
    this.props.dispatch(initDivide())
    this.refs.divideModal.getWrappedInstance().show()
  }

  showLeverageModal = () => {
    this.props.dispatch(initLeverage())
    this.refs.leverageModal.getWrappedInstance().show()
  }

  showAccountGroupModal = () => {
    this.props.dispatch(initAccountGroup());
    this.refs.accountGroupModal.getWrappedInstance().show()
  }

  removeAcctHandler = () => {
    let ds = this.props.dispatch;
    let refContentCreator = function () {
      return <DeleteConfirm ref="recyclewarning" />
    };
    var m = Modal.show({
      title: '删除确认',
      hasOk: true,
      hasCancel: true,
      onOk: () => {
        ds(deleteAccount());
        ds(selectAllAccount(false));
        m.close();
      },
      onCancel: () => { },
      refContentCreator: refContentCreator
    })
  }

  render() {
    return (
      <div className="usermgmt-toolbar" style={{
        display: this.props.show ? 'inline-block' : 'none'
      }}>
        <span className="batchtool-thumbnail">
          已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
        <Button
          bsClass="btn btn-primary"
          onClick={this.unselectAccountList}
          >取消</Button>
        <Button bsClass="btn btn-primary" onClick={this.showDivideModal}>划转</Button>
        <Button bsClass="btn btn-primary" className={PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-LEVER") ? "privilegeYes" : "privilegeNo"} onClick={this.showLeverageModal}>修改杠杆</Button>
        <Button bsClass="btn btn-primary" onClick={this.showAccountGroupModal}>修改账户组</Button>
        <Button bsClass="btn btn-primary" className={PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_DELETE") ? "privilegeYes" : "privilegeNo"} onClick={this.removeAcctHandler}>删除</Button>
        <DivideModal ref="divideModal" />
        <LeverageModal ref="leverageModal" />
        <AccountGroupModal ref="accountGroupModal" />
      </div>
    )
  }
}

function mapStateToProps(state: IAccountState) {
  return {
    show: state.accountTable.showBatchTools,
    selectedCount: state.accountTable.selectedCount
  }
}

export default connect<P, any, any>(mapStateToProps)(BatchTools);
