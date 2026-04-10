import { Component } from "react";
import { Input, Icon } from "antd";
import eyeImage from "@/images/eye.svg";
import eyeInvisibleImage from "@/images/eye-invisible.svg";
import cs from "./index.less";

export default class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputType: props.type || "password",
      icon: eyeImage
    };
  }
  handleChangeType = () => {
    const { inputType } = this.state;
    if (inputType === "text") {
      this.setState({
        inputType: "password",
        icon: eyeImage
      });
    } else if (inputType === "password") {
      this.setState({
        inputType: "text",
        icon: eyeInvisibleImage
      });
    }
  };
  render() {
    const { inputType, icon } = this.state;
    const { type = "password", ...restProps } = this.props;
    return (
      <Input
        type={inputType}
        {...restProps}
        suffix={
          <img
            onClick={this.handleChangeType}
            style={{ width: "15px" }}
            src={icon}
          />
        }
      />
    );
  }
}
