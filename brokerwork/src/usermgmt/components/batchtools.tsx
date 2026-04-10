// libs
import * as React from 'react';
import { connect } from 'react-redux';
// UI component
import{ Button, UiPrivilege ,Modal, Message, LoadingMask} from 'fooui';
import SecuritySettingPopup from './securitySettingPopup';
import CommissionSettingPopup from './commissionSettingPopup';
import PrivilegeHelper from '../../common/privilegeHelper';
// store
import { UserAppState } from '../store/usermgmtstore';
// action
import { removeUserToRecycle } from '../actions/useractions';
import {
    fetchUserTableColumns,
    fetchUser,
    toggleUserSelect,
    toggleAllUserSelect,
    showUserEditor,
    SelectLevelCount,
    changeShowAllChecked
} from '../actions/useractions';
import {utils} from '../../common/utils';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';
import DivideModal from './divideModal';

/* ------------------- main start ---------------------- */

interface BatchToolsProps {
  show?: boolean,
  selectedCount?: number,
  removeUserToCycle?: Function,
  MassTransfer?: Function,
  toggleAllUserSelect?: Function,
  initDivide?: Function,
  SelectLevelCount?: Function,
  userHierarchy?:string,
  changeShowAllChecked?:Function,
  userList?:any,
  selectHierarchy?: any
}

class BatchTools extends React.Component<BatchToolsProps,{}> {
  refs: any;
  constructor( props:{} ) {
    super( props );
  }
  
  popupSecuritySetting = ()=>{
    this.refs.ssp.show();
  }

  showDivideModal = () => {
    const {userList, selectHierarchy, SelectLevelCount} = this.props;
    let selectedUserIds:Array<string> = [];
    let selectedUserLevelIds: Array<string> = [];
    let highestLevel;
    let chosenLevel;
    let isShow;
    for (var i = 0; i < selectHierarchy.length; i++)
    {
      if(selectHierarchy[i].sid === 1){
          highestLevel = selectHierarchy[i].id;
      }
    }

    userList.forEach(user => {
        if (user.selected) {
              selectedUserIds.push( user.id );
              selectedUserLevelIds.push( user.levelId );
        }
    });

    for (var i = 0; i < userList.length; i++)
    {
      if(userList[i].id === selectedUserIds[0]){
         chosenLevel = userList[i].levelId;
      }
    }

    for (var i = 0; i < selectedUserLevelIds.length; i++)
    {
      if(selectedUserLevelIds[i] !== chosenLevel || chosenLevel == 0){
         isShow = false
      }else{
        console.log(chosenLevel + "....");
        isShow = true;
      }
    }

    if(!isShow){
       Message.error("未设置层级的用户和层级不相同的用户不能被批量划转"); 
    }else{
        if(parseInt(chosenLevel) === parseInt(highestLevel)){
           Message.error("选中用户的层级已经是系统最高级，系统暂不支持降级划转"); 
         }else{
                SelectLevelCount(chosenLevel);
                setTimeout(this.refs.userDivideModal.getWrappedInstance().show());  
         }
    
    }
  }

  popupCommissionSetting = ()=>{
    this.refs.csp.show();
  }
  _cancel=()=>{
         this.props.changeShowAllChecked(false);
         this.props.toggleAllUserSelect(false);
  }


  render() {
    let selectedCount;
    let style= {
      display: this.props.show ? 'inline-block' : 'none'
    }
    return (
      <div className="usermgmt-toolbar" style={ style }>
        <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
          <Button
              bsClass="btn btn-primary"
              onClick={this. _cancel }
          >取消</Button>
            <Button
              bsClass="btn btn-primary"
              className={PrivilegeHelper.getHavePrivilege("USER_DELETE") ? "privilegeYes" : "privilegeNo"}
              onClick={ this.props.removeUserToCycle}
            >删除</Button>
            <Button
              bsClass="btn btn-primary"
              onClick={this.showDivideModal}
            >批量划转</Button>
        <Button bsClass="btn btn-primary" style={{display:'none'}}>修改上级</Button>
        <Button 
          bsClass="btn btn-primary"
          onClick={ this.popupSecuritySetting }
          style={{display:'none'}}
        >安全控制</Button>
        <Button 
          bsClass="btn btn-primary"
          onClick={ this.popupCommissionSetting }
          style={{display:'none'}}
        >佣金参数</Button>
        <SecuritySettingPopup ref="ssp"/>
        <CommissionSettingPopup ref="csp"/>
        <DivideModal ref="userDivideModal" />
      </div>
    )
  }
}

function mapStateToProps( state:UserAppState ) {
  return {
    show: state.userMgmt.showBatchTools,
    selectedCount: state.userMgmt.userSelectedCount,
    userHierarchy:state.userMgmt.userHierarchy,
    userList: state.userMgmt.userList,
    selectHierarchy:state.userMgmt.selectHierarchy
  }
}

function mapDispatchToProps( dispatch:Function ) {
  return {
    removeUserToCycle() {
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                dispatch( removeUserToRecycle() );
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    },
     toggleAllUserSelect: function ( selected:boolean ) {
         dispatch( toggleAllUserSelect( selected ))
     },
    SelectLevelCount(levelId) {
			dispatch(SelectLevelCount(levelId))
		},
    changeShowAllChecked(showAllChecked) {
      dispatch( changeShowAllChecked(showAllChecked) )
    }
  }
}

export default connect<BatchToolsProps, any, any>(mapStateToProps,mapDispatchToProps)( BatchTools );
