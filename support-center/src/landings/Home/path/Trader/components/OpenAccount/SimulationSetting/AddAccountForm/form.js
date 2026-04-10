import { Field } from 'redux-form';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { default as FormField } from 'components/FormField';
import { required } from 'components/FormField/validate';
import { currencyList } from '../../constant';
import cs from './index.less';
import Tab from 'components/Tab';
import { FormattedMessage } from 'react-intl';

export default class AddForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    activeKey: 'zh-CN'
  };
  onChangeTab = key => {
    this.setState({
      activeKey: key
    });
  };
  languagesKeys = [];
  // 验证账户名 只要有一个填写就行
  validateTypeName = (value, allValues) => {
    if (!this.languagesKeys.length) {
      this.languagesKeys = this.props.languages.map(item => `typeNames_${item.value}`);
    }
    if (!this.languagesKeys.some(key => allValues[key])) {
      return (
        <FormattedMessage
          id="trader.account.more_language_tips"
          defaultMessage={i18n['trader.account.more_language_tips']}
          values={{ name: i18n['platform.tab.open.account.type.name'] }}
        />
      );
    }
    return undefined;
  };
  render() {
    const { leverageList, plat, maxLeverageList, accountTypeList, totalCaculationTypeList, languages } = this.props;
    return (
      <div>
        <Form showHelpText>
          <Form.Item className={cs.languageItem}>
            <Form.Label>
              <span className="required" />
              {i18n['platform.tab.open.account.type.name']}：
            </Form.Label>
            <Form.Control className={cs.languageItemControl}>
              {plat === 'CTRADER' ? (
                <Field
                  name="typeName"
                  label={i18n['platform.tab.open.account.type.name']}
                  fieldType="text"
                  component={FormField}
                  validate={required}
                />
              ) : (
                <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab} className={cs.tab}>
                  {languages.map(el => {
                    return (
                      <Tab.Panel title={el.label} eventKey={el.value}>
                        <Field
                          name={`typeNames_${el.value}`}
                          fieldType="text"
                          component={FormField}
                          validate={this.validateTypeName}
                        />
                      </Tab.Panel>
                    );
                  })}
                </Tab>
              )}
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs.form_label}>
              <span className="required" />
              {i18n['platform.tab.open.account.lever']}：
            </Form.Label>
            <Form.Control>
              {leverageList ? (
                <Field
                  name="leverage"
                  label={i18n['platform.tab.open.account.lever']}
                  fieldType="select"
                  component={FormField}
                  options={leverageList}
                  validate={required}
                />
              ) : null}
            </Form.Control>
          </Form.Item>
          {/* ctrader不展示 mt组 */}
          {plat !== 'CTRADER' ? (
            <Form.Item>
              <Form.Label className={cs.form_label}>
                <span className="required" />
                {i18n['platform.tab.open.account.mt']}：
              </Form.Label>
              <Form.Control>
                <Field
                  name="accountGroup"
                  label={i18n['platform.tab.open.account.mt']}
                  fieldType="text"
                  component={FormField}
                  validate={required}
                />
              </Form.Control>
            </Form.Item>
          ) : null}
          {/* ctrader展示 */}
          {plat === 'CTRADER' ? (
            <Form.Item>
              <Form.Label className={cs.form_label}>
                <span className="required" />
                {i18n['platform.tab.open.account.ctrader.group']}：
              </Form.Label>
              <Form.Control>
                <Field
                  name="accountGroup"
                  label={i18n['platform.tab.open.account.ctrader.group']}
                  fieldType="text"
                  component={FormField}
                  validate={required}
                />
              </Form.Control>
            </Form.Item>
          ) : null}
          <Form.Item>
            <Form.Label className={cs.form_label}>
              <span className="required" />
              {i18n['platform.tab.open.account.initamount']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="initAmount"
                label={i18n['platform.tab.open.account.initamount']}
                fieldType="number"
                component={FormField}
                validate={required}
              />
            </Form.Control>
          </Form.Item>

          {/* ctrader展示 */}
          {plat === 'CTRADER' ? (
            <div>
              <Form.Item>
                <Form.Label className={cs.form_label}>
                  <span className="required" />
                  {i18n['platform.tab.open.account.currency']}：
                </Form.Label>
                <Form.Control>
                  <Field
                    name="currency"
                    label={i18n['platform.tab.open.account.currency']}
                    fieldType="select"
                    component={FormField}
                    options={currencyList}
                    validate={required}
                  />
                </Form.Control>
              </Form.Item>
              <Form.Item>
                <Form.Label className={cs.form_label}>
                  <span className="required" />
                  {i18n['platform.tab.open.account.max.leverage']}：
                </Form.Label>
                <Form.Control>
                  {maxLeverageList ? (
                    <Field
                      name="maxLeverage"
                      label={i18n['platform.tab.open.account.max.leverage']}
                      fieldType="select"
                      component={FormField}
                      options={maxLeverageList}
                      validate={required}
                    />
                  ) : null}
                </Form.Control>
              </Form.Item>
              <Form.Item>
                <Form.Label className={cs.form_label}>
                  <span className="required" />
                  {i18n['platform.tab.open.account.ctrader.type']}：
                </Form.Label>
                <Form.Control>
                  {accountTypeList ? (
                    <Field
                      name="ctraderAccountType"
                      label={i18n['platform.tab.open.account.ctrader.type']}
                      fieldType="select"
                      component={FormField}
                      options={accountTypeList}
                      validate={required}
                    />
                  ) : null}
                </Form.Control>
              </Form.Item>
              <Form.Item>
                <Form.Label className={cs.form_label}>
                  <span className="required" />
                  {i18n['platform.tab.open.account.total.margin.calc.type']}：
                </Form.Label>
                <Form.Control>
                  {totalCaculationTypeList ? (
                    <Field
                      name="totalMarginCalculationType"
                      label={i18n['platform.tab.open.account.total.margin.calc.type']}
                      fieldType="select"
                      component={FormField}
                      options={totalCaculationTypeList}
                      validate={required}
                    />
                  ) : null}
                </Form.Control>
              </Form.Item>
            </div>
          ) : null}
        </Form>
      </div>
    );
  }
}
