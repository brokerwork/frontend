import { reduxForm, Field, initialize } from 'redux-form';
import { FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import Form from 'components/Form';
import { renderField, required } from 'utils/renderField';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import cs from './UpdateAccountModal.less';
import Dropdown, { DropdownForCode } from 'components/Dropdown';

export const UPDATE_FORM = 'TRADE_SETTING_UPDATE_FORM';
const marginModeList = [
  {
    label: i18n['settings.trade.absolute_amount'],
    value: 'NUMBER'
  },
  {
    label: i18n['settings.trade.percentage_of_customer_balance'],
    value: 'PERCENT'
  }
];
export const DropdownContainer = ({
  onSelect,
  name,
  disabled,
  options,
  input,
  className,
  searchable,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  return (
    <Form.Control error={touched && error ? error : null} className={className}>
      <DropdownForCode
        {...input}
        onChange={
          onSelect ? onSelect.bind(this, input.onChange) : input.onChange
        }
        disabled={disabled}
        data={options}
        searchable={searchable}
        defaultSelect
        className={`${cs['dropdown-width']} ${touched && error
          ? cs['error']
          : ''}`}
      />
    </Form.Control>
  );
};
function fn() {}
class UpdateForm extends PureComponent {
  render() {
    const { initialValues, accountListData, singleInfo, type } = this.props;
    let disabled = type === 'edit' ? true : false;
    return (
      <Form>
        <Form.Item col={1}>
          <Form.Label required={true} className={cs['label']}>
            {i18n['settings.trade.table_name']}：
          </Form.Label>
          <Field
            name="userId"
            className={`col-sm-3 ${cs['dropdown']}`}
            component={DropdownContainer}
            searchable
            disabled={disabled}
            options={accountListData}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required={true} className={cs['label']}>
            {i18n['settings.trade.form_login']}：
          </Form.Label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              value={
                (singleInfo && singleInfo.login) ||
                (initialValues && initialValues.login) ||
                ''
              }
              disabled={true}
            />
          </div>
          <div className={`col-sm-6 ${cs['field_tips']}`}>
            {i18n['settings.trade.form_balance']}：{(singleInfo &&
              singleInfo.balance) ||
              (initialValues && initialValues.balance) ||
              0}{' '}
            USD
          </div>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']} required={true}>
            {i18n['settings.trade.form_margin_warn']}：
          </Form.Label>
          <Field
            name="warnMode"
            columns={10}
            component={renderField}
            type="radioField"
            radioList={marginModeList}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']} />
          <Field
            name={
              initialValues.warnMode === 'NUMBER'
                ? 'marginWarn'
                : 'marginWarnPercent'
            }
            className="col-sm-3"
            component={renderField}
            type="numberField"
          />
          <div className={`col-sm-1 ${cs['field_tips']}`}>
            {initialValues.warnMode === 'NUMBER' ? 'USD' : '％'}
          </div>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']}>
            {i18n['settings.trade.form_fee_radio']}：
          </Form.Label>
          <Field
            name="commissionEnable"
            className={cs['checkbox-align']}
            component={renderField}
            type="checkboxField"
            inline
            checkboxList={[
              { label: i18n['settings.trade.form_fee_radio_option'], value: 1 }
            ]}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']}>
            {i18n['settings.trade.form_commission_radio']}：
          </Form.Label>
          <Field
            name="swapsEnable"
            component={renderField}
            type="checkboxField"
            className={cs['checkbox-align']}
            inline
            checkboxList={[
              { label: i18n['settings.trade.form_fee_radio_option'], value: 1 }
            ]}
          />
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: UPDATE_FORM,
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
  validate: (values = {}) => {
    const errors = {};

    if (required(values.name)) {
      errors.name = required(values.name);
    }

    if (required(values.marginWarn)) {
      errors.marginWarn = required(values.marginWarn);
    }

    return errors;
  }
})(UpdateForm);
