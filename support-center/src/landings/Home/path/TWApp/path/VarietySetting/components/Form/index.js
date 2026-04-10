import Form from 'components/Form';
import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import i18n from 'utils/i18n';
export const VARIETTY_FORM = 'TM_VARIETTY_SETTING_VARIETTY_FORM';
class VarietyForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['twapp.variety_setting.name']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="symbolName"
              fieldType="text"
              component={FormField}
              validate={required}
              maxLength={7}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
        <Form.Label>
          <span className="required"></span>
          {i18n['twapp.variety_setting.code']}：
        </Form.Label>
        <Form.Control>
          <Field
            name="symbol"
            fieldType="text"
            component={FormField}
            validate={required}
            maxLength={14}
          />
        </Form.Control>
      </Form.Item>
      </Form>
    );
  }
} 
export default reduxForm({
  form: VARIETTY_FORM,
  enableReinitialize: true
})(VarietyForm);