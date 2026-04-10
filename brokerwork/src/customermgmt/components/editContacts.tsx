// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import  {connect} from 'react-redux';
// components
import {Card, Form, FormGroup, Col, FormControl, Select, Button, ControlLabel  } from 'fooui';
// data
import {CustomerContactsDTO} from '../model/contacts';
import {addContacts} from '../actions/contactsActions';

interface P {
    addContacts?: Function;
}

interface S {
    name?: string;
    position?: string;
    gender?: string;
    birthday?: number;
    phone?: string;
    email?: string;
    remark?: string;
    show?: boolean;
    customName?: string;
}

class EditContactCard extends React.Component<P, S> {
    refs: any;
    contactId: string;
    customerId: string;
    constructor (props: P){
        super(props);
        this.customerId = '';
        this.contactId = '';
        this.state = {
            name: '联系人',
            position: 'position',
            gender: 'gender',
            birthday: 19970101,
            phone: '18888888888',
            email: 'example.@xx.com',
            remark: 'this is remark',
            show: false
        };
    }

    _onChangeName = (e: any)=> {
        // 可以在此处对数据进行校验
        
        this.setState({
            name: e.target.value
        });
    }
    _onChangePosition = (e: any)=> {
        this.setState({
            position: e.target.value
        });
    }

    _onChangeBirthday = (e: any)=> {
        this.setState({
            birthday: e.target.value
        });
    }

    _onChangePhone = (e: any)=> {
        this.setState({
            phone: e.target.value
        });
    }

    _onChangeEmail = (e: any)=> {
        this.setState({
            email: e.target.value
        });
    }

    _onChangeRemark = (e: any)=> {
        this.setState({
            remark: e.target.value
        });
    }

    _onClickSave = ()=> {
        let param: any = {
            contactId: this.contactId,
            customContact: {
                birthday: ReactDOM.findDOMNode(this.refs.birthday).value,
                comments: ReactDOM.findDOMNode(this.refs.remark).value,
                contactsName: ReactDOM.findDOMNode(this.refs.contactName).value,
                email: ReactDOM.findDOMNode(this.refs.email).value,
                phone: ReactDOM.findDOMNode(this.refs.phone).value,
                resign: ReactDOM.findDOMNode(this.refs.position).value
            },
            customerId: this.customerId,
            redundancy: {
                customName: this.state.customName
            }
        };
        this.props.addContacts(param);
        this.hideEditCard();
    };

    _onClickCancel = ()=> {
        
        this.hideEditCard();
    };

    showEditCard = (data: CustomerContactsDTO)=> {
        this.contactId = data.contactId;
        this.customerId = data.customerId;
        this.setState({
            name: data.customContact.contactsName,
            position: data.customContact.resign,
            gender: data.customContact.gender,
            birthday: data.customContact.birthday,
            phone: data.customContact.phone,
            email: data.customContact.email,
            remark: data.customContact.comments,
            customName: data.redundancy.customName,
            show: true
        });
        this.refs.editContact.show();
    };

    hideEditCard = ()=> {
        this.refs.editContact.hide();
    };

    render() {
        return (
            <Card title="修改联系人" ref="editContact" show={this.state.show} className="edit-contact">
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                            <span className="fa fa-star" style={{'color': 'red'}} />
                            客户名称:
                        </Col>
                        <Col md={10}>
                            <FormControl disabled value={this.state.customName} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                            <span className="fa fa-star" style={{'color': 'red'}} />
                            联系人姓名:
                        </Col>
                        <Col md={10}>
                            <FormControl ref="contactName" 
                                        value={this.state.name} 
                                        onChange={this._onChangeName}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                            职务:
                        </Col>
                        <Col md={10}>
                            <FormControl ref="position" 
                                        value={this.state.position} 
                                        onChange={this._onChangePosition}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                            生日:
                        </Col>
                        <Col md={10}>
                            <FormControl ref="birthday" 
                                        value={this.state.birthday}
                                        onChange={this._onChangeBirthday} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                           电话:
                        </Col>
                        <Col md={10}>
                            <FormControl ref="phone" 
                                        value={this.state.phone}
                                        onChange={this._onChangePhone} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                            邮箱:
                        </Col>
                        <Col md={10}>
                            <FormControl ref="email" 
                                        value={this.state.email}
                                        onChange={this._onChangeEmail} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} md={2}>
                            备注:
                        </Col>
                        <Col md={10}>
                            <FormControl ref="remark" 
                                        value={this.state.remark} 
                                        onChange={this._onChangeRemark} />
                        </Col>
                    </FormGroup>
                    <Button onClick={this._onClickCancel} style={{'float': 'right'}}>取消</Button>
                    <Button onClick={this._onClickSave} bsStyle="primary" style={{'float': 'right'}}>保存</Button>
                </Form>
            </Card>
        );
    }
}

function mapDispatchToProps(dispatch: Function) {
    return {
        addContacts: (param: any)=> {
            dispatch(addContacts(param));
        }
    }
}

export default connect(null, mapDispatchToProps, null, {withRef:true})(EditContactCard);