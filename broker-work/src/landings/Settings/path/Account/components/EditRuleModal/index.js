import React, { PureComponent } from 'react';
import { Dialog, Button, Form, Select, Message } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './index.less';
import NumberInput from 'components/v2/NumberInput';
import { OPERATOR_FLAGS_OPTIONS } from '../../constant';

export class EditRuleModal extends PureComponent {
  state = {
    errorMsg: '',
    ruleData: this.props.ruleData
  };
  renderForm = () => {
    const { errorMsg, ruleData } = this.state;
    return (
      <Form>
        <Form.Item required errorMsg={errorMsg}>
          <Form.Label>
            {i18n['settings.account_group_manager.rule1']}
          </Form.Label>
          <Form.Control>
            <div className={cs.horizon}>
              <span>{i18n['settings.account_group_manager.account']}</span>
              <NumberInput
                className={cs.fillSpace}
                value={ruleData['conditionA']}
                integer
                placeholder={i18n['settings.account_group_manager.day']}
                maxLength={4}
                onChange={this.onChange.bind(this, 'conditionA')}
              />
              <span>{i18n['settings.account_group_manager.inday']}</span>
              <Select disabled value={ruleData['ruleType']}>
                <Select.Option value="DEAL_TIME">
                  {i18n['settings.account_group_manager.ruleType.DEAL_TIME']}
                </Select.Option>
              </Select>
              <Select
                value={ruleData['operator']}
                onSelect={this.onChange.bind(this, 'operator')}
              >
                {OPERATOR_FLAGS_OPTIONS.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <NumberInput
                className={cs.fillSpace}
                value={ruleData['conditionB']}
                integer
                placeholder={i18n['settings.account_group_manager.count']}
                maxLength={4}
                onChange={this.onChange.bind(this, 'conditionB')}
              />
              <span>{i18n['settings.account_group_manager.count']}</span>
            </div>
          </Form.Control>
        </Form.Item>
      </Form>
    );
  };

  onChange = (key, e) => {
    const value = e.target ? e.target.value : e;
    const ruleData = { ...this.state.ruleData };
    ruleData[key] = value;
    let errorMsg = '';
    const { conditionA, conditionB } = ruleData;
    if (!conditionA || conditionA === '0') {
      errorMsg = i18n['settings.account_group_manager.errorDay'];
    } else if (!conditionB || conditionB === '0') {
      errorMsg = i18n['settings.account_group_manager.errorCount'];
    }
    this.setState({ ruleData, errorMsg });
  };

  onHide = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  onSave = () => {
    const { onSave } = this.props;
    const { errorMsg, ruleData } = this.state;
    if (errorMsg) {
      Message.error(errorMsg);
      return;
    }
    onSave && onSave(ruleData);
  };

  render() {
    const { visible } = this.props;
    return (
      <Dialog
        visible={visible}
        className={cs.modalBody}
        title={i18n['settings.account_group_manager.ruleSetting']}
        onCancel={this.onHide}
        width={700}
        footer={
          <div>
            <Button type="default" onClick={this.onHide}>
              {i18n['general.cancel']}
            </Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        {this.renderForm()}
      </Dialog>
    );
  }
}

export default EditRuleModal;
