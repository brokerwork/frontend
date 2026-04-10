import { Component } from "react";
import "./index.less";
import { getType } from "@/utils/language";

export default class Step extends Component {
  static defaultProps = {
    steps: 1,
    current: 1
  };
  render() {
    const { fields, current, label } = this.props;
    let steps = [];
    for (let i = 0; i < fields.length; i++) {
      steps.push(i);
    }
    return (
      <ul className="step-container">
        {steps.map((el, index) => {
          const title = _.find(fields, { index: index + 1 }).languageSettingMap[
            getType()
          ];

          return (
            <li className={index + 1 <= current && "active"} title={title}>
              {steps.length > 5 ? `step${index + 1}` : <span>{title}</span>}
            </li>
          );
        })}
      </ul>
    );
  }
}
