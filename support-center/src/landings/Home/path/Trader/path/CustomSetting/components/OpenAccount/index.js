import cs from './index.less';
import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import PersonalAccount from './PersonalAccount';
import _ from 'lodash';
const TabPanel = Tab.Panel;

export default class OpenAccount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1
    };
  }

  render() {
    const { activeKey } = this.state;
    const { paltSetting } = this.props;
    // 如果账户设置个人帐户关闭后，开户设置中不显示
    const enablePersonalAccount = _.get(paltSetting, 'basicSetting.enablePersonalAccount', false);
    return (
      <div className={cs.ctraderSetting}>
        {enablePersonalAccount && (
          <Tab
            className={cs.setting_tab}
            activeKey={activeKey}
            id="customOpenAccount"
            onChange={key => {
              this.setState({ activeKey: key });
            }}
          >
            {enablePersonalAccount && (
              <TabPanel className={cs.setting_tabpanel} eventKey={1} title={i18n['trader.customSetting.tab.personal']}>
                <PersonalAccount {...this.props} />
              </TabPanel>
            )}
          </Tab>
        )}
      </div>
    );
  }
}
