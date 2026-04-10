import React from "react";
import Radio from "../components/Radio";
import { action } from "@storybook/addon-actions";
const RadioGroup = Radio.Group
class Demo extends React.Component{
  state = {
    value1:'1',
  }
  onChange1 = (e) => {
    console.log(e.target.value)
    this.setState({value1:e.target.value})
  }
  render(){
    return(
      <div>
        <RadioGroup name="myradio" value={this.state.value1} onChange={this.onChange1}>
          <Radio value='1'> Radio1 </Radio>
          <Radio value='2'> Radio2 </Radio>
          <Radio value='3'> Radio3 </Radio>
        </RadioGroup>
      </div>
    )
  }
}
export default {
  chapters: [
    {
      sections: [
        {
          title: "",
          info: "",
          sectionFn: () => {
            return (
              <div>
                <div className="story-demo">
                  <h3>Radio</h3>
                  <Radio> 未选中 </Radio>
                  <Radio checked={true}>选中</Radio>
                  <Radio disabled>未选中/不可选</Radio>
                  <Radio checked={true} disabled>选中/不可选</Radio>
                </div>
                <div className="story-demo">
                  <h3>RadioGroup</h3>
                  <RadioGroup name="myradio1">
                    <Radio value='1'>Radio1</Radio>
                    <Radio value='2'>Radio2</Radio>
                    <Radio value='3'>Radio3</Radio>
                  </RadioGroup>
                </div>
                <div className="story-demo">
                  <h3>RadioGroup(type="button")</h3>
                  <RadioGroup name="myradio2" type="button">
                    <Radio value='1'>绑定已有账号</Radio>
                    <Radio value='2'>新建账号并绑定</Radio>
                    <Radio value='3'>不绑定返佣账号</Radio>
                  </RadioGroup><br/>
                  <RadioGroup name="myradio2" type="button" disabled value='3'>
                    <Radio value='1'>绑定已有账号</Radio>
                    <Radio value='2'>新建账号并绑定</Radio>
                    <Radio value='3'>不绑定返佣账号</Radio>
                  </RadioGroup>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
