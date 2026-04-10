import { NavLink } from 'react-router-dom';
import cs from './Menu.less';
import i18n from 'utils/i18n';
import { Menu } from 'lean-ui';

const MENUS = [
  {
    link: '/dashboard',
    label: i18n['navigation.dashboard.my_dashboard'],
    icon: 'dashboard-circle',
    category: 'dashboard',
    right: 'DASHBOARD'
  },
  {
    label: i18n['navigation.dashboard.achievements'],
    icon: 'chart-suqare',
    category: 'achievements',
    right: 'DASHBOARD_TYPE_PFS',
    subMenus: [
      {
        link: '/new-customers',
        label: i18n['dashboard.navigator.achievements.new_customers'],
        right: 'DASHBOARD_TYPE_PFS_NC'
      },
      {
        link: '/total-customers',
        label: i18n['dashboard.navigator.achievements.total_customers'],
        right: 'DASHBOARD_TYPE_PFS_CC'
      },
      {
        link: '/trade',
        label: i18n['dashboard.navigator.achievements.trade'],
        right: 'DASHBOARD_TYPE_PFS_FUND'
      },
      {
        link: '/commission',
        label: i18n['dashboard.navigator.achievements.commission'],
        right: 'DASHBOARD_TYPE_PFS_COMMISSION'
      },
      {
        link: '/staff-performance',
        label: i18n['dashboard.navigator.achievements.staff_performance'],
        right: 'DASHBOARD_TYPE_PFS_RANK'
      }
    ]
  },
  {
    label: i18n['navigation.dashboard.customer_source'],
    icon: 'discover-circle',
    category: 'customer-source',
    right: 'DASHBOARD_TYPE_SOURCE',
    subMenus: [
      {
        link: '/transfom-trends',
        label: i18n['dashboard.navigator.customer_source.transfom_trends'],
        right: 'DASHBOARD_TYPE_SOURCE_CON'
      },
      {
        link: '/transfom-funnel',
        label: i18n['dashboard.navigator.customer_source.transfom_funnel'],
        right: 'DASHBOARD_TYPE_SOURCE_FUNEL'
      }
    ]
  },
  {
    label: i18n['navigation.dashboard.customer_data'],
    icon: 'data-analysis',
    category: 'customer-data',
    right: 'DASHBOARD_TYPE_CDA',
    subMenus: [
      {
        label: i18n['dashboard.navigator.customer_data.customers'],
        link: `/customers`,
        right: 'DASHBOARD_TYPE_CDA_CP'
      },
      {
        label: i18n['dashboard.navigator.customer_data.customer_rankings'],
        link: `/customer-rankings`,
        right: 'DASHBOARD_TYPE_CDA_TAR'
      },
      {
        label: i18n['dashboard.navigator.customer_data.active_customer'],
        link: `/active-customer`,
        right: 'DASHBOARD_TYPE_CDA_AC'
      },
      {
        label: i18n['dashboard.navigator.customer_data.customer_dormant'],
        link: `/customer-dormant`,
        right: 'DASHBOARD_TYPE_CDA_DC'
      },
      {
        label:
          i18n['dashboard.navigator.customer_data.trade_variety_distribute'],
        link: `/trade-variety-distribute`,
        right: 'DASHBOARD_TYPE_CDA_DT'
      }
    ]
  }
];

export default class SideMenu extends Component {
  state = {
    selectedKeys: ['dashboard']
  };
  filterMenus = () => {
    const { userRights } = this.props;
    const filtered = MENUS.filter(item => userRights[item.right]);

    return filtered.map(item => {
      if (!item.subMenus) return item;

      return {
        ...item,
        subMenus: item.subMenus.filter(subMenu => userRights[subMenu.right])
      };
    });
  };
  onChange = ({ key }) => {
    this.setState({
      selectedKeys: [key]
    })
  };
  render() {
    const menus = this.filterMenus();
    const { selectedKeys } = this.state;
    return (
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={['achievements', 'customer-source', 'customer-data']}
        onClick={this.onChange}
      >
        {menus.map(item => {
          if (item.subMenus) {
            return (
              <Menu.SubMenu
                key={item.category}
                title={
                  <span>
                    <i className={`fa fa-${item.icon} ${cs['icon']}`} />
                    {item.label}
                  </span>
                }
              >
                {item.subMenus.map(s => (
                  <Menu.Item key={s.link}>
                    <NavLink
                      to={`/dashboard/${item.category}${s.link}`}
                      activeClassName="active"
                    >
                      {s.label}
                    </NavLink>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={item.category}>
                <NavLink to={item.link} activeClassName="active">
                  <i className={`fa fa-${item.icon} ${cs['icon']}`} />
                  {item.label}
                </NavLink>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  }
}
