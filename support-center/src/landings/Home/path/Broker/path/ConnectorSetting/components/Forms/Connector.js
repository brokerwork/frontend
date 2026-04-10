import { reduxForm, Field, SubmissionError } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';

export const CONNECTOR_FORM = 'BROKER_CONNECTOR_SETTING_CONNECTOR_FORM';

const isLessThan = value =>
  value
    ? parseFloat(value) < 2147483647
      ? undefined
      : label => (
          <FormattedMessage
            id="connector.setting.validate.no"
            defaultMessage={i18n['connector.setting.validate.no']}
            values={{ value: label }}
          />
        )
    : null;

class ConnectorForm extends PureComponent {
  render() {
    const { initialValues, currentNo, handleSubmit } = this.props;

    return (
      <Form>
        <Form.Item>
          <Form.Label>{i18n['connector.setting.server.type']}：</Form.Label>
          <Form.Control>
            <Field name="_type" disabled fieldType="text" component={FormField} />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
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
            <span className="required" />
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
            <span className="required" />
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
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n['connector.setting.table.account']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="login"
              label={i18n['connector.setting.table.account']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n['connector.setting.table.account.password']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="password"
              label={i18n['connector.setting.table.account.password']}
              fieldType="password"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['table.header.status']}：</Form.Label>
          <Form.Control>
            <Field name="_status.label" disabled fieldType="text" component={FormField} />
          </Form.Control>
        </Form.Item>
        <Form.Item key="beginNo">
          <Form.Label>{i18n['connector.setting.account.start']}：</Form.Label>
          <Form.Control>
            <Field
              name="beginNo"
              label={i18n['connector.setting.account.start']}
              fieldType="number"
              component={FormField}
              validate={isLessThan}
            />
          </Form.Control>
        </Form.Item>
        ,
        <Form.Item key="endNo">
          <Form.Label>{i18n['connector.setting.account.end']}：</Form.Label>
          <Form.Control>
            <Field
              name="endNo"
              label={i18n['connector.setting.account.end']}
              fieldType="number"
              component={FormField}
              validate={isLessThan}
            />
          </Form.Control>
        </Form.Item>
        {initialValues.type === 'real'
          ? [
            <Form.Item key="rebateBeginNo">
                <Form.Label>{i18n['connector.setting.rebate.start']}：</Form.Label>
                <Form.Control>
                  <Field
                    name="rebateBeginNo"
                    label={i18n['connector.setting.rebate.start']}
                    fieldType="number"
                    component={FormField}
                    validate={isLessThan}
                  />
                </Form.Control>
              </Form.Item>,
            <Form.Item key="rebateEndNo">
                <Form.Label>{i18n['connector.setting.rebate.end']}：</Form.Label>
                <Form.Control>
                  <Field
                    name="rebateEndNo"
                    label={i18n['connector.setting.rebate.end']}
                    fieldType="number"
                    component={FormField}
                    validate={isLessThan}
                  />
                </Form.Control>
              </Form.Item>
          ]
          : undefined}
      </Form>
    );
  }
}

export default reduxForm({
  form: CONNECTOR_FORM,
  enableReinitialize: true
})(ConnectorForm);
