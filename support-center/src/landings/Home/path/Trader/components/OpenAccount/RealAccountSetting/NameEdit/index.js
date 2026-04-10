import cs from './index.less';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import Form from 'components/Form';
import { languages } from 'utils/config';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';

export default class NameEdit extends PureComponent {
  dataMap = this.props.data;

  onChangeName = (key, { target: { value } }) => {
    const { onChange } = this.props;
    const newData = { ...this.dataMap };
    newData[key] = value;
    this.dataMap = newData;
    if (onChange) {
      onChange(newData);
    }
  };

  renderItem = ({ label, value }, index) => {
    const { data } = this.props;
    return (
      <Form.Item key={index}>
        <Form.Label>
          <FormattedMessage
            id="field.setting.field.nameLabel"
            defaultMessage={i18n['field.setting.field.nameLabel']}
            values={{ label }}
          />
        </Form.Label>
        <input
          className="form-control"
          type="text"
          defaultValue={data[value]}
          onChange={this.onChangeName.bind(this, value)}
        />
      </Form.Item>
    );
  };
  render() {
    return <Form>{languages.map(this.renderItem)}</Form>;
  }
}
