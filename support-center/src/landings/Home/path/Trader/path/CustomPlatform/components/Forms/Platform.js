import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { PLATFORM_TYPES } from '../../constants';

export const PLATFORM_FORM = 'TRADER_PLATFORM_FORM';

class PlatformForm extends PureComponent {
  render() {
    const { isEdit } = this.props;

    return (
      <Form>
        <Form.Item>
          <Form.Label>{i18n['trader.customPlatform.form.type']}：</Form.Label>
          <Form.Control staticControl>
            <Field
              disabled={isEdit}
              name="platformType"
              label={i18n['trader.customPlatform.form.type']}
              fieldType="radio"
              options={PLATFORM_TYPES}
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['trader.customPlatform.form.name']}：</Form.Label>
          <Form.Control>
            <Field
              name="name"
              label={i18n['trader.customPlatform.form.name']}
              fieldType="text"
              component={FormField}
              validate={required}
              maxLength="50"
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: PLATFORM_FORM
})(PlatformForm);
