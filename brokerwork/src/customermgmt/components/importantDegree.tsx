import * as React from 'react';
import {Button, Row, Col} from 'fooui';
import * as classnames from 'classnames';
import {Panel,
  DropdownButton, MenuItem, CustomDateRangePicker,
  FormControl, ButtonGroup, FormGroup, Form, Checkbox
} from 'fooui';


interface P { }
interface S {
    important?:boolean;
    priority?: boolean;
}
class ImportantDegree extends React.Component<P, S>{

  constructor(props: P) {
    super(props);
    this.state = {
        important: false,
        priority: false
    }
  }

  isImportant(){
      return this.state.important;
  }
  isPriority(){
      return this.state.priority;
  }

  setImportant = (e)=>{
      var isImportant = e.target.checked;
      this.setState({important: isImportant})
  }
   setEurgent = (e)=>{
        var isEurgent = e.target.checked;
        this.setState({priority: isEurgent})
    }

  render() {

    return (
      <Form horizontal className="add-panel degree-panel small-panel">
        <FormGroup className="degree-info">
          <Col  sm={4}>
            优先级：
          </Col>
          <Col sm={4}>
            <input
                type="checkbox"
                name="checkbox1"
                value="checkbox"
                onChange={this.setImportant}/>重要<span className="fa fa-star"></span>
          </Col>
          <Col sm={4}>
            <input
                type="checkbox"
                name="checkbox1"
                value="checkbox"
                onChange={this.setEurgent}/>紧急<span className="fa fa-exclamation-circle"></span>
          </Col>
        </FormGroup>
      </Form>

    )
  }
}


export {ImportantDegree};