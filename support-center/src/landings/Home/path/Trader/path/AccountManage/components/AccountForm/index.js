import { Field, formValueSelector, reduxForm } from 'redux-form';
import Form from 'components/Form';
import cs from './index.less';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Tab from 'components/Tab';
import { connect } from 'react-redux';
import { ACCOUNT_NAME_FIELD_PREFIX, ACCOUNT_DESC_FIELD_PREFIX } from '../../utils';
import { ACCOUNT_CATEGORY } from '../../constant';
export const TRADER_ACCOUNT_MANAGE_FORM = 'TRADER_ACCOUNT_MANAGE_FORM';

class CForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { activeLanguageKey: 'zh-CN' };
  }

  onChangeLanguageTab = key => {
    this.setState({
      activeLanguageKey: key
    });
  };
  languagesKeys = [];
  // 验证账户名 只要有一个填写就行
  validateAccountName = (value, allValues) => {
    if (!this.languagesKeys.length) {
      this.languagesKeys = this.props.languages.map(item => `${ACCOUNT_NAME_FIELD_PREFIX}${item.value}`);
    }
    if (!this.languagesKeys.some(key => allValues[key])) {
      return i18n['trader.account.manage.add.accountName.tips'];
    }
    return undefined;
  };
  render() {
    const { languages = [], isEdit } = this.props;
    return (
      <Form showHelpText className={cs.account_setting}>
        {!isEdit && (
          <Form.Item className={cs.account_category}>
            <span className={cs.required}>{i18n['trader.account.manage.table_header.accountCategory']}：</span>
            <Form.Control>
              <Field
                name={`accountCategory`}
                label={i18n['trader.customSetting.form.accountName']}
                fieldType="radio"
                component={FormField}
                options={ACCOUNT_CATEGORY}
              />
            </Form.Control>
          </Form.Item>
        )}
        <Tab className={cs['tab']} activeKey={this.state.activeLanguageKey} onChange={this.onChangeLanguageTab}>
          {languages.map(el => {
            return (
              <Tab.Panel title={el.label} eventKey={el.value} className={cs['tab_content']}>
                <Form.Item>
                  <span className={cs.required}>{i18n['trader.customSetting.form.accountName']}：</span>
                  <Form.Control>
                    <Field
                      name={`${ACCOUNT_NAME_FIELD_PREFIX}${el.value}`}
                      label={i18n['trader.customSetting.form.accountName']}
                      fieldType="text"
                      component={FormField}
                      validate={this.validateAccountName}
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
                    />
                  </Form.Control>
                </Form.Item>
              </Tab.Panel>
            );
          })}
        </Tab>
      </Form>
    );
  }
}

export default reduxForm({
  form: TRADER_ACCOUNT_MANAGE_FORM,
  enableReinitialize: true
})(CForm);
