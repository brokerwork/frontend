import * as React from 'react';
import {Row, Col, Button,
    DropdownButton, MenuItem, CustomDateRangePicker,
    ButtonGroup, Select, Modal, SearchBox,Panel,NewSelect,Pagination,Table,Message
} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import DeleteConfirmModal from '../../deleteConfirmModal';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm'


interface P{
    show?: boolean,
    selectedCount?:number,
    id?:any,
    fetchMsgList?:Function,
    onDeleteClick?:Function
}
interface S{

}
class BatchTools extends React.Component<P, S> {
    constructor(props:{}) {
        super(props);
        this.state={
           show:false,
            selectedCount:0
        }
    }
    //删除
    _onDeleteClick = ()=>{
        //DeleteConfirmModal.confirm(()=>{
        //   this.props.onDeleteClick();
        //})
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning" draftInfo={false}/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                this.props.onDeleteClick();
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }

    render() {
        let style = {
            display: this.props.show ? 'inline-block' : 'none'
        };
        return (
            <div className="message-toolbar" style={ style }>
                <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
                <Button bsClass="btn btn-primary" onClick={this._onDeleteClick}>删除</Button>
            </div>
        )
    }
}
export {BatchTools}