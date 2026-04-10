// libs
import * as React from 'react';
import {Button,
    DropdownButton, MenuItem, CustomDateRangePicker,ButtonGroup
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
    ticket: string,
    email: string,
    resetnewpwd: string,
    tints: string,
    issuccess: string,
    okOrNot: boolean
}

class MailBind extends React.Component<P,S> {
    constructor( props:P ) {
        super( props );
        this.state = {
            value: "",
            login: "想起密码？直接登录",
            errorTints: "您的邮箱输入有误",
            oldemailplaceholder: "当前邮箱",
            newemailplaceholder: "新邮箱",
            ticket: "",
            email: "",
            tints: "",
            issuccess: "",
            okOrNot: true
        }
    }

    componentDidMount(){
       let getkeyticket = this.GetQueryString("ticket");
       let getkeyemail = this.GetQueryString("email");
       this.setState({email: getkeyemail});
       HttpClient.doPost("/v1/user/bind/" + getkeyemail + "/mail/" + getkeyticket, {})
                  .then((res)=>{
                     if (res.result){
                        this.setState({
                            tints: "恭喜！",
                            issuccess: "绑定邮箱成功，请重新登录",
                            okOrNot: true
                        });

                     }else{
                         this.setState({
                            tints: "抱歉！",  
                            issuccess: I18nLoader.getErrorText(res.mcode),
                            okOrNot: false
                        })
                     }
                }
       
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

    render() {
        const {tints, email, issuccess, okOrNot} = this.state;
        return (
            <div id="forget">
               <div className="wholePage">
                <div className="loginPanelMark">
                    <form className="loginPanel">
                        <div className="resetsuccess">
                           <div className="firstline">
                              <i className={okOrNot ? "fa fa-check-circle-o greenIcon" : "fa fa-times-circle-o redIcon"}></i>
                              <b>{tints}</b>
                           </div>
                           <div className="secondline">
                              账号：{email}
                           </div>
                           <div className="thirdline">
                              {issuccess}
                           </div>
                           <Button className="loginnow" bsStyle="primary" style={{width:"90%"}} bsSize="large" onClick={this.gotologin} block>立即登录</Button>
                         </div>
                        <div className="beautifulBlank"></div>
                    </form>
                </div>
            </div>

            </div>
        )
    }
}

export { MailBind };
