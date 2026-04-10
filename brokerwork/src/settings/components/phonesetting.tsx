import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P {

}
interface S {
    phonesetting: string,
    newphone: string,
    yes: string,
    cancel: string,
    originphone:string,
    checkcode: string,
    getcheckcode: string
}

class PhoneSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            phonesetting: "手机设置",
            originphone: "原手机号",
            newphone: "新手机号",
            yes: "确定",
            cancel: "取消",
            checkcode: "验证码",
            getcheckcode: "获取验证码"
        }
    }

    render() {
        return (
            <div style={{"height": window.innerHeight}} className="leftheightcontrol">
                <Panel header={this.state.phonesetting} className="phonesetting" bsStyle="primary">
                <div className="phonesettingcontent">
                  <Row>
                    <span className="basiclabel">{this.state.originphone}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="email" placeholder="jane.doe@example.com" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{this.state.newphone}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="email" placeholder="jane.doe@example.com" />
                       </FormGroup>
                 </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{this.state.checkcode}: </span>
                       <FormGroup className="threepartline" controlId="formInlineEmail">
                           <FormControl type="email" placeholder="jane.doe@example.com" />
                       </FormGroup>
                       <Button className="checkcodebtn">{this.state.getcheckcode}</Button>
                 </Row>
                 <Row>
                    <div className="confirmbasic">
                        <Button bsStyle="primary" className="yesbtn">{this.state.yes}</Button>
                        <Button bsStyle="primary">{this.state.cancel}</Button>
                    </div>     
                 </Row>
                </div>
            </Panel>
            </div>
        );
    }
}

export {PhoneSetting};