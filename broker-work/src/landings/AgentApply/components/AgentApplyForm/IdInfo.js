import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';

export const AGENT_APPLY_ID_INFO_FORM = 'AGENT_APPLY_ID_INFO_FORM';

class AgentApplyIdInfoForm extends PureComponent {
  render() {
    const { fields, initialValues } = this.props;
    const setDefaultValue = Object.keys(initialValues).length === 0;

    return <CustomField fields={fields} setDefaultValue={setDefaultValue} />;
  }
}

export default reduxForm({
  form: AGENT_APPLY_ID_INFO_FORM,
  enableReinitialize: true,
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
})(AgentApplyIdInfoForm);
