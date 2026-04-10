import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Panel, Modal, Row, Col, Button, InputGroup
    FormGroup, Form, FormControl, ControlLabel} from 'fooui';
import * as DTO from '../../../taskmgmt/model/index';

/**
 * 这里只做新增Category的逻辑, 编辑的逻辑在表格里面了. 真是XXX的设计.
 */
interface P{
    addCategory?:Function;
    idGenerator:Function;
}
interface S{
    itemId?:string;
}

class CategoryModal extends React.Component<any,any>{
    refs: any;
    constructor(props){
        super(props)
        this.state = {
            itemId: null
        }
    }

    show = (itemId)=>{
        this.setState({itemId: itemId});
        this.refs.modal.show();
    }

    hide = ()=>{
        this.refs.modal.close();
    }
    
    addCategory = ()=>{
        var categoryNo = ReactDOM.findDOMNode(this.refs.categoryNo).value;
        var categoryName = ReactDOM.findDOMNode(this.refs.categoryName).value;
        var categoryVerify: boolean = ReactDOM.findDOMNode(this.refs.categoryVerify).checked;
        var categoryColor = ReactDOM.findDOMNode(this.refs.categoryColor).value;
        var categoryComments = ReactDOM.findDOMNode(this.refs.categoryComments).value;

        var category: DTO.FlowCategory = new DTO.FlowCategory({
            categoryNo: categoryNo,
            categoryName: categoryName,
            color: categoryColor,
            verify: categoryVerify,
            comments: categoryComments,
        });
        var itemId = this.state.itemId;
        this.props.addCategory(category, itemId);
    }

    render(){
        return (
            <Modal ref="modal" title="添加任务类型">
                <div style={{width: 490}}>
                    <Form horizontal>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel><span className="required-field">*</span>任务类型编号</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="categoryNo"
                                             readOnly
                                             value={this.props.idGenerator()}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel><span className="required-field">*</span>任务类型名称</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="categoryName"/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel>标记颜色</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="categoryColor"/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                            </Col>
                            <Col sm={3}>
                            <div style={{lineHeight: '20px'}} >
                                <input type="checkbox" 
                                        ref="categoryVerify"/>
                                <span>查看任务状态</span>
                            </div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel>备注</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="categoryComments" componentClass="textarea" placeholder="" />
                            </Col>
                        </FormGroup>
                    </Form>
                    <hr/>
                    <div className="pull-right">
                        <Button bsStyle="primary" onClick={this.addCategory}>保存</Button>
                        <Button onClick={()=>{this.hide()}}>取消</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default CategoryModal;