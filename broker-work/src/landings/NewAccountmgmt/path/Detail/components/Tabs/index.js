import Trade from '../../containers/Trade';
import Leverage from '../../containers/Leverage';
import Balance from '../../containers/Balance';
import Password from '../../containers/Password';
import Credit from '../../containers/Credit';
import OwnerInfo from '../../containers/OwnerInfo';
import i18n from 'utils/i18n';
import cs from './Tabs.less';
import { Menu } from 'lean-ui';
import { rights } from '../../../../controls/reducers';

const TABS = [
  {
    label: i18n['account.detail.trade_record'],
    eventKey: 'trade',
    vendor: 'all',
    right: 'trade',
    content: props => <Trade {...props} />
  },
  {
    label: i18n['account.edit_account.account_owner_info'],
    eventKey: 'ownerInfo',
    vendor: 'all',
    right: 'ownerInfo',
    content: props => <OwnerInfo {...props} />
  }
];

export default class Tabs extends PureComponent {
  state = {
    activeTab: 'trade', // ownerInfo
    tabs: []
  };

  componentDidMount() {
    const {
      currentServer: { vendor }
    } = this.props;
    const tabs = this.filterTabs();
    let activeTab = tabs[0].eventKey;
    if (vendor && vendor.indexOf('CUSTOM') > -1) {
      activeTab = 'ownerInfo';
    }
    this.setState({
      activeTab,
      tabs
    });
  }

  changeTab = ({ key: activeTab }) => {
    this.setState({
      activeTab
    });
  };

  filterTabs = () => {
    const {
      rights,
      currentServer: { vendor },
      filteredRights,
      isSimAccount
    } = this.props;

    return TABS.filter(tab => {
      if (tab.eventKey === 'balance')
        return rights && rights.update && rights.update.balance;
      if (tab.eventKey === 'credit')
        return rights && rights.update && rights.update.credit;

      if (tab.vendor === 'all' && filteredRights.show[tab.right]) {
        if (isSimAccount && tab.eventKey === 'ownerInfo') {
          return false;
        }
        return true;
      }

      return tab.vendor.includes(vendor) && filteredRights.show[tab.right];
    });
  };

  render() {
    const { activeTab, tabs } = this.state;
    const { filteredRights, onSingleFormSubmit } = this.props;
    const activeItem = tabs.find(tab => tab.eventKey === activeTab);
    return (
      <div className={cs['tabs']}>
        {tabs.length ? (
          <div>
            <Menu
              selectedKeys={[activeTab]}
              mode="horizontal"
              onSelect={this.changeTab}
            >
              {tabs.map(tab => {
                return <Menu.Item key={tab.eventKey}>{tab.label}</Menu.Item>;
              })}
            </Menu>
            {activeItem
              ? activeItem.content({ filteredRights, onSingleFormSubmit })
              : null}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
