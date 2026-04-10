import React from "react";
import Input from "../components/Input";
import Icon from "../components/Icon";
import { action } from "@storybook/addon-actions";

const { TextArea } = Input;

class Demo extends React.Component {
  state = {
    value: "按下Enter键",
    errorText: ""
  };
  onPressEnter = e => {
    alert(e.target.value);
  };
  onChange = e => {
    this.setState({
      value: e.target.value,
      errorText: !!e.target.value ? "" : "不能为空"
    });
  };
  render() {
    const { value, errorText } = this.state;
    return (
      <div className="story-input">
        <Input
          errorText={errorText}
          value={this.state.value}
          onChange={this.onChange}
          onPressEnter={this.onPressEnter}
        />
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "input 输入框",
          info: "输入框",
          sectionFn: () => {
            return (
              <div className="story-panel">
                <div className="story-input">
                  <Input line placeholder={"Text Entered"} />
                </div>
                <div className="story-input">
                  <Input
                    errorText={"This field is required"}
                    placeholder={"Text Entered"}
                  />
                </div>
                <div className="story-input">
                  <Input haserror placeholder={"Text Entered"} />
                </div>
                <div className="story-input">
                  <Input size={"small"} placeholder={"Text Entered"} />
                </div>
                <div className="story-input">
                  <Input
                    prefix={<Icon icon="search" />}
                    placeholder={"Text Entered"}
                  />
                </div>
                <div className="story-input">
                  <Input
                    suffix={<Icon icon="search" />}
                    placeholder={"Text Entered"}
                  />
                </div>
                <div className="story-input">
                  <Input size={"large"} placeholder={"Text Entered"} />
                </div>
                <div className="story-input">
                  <Input
                    disabled
                    prefix={<Icon icon="search" />}
                    suffix={<Icon icon="error" />}
                    placeholder={"Text Entered"}
                    value="我被禁用了"
                  />
                </div>
                <div className="story-input">
                  <Input addonBefore={"http://"} />
                </div>
                <div className="story-input">
                  <Input
                    errorText={"This field is required"}
                    addonAfter={".com"}
                  />
                </div>
                <div className="story-input">
                  <Input addonBefore={"http://"} addonAfter={".com"} />
                </div>
                <div className="story-input">
                  <Input
                    errorText={"This field is required"}
                    placeholder={"English"}
                    addonBefore={<Icon icon="heart" />}
                    addonAfter={<Icon icon="search" />}
                  />
                </div>
                <div className="story-input">
                  <Input
                    type="password"
                    defaultValue={"默认值朱利安"}
                    placeholder={"Text Entered"}
                  />
                </div>
                <div className="story-input">
                  <TextArea />
                </div>
                <div className="story-input">
                  <TextArea errorText={"This textarea is required"} />
                </div>
                <Demo />
              </div>
            );
          }
        }
      ]
    }
  ]
};
