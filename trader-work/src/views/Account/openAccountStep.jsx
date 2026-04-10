import { Component } from "react";
import { connect } from "react-redux";
import { Form, Row, Col, Tooltip, Modal, Button, Input } from "antd";
import i18n from "@/utils/i18n";
import FormField from "@/components/FormField";
import { getTypeCountryCode } from "@/utils/language";
import moment from "moment";
import "./openAccountStep.less";
import _ from "lodash";

class OpenAccountStep extends Component {
  state = {
    add: false,
    bankName: ""
  };
  //根据字段属性计算form布局，返回三个col span：formitem、label、wrapper
  renderFormItem = field => {
    let colSpan = 12,
      labelSpan = 8,
      wrapperSpan = 16;
    if (field.longField) {
      (colSpan = 24), (labelSpan = 16), (wrapperSpan = 8);
    } else if (+field.columns > 1) {
      (colSpan = 24), (labelSpan = 4), (wrapperSpan = 20);
    } else if (field.relationFunc) {
      (colSpan = 24), (labelSpan = 4), (wrapperSpan = 8);
    }
    let label = field.label;
    let imageTip = i18n["upload.support.tip"];
    if (
      (field.remark ||
        field.hint ||
        field.placeHolder ||
        field.fieldType === "image") &&
      !field.placeHolderShow
    ) {
      label = (
        <span>
          <span>{field.label}</span>
          <Tooltip
            title={field.remark || field.hint || field.placeholder || imageTip}
            placement="right"
            arrowPointAtCenter="true"
            trigger="click"
            getPopupContainer={() =>
              document.getElementById("open-account-step")
            }
          >
            <i className="icon-icon_ask"></i>
          </Tooltip>
        </span>
      );
    } else {
      label = <span>{field.label}</span>;
    }
    if (field.defaultValue) {
      //需要特殊处理的默认值
      if (["date", "datestring"].indexOf(field.fieldType) != -1) {
        field.defaultValue = moment(field.defaultValue);
      } else if (
        field.fieldType == "phone" &&
        !field.defaultValue.countryCode
      ) {
        field.defaultValue.countryCode = getTypeCountryCode();
      }
    } else if (field.defaultValue === undefined) {
      if (field.fieldType == "select") {
        field.defaultValue = "";
      }
    }
    // 预防报错
    if (field.fieldType == "select" && !field.optionList) {
      field.optionList = [];
    }
    let isSame = this.props.isSame;
    return (
      <Col span={colSpan} key={field.key}>
        <Form.Item
          colon={false}
          required={
            field.validateType && field.validateType.required ? true : false
          }
          label={label}
          labelCol={{ span: labelSpan }}
          wrapperCol={{ span: wrapperSpan }}
        >
          {this.props.form.getFieldDecorator(
            isSame ? field.key : `${field.formName}@${field.key}`,
            {
              initialValue: field.defaultValue,
              rules: [
                {
                  type: field.fieldType,
                  validator: new FormField(field).fieldValidate
                }
              ]
            }
          )(new FormField({ ...field, addBank: this.addBank }).renderField())}
          <div style={{ marginLeft: 10, color: "#989898", lineHeight: "12px" }}>
            {field.placeHolderShow &&
              (field.remark ||
                field.hint ||
                field.placeholder ||
                (field.fieldType === "image" && imageTip))}
          </div>
        </Form.Item>
      </Col>
    );
  };
  //渲染级联字段，参数：根字段-Object、所有字段-Array<Object>、DOM结果-Array
  renderRelation = (field, fields, result) => {
    if (
      field &&
      field.relationFunc &&
      ["radio", "select"].indexOf(field.fieldType != -1)
    ) {
      field.optionList.length &&
        field.optionList.forEach(e => {
          if (
            e.relationField &&
            (this.props.form.getFieldValue(field.key) == e.value ||
              field.defaultValue == e.value)
          ) {
            const subField = fields.find(f => f.key == e.relationField);
            if (subField && subField.key && subField.fieldType) {
              result.push(this.renderFormItem(subField));
            }
            this.renderRelation(subField, fields, result);
          }
        });
    }
  };
  addBank = () => {
    this.setState({
      add: true
    });
  };
  confirmName = e => {
    let type = e.nativeEvent.type;
    let code = e.nativeEvent.code;
    if (type === "keypress" && code !== "Enter") return;
    let field = this.props.fields.find(el => el.key === "bankAccount");
    this.props.form.setFieldsValue({
      [field.formName + "@" + field.key]: this.state.bankName
    });
    this.setState({
      add: false
    });
  };
  changeName = e => {
    let bankName = e.target.value;
    bankName = bankName.replace(/\d/, "");
    this.setState({
      bankName
    });
  };
  render() {
    const { fields } = this.props;
    const result = [];
    const renderFields = [];
    const relationFields = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (!field.relation && field.key && field.fieldType) {
        result.push(this.renderFormItem(field));
        this.renderRelation(field, fields, result);
      }
    }
    return [
      <Form className="open-account-step" id="open-account-step">
        <Row>{result}</Row>
      </Form>,
      <Modal
        title={i18n["userinfo.bank.addBankName"]}
        visible={this.state.add}
        onCancel={() => this.setState({ add: false })}
        footer={
          <span>
            <Button onClick={this.confirmName} type="primary">
              {i18n["general.button.sure"]}
            </Button>
            <Button
              onClick={() => {
                this.setState({ add: false });
              }}
            >
              {i18n["general.button.cancel"]}
            </Button>
          </span>
        }
      >
        <Input
          onKeyPress={this.confirmName}
          value={this.state.bankName}
          onChange={this.changeName}
        />
      </Modal>
    ];
  }
}
export default OpenAccountStep = Form.create({
  //不太规范
  onValuesChange: ({ fields }, values) => {
    console.log(1, values);
    if (fields && fields.length) {
      fields.forEach(e => {
        if (values[e.formName + "@" + e.key] != undefined) {
          e.defaultValue = values[e.formName + "@" + e.key];
        }
      });
    }
  }
})(OpenAccountStep);
