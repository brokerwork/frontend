import { Field } from 'redux-form';
import Form from 'components/Form';
import cs from '../../Form.less';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
import Tab from 'components/Tab';

export const COMPANY_ACCOUNT_FORM = 'TRADER_CUSTOM_COMPANY_ACCOUNT_FORM';
export const ACCOUNT_NAME_FIELD_PREFIX = 'accountName_';
export const ACCOUNT_DESC_FIELD_PREFIX = 'accountDesc_';
export default class AccountForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { activeLanguageKey: 'zh-CN' };
  }

  onChangeLanguageTab = key => {
    this.setState({
      activeLanguageKey: key
    });
  };

  render() {
    const { languages = [], type, formValues } = this.props;
    if (!formValues) {
      return null;
    }
    return (
      <Form showHelpText className={cs.account_setting}>
        {/* <Form.Item>
          <Form.Label />
          <Form.Control>
            <Field
              name="enabled"
              label={i18n[`trader.customSetting.${type}.enabled`]}
              fieldType="checkbox"
              component={FormField}
            />
          </Form.Control>
        </Form.Item> */}
        <Form.Item>
          <Form.Label />
          <Form.Control className={cs.switch_style}>
            <span className={cs.switch_label}>{i18n[`trader.customSetting.${type}.enabled`]}</span>
            <Field name="enabled" fieldType="switch" component={FormField} />
          </Form.Control>
        </Form.Item>
        <Tab className={cs['tab']} activeKey={this.state.activeLanguageKey} onChange={this.onChangeLanguageTab}>
          {languages.map(el => {
            return (
              <Tab.Panel title={el.label} eventKey={el.value} className={cs['tab_content']}>
                <Form.Item>
                  <span>{i18n['trader.customSetting.form.accountName']}：</span>
                  <Form.Control>
                    <Field
                      name={`${ACCOUNT_NAME_FIELD_PREFIX}${el.value}`}
                      label={i18n['trader.customSetting.form.accountName']}
                      fieldType="text"
                      maxLength={50}
                      component={FormField}
                      disabled={!formValues.enabled}
                    />
                  </Form.Control>
                </Form.Item>
                <Form.Item>
                  <span>{i18n['trader.customSetting.form.accountIntroduce']}：</span>
                  <Form.Control>
                    <Field
                      name={`${ACCOUNT_DESC_FIELD_PREFIX}${el.value}`}
                      label={i18n['trader.customSetting.form.accountIntroduce']}
                      fieldType="textarea"
                      maxLength={200}
                      rows={10}
                      component={FormField}
                      disabled={!formValues.enabled}
                    />
                  </Form.Control>
                </Form.Item>
              </Tab.Panel>
            );
          })}
        </Tab>
        <Form.Item>
          <Form.Label />
          <Form.Control className={cs.allowed_check_box}>
            <Field
              label={i18n[`trader.customSetting.form.allowApply.${type}`]}
              name="allowApply"
              fieldType="checkbox"
              component={FormField}
              disabled={!formValues.enabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label />
          <Form.Control>
            <div>{i18n[`trader.customSetting.${type}.auth`]}</div>
            <Field name="subaccountRights" fieldType="authTree" component={FormField} disabled={!formValues.enabled} />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
