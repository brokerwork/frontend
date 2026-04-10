import Form from 'components/Form';
import { Field } from 'redux-form';
import { default as FormField } from 'components/FormField';
import { required } from 'components/FormField/validate';
import i18n from 'utils/i18n';
import cs from './index.less';
import Tab from 'components/Tab';

export default class OtherForm extends PureComponent {
  state = {
    activeKey: 'zh-CN'
  };
  onChangeTab = key => {
    this.setState({
      activeKey: key
    });
  };
  render() {
    if (!this.props.formValues) return null;
    const {
      formValues: { providerName, name },
      languages,
      plat
    } = this.props;
    return (
      <Form showHelpText>
        <Form.Item>
          <Form.Label className={cs.form_label}>{i18n['platform.tab.deposit.poundage']}：</Form.Label>
          <Form.Control className={cs.currency}>
            <span>{providerName !== name ? `${providerName}(${name})` : providerName}</span>
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label className={cs.form_label}>{i18n['platform.tab.deposit.poundage']}：</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.poundage']}
              name="charges"
              fieldType="number"
              component={FormField}
            />
          </Form.Control>
          <Form.HelpText>%</Form.HelpText>
        </Form.Item>
        <Form.Item>
          <Form.Label className={cs.form_label} />
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.poundage.show']}
              name="showCharge"
              fieldType="checkbox"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label className={cs.form_label}>{i18n['platform.tab.deposit.min.amount']}：</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.min.amount']}
              name="minDeposit"
              fieldType="number"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label className={cs.form_label}>{i18n['platform.tab.deposit.max.amount']}：</Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.max.amount']}
              name="maxDeposit"
              fieldType="number"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item className={cs.languageItem}>
          <Form.Label>{i18n['platform.tab.deposit.notice']}：</Form.Label>
          <Form.Control className={cs.languageItemControl}>
            {plat === 'CTRADER' ? (
              <Field label={i18n['platform.tab.deposit.notice']} name="notice" fieldType="text" component={FormField} />
            ) : (
              <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
                {languages.map(el => {
                  return (
                    <Tab.Panel title={el.label} eventKey={el.value}>
                      <Field name={`notices_${el.value}`} fieldType="textarea" component={FormField} />
                    </Tab.Panel>
                  );
                })}
              </Tab>
            )}
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
