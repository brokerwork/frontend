import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Table, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P {

}
interface S {
   emailpostsettingtitle: string
}

class EmailPostSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            emailpostsettingtitle: "邮件发送设置"
        }
    }

    render() {
        return (
            <div style={{"height": window.innerHeight}} className="leftheightcontrol">
                <Panel header={this.state.emailpostsettingtitle} className="changepwd" bsStyle="primary">
                  <div id="messagesetting"> 
                   <Table responsive>
                     <thead>
                       <tr>
                         <th>SMTP服务器</th>
                         <th>安全链接类型</th>
                         <th>SMTP端口</th>
                         <th>帐号</th>
                         <th>密码</th>
                         <th>发件邮箱</th>
                         <th>操作</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td>smtp.lwork.com</td>
                          <td>TLS</td>
                          <td>25</td>
                          <td>leanwork</td>
                          <td>******</td>
                          <td>info@lwork.com</td>
                          <td>
                             <Button bsStyle="primary" className="yesbtn"><i className="fa fa-pencil"></i></Button>
                             <Button bsStyle="primary"><i className="fa fa-times"></i></Button>
                          </td>
                      </tr>
                      <tr>
                          <td>smtp.lwork.com</td>
                          <td>TLS</td>
                          <td>25</td>
                          <td>leanwork</td>
                          <td>******</td>
                          <td>info@lwork.com</td>
                          <td>
                             <Button bsStyle="primary" className="yesbtn"><i className="fa fa-pencil"></i></Button>
                             <Button bsStyle="primary"><i className="fa fa-times"></i></Button>
                          </td>
                     </tr>
                     <tr>
                          <td>smtp.lwork.com</td>
                          <td>TLS</td>
                          <td>25</td>
                          <td>leanwork</td>
                          <td>******</td>
                          <td>info@lwork.com</td>
                          <td>
                             <Button bsStyle="primary" className="yesbtn"><i className="fa fa-pencil"></i></Button>
                             <Button bsStyle="primary"><i className="fa fa-times"></i></Button>
                          </td>
                    </tr>
                   </tbody>
                   </Table> 
                   <Button bsStyle="primary" className="yesbtn pull-right" onClick={this.showaddModal}><i className="fa fa-plus"></i>添加新模版</Button>
                  </div>
               </Panel>
            </div>
        );
    }
}

export {EmailPostSetting};