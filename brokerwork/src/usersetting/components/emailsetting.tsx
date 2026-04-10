import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Message} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {UserHelper} from '../../common/userHelper';
import { I18nLoader } from '../../i18n/loader';
import {MainPanelResizeUtil} from '../../common/resize';

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
            emailsetting: I18nLoader.get('user_setting.email_setting.email_setting'),
            originemail: I18nLoader.get('user_setting.email_setting.origin_email'),
            newemail: I18nLoader.get('user_setting.email_setting.new_email'),
            yes: I18nLoader.get('general.apply'),
            cancel: I18nLoader.get('general.cancel'),
            sendsuccess: ""
        }
    }

    componentDidMount(){//初始化获得用户邮箱信息
          new MainPanelResizeUtil().register(this);
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
                         Message.error(I18nLoader.getErrorText(res.mcode));
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
                        this.setState({
                            sendsuccess: I18nLoader.get('user_setting.email_setting.send_success_tips')
                        });
                     }else{
                         Message.error(I18nLoader.getErrorText(res.mcode));
                     }
                }
    }

    render() {
        return (
            <div id="main-content" className="merge-left">
                <div className="page-wrapper usermgmt-wrapper">
                <Row>
                  <div className="col-sm-12">
                        <Panel header={this.state.emailsetting} className="emailsetting main-panel" bsStyle="primary">
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
                </Row>
                </div>
             </div>  
                
        );
    }
}

export {EmailSetting};