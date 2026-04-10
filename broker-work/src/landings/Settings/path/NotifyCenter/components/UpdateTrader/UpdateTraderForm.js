import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
// import Form from 'components/v2/Form';
import { renderField, required, requiredKey } from 'utils/v2/renderField';
import cs from './index.less';
import i18n from 'utils/i18n';
import { Input, Button, Form, Select } from 'lean-ui';
import NumberInput from 'components/v2/NumberInput';
import {
  TRADER_TYPE_OPTIONS,
  RULE_LOGIC_OPTIONS,
  RULE_LOGIC_SILENT,
  NOTIFY_FREQUENCY
} from './constants';
import { FormattedMessage } from 'react-intl';
import React, { PureComponent } from 'react';

export const UPDATE_TRADER_FORM = 'UPDATE_TRADER_FORM';

class UpdateTraderForm extends PureComponent {
  constructor(props) {
    super(props);
    const options = this.getOptions();
    this.state = { options };
  }

  componentDidMount() {
    const { options } = this.state;
    const { change, isEdit } = this.props;
    if (isEdit) {
      return;
    }
    change('type', options[0].value);
  }

  onChange = (props, value) => {
    props.onChange(value > 100 ? 100 : value);
  };
  onSet = () => {
    this.props.setScale();
  };

  renderNotifyFrequency = () => {
    const { formValues = {} } = this.props;
    if (!formValues.type) {
      return null;
    }
    const { type, notificationFrequency } = formValues;
    if ('TRADER_MARGIN_LEVEL' === type || 'TRADER_OPEN_DEMO' === type) {
      return null;
    }
    return (
      <Form.Item col={1}>
        <Form.Label>{i18n['settings.update_notify.rate']}</Form.Label>
        <Form.Control>
          <Field
            name="notificationFrequency"
            component={renderField}
            radioList={NOTIFY_FREQUENCY}
            type="radioField"
            colClassName={cs.colWrapper}
            suffix={
              notificationFrequency === 'FixedInterval' ? (
                <Field
                  colClassName={cs['inline']}
                  className={cs['input_suffix']}
                  name="notificationInterval"
                  component={renderField}
                  type="numField"
                  integer
                  suffix={i18n['settings.update_notify.placeholder.day']}
                  maxLength={4}
                  validate={[required]}
                />
              ) : (
                undefined
              )
            }
            validate={[required]}
          />
        </Form.Control>
      </Form.Item>
    );
  };

  renderRule = () => {
    const { formValues = {} } = this.props;
    if (!formValues.type) {
      return null;
    }
    switch (formValues.type) {
      case 'TRADER_MARGIN_LEVEL':
        const { ratioType } = formValues.ruleDetail || {};
        return (
          <Form.Control key="TRADER_MARGIN_LEVEL">
            <Field
              name="ruleDetail.ratioType"
              component={renderField}
              radioList={[
                {
                  value: 'unify',
                  label: i18n['settings.notify_center.setScale.unify']
                },
                {
                  value: 'group',
                  label: i18n['settings.notify_center.setScale.group']
                }
              ]}
              type="radioField"
              validate={[required]}
              // onChange={this.onChangeRule}
            />
            {ratioType === 'unify' && (
              <div>
                {i18n['settings.notify_center.setScale.tip1']}
                <Field
                  colClassName={cs['inline']}
                  className={cs['input']}
                  name="ruleDetail.unifiedRatio"
                  component={renderField}
                  type="numField"
                  integer
                  validate={[required]}
                />
                {i18n['settings.notify_center.setScale.tip2']}
              </div>
            )}
            {ratioType === 'group' && (
              <Field
                name="ruleDetail.groupRatio"
                component={() => (
                  <a onClick={this.onSet}>
                    {i18n['settings.notify_center.setScale.set']}
                  </a>
                )}
              />
            )}
          </Form.Control>
        );
      case 'TRADER_OPEN_DEMO':
        return (
          <Form.Control key="TRADER_MARGIN_LEVEL">
            <div className={cs.wrapper}>
              <span className={cs.label}>
                {i18n['settings.update_notify.rule.open_demo_header']}
              </span>
              <Field
                colClassName={cs['inline']}
                className={cs['input_suffix']}
                name="ruleDetail.registerTimeScope"
                component={renderField}
                type="numField"
                integer
                suffix={i18n['settings.update_notify.placeholder.day']}
                maxLength={4}
                validate={[required]}
              />
              <span className={cs.label}>
                {i18n['settings.update_notify.rule.open_demo_tail']}
              </span>
            </div>
          </Form.Control>
        );
      case 'TRADER_OPEN_REAL':
        return (
          <Form.Control key="TRADER_OPEN_REAL">
            <div className={cs.wrapper}>
              <span className={cs.label}>
                {i18n['settings.update_notify.rule.open_demo_header']}
              </span>
              <Field
                colClassName={cs['inline']}
                className={cs['input_suffix']}
                name="ruleDetail.registerTimeScope"
                component={renderField}
                type="numField"
                integer
                suffix={i18n['settings.update_notify.placeholder.day']}
                maxLength={4}
                validate={[required]}
              />
              <span className={`${cs.label} ${cs.margin}`}>
                {i18n['settings.update_notify.rule.open_demo_tail']}
              </span>
              <Field
                name="ruleDetail.logicType"
                component={renderField}
                type="selectField"
                validate={[required]}
                options={RULE_LOGIC_OPTIONS}
              />
            </div>
            <div className={cs.wrapper}>
              <span className={cs.label}>
                {i18n['settings.update_notify.rule.open_demo_header2']}
              </span>
              <Field
                name="ruleDetail.demoTimeScope"
                colClassName={cs['inline']}
                className={cs['input_suffix']}
                component={renderField}
                type="numField"
                integer
                suffix={i18n['settings.update_notify.placeholder.day']}
                maxLength={4}
                validate={[required]}
              />
            </div>
          </Form.Control>
        );
      case 'TRADER_OPEN_REAL_FORM':
        return i18n['settings.update_notify.rule.open_real_form'];
      default:
        return (
          <Form.Control key="TRADER_SILENT_CLIENT">
            <div className={cs.wrapper}>
              <span className={cs.label}>
                {i18n['settings.update_notify.user']}
              </span>
              <Field
                colClassName={cs['inline']}
                className={cs['input_suffix']}
                name="ruleDetail.timeScope"
                component={renderField}
                type="numField"
                integer
                suffix={i18n['settings.update_notify.inDays']}
                maxLength={4}
                validate={[required]}
              />
              <Select className={cs.margin} disabled value="times">
                <Select.Option value="times">
                  {i18n['settings.update_notify.transactionNumer']}
                </Select.Option>
              </Select>
              <Field
                name="ruleDetail.condition"
                component={renderField}
                type="selectField"
                validate={[required]}
                options={RULE_LOGIC_SILENT}
              />
              <Field
                colClassName={cs['inline']}
                className={cs['input_suffix']}
                name="ruleDetail.dealScope"
                component={renderField}
                type="numField"
                integer
                suffix={i18n['settings.update_notify.number']}
                maxLength={4}
                validate={[required]}
              />
            </div>
          </Form.Control>
        );
    }
  };

  onChangeType = value => {
    const { change, clearAsyncError } = this.props;
    if (value === 'TRADER_OPEN_REAL') {
      change('ruleDetail', { logicType: 'AND' });
    } else if (value === 'TRADER_SILENT_CLIENT') {
      change('ruleDetail', { condition: 'LTE' });
    }
  };

  getOptions = () => {
    const { existTypes } = this.props;
    if (!existTypes) {
      return TRADER_TYPE_OPTIONS;
    }
    return TRADER_TYPE_OPTIONS.filter(el => !existTypes.has(el.value));
  };

  render() {
    const { options } = this.state;
    const { notifyWay, formValues = {}, isEdit } = this.props;
    if (!formValues.type) {
      return null;
    }
    return (
      <Form>
        {!isEdit && (
          <Form.Item col={1}>
            <Form.Label>
              {i18n['settings.notify_rule_area.header_type']}
            </Form.Label>
            <Form.Control>
              <Field
                name="type"
                component={renderField}
                radioList={options}
                onFieldChange={this.onChangeType}
                type="radioField"
              />
            </Form.Control>
          </Form.Item>
        )}
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['settings.update_nofity.rule_label']}
          </Form.Label>
          {this.renderRule()}
        </Form.Item>
        {this.renderNotifyFrequency()}
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['settings.notify_center.user']}
          </Form.Label>
          <Form.Control>
            <Field
              name="roles"
              component={renderField}
              radioList={[
                {
                  value: 'all',
                  label: i18n['report.download_tips_modal.summary_user']
                }
              ]}
              type="radioField"
              onChange={this.getCopy}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label required>
            {i18n['settings.update_nofity.notify_way']}
          </Form.Label>
          <Form.Control>
            <Field
              name="noticeType"
              component={renderField}
              checkboxList={notifyWay}
              type="checkboxField"
              validate={required}
              label={i18n['settings.self_notify.data_report.way_tips']}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

const MyForm = reduxForm({
  form: UPDATE_TRADER_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  enableReinitialize: true,
  touchOnChange: true,
  validate: (values = {}) => {
    let ruleDetail = {};
    if (values.ruleDetail) {
      if (values.ruleDetail.unifiedRatio > 100) {
        ruleDetail.unifiedRatio = i18n['settings.update_notify.moreThan100'];
      }
      if (!values.ruleDetail.registerTimeScope) {
        ruleDetail.registerTimeScope = i18n['settings.update_notify.needInput'];
      }
    }
    return { ruleDetail };
  }
})(UpdateTraderForm);

export default connect(state => ({
  formValues: getFormValues(UPDATE_TRADER_FORM)(state)
}))(MyForm);
