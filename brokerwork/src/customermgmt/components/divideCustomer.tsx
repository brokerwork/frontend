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
class DivideCustomer extends React.Component<P, S>{

  constructor(props: P) {
    super(props);

  }

  render() {

    return (
      <Form horizontal className="add-panel small-panel">
        <FormGroup>
          <Col  sm={3} className="fontcolor">
            <span className="required-field">*</span>
            客户归属：
          </Col>
          <Col sm={9}>
            <select className="form-control m-bot15">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>

          </Col>
        </FormGroup>
        <FormGroup className="divide-info">
          <Col  sm={3}>
          </Col>
          <Col sm={9}>
            <span>客户转移成功之后，该操作无法恢复。</span>
          </Col>
        </FormGroup>
        
      </Form>

    )
  }
}

export {DivideCustomer};