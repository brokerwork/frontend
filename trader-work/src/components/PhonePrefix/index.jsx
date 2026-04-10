import React, { Component } from "react";
import { Select } from "antd";
import { getCountryCode } from "@/utils/country";
import { getTypeCountryCode } from "@/utils/language";

import "./index.less";

const Option = Select.Option;

let countryUrl = "//broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country";
class PhonePrefix extends Component {
  constructor(props) {
    super(props);
    let val = props.value;
    if (props.value) {
      val = props.value;
    }
    this.state = {
      val: val
    };
  }
  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      if (nextProps.value) {
        this.setState({
          val: nextProps.value
        });
      } else {
        this.setState({
          val: ""
        });
      }
    }
  }
  //  选择国家
  onSelected = val => {
    const { onSelect } = this.props;
    this.setState({
      val: val
    });
    onSelect && onSelect(val);
  };
  onChange = val => {
    const { onSelect } = this.props;
    this.setState({
      val: val
    });
    onSelect && onSelect(val);
  };
  //  下拉框搜索
  filterOption = (input, option) => {
    return option.props.value.indexOf(input) >= 0;
  };

  render() {
    let { selectStyle, defaultValue, disabled, showFlag } = this.props;
    let defaultVal = defaultValue;
    
    const countryPhone = getCountryCode()||[];
    
    if (!defaultValue&&!!countryPhone.length) {
      defaultVal = countryPhone.find(el => el.isDefault)
        ? countryPhone.find(el => el.isDefault).value
        : countryPhone[0].value;
    }
    let style = { ...selectStyle };
    if (showFlag) {
      style = { width: "75px", ...selectStyle };
    }
    return (
      <div className="reg-input-country" id="reg-input-country">
        <Select
          showSearch
          style={style}
          value={this.state.val || defaultVal}
          dropdownStyle={showFlag && { width: "85px" }}
          defaultValue={defaultVal}
          onSelect={this.onSelected}
          onChange={this.onChange}
          optionFilterProp="children"
          notFoundContent={""}
          optionLabelProp={"item"}
          getPopupContainer={() => document.getElementById("reg-input-country")}
          dropdownMatchSelectWidth={false}
          filterOption={this.filterOption}
          disabled={disabled}
        >
          {countryPhone && countryPhone.length ? (
            countryPhone.map(item => {
              return (
                <Option
                  title={item.label}
                  key={item.value}
                  value={item.value}
                  item={
                    showFlag ? (
                      <img
                        src={`${countryUrl}/${item.value.replace("+", "")}.png`}
                        className="select-img"
                      />
                    ) : (
                      item.value
                    )
                  }
                >
                  <span className="option-span">{item.value}</span>
                  {showFlag && (
                    <img
                      className="option-img"
                      src={`${countryUrl}/${item.value.replace("+", "")}.png`}
                    />
                  )}
                </Option>
              );
            })
          ) : (
            <Option
              value={defaultVal}
              item={
                showFlag ? (
                  <img
                    src={`${countryUrl}/${defaultVal.replace("+", "")}.png`}
                    className="select-img"
                  />
                ) : (
                  defaultVal
                )
              }
            >
              <span className="option-span">{defaultVal}</span>
              {showFlag && (
                <img
                  className="option-img"
                  src={`${countryUrl}/${defaultVal.replace("+", "")}.png`}
                />
              )}
            </Option>
          )}
        </Select>
      </div>
    );
  }
}

export default PhonePrefix;
