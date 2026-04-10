import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Message} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {UserHelper} from '../../common/userHelper';
import {HttpClient} from '../../http/httpclient';
import {I18nLoader}from '../../i18n/loader';
import InitPasswordModal from '../../initPasswordModal';
import {MainPanelResizeUtil} from '../../common/resize';

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
            originpwd: I18nLoader.get('user_setting.change_pwd.origin_pwd'),
            newpwd: I18nLoader.get('user_setting.change_pwd.new_pwd'),
            confirmpwd: I18nLoader.get('user_setting.change_pwd.confirm_pwd'),
            yes: I18nLoader.get('general.apply'),
            cancel: I18nLoader.get('general.cancel'),
            changepwd: I18nLoader.get('user_setting.change_pwd.change_pwd')
        }
    }
    componentDidMount(){//初始化获得用户信息
          new MainPanelResizeUtil().register(this);
          const userInfo = UserHelper.getUserInfo();
          if (userInfo.needInitPass) {
                InitPasswordModal.show();
		  }
    }

    changepassword = () => {
        let origin = ReactDOM.findDOMNode(this.refs.origin).value;
        let newPwd = ReactDOM.findDOMNode(this.refs.newPwd).value;
        let verified = ReactDOM.findDOMNode(this.refs.verified).value;
        if (newPwd !== verified) {
            Message.error(I18nLoader.get('user_setting.change_pwd.pwd_not_same'));
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
                         Message.success(I18nLoader.get('general.modify_success'));
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
            <div id="main-content" className="merge-left">
                <div className="page-wrapper usermgmt-wrapper">
                <Row>
                  <div className="col-sm-12">
                  <Panel header={this.state.changepwd} className="changepwd main-panel" bsStyle="primary">
                        <div className="changepwdcontent">
                            <Row>
                                <span className="basiclabel"><span id="redstar">*</span>{this.state.originpwd}: </span>
                                <FormGroup className="halfline" controlId="formInlineEmail">
                                    <FormControl type="password" ref="origin" placeholder={I18nLoader.get('user_setting.change_pwd.origin_pwd_placeholder')} />
                                </FormGroup>
                            </Row>
                            <Row>
                                <span className="basiclabel"><span id="redstar">*</span>{this.state.newpwd}: </span>
                                <FormGroup className="halfline" controlId="formInlineEmail">
                                    <FormControl type="password" ref="newPwd" placeholder={I18nLoader.get('user_setting.change_pwd.new_pwd_placeholder')} />
                                </FormGroup>
                            </Row>
                            <Row>
                                <span className="basiclabel"><span id="redstar">*</span>{this.state.confirmpwd}: </span>
                                <FormGroup className="halfline" controlId="formInlineEmail">
                                    <FormControl type="password" ref="verified" placeholder={I18nLoader.get('user_setting.change_pwd.confirm_pwd_placeholder')} />
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
                </Row>
                </div>
            </div>  
        );
    }
}

export {ChangePwd};