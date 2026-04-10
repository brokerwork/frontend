import cs from './index.less';
import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import PersonalAccount from './PersonalAccount';
import CompanyAccount from './components/CompanyAccount';
import AssetsAccount from './components/AssetsAccount';
const TabPanel = Tab.Panel;
export const COMPANY_ACCOUNT_FORM = 'TRADER_CUSTOM_COMPANY_ACCOUNT_FORM';
export const ASSET_ACCOUNT_FORM = 'TRADER_CUSTOM_ASSET_ACCOUNT_FORM';

export default class Account extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1
    };
  }
  render() {
    const { activeKey } = this.state;
    const {
      paltSetting: { corporateAccount, assetAccount }
    } = this.props;
    return (
      <div className={cs.ctraderSetting}>
        <Tab
          className={cs.setting_tab}
          activeKey={activeKey}
          id="customAccountSetting"
          onChange={key => {
            this.setState({ activeKey: key });
          }}
        >
          <TabPanel className={cs.setting_tabpanel} eventKey={1} title={i18n['trader.customSetting.tab.personal']}>
            <PersonalAccount {...this.props} />
          </TabPanel>
          <TabPanel className={cs.setting_tabpanel} eventKey={2} title={i18n['trader.customSetting.tab.company']}>
            <CompanyAccount {...this.props} data={corporateAccount} type="corporateAccount" />
          </TabPanel>
          <TabPanel
            className={cs.setting_tabpanel}
            eventKey={3}
            title={i18n['trader.customSetting.tab.assetManagement']}
          >
            <AssetsAccount {...this.props} data={assetAccount} type="assetAccount" />
          </TabPanel>
        </Tab>
      </div>
    );
  }
}
