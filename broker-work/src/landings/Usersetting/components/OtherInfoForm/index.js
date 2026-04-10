import { reduxForm } from 'redux-form';
import { Form, Button } from 'lean-ui';
import CustomField, { validate } from 'components/v2/CustomField';
import i18n from 'utils/i18n';
import cs from './OtherInfoForm.less';
import { COUNTRY_PROVINCE_CITY_KEY } from '../../constant';
const FormItem = Form.Item;
export const OTHER_INFO_FORM = 'USER_SETTING_OTHER_INFO_FORM';

class OtherInfoForm extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(OTHER_INFO_FORM);
  };
  render() {
    const { initialValues, fields, onSubmit, disabled } = this.props;

    return (
      <div className={cs['form']}>
        <CustomField
          fields={fields}
          onSubmit={onSubmit}
          initialValues={initialValues}
          disabled={disabled}
        />
        <Button type="primary" onClick={this.onSave} className={cs['btn']}>
          {i18n['general.save']}
        </Button>
      </div>
    );
  }
}

export default reduxForm({
  form: OTHER_INFO_FORM,
  shouldValidate: () => true,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document
            .querySelectorAll('[class*=error]')[0]
            .setAttribute('tabindex', '0');
      document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate
})(OtherInfoForm);
