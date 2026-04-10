import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import Nav from 'components/Nav';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './Forms.less';
import CopyToClipboard from 'components/CopyToClipboard';
import Tips from 'components/Tips';

export const AGENT_FORM = 'BROKER_FIELD_SETTING_AGENT_FORM';

const atLeastOneOption = (value = '', values) => {
  const hasOption = value.includes('sc_agent_risk_option');

  return !values.enableRiskAgreement ? undefined : hasOption ? undefined : i18n['field.setting.agent.option.error'];
};

class AgentForm extends PureComponent {
  state = {
    file: ''
  };

  onFileUpload = file => {
    this.setState({
      file
    });
  };

  render() {
    const { onCreateButtonClick, initialValues } = this.props;
    const { file } = this.state;

    return (
      <div>
        <Form className={cs['agent-form']}>
          <Form.Item>
            <Form.Label>
              <span className="required"></span>
              logo：
            </Form.Label>
            <Form.Control>
              <Field name="logo" label="logo" fieldType="file" component={FormField} validate={required} />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>
              <span className="required"></span>
              {i18n['field.setting.agent.edit.title']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="title"
                label={i18n['field.setting.agent.edit.title']}
                fieldType="text"
                component={FormField}
                validate={required}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['field.setting.agent.edit.comment']}：</Form.Label>
            <Form.Control>
              <Field name="comment" fieldType="textarea" component={FormField} />
            </Form.Control>
          </Form.Item>
        </Form>
        <Nav activeKey="risk" sm>
          <Nav.Item eventKey="risk">{i18n['field.setting.agent.risk.agreenment']}</Nav.Item>
        </Nav>
        <div className={cs['risk-content']}>
          <Field
            fieldClassName={cs['risk-switch']}
            name="enableRiskAgreement"
            fieldType="radio"
            options={[{ label: i18n['general.enable'], value: true }, { label: i18n['general.disable'], value: false }]}
            component={FormField}
          />
          <div>
            <div>
              {i18n['field.setting.agent.name.config']}
              <Tips className={cs.tips} align="top">
                {i18n['field.setting.agent.name.config.tips']}
              </Tips>
            </div>
            <div className={cs['name-config']}>
              <Field name="name" fieldType="text" component={FormField} />
            </div>
          </div>
          <Button style="primary" onClick={onCreateButtonClick}>
            <i className="fa fa-plus"></i>
            {i18n['field.setting.agent.create.option']}
          </Button>
          <Field
            fieldClassName={cs['upload-file']}
            name="file"
            fieldType="file"
            showItem={false}
            onFieldChange={this.onFileUpload}
            component={FormField}
          />
          {file ? (
            <div className={cs['copy-link']}>
              <a href={file} target="_blank" className={cs['copy-link-text']}>
                {file}
              </a>
              <CopyToClipboard text={file} />
            </div>
          ) : (
            undefined
          )}
          <Field name="riskAgreement" fieldType="editor" component={FormField} validate={atLeastOneOption} />
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: AGENT_FORM,
  enableReinitialize: true
})(AgentForm);
