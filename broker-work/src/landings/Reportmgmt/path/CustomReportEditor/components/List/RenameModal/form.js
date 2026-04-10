import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { required, renderField, maxLength } from 'utils/v2/renderField';

export const FIELD_NAME_FORM = 'FIELD_NAME_FORM';
class FieldRenameFrom extends PureComponent {
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
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: FIELD_NAME_FORM,
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
})(FieldRenameFrom);
