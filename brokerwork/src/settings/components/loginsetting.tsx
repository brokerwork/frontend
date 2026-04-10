import * as React from 'react';
import {ButtonGroup, Radio, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P {

}
interface S {
   loginsettingtitle: string
}

class LoginSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            loginsettingtitle: "登录设置"
        }
    }

    render() {
        return (
            <div>
                <Panel header={this.state.loginsettingtitle} bsStyle="primary">
                <div id="loginsettingcontent">
                    <Row>
                       <FormGroup controlId="formInlineEmail">
                          <ControlLabel className="loginbasiclabel">滑动验证：</ControlLabel>
                          <Radio className="logininline" checked name="optionsRadios">
                            验证
                          </Radio>
                          <Radio className="logininline left" name="optionsRadios">
                            不验证
                          </Radio>
                          <div>
                             <select className="form-control checktimescontrol logininline">
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                            <span className="logininline littleleft">次 密码错误，使用滑动验证</span>
                          </div>
                        </FormGroup>
                    </Row>
                    <Row>
                       <FormGroup controlId="formInlineEmail">
                          <ControlLabel className="loginbasiclabel">账户锁定：</ControlLabel>
                          <Radio className="logininline" checked name="lockRadios">
                            锁定
                          </Radio>
                          <Radio className="logininline left" name="lockRadios">
                            不锁定
                          </Radio>
                          <div>
                             <select className="form-control checktimescontrol logininline">
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="5">12</option>
                                <option value="6">13</option>
                                <option value="7">14</option>
                                <option value="8">15</option>
                                <option value="9">16</option>
                                <option value="10">17</option>
                                <option value="10">18</option>
                                <option value="10">19</option>
                                <option value="10">20</option>
                            </select>
                            <span className="logininline littleleft">次 密码错误，账户被锁定，需练习管理员解锁</span>
                          </div>
                        </FormGroup>
                    </Row>
                    <Row>
                       <FormGroup controlId="formInlineEmail">
                          <ControlLabel className="loginbasiclabel">超时自动退出：</ControlLabel>
                          <Radio className="logininline" checked name="limitRadios">
                            限制
                          </Radio>
                          <Radio className="logininline left" name="limitRadios">
                            不限制
                          </Radio>
                          <div>
                             <select className="form-control checktimescontrol logininline">
                                <option value="4">5</option>
                                <option value="5">10</option>
                                <option value="6">15</option>
                                <option value="7">20</option>
                                <option value="8">25</option>
                                <option value="9">30</option>
                                <option value="10">60</option>
                            </select>
                            <span className="logininline littleleft">分钟 用户无操作，账户自动登出</span>
                          </div>
                        </FormGroup>
                    </Row>
                    <Row>
                     <FormGroup>
                        <Col className="pull-center">
                            <Button type="button"bsStyle="primary">
                                保存
                            </Button>
                            <Button type="button" className="littleleft">
                                取消
                            </Button>
                        </Col>
                     </FormGroup>
                     </Row>
                </div>
            </Panel>
            </div>
        );
    }
}

export {LoginSetting};