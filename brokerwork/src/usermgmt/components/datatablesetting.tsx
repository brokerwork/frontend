// libs
import * as React from 'react';
import { TableColumnOpt, Modal, Transfer } from 'fooui';
import { connect } from 'react-redux';
// store
import { UserAppState } from '../store/usermgmtstore';
import { changeUserTableColumn } from '../actions/useractions';
/* ------------------- main start ---------------------- */

interface P {
  tableColOptions?: Array<TableColumnOpt>,
  hideColOptions?: Array<TableColumnOpt>,
  changeUserTableColumn?: Function
}

class DataTableSetting extends React.Component<P,{}> {
  refs:any;
  constructor( props:P ) {
    super( props );
  }
  
  show = ()=>{
    this.refs.myModal.show();
  }
  close = ()=>{
    this.refs.myModal.close();
  }
  saveHandler = ()=>{
    let myTransfer = this.refs.myTransfer;
    let data = myTransfer.getData();
    let doDefault:any;
    let showData = data.data2.map( (d:{label:string,value:any})=>d.value );
    this.props.changeUserTableColumn( showData );
    this.close();
  }

  render() {
    let hideData = this.props.hideColOptions.map(colOpt=>{
      return {
        label: colOpt.title,
        value: colOpt
      }
    })
    let showData = this.props.tableColOptions.map(colOpt=>{
      return {
        label: colOpt.title,
        value: colOpt
      }
    })
    return (
      <Modal 
        show={false}
        ref="myModal"
        title="设置"
        hasCancel
        hasOk
        okText="保存"
        onOk={ this.saveHandler }
      >
        <Transfer 
          head1="隐藏字段" 
          head2="显示字段" 
          data1={hideData} 
          data2={showData}
          ref="myTransfer"
        />
      </Modal>
    )
  }
}

function mapStateToProps( state:UserAppState ) {
  let hideColOptions:Array<TableColumnOpt> = [];
  state.userMgmt.userTableAllColOptions.forEach( colOpt=>{
    if ( !state.userMgmt.userTableColOptions.find(co=>co.dataIndex===colOpt.dataIndex)) {
      hideColOptions.push( colOpt )
    }
  } )

  return {
    tableColOptions: state.userMgmt.userTableColOptions,
    hideColOptions: hideColOptions
  }
}

function mapDispatchToProps( dispatch:Function ) {
  return {
    changeUserTableColumn: function ( showData:any ) {
      dispatch( changeUserTableColumn( showData ) )
    }
  }
}

export default connect<P,any,any>( mapStateToProps, mapDispatchToProps, undefined, {withRef:true} )( DataTableSetting );