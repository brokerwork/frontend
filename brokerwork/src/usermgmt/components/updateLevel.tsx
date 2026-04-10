import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';
import {Panel,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, FormGroup, Form, Checkbox
} from 'fooui';

interface P { }
interface S {

}
class UpdateLevel extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
    }

    render() {

        return (
            <Form horizontal className="add-panel small-panel">
                <FormGroup>
                    <Col  sm={3}>
                        <span className="required-field">*</span>
                        上级角色：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <hr className="h-rule h-rule1"/>
                    <Col className="pull-right add-buttons">
                        <Button type="submit" bsStyle="primary">
                            保存
                        </Button>
                        <Button type="submit">
                            取消
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

export {UpdateLevel};