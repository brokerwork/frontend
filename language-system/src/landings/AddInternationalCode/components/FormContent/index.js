import React, { useState } from "react";
import { Form, Row, Col, Input, Button, Select, message } from "antd";
import cs from "./index.less";
import { observer } from "mobx-react-lite";
import { useStore } from "src/utils/provider.js";
import { useGlobalStores } from "src/hooks/useGlobalStores";

const { Option } = Select;
const FormContent = observer(props => {
  const { getFieldDecorator } = props.form;
  const store = useStore();
  const { commonStore } = useGlobalStores();
  const [fillLang, setFillLang] = useState("zh_CN");
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { resKey, ...restValues } = values;
        const params = {
          resKey: resKey,
          content: restValues,
          productId: store.activeKey
        };
        store.upsertLang(params).then(res => {
          if (res.result) {
            message.success("添加成功");
            props.form.resetFields();
          }
        });
        // push("/home");
      }
    });
  };
  const handleChange = value => {
    setFillLang(value);
  };
  const onFillLanguage = () => {
    const values = props.form.getFieldsValue();
    // 如果全部填写则不需要填充
    if (
      !Object.entries(values).some(item => item[0] !== "resKey" && !item[1])
    ) {
      message.info("您已填写所有语言，不需要填充");
      return;
    }
    // 把未填写的填充选中的语言
    if (fillLang) {
      const fillValue = values[fillLang];
      Object.keys(values).forEach(key => {
        if (key !== "resKey" && !values[key]) {
          props.form.setFieldsValue({ [key]: fillValue });
        }
      });
    }
  };
  return (
    <Form
      className={cs.add_form}
      onSubmit={handleSubmit}
      labelCol={{ span: 4 }}
      labelAlign="left"
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="res_key">
            {getFieldDecorator("resKey", {
              rules: [
                {
                  required: true,
                  message: "请输入res_key"
                }
              ]
            })(<Input placeholder="请输入res_key" />)}
          </Form.Item>
        </Col>
        {commonStore.languageList.map(lang => {
          return (
            <Col span={12} key={lang.lang}>
              <Form.Item label={lang.name}>
                {getFieldDecorator(lang.lang, {
                  rules: [
                    {
                      required: true,
                      message: `请输入${lang.name}`
                    }
                  ]
                })(<Input placeholder={`请输入${lang.name}`} />)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>

      <Row>
        把未填充的同步为
        <Select
          value={fillLang}
          style={{ margin: "0 10px", width: 120 }}
          onChange={handleChange}
        >
          {commonStore.languageList.map(item => {
            return (
              <Option key={item.lang} value={item.lang}>
                {item.name}
              </Option>
            );
          })}
        </Select>
        <Button type="primary" onClick={onFillLanguage}>
          同步
        </Button>
      </Row>
      <Row>
        <div className={cs.footer_btn}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </div>
      </Row>
    </Form>
  );
});

const WrappedFormContent = props => {
  const WrapContent = Form.create({
    name: `add_international_code_form_${props.name}`
  })(FormContent);
  return <WrapContent />;
};
export default WrappedFormContent;
