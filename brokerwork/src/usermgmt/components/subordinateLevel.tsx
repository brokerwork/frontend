import * as React from 'react';
import {Button, Row, Col,TreeDiagram} from 'fooui';
import * as classnames from 'classnames';
import {Panel,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl,ButtonGroup,FormGroup,Form,Checkbox
} from 'fooui';
import {Table}  from 'react-bootstrap';

interface P{}
interface S{

}
var data:TreeDigramData = {
    text: { name: "Parent node" },
    children: [
        {
            text: { name: "AAA" },
            children: [
                { 
                    text: {name: 'DDD'}
                },
                { text: {name: 'EEE'} },
                { text: {name: 'FFF'} }
            ]
        },
        {
            text: { name: "BBB" },
            children:[
                { text: {name: 'G'} },
                { text: {name: 'H'} },
            ]
        }
    ]
};

class SubordinateLevel extends React.Component<P,S>{

    constructor(props:P){
        super(props);

    }
    
    render(){
        return (
            <Form horizontal className="add-panel addsale-panel control-panel small-panel">
                <TreeDiagram data={data}/>
            </Form>
        )
    }
}

export {SubordinateLevel};