// libs
import * as React from 'react';
import { Modal } from 'fooui';
/* ------------------- main start ---------------------- */

let DeleteConfirmModal = {
  confirm( okCallback:Function ) {
    Modal.show( {
      title: '提示',
      content: <div style={{padding:'40px 70px'}}><i className="fa fa-warning" style={{color:'red',fontSize:'18px'}}></i>&nbsp;确定要删除吗？</div>,
      hasOk:true,
      hasCancel:true,
      className:'empty-content',
      onOk( c:any ) {
        if ( okCallback ) {
          okCallback( c )
        }
        c.close();
      }
    } )
  }
}

export default DeleteConfirmModal;
