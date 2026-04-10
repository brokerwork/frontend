import React from "react";
import { Form, Input, Select } from "antd";
import { observer } from "mobx-react-lite";
import { LANGUAGES_SHORT_LIST } from "src/utils/languages";
const { Option } = Select;
const FormContent = observer(props => {
  const { getFieldDecorator } = props.form;
  const handleSelect = value => {};
  return (
    <Form>
      <Form.Item label="语言名">
        {getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "请输入语言名"
            }
          ]
        })(<Input placeholder="请输入语言名" />)}
      </Form.Item>
      <Form.Item label="标识">
        {getFieldDecorator("lang", {
          rules: [
            {
              required: true,
              message: "请选择标识"
            }
          ]
        })(
          <Select
            onChange={handleSelect}
            showSearch
            placeholder="可输入国家名称搜索"
          >
            {LANGUAGES_SHORT_LIST.map(item => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        )}
      </Form.Item>
    </Form>
  );
});

const WrappedFormContent = Form.create({
  name: "mutiple_language_manage_add_form"
})(FormContent);

export default WrappedFormContent;
