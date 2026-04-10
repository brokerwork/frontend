import * as React from 'react';
import {Row, Col, Button,
    DropdownButton, MenuItem, CustomDateRangePicker,
    ButtonGroup, Select, Modal, SearchBox,Panel,NewSelect,Pagination,Table
} from 'fooui';
interface P{
    show?: boolean,
    selectedCount?:number,
    onRevertClick?:Function,
    onClearClick?:Function
}
interface S{

}
class RecycleBatchTools extends React.Component<P, S> {
    constructor(props:{}) {
        super(props);
        this.state={
            show:false
            //selectedCount:0
        }
    }
    //还原
    _onRevertClick = ()=>{
        this.props.onRevertClick();
    }
    //清空
    _onClearClick = ()=>{
        this.props.onClearClick();
    }
    render() {
        let style = {
            display: this.props.show ? 'inline-block' : 'none'
        };
        return (
            <div className="message-toolbar" style={ style }>
                <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
                <Button bsClass="btn btn-primary" onClick={this._onClearClick}>彻底删除</Button>
                <Button bsClass="btn btn-primary" onClick={this._onRevertClick}>还原</Button>
            </div>
        )
    }
}
export {RecycleBatchTools}