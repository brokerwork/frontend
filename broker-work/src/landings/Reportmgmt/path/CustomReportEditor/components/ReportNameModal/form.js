import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { required, renderField, maxLength } from 'utils/v2/renderField';

export const CUSTOM_REPORT_NAME_FORM = 'CUSTOM_REPORT_NAME_FORM';
class ReportNameFrom extends PureComponent {
  render() {
    return (
      <Form horizontal>
        <Form.Item col="1">
          <Form.Control>
            <Field
              name="name"
              component={renderField}
              type="textField"
              required
              maxLength={100}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: CUSTOM_REPORT_NAME_FORM,
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
})(ReportNameFrom);
