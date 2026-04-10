import Panel from 'components/Panel';
import Button from 'components/Button';
import TipForm from './TipForm';
import Tips from 'components/Tips';
import i18n from 'utils/i18n';
import cs from '../index.less';
import { TIP_FORM } from './TipForm';
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
    submitForm(TIP_FORM);
  };
  onReset = () => {
    this.props.reset(TIP_FORM);
    this.props.showTopAlert({
      style: 'success',
      content: i18n['general.reset_success']
    });
  };
  handleActiveChange = key => {
    const { getOpenDescData, plat, accountTypeConfig } = this.props;
    const accountTypeInfos = accountTypeConfig ? accountTypeConfig.accountTypeInfos : [];

    const customerAccountType = _.get(accountTypeInfos[key], 'customerAccountType', '');
    getOpenDescData(plat, customerAccountType);
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
        <Panel
          className={cs.margin_20}
          header={[
            i18n['trader.plat.setting.open_account.tip'],
            <Tips align="right">{i18n['trader.plat.setting.open_account.tip.hover']}</Tips>
          ]}
        >
          {versionRights['SC_CUSTOM_ACCOUNT_TYPE'] ? (
            <div>
              <Tab activeKey={activeKey} id="realOpenAccount" onChange={this.handleActiveChange}>
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
              <TipForm {...this.props} activeKey={activeKey} />
              <div>
                <Button style="primary" className={cs.margin_right} onClick={this.onSave}>
                  {i18n['app.btn.save']}
                </Button>
                <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
              </div>
            </div>
          ) : (
            <div>
              <TipForm {...this.props} activeKey={activeKey} />
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
