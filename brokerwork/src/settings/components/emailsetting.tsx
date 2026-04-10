import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {UserHelper} from '../../common/userHelper';

let token = UserHelper.getToken();
let userInfo = UserHelper.getUserInfo();
interface P {

}
interface S {
    emailsetting: string,
    newemail: string,
    yes: string,
    cancel: string,
    originemail:string,
    sendsuccess: string
}

class EmailSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            emailsetting: "邮箱设置",
            originemail: "当前邮箱",
            newemail: "新邮箱",
            yes: "确定",
            cancel: "取消",
            sendsuccess: ""
        }
    }

    componentDidMount(){//初始化获得用户邮箱信息
          let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          HttpClient.doPost('/v1/user/currentUser', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        
                        var data = res.data;
                        ReactDOM.findDOMNode(this.refs.oldemail).value = data.email;
                     }else{
                         alert("重置失败");
                     }
                }
    }

    sendmailbind = () => {
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
        let mail = ReactDOM.findDOMNode(this.refs.newemail).value
        HttpClient.doPost('/v1/user/bind/' + mail + "/mail", {},  otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        this.setState({sendsuccess: '验证邮件已下发，请点击邮箱内链接重新激活登录'});
                     }else{
                         alert("拉取信息失败");
                     }
                }
    }

    render() {
        return (
            <div className="leftheightcontrol">
                <Panel header={this.state.emailsetting} className="emailsetting" bsStyle="primary">
                <div className="emailsettingcontent">
                  <Row>
                    <span className="basiclabel">{this.state.originemail}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="email" ref="oldemail" className="readonlytag" readOnly placeholder="" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{this.state.newemail}: </span>
                       <FormGroup className="halfline" controlId="formInlineEmail">
                           <FormControl type="email" ref="newemail" placeholder="" />
                       </FormGroup>
                 </Row>
                 <Row>
                    <div className="confirmbasic">
                        <Button bsStyle="primary" className="yesbtn btn-basicinfo" onClick={this.sendmailbind}>{this.state.yes}</Button>
                        <Button bsStyle="default" className="btn-basicinfo">{this.state.cancel}</Button>
                    </div>     
                 </Row>
                 <Row>
                    <div className="confirmbasic">
                        {this.state.sendsuccess}
                    </div>     
                 </Row>
                </div>
            </Panel>
            </div>
        );
    }
}

export {EmailSetting};