import * as React from "react";
import Select from "../Select";
import Option from "../Select/Option";

class Selector extends React.Component<any, any> {
  static Option: typeof Option;
  render() {
    const { children, onChange, ...otherProps } = this.props;
    //转化Select的onChange和onSelect事件， rc-pagination中默认select使用的是onChange
    return (
      <Select {...otherProps} onSelect={onChange}>
        {children}
      </Select>
    );
  }
}

Selector.Option = Option;

export default Selector;
