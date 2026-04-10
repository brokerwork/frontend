import Form from 'components/Form';
import { reduxForm, Field } from 'redux-form';
import { required } from 'components/FormField/validate';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
export const TIME_FROM = 'TM_SYNRCHONIZE_SETTING_TIME_FORM';
class TimeForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['twapp.trade_time_setting.monday']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="1"
              fieldType="hour"
              component={FormField}
              validate={required}
              inline
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
            <Form.Label>
                <span className="required"></span>
                    {i18n['twapp.trade_time_setting.tuesday']}：
            </Form.Label>
            <Form.Control>
                <Field
                  name="2"
                  fieldType="hour"
                  component={FormField}
                  validate={required}
                />
            </Form.Control>
        </Form.Item>
        <Form.Item>
            <Form.Label>
                <span className="required"></span>
                    {i18n['twapp.trade_time_setting.wednesday']}：
            </Form.Label>
            <Form.Control>
                <Field
                  name="3"
                  fieldType="hour"
                  component={FormField}
                  validate={required}
                />
            </Form.Control>
        </Form.Item>
        <Form.Item>
            <Form.Label>
                <span className="required"></span>
                  {i18n['twapp.trade_time_setting.thursday']}：
            </Form.Label>
            <Form.Control>
                <Field
                  name="4"
                  fieldType="hour"
                  component={FormField}
                  validate={required}
                />
            </Form.Control>
        </Form.Item>
        <Form.Item>
            <Form.Label>
                <span className="required"></span>
                  {i18n['twapp.trade_time_setting.friday']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="5"
                fieldType="hour"
                component={FormField}
                validate={required}
              />
            </Form.Control>
        </Form.Item>
        <Form.Item>
            <Form.Label>
                <span className="required"></span>
                  {i18n['twapp.trade_time_setting.saturday']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="6"
                fieldType="hour"
                component={FormField}
                validate={required}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
          <Form.Label>
              <span className="required"></span>
                {i18n['twapp.trade_time_setting.sunday']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="7"
              fieldType="hour"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
} 
export default reduxForm({
  form: TIME_FROM,
  enableReinitialize: true,
  validate: values => {
    const errors = {};
    for (let key in values) {  
      const start = values[key].start;
      const end = values[key].end;
      if (parseInt(start) > parseInt(end)) {
        errors[key] = i18n['twapp.trade_time_setting.error_tips'];
      }
    } 
    return errors;
  }
})(TimeForm);