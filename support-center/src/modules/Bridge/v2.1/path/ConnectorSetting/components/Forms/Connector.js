import { reduxForm, Field } from "redux-form";
import FormField from "components/FormField";
import { required } from "components/FormField/validate";
import { lessThan, greaterThan } from "components/FormField/normalize";
import Form from "components/Form";
import i18n from "utils/i18n";

export const CONNECTOR_FORM = "BRIDGE_CONNECTOR_SETTING_CONNECTOR_FORM";

class ConnectorForm extends PureComponent {
  render() {
    const { initialValues, currentNo } = this.props;

    return (
      <Form>
        <Form.Item>
          <Form.Label>{i18n["connector.setting.server.type"]}：</Form.Label>
          <Form.Control>
            <Field
              name="vendorType"
              disabled
              fieldType="text"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["bridge.connector.name"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="name"
              label={i18n["connector.setting.table.srvname"]}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["bridge.connector.address"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="addr"
              label={i18n["connector.setting.table.srvaddress"]}
              fieldType="text"
              component={FormField}
              validate={required}
              placeholder={i18n["bridge.connector.address.placeholder"]}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["bridge.connector.account"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="managerLogin"
              label={i18n["connector.setting.account.port"]}
              fieldType="number"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["bridge.connector.password"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="managerPwd"
              label={i18n["connector.setting.table.account.password"]}
              fieldType="password"
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
  form: CONNECTOR_FORM,
  enableReinitialize: true
})(ConnectorForm);
