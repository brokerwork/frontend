import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P {

}
interface S {
   registersettingtitle: string
}

class RegisterSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
             registersettingtitle: "注册设置"
        }
    }

    render() {
        return (
            <div>
                <Panel header={this.state.registersettingtitle} className="changepwd" bsStyle="primary">
                <div className="changepwdcontent">
                   注册设置
                </div>
            </Panel>
            </div>
        );
    }
}

export {RegisterSetting};