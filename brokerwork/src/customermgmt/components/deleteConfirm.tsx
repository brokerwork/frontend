import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';
import {Panel, DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl,ButtonGroup,FormGroup,Form,Checkbox
} from 'fooui';
import { I18nLoader } from '../../i18n/loader';

let lang = I18nLoader.getLang();
interface P{
    className?:string;
    draftInfo?:boolean;
}
interface S{
}
class DeleteConfirm extends React.Component<P,S>{
    constructor(props:P){
        super(props); 
    }
    static defaultProps = {
        draftInfo:true
    };
    render(){
        let newStyle = "empty-panel " + this.props.className;
        let deleteContent = this.props.draftInfo ? I18nLoader.get('general.delete_confirm') : I18nLoader.get('general.delete_confirm_recyle');
        return (
            <div className={newStyle}>
                <div className="empty-content">
                    <span className="fa fa-warning"></span>
                    <span>{deleteContent}</span>
                </div>
            </div> 
        )
    }
}
export {DeleteConfirm};