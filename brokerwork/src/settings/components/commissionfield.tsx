import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P {

}
interface S {
   commissionfieldtitle: string
}

class CommissionField extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            commissionfieldtitle: "佣金报表字段设置"
        }
    }

    render() {
        return (
            <div style={{"height": window.innerHeight}} className="leftheightcontrol">
                <Panel header={this.state.commissionfieldtitle} className="changepwd" bsStyle="primary">
                <div className="changepwdcontent">
                   佣金字段设置
                </div>
            </Panel>
            </div>
        );
    }
}

export {CommissionField};