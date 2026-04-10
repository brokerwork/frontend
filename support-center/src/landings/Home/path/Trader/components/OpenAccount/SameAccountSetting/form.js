import Form from 'components/Form';
import { Field } from 'redux-form';
import { default as FormField } from 'components/FormField';
import i18n from 'utils/i18n';
import cs from './index.less';
import Tab from 'components/Tab';

const EXPLAIN_TYPES = [
  { value: true, label: i18n['platform.tab.open.account.sameAccount.require'] },
  { value: false, label: i18n['platform.tab.open.account.sameAccount.notRequire'] }
];
export default class SameAccountSetting extends Component {
  state = {
    activeKey: 'zh-CN'
  };
  onChangeTab = key => {
    this.setState({
      activeKey: key
    });
  };
  render() {
    const { languages } = this.props;
    return (
      <Form className={cs.sameAccountForm}>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.open.account.sameAccount.explain']}</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.open.account.sameAccount.explain']}
              name="accountDescFieldRequired"
              fieldType="radio"
              component={FormField}
              options={EXPLAIN_TYPES}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.open.account.sameAccount.explain.default_tips']}</Form.Label>
          <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
            {languages.map(el => {
              return (
                <Tab.Panel title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Field name={`accountDescFieldHint_${el.value}`} fieldType="text" component={FormField} />
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>
        </Form.Item>
      </Form>
    );
  }
}
