import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';
import {Panel, DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl,ButtonGroup,FormGroup,Form,Checkbox
} from 'fooui';

interface P{
    className?: string;
    errorcontent: string;
}
interface S{}
class FailureFactor extends React.Component<P,S>{
    constructor(props:P){
        super(props);
    }
    render(){
        let newStyle = "empty-panel " + this.props.className;
        return (
            <div className={newStyle}>
                <div className="empty-content">
                    <span>{this.props.errorcontent}</span>
                </div>
            </div>
        )
    }
}
export {FailureFactor};