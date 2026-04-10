import CustomField, { validate } from 'components/v2/CustomField';
import { Field } from 'redux-form';
import { reduxForm } from 'redux-form';
import Form from 'components/Form';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';
import Checkbox from 'components/Checkbox';
import { FormattedMessage } from 'react-intl';
import cs from '../../UpdateUserCard.less';
import { isRequired, isEmail, isPositiveNumber } from 'utils/validate';

export const USER_FORM_AGENCT_INFO = 'USER_FORM_AGENCT_INFO';

class AgencyForm extends PureComponent {
  render() {
    const {
      initialValues,
      fields,
      onSubmit,
      onSubmitSuccess,
      disabled
    } = this.props;
    return (
      <CustomField
        fields={fields}
        onSubmit={onSubmit}
        disabled={disabled}
        onSubmitSuccess={onSubmitSuccess}
        initialValues={initialValues}
      />
    );
  }
}

export default reduxForm({
  form: USER_FORM_AGENCT_INFO,
  validate,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  }
})(AgencyForm);
