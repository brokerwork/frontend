// libs
import * as React from 'react';
import {AppHeader} from '../../header/index';
import {SiderBar} from './siderbar';
import {ChangePwd} from './changepwd';
import {PhoneSetting} from './phonesetting';
import {ButtonGroup, DropdownButton, MenuItem, Dropdown, Glyphicon, Grid} from 'react-bootstrap';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
/* ------------------- main start ---------------------- */

interface P {
   
}
interface S {
   windowwidth: string,
   windowheight: string
}

class PersonalSetting extends React.Component<P,S> {
    constructor( props:P ) {
        super( props );
        this.state = {
            windowwidth: null,
            windowheight: null
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    render() {
        let yywidth = this.state.windowwidth;
        let yyheight = this.state.windowheight;
        return (
            <div style={{height:"100%",width:"100%"}}>
              <AppHeader/>
              <div id="mainContent">
                    <SiderBar/>
                    <div id="leftcontent">
                      {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
    updateDimensions = () => {
        let mmheight = document.body.clientHeight-80;
        let leftwidth = document.body.clientWidth - 247;
        this.setState({windowwidth: leftwidth});
        this.setState({windowheight:mmheight});
    }

    componentWillMount = () => {
        this.updateDimensions();
    }

    componentDidMount = () => {
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.updateDimensions);
    }
}

export { PersonalSetting };
