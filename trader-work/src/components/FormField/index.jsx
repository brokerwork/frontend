import React, { Component } from "react";
import i18n from "@/utils/i18n";
import * as validate from "@/utils/validate";
import utils from "@/utils/common";
import { getNation, getNationObject, getCountryObject } from "@/utils/country";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Radio,
  Divider,
  Icon
} from "antd";
const { Option } = Select;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import Phone from "./phone";
import Tin from "./tin";
import City from "./city";
import TextGroup from "./textGroup";
import FileUpload from "../FileUpload";
import moment from "moment";
import "./index.less";

// const and enum
const DefaultLayoutConfig = {
  labelUnitWidth: 82,
  fieldUnitWidth: 260
};

const PHONE_NO_PREFIX_COMPONENT_WIDTH = 60;
const FIELD_MARGIN = 10;

// class
export default class FormField {
  constructor(props) {
    this.props = props;
  }
  setDefaultValue = (fields, values = {}) => {
    if (Object.keys(values).length == 0) {
      return;
    }
    fields.forEach(f => {
      f.defaultValue = valueObject[fc.key];
    });
  };
  renderField() {
    const commonFieldWidth = "80%";
    const p = this.props;
    let field;
    const classes = "form-field";
    switch (p.fieldType) {
      case "text":
        field = p.userCustom ? (
          <TextGroup
            type={p.fieldType}
            style={{ width: commonFieldWidth }}
            disabled={!p.enable}
            placeholder={p.hint}
            addMulti={p.addMulti}
          ></TextGroup>
        ) : (
          <Input
            style={{ width: commonFieldWidth }}
            maxLength={p.size || 200}
            disabled={!p.enable}
            placeholder={p.hint}
          ></Input>
        );
        break;
      case "textarea":
        field = p.userCustom ? (
          <TextGroup
            type={p.fieldType}
            style={{ width: commonFieldWidth }}
            disabled={!p.enable}
            placeholder={p.hint}
            addMulti={p.addMulti}
          ></TextGroup>
        ) : (
          <TextArea
            style={{ width: commonFieldWidth }}
            maxLength={p.size || 2000}
            disabled={!p.enable}
            placeholder={p.hint}
          ></TextArea>
        );
        break;
      case "datestring":
      case "date":
        field = (
          <DatePicker
            showToday={false}
            style={{ width: commonFieldWidth }}
            disabled={!p.enable}
            placeholder={p.hint}
          ></DatePicker>
        );
        break;
      case "country":
        let nationData = getNation();
        field = (
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: commonFieldWidth }}
            disabled={!p.enable}
          >
            {nationData.map((item, index) => {
              return <Option value={item.id}>{item.value}</Option>;
            })}
          </Select>
        );
        break;
      case "select":
        if (p.key === "bankAccount") {
          field = (
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              notFoundContent={
                <div>
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    onClick={p.addBank}
                    style={{ color: "#000", padding: "8px", cursor: "pointer" }}
                  >
                    <Icon type="plus" /> {i18n["userinfo.bank.addBank"]}
                  </div>
                </div>
              }
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: commonFieldWidth }}
              disabled={!p.enable}
            >
              <Option value="">{i18n["general.select"]}</Option>
              {p.optionList.map(e => {
                return <Option value={e.value}>{e.label}</Option>;
              })}
            </Select>
          );
        } else {
          field = (
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: commonFieldWidth }}
              disabled={!p.enable}
            >
              <Option value="">{i18n["general.select"]}</Option>
              {p.optionList.map(e => {
                return <Option value={e.value}>{e.label}</Option>;
              })}
            </Select>
          );
        }

        break;
      case "checkbox":
        field = (
          <CheckboxGroup
            style={{ width: commonFieldWidth }}
            options={p.optionList}
            disabled={!p.enable}
          />
        );
        break;
      case "radio":
        field = (
          <RadioGroup onChange={this.onChange} disabled={!p.enable}>
            {p.optionList.map(e => {
              return <Radio value={e.value}>{e.label}</Radio>;
            })}
          </RadioGroup>
        );
        break;
      case "phone":
        field = (
          <Phone
            style={{ width: commonFieldWidth }}
            disabled={!p.enable}
            placeholder={p.hint}
          ></Phone>
        );
        break;
      case "city":
        field = (
          <City
            style={{ width: commonFieldWidth }}
            disabled={!p.enable}
            defaultValue={p.defaultCity.country}
          ></City>
        );
        break;
      case "tin":
        field = (
          <Tin
            commonFieldWidth={commonFieldWidth}
            disabled={!p.enable}
            addMulti={p.addMulti}
            placeholder={p.hint}
          ></Tin>
        );
        break;
      case "image":
        field = (
          <FileUpload
            numMax={1}
            commonFieldWidth={commonFieldWidth}
            disabled={!p.enable}
          ></FileUpload>
        );
        break;
      default:
        field = null;
        break;
    }
    return field;
  }

  //  根据字段格式化每一类数据
  formatFieldData(fieldsData) {
    if (fieldsData instanceof Array) {
      let stepData = {};
      let countryObject = getCountryObject();
      let nationData = getNationObject();
      fieldsData.forEach((item, index) => {
        if (!item.defaultValue) return;
        let key = item.key;
        let defaultValue = item.defaultValue;
        if (moment.isMoment(defaultValue)) {
          defaultValue = defaultValue.format("YYYY-MM-DD");
        }
        stepData[key] = defaultValue;
        switch (item.fieldType) {
          case "text":
          case "textarea":
            if (item.userCustom) {
              stepData[key] = defaultValue.map(e => <div>{e}</div>);
            }
            break;
          case "tin":
            let tinArray = defaultValue.map((item, index) => {
              return item.countryCode && item.tin ? (
                <div>
                  {" "}
                  {(nationData[item.countryCode]
                    ? nationData[item.countryCode].value
                    : item.countryCode) +
                    " " +
                    item.tin}
                </div>
              ) : null;
            });
            stepData[key] = tinArray;
            break;
          case "image":
            if (/.pdf$/.test(defaultValue)) {
              let nameArr = defaultValue.split("_")[0].split("/");
              stepData[key] = (
                <span>{`${nameArr[nameArr.length - 1]}.pdf`}</span>
              );
            } else {
              let path = utils.isFullUrl(defaultValue)
                ? defaultValue
                : "/api" + defaultValue;
              stepData[key] = <img src={path} />;
            }

            break;
          case "phone":
            stepData[key] =
              defaultValue["countryCode"] + " " + defaultValue["phone"];
            break;
          case "country":
            const countryValue = nationData[defaultValue];
            if (countryValue) {
              stepData[key] = countryValue.value;
            }
            break;
          case "city":
            stepData[key] = "";
            if (defaultValue.country && countryObject[defaultValue.country]) {
              stepData[key] = countryObject[defaultValue.country].value;
              if (
                defaultValue.province &&
                countryObject[defaultValue.province]
              ) {
                stepData[key] +=
                  " " + countryObject[defaultValue.province].value;
                if (defaultValue.city && countryObject[defaultValue.city]) {
                  stepData[key] += " " + countryObject[defaultValue.city].value;
                }
              }
            }
            break;
          case "radio":
          case "select":
            let radioList = item.optionList;
            radioList &&
              radioList.forEach(option => {
                if (option.value == defaultValue) {
                  stepData[key] = option.label;
                }
              });
            break;
          case "checkbox":
            if (typeof defaultValue === "string") {
              defaultValue = defaultValue.split(" ");
            }
            let obj = "";
            stepData[key] = item.optionList
              .map(e => {
                if (defaultValue.indexOf(e.value) != -1) {
                  return e.label;
                }
                return null;
              })
              .join("  ");
            break;
        }
      });
      return stepData;
    } else {
      return null;
    }
  }
  fieldValidate = (rule, value, callback) => {
    const validateType = this.props.validateType || {};
    let flag = true;
    switch (rule.type) {
      case "text":
      case "textarea":
      case "date":
      case "datestring":
      case "country":
      case "image":
        if (validateType.required) {
          if (validateType.email) {
            flag = validate.isEmail(value);
          } else if (validateType.phone) {
            flag = validate.isPhone(value);
          } else if (
            this.props.userCustom &&
            ["text", "textarea"].indexOf(rule.type) != -1
          ) {
            flag = value && value.every(e => e.trim());
          } else {
            flag = !!value;
          }
        }

        if (!flag) {
          if (rule.type === "image") {
            callback(i18n["formfieldcomponent.image.invalid"]);
          }
          callback(i18n["formfieldcomponent.text.invalid"]);
        } else if (this.props.alphabet && !validate.isLetters(value)) {
          callback(i18n["formfieldcomponent.letters.invalid"]);
        } else {
          callback();
        }
        break;
      case "checkbox":
      case "radio":
      case "select":
        if (!validateType.required || (value && value.length)) callback();
        else {
          callback(i18n["general.select"]);
        }
        break;
      case "phone":
        if (
          !validateType.required ||
          (value && value.countryCode && validate.isPhone(value.phone))
        )
          callback();
        else {
          callback(i18n["formfieldcomponent.text.invalid"]);
        }
        break;
      case "city":
        if (validateType.required && (!value || !value.city)) {
          callback(i18n["country.picker.selector"]);
        } else {
          callback();
        }
        break;
      case "tin":
        if (
          validateType.required &&
          !(
            value &&
            value.every((e = {}) => {
              if (e.countryCode && e.tin) {
                return true;
              }
              return false;
            })
          )
        ) {
          callback(i18n["formfieldcomponent.text.invalid"]);
          break;
        }
        if (
          value &&
          value.some((e = {}) => {
            if ((e.countryCode && !e.tin) || (e.tin && !e.countryCode)) {
              return true;
            }
            return false;
          })
        ) {
          callback(i18n["tin.validate.errorMsg"]);
          break;
        }
        callback();
        break;
      default:
        callback();
        break;
    }
  };
  parseChangedFields = (values, nextValues = {}) => {
    let result = {};
    Object.keys(nextValues).forEach(k => {
      let curr = values[k] || "";
      let next = nextValues[k] || "";
      if (moment.isMoment(next)) {
        next = next.format("YYYY-MM-DD");
      }
      if (typeof curr === "object" && typeof next === "object") {
        if (Array.isArray(curr)) {
          if (JSON.stringify(curr) != JSON.stringify(next)) {
            result[k] = next;
          }
        } else {
          if (Object.keys(curr).some(key => curr[key] != next[key])) {
            //这一行也可以用上面的stringify方法吗？
            result[k] = next;
          }
        }
      } else if (curr != next) {
        result[k] = next;
        /*
					当sc在表单生成后又添加了新的字段，那么 curr 里面是没有sc新添加字段的（连默认值都没有），
					但是我们生成的 next 里面是有所有表单字段的，用户没有填的会用空字符串做为默认值。
					所以这里除了要判断 curr !== next，还要判断当前字段是否是 sc 新添加的字段并且用户有没有填入有效值。
					只有修改过的字段，并且不是新加的非空字段才会标识为修改。
				*/ //SC新增了字段，即使用户没有修改，也算有变化
        //上面这一段，存疑。。。
      }
      // if (result[k]) {
      // 	console.log(curr);
      // 	console.log(next);
      // 	console.log('----------',result[k])
      // }
    });
    return result;
  };
}
