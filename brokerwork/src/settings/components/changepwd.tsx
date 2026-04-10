import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Message} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {UserHelper} from '../../common/userHelper';
import {HttpClient} from '../../http/httpclient';
import {I18nLoader}from '../../i18n/loader';

interface P {

}
interface S {
   originpwd: string,
   newpwd: string,
   confirmpwd: string,
   yes: string,
   cancel: string,
   changepwd: string
}

class ChangePwd extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            originpwd: "原密码",
            newpwd: "新密码",
            confirmpwd: "确认密码",
            yes: "确定",
            cancel: "取消",
            changepwd: "修改密码"
        }
    }

    changepassword = () => {
        let origin = ReactDOM.findDOMNode(this.refs.origin).value;
        let newPwd = ReactDOM.findDOMNode(this.refs.newPwd).value;
        let verified = ReactDOM.findDOMNode(this.refs.verified).value;
        if (newPwd !== verified) {
            Message.error('两次输入的新密码不一致')；
            return;
        }
          let defaultParams:any = {
             'newPwd': newPwd,
             'origin': origin,
             'verified': verified
          }
          HttpClient.doPost('/v1/user/pwd/modify', defaultParams)
                  .then((res)=>{
                     if (res.result){
                         Message.success("修改成功");
                         setTimeout(function() {
                             if ( location.search.indexOf('$Path=/dev')>=0) {
                                window.location.href = "/login?$Path=/dev";
                            } else {
                                window.location.href = "/login";
                            }
                            
                         }, 1500);
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
    }

    render() {
        return (
            <div className="leftheightcontrol">
                <Panel header={this.state.changepwd} className="changepwd" bsStyle="primary">
                <div className="changepwdcontent">
                  <Row>
                    <span className="basiclabel"><span id="redstar">*</span>{this.state.originpwd}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="password" ref="origin" placeholder="请输入原密码" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{this.state.newpwd}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="password" ref="newPwd" placeholder="请输入新密码" />
                       </FormGroup>
                 </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{this.state.confirmpwd}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="password" ref="verified" placeholder="请再输入新密码" />
                       </FormGroup>
                 </Row>
                 <Row>
                    <div className="confirmbasic">
                        <Button bsStyle="primary" onClick={this.changepassword} className="yesbtn btn-basicinfo">{this.state.yes}</Button>
                        <Button bsStyle="default" className="btn-basicinfo">{this.state.cancel}</Button>
                    </div>     
                 </Row>
                </div>
            </Panel>
            </div>
        );
    }
}

export {ChangePwd};