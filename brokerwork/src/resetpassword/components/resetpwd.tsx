// libs
import * as React from 'react';
import {Button,
    NewSelect, MenuItem, CustomDateRangePicker,ButtonGroup,Message
} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {Form, FormGroup, 
    FormControl, Dropdown, ControlLabel, Grid, Row, 
    Col, Clearfix, Panel, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import * as classnames from 'classnames';
import * as ReactDOM from 'react-dom';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {I18nLoader} from '../../i18n/loader';
import { utils } from '../../common/utils'
/* ------------------- main start ---------------------- */
interface P {

}
interface S {
    value:string,
    login: string,
    errorTints: string,
    oldemailplaceholder: string,
    newemailplaceholder: string,
    nextstep: string,
    ticket: string,
    email: string,
    resetnewpwd: string,
    success: string,
    isLoading: boolean
}

const PwdPlaceholder = {
    "Middle": "数字、字母组成，不少于6位",
    "Strong": "数字、大小写字母组成，不少于8位",
    "SuperStrong": "数字、大小写字母、符号组成，不少于8位"
}

const PUNCT = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

function toJsRegExpMap( data ) {
    let map = {};
    for (let key in data){
        let backendRegExp = data[key];
        map[key] = new RegExp( backendRegExp.replace(/\\p{Digit}/g, '\\d').replace(/\\p{Lower}/g, 'a-z').replace(/\\p{Upper}/g, 'A-Z').replace(/\\p{Alpha}/g, 'a-zA-Z').replace(/\\p{Punct}/g, PUNCT))
    }
  return map;
}

class ResetPwd extends React.Component<P,S> {
    constructor( props:P ) {
        super( props );
        this.state = {
            value: "",
            login: "想起密码？直接登录",
            errorTints: "您的邮箱输入有误",
            oldemailplaceholder: "新密码",
            newemailplaceholder: "再次输入",
            nextstep: "下一步",
            ticket: "",
            email: "",
            resetnewpwd: {display: 'block'},
            success: {display: 'none'},
            isLoading: false,
        }
    }

    componentDidMount(){
       let getkeyticket = this.GetQueryString("ticket");
       let getkeyemail = this.GetQueryString("email");
       HttpClient.doGet("/v1/user/login/access").then((res) => {
           if (!res.result) return true;
           var data = res.data;
           var pwdStrength = data.pwdStrength;
           var regMap = toJsRegExpMap(data.pwdRegexMap);
           console.info('regMap', regMap);
           var reg = regMap[pwdStrength];
           this.setState({
               pwdStrength: pwdStrength,
               pwdReg: reg,
               pwdPlaceholder: PwdPlaceholder[pwdStrength]
           });
       });
       this.setState({ticket: getkeyticket， email: getkeyemail});
    }

        GetQueryString = (key) => {//获取
         // key为url变量名称
               var urlGets = location.search.substr(1);
               if(urlGets.length > 0){
                 let start = urlGets.indexOf(key + '=');
                  if(start != -1){
                    start = start + key.length + 1;
                    let end = urlGets.indexOf('&',start)
                   if(end == -1){
                     end = urlGets.length
                   }
                   return decodeURIComponent(urlGets.substring(start,end))
                 }
               }
               return '';
    }

    gotologin = () =>{
        window.location.href = utils.linkValue('/login');
    }

    preRestPassword = () => {
        this.setState({
            isLoading: true
        }, () => {
            this.resetpwd();
        })
    }

    resetpwd = () => {
        let newPwd = document.getElementById("newPwd").value;
        let verified = document.getElementById("verified").value;
        let email = this.state.email;
        let pwdReg = this.state.pwdReg;
        let pwdPlaceholder = this.state.pwdPlaceholder;
        if (newPwd !== verified) {
            this.setState({
                isLoading: false
            }, () => {
                Message.error("两次密码输入不一致！");
            })
            return true;
        }
        if (!newPwd.match(pwdReg) || !verified.match(pwdReg)) {
            this.setState({
                isLoading: false
            }, () => {
                Message.error("密码不符合规则, 请输入" + pwdPlaceholder + "的字符");
            })
            return true;
        }
        let defaultParam: {} = {
                        ticket: this.state.ticket,
                        newPwd: newPwd,
                        verified: verified
                };
       HttpClient.doPost("/v1/user/reset/password/" + email + "/mail", defaultParam)
                  .then((res)=>{
                     if (res.result){
                        this.setState({
                            resetnewpwd: {display: 'none'}, 
                            success: {display: 'block'}
                        });
                     }else{
                         this.setState({
                             isLoading: false
                         }, () => {
                            Message.error( I18nLoader.getErrorText(res.mcode) );
                         })
                     }
                }
    }


    render() {
        let isLoading = this.state.isLoading;
        let pwdPlaceholder = this.state.pwdPlaceholder;
        return (
            <div id="forget">
               <div className="wholePage">
                <div className="loginPanelMark">
                    <form className="loginPanel">
                        <div className="loginHeader" style={this.state.resetnewpwd}>
                            <div className="findpwd">重置密码</div>
                            <div className="languange-choice">
                                <NewSelect options={[{ label: '中国', value: 'china' }]}
							               btnText='中国'
							               className="header-lang header-menu"
							               imgSrc="http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/chinese.png"
							               iconRight="fa fa-angle-down"
							               isChangeText={true}
							               alignment="alignRight"
							    />
                            </div>
                        </div>
                        <div className="loginContent" style={this.state.resetnewpwd}>
                            <ControlLabel className="errorTints">{this.state.errorTints}</ControlLabel>
                            <FormGroup controlId="newPwd">
                                <FormControl id="newPwd" type="password" placeholder={this.state.oldemailplaceholder} />
                                <FormControl.Feedback />
                            </FormGroup>
                            <FormGroup controlId="verified">
                                <FormControl id="verified" type="password" placeholder={this.state.newemailplaceholder} />
                                <FormControl.Feedback />
                            </FormGroup>
                            <Button 
                                bsStyle="primary" 
                                style={{width:"99%"}} 
                                bsSize="large" 
                                disabled={isLoading} 
                                onClick={!isLoading ? this.preRestPassword : null} 
                                block id="resetemail">
                                    {isLoading ? 'Loading...' : this.state.nextstep}
                            </Button>
                            <Button className="registerBtn" style={{width:"99%"}}  bsSize="large" block onClick={this.gotologin}>{this.state.login}</Button>
                        </div>
                        <div className="resetsuccess" style={this.state.success}>
                         <div className="firstline">
                           <img src="http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/okgreen.png" />
                           <b>恭喜！</b>
                         </div>
                         <div className="secondline">
                            账号：{this.state.email}
                         </div>
                         <div className="thirdline">
                            重置密码成功
                         </div>
                         <Button className="loginnow" bsStyle="primary" style={{width:"90%"}} bsSize="large" onClick={this.gotologin} block>立即登录</Button>
                         <div className="beautifulBlank"></div>
                    </div>
                        <div className="beautifulBlank"></div>
                    </form>
                    
                </div>
            </div>

            </div>
        )
    }
}

export { ResetPwd };
