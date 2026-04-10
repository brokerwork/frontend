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
class Empty extends React.Component<P, S>{

    constructor(props: P) {
        super(props);

    }

    render() {
        return (
            <div className="empty-panel">
                <div className="empty-content">
                    <span className="fa fa-warning"></span>
                    <span>清空的用户将彻底删除，不可恢复。</span>
                </div>

                <hr className="h-rule h-rule1"/>
                <Col className="pull-right add-buttons">
                    <Button type="submit" bsStyle="primary">
                        保存
                    </Button>
                    <Button type="submit">
                        取消
                    </Button>
                </Col>
            </div>
        )
    }
}

export {Empty};