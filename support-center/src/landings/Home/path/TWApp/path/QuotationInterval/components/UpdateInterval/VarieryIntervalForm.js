import Form from 'components/Form';
import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import i18n from 'utils/i18n';
export const VARIETTY_INTERVAL_FORM = 'TM_VARIETTY_SETTING_VARIETTY_INTERVAL_FORM';
class VarietyIntervalForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
        <Form.Label>
          {i18n['twapp.quotationinterval.interval']}：
        </Form.Label>
        <Form.Control>
          <Field
            name='period'
            fieldType="number"
            component={FormField}
          />
        </Form.Control>
      </Form.Item>
      </Form>
    );
  }
} 
export default reduxForm({
  form: VARIETTY_INTERVAL_FORM,
  enableReinitialize: true
})(VarietyIntervalForm);