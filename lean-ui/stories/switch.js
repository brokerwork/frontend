import React from "react"
import Switch from "../components/Switch"
import Button from "../components/Button"
import Icon from "../components/Icon"
import { action } from "@storybook/addon-actions"

class Demo extends React.Component { 
  state = {
    checked: false,
    disabled: false,
  }
  click = () => { 
    const { checked, disabled } = this.state
    this.setState({
      checked: !checked,
      disabled: !disabled,
    })
  }
  change = (checked) => { 
    this.setState({
      checked: checked
    })
  }
  render() { 
    const { checked, disabled, switchVal } = this.state
    return (
      <div>
        <Switch onChange={this.change} checked={checked} disabled={disabled} defaultChecked={switchVal}></Switch>
        <span>switch的值:{checked ? 'true' : 'false'}</span>
        <br/>
        <Button onClick={this.click} type="primary">Toggle Switch</Button>
      </div>
    )
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "switch primary",
          info: "开关",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <div className="story-demo">
                  <Switch ></Switch>
                  <Switch defaultChecked></Switch>
                  <Switch disabled></Switch>
                  <Switch defaultChecked disabled></Switch>
                </div>
                <div className="story-demo">
                  <Switch checkedChildren={1} unCheckedChildren={0}></Switch>
                  <Switch checkedChildren={'开'} unCheckedChildren={'关'} defaultChecked></Switch>
                  <Switch checkedChildren={'开'} unCheckedChildren={'关'} disabled></Switch>
                  <Switch checkedChildren={1} unCheckedChildren={0} defaultChecked disabled></Switch>
                </div>
                <div className="story-demo">
                  <Switch checkedChildren={<Icon icon="check"/>} unCheckedChildren={<Icon icon="close"/>}></Switch>
                  <Switch checkedChildren={<Icon icon="check"/>} unCheckedChildren={<Icon icon="close"/>} defaultChecked></Switch>
                  <Switch checkedChildren={<Icon icon="check"/>} unCheckedChildren={<Icon icon="close"/>} disabled></Switch>
                  <Switch checkedChildren={<Icon icon="check"/>} unCheckedChildren={<Icon icon="close"/>} defaultChecked disabled></Switch>
                </div>
                <div className="story-demo">
                  <Demo/>  
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
