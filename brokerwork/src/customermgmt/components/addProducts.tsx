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
class AddProducts extends React.Component<P, S>{

    constructor(props: P) {
        super(props);

    }

    render() {

        return (
            <Form horizontal className="add-panel small-panel">
                <FormGroup>
                    <Col  sm={3}>
                        <span className="required-field">*</span>
                        产品图片：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col  sm={3}>
                        <span className="required-field">*</span>
                        产品名称：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col  sm={3}>
                        <span className="required-field">*</span>
                        产品编号：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col  sm={3}>
                        <span className="required-field">*</span>
                        产品价格：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col  sm={3}>

                        计价单位：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>

                <FormGroup className="describe">
                    <Col  sm={3}>
                        产品描述：
                    </Col>
                    <Col sm={9}>
                        <FormControl type="text"  />
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

export {AddProducts};