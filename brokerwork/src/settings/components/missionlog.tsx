import * as React from 'react';
import {ButtonGroup, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {Commonlog} from './commonlog';
import {I18nLoader} from '../../i18n/loader';


interface P {
    title: string
}
interface S {
}

class MissionLog extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
    }

    render() {
        return (
            <Commonlog  title={I18nLoader.get('setting.siderbar.log.task')} />
        );
    }
}

export {MissionLog};