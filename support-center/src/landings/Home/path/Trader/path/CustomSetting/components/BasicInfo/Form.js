import { Field, reduxForm } from 'redux-form';
import Form from 'components/Form';
import cs from './Form.less';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';

export const TRADER_CUSTOM_BASIC_FORM = 'TRADER_CUSTOM_BASIC_FORM';

class CForm extends PureComponent {
  render() {
    return (
      <Form showHelpText>
        <Form.Item>
          <Form.Label>{i18n['trader.plat.setting.basicInfo.status']}：</Form.Label>
          <Form.Control className={cs['rem-group']}>
            <Field label={i18n['general.start']} name="enabled" fieldType="checkbox" component={FormField} />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n['trader.plat.setting.basicInfo.name']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="structuralName"
              label={i18n['trader.plat.setting.basicInfo.name']}
              fieldType="text"
              maxLength={50}
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['trader.plat.setting.basicInfo.logo']}：</Form.Label>
          <Form.Control>
            <Field name="structuralLogo" fieldType="file" onlyImage component={FormField} />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['trader.plat.setting.basicInfo.introduce']}：</Form.Label>
          <Form.Control>
            <Field
              name="description"
              label={i18n['trader.plat.setting.basicInfo.introduce']}
              fieldType="textarea"
              maxLength={50}
              rows={10}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export const BasicInfoForm = reduxForm({
  form: TRADER_CUSTOM_BASIC_FORM,
  enableReinitialize: true
})(CForm);
