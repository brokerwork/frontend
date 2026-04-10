import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const CTRADER_CONNECTOR_FORM = 'BROKER_CONNECTOR_SETTING_CTRADER_CONNECTOR_FORM';


class ConnectorForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            {i18n['connector.setting.server.type']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="_type"
              disabled
              fieldType="text"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['connector.setting.table.srvname']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="name"
              label={i18n['connector.setting.table.srvname']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['connector.setting.table.srvaddress']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="host"
              label={i18n['connector.setting.table.srvaddress']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['connector.setting.account.port']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="port"
              label={i18n['connector.setting.account.port']}
              fieldType="number"
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
  form: CTRADER_CONNECTOR_FORM,
  enableReinitialize: true
})(ConnectorForm);