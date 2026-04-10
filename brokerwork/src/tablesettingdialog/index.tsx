// libs
import * as React from 'react';
import { Modal, TableColumnOpt, Transfer, Button } from 'fooui';
/* ------------------- main start ---------------------- */

interface TableSettingDialogProps {
  showColumns: Array<TableColumnOpt>
  hideColumns: Array<TableColumnOpt>
  onSave?: ( hideData:Array<TableColumnOpt>, showColumns: Array<TableColumnOpt> )=>void|boolean
} 

interface TableSettingDialogState {
  showColumns: Array<TableColumnOpt>
  hideColumns: Array<TableColumnOpt>
}

class TableSettingDialog extends React.Component<TableSettingDialogProps,TableSettingDialogState> {
  refs:any;
  constructor( props:TableSettingDialogProps ) {
    super( props );
    this.state = {
      showColumns: this.props.showColumns,
      hideColumns: this.props.hideColumns
    }
  }
  
  componentWillReceiveProps( nextProps:TableSettingDialogProps ) {

    this.setState( {
      showColumns: nextProps.showColumns,
      hideColumns: nextProps.hideColumns
    } );

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
    if ( this.props.onSave ) {
      let hideData = data.data1.map( (d:{label:string,value:any})=>d.value );
      let showData = data.data2.map( (d:{label:string,value:any})=>d.value );
      doDefault = this.props.onSave( hideData, showData )
    }
    if ( doDefault !== false ) {
      this.close();
    }
  }

  render() {
    let props = this.props;
    let state = this.state;
    let showData = state.showColumns.map( colOpt=>{
      return {
        label: colOpt.title,
        value: colOpt
      }
    } );
    let hideData = state.hideColumns.map( colOpt=>{
      return {
        label: colOpt.title,
        value: colOpt
      }
    } )

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

export { TableSettingDialog }
