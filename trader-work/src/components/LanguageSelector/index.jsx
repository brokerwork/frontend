import { Component } from "react";
import { countryCodeStaticDir, languages } from "@/utils/config";
import * as language from "@/utils/language";
import { connect } from "react-redux";

import { Menu, Dropdown } from "antd";

import "./index.less";
import china from "@/images/86.png";
import us from "@/images/1 .png";
import tw from "@/images/886.png";
import jp from "@/images/81.png";
import ko from "@/images/82.png";
import vi from "@/images/vi.png";

// 国际化语言切换，入参:onChange
class LanguageSelector extends Component {
  constructor() {
    super();
  }
  onChange(v) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(v.key);
    }
  }
  renderLanguage(t) {
    const type = language.getType(this.props.defaultLanguage);
    console.log('fwfwfwfw', this.props.defaultLanguage)
    const { configAcessResult } = this.props;
    let icon, text;
    switch (type) {
      case "zh-CN":
        icon = china;
        text = "中";
        break;
      case "en-US":
        icon = us;
        text = "En";
        break;
      case "zh-TW":
        icon = tw;
        text = "繁";
        break;
      case "ja-JP":
        icon = jp;
        text = "日";
        break;
      case "ko-KR":
        icon = ko;
        text = "한";
        break;
      case "vi-VN":
        icon = vi;
        text = "Việt";
        break;
    }
    return (
      <div className="selector-panel">
        {configAcessResult && configAcessResult.showFlag && (
          <img src={icon} className="type-icon" />
        )}
        <span className="country">{text}</span>
        <span className="ant-select-arrow down-icon" />
      </div>
    );
  }
  render() {
    let { language = [] } = this.props;
    // 屏蔽印尼语
    // language = language.filter(el => {
    //   return el.value !== "id-ID";
    // });
    const menu = (
      <Menu
        onClick={this.onChange.bind(this)}
        className="language-selector-menu"
      >
        {language &&
          language.map(item => {
            return item.enabled ? (
              <Menu.Item key={item.value}>
                <div>{item.label}</div>
              </Menu.Item>
            ) : null;
          })}
      </Menu>
    );
    return (
      <div className="language-selector">
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
          <div className="selector-panel">{this.renderLanguage()}</div>
        </Dropdown>
      </div>
    );
  }
}

export default connect(
  ({ common }) => {
    return {
      configAcessResult: common.configAcessResult
    };
  },
  {}
)(LanguageSelector);
