import { Card, Menu } from 'lean-ui';
import i18n from 'utils/i18n';
import ChangePwd from '../../../../containers/ChangePwd';
import DoubleAuth from '../../containers/DoubleAuth';
import cs from './style.less';
export default class SecurityRoot extends PureComponent {
  state = {
    activeTab: 'changePwd',
    authDataReady: false,
    tabs: [
      {
        eventKey: 'changePwd',
        label: i18n['user_setting.change_pwd.title']
      }
    ]
  };
  componentDidMount() {
    const { getSetting, getAuthState, versionRights } = this.props;
    const { tabs } = this.state;
    getAuthState();
    getSetting().then(({ data }) => {
      const haveAuth = _.get(data, 'twoFAConfig.enable', false);
      if (haveAuth && versionRights['SC_SECURITY_SET']) {
        this.setState({
          authDataReady: true,
          tabs: [
            ...tabs,
            {
              eventKey: 'doubleAuth',
              label: i18n['user_setting.double_auth.title']
            }
          ]
        });
      }
    });
  }
  changeTab = ({ key: activeTab }) => {
    this.setState({
      activeTab
    });
  };
  render() {
    const { versionRights } = this.props;
    const { activeTab, authDataReady, tabs  } = this.state;
    return (
      <Card className={cs.root}>
        <Menu
          selectedKeys={[activeTab]}
          mode="horizontal"
          onSelect={this.changeTab}
        >
          {tabs.map(tab => {
            return <Menu.Item key={tab.eventKey}>{tab.label}</Menu.Item>;
          })}
        </Menu>
        <div>
          {activeTab === 'changePwd' ? <ChangePwd /> : null}
          {activeTab === 'doubleAuth' && authDataReady && versionRights['SC_SECURITY_SET'] ? <DoubleAuth /> : null}
        </div>
      </Card>
    );
  }
}
