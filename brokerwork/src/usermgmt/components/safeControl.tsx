import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';
import {Panel,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, FormGroup, Form, Checkbox
} from 'fooui';
import {Table}  from 'react-bootstrap';

interface P { }
interface S {

}
class SafeControl extends React.Component<P, S>{

    constructor(props: P) {
        super(props);

    }

    render() {

        return (
            <Form horizontal className="add-panel addsale-panel control-panel small-panel">
                <FormGroup>
                    <Col  sm={6}>
                        白名单： <FormControl type="text" placeholder="0.0.0.0" />
                        <span className="connect" >～</span>
                        <FormControl type="text" placeholder="0.0.0.0" />
                        <Button className="ghost-btn no-border">
                            <i className="fa fa-plus"></i>
                        </Button>
                        <Button className="ghost-btn no-border">
                            <i className="fa fa-minus"></i>
                        </Button>
                    </Col>
                    <Col sm={6}>
                        黑名单： <FormControl type="text" placeholder="0.0.0.0"/>
                        <span className="connect">～</span>
                        <FormControl type="text" placeholder="0.0.0.0" />
                        <Button className="ghost-btn no-border">
                            <i className="fa fa-plus"></i>
                        </Button>
                        <Button className="ghost-btn no-border">
                            <i className="fa fa-minus"></i>
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

export {SafeControl};