import Panel from 'components/Panel';
import Button from 'components/Button';
import RiskDisclosureForm from './RiskDisclosureForm';
import i18n from 'utils/i18n';
import cs from '../index.less';
import { RISK_DISCLOSURE_FORM } from './RiskDisclosureForm';
import language from 'utils/language';
import _ from 'lodash';
import Tab from 'components/Tab';
const TabPanel = Tab.Panel;
export default class RiskDisclosure extends PureComponent {
  state = {
    activeKey: 0
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(RISK_DISCLOSURE_FORM);
  };
  onReset = () => {
    this.props.reset(RISK_DISCLOSURE_FORM);
    this.props.showTopAlert({
      style: 'success',
      content: i18n['general.reset_success']
    });
  };
  handleActiveChange = key => {
    const { getRiskDescData, plat, accountTypeConfig } = this.props;
    const accountTypeInfos = accountTypeConfig ? accountTypeConfig.accountTypeInfos : [];
    if (key === this.state.activeKey) {
      return;
    }
    const customerAccountType = _.get(accountTypeInfos[key], 'customerAccountType', '');
    getRiskDescData(plat, customerAccountType);
    this.setState({ activeKey: key });
  };
  render() {
    const { activeKey } = this.state;
    const { accountTypeConfig, versionRights } = this.props;
    let accountTypeInfos = [];
    if (accountTypeConfig) {
      accountTypeInfos = accountTypeConfig.accountTypeInfos;
    }
    return (
      <div>
        <Panel className={cs.margin_20} header={i18n['platform.tab.open.account.risk.setting']}>
          {versionRights['SC_CUSTOM_ACCOUNT_TYPE'] ? (
            <div>
              <Tab activeKey={activeKey} onChange={this.handleActiveChange}>
                {accountTypeInfos.map((item, index) => {
                  const Lang = language.getLang();
                  const title = item.accountTypeName[Lang] || (Lang === 'zh-CN' ? '未命名' : 'unknown');
                  return (
                    <TabPanel
                      key={item.customerAccountType}
                      className={cs.setting_tabpanel}
                      eventKey={index}
                      title={
                        <span className={cs.tab_title} title={title}>
                          {title}
                        </span>
                      }
                    ></TabPanel>
                  );
                })}
              </Tab>
              <RiskDisclosureForm {...this.props} activeKey={activeKey} />
              <div>
                <Button style="primary" className={cs.margin_right} onClick={this.onSave}>
                  {i18n['app.btn.save']}
                </Button>
                <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
              </div>
            </div>
          ) : (
            <div>
              <RiskDisclosureForm {...this.props} />
              <div>
                <Button style="primary" className={cs.margin_right} onClick={this.onSave}>
                  {i18n['app.btn.save']}
                </Button>
                <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
              </div>
            </div>
          )}
        </Panel>
      </div>
    );
  }
}
