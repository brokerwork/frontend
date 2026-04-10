import { reduxForm, Field } from 'redux-form';
import { Form } from 'lean-ui';
import { renderField } from 'utils/renderField';

export const OPTIONS_FORM = 'DASHBOARD_ADD_WORKBENCH_OPTIONS_FORM';

class OptionsForm extends PureComponent {
  render() {
    const { disabled, options } = this.props;
    return (
      <Form>
        <Field
          name="selectType"
          component={renderField}
          disabled={!!disabled}
          type="checkboxField"
          checkboxList={options}
        />
      </Form>
    );
  }
}

export default reduxForm({
  form: OPTIONS_FORM,
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
})(OptionsForm);
