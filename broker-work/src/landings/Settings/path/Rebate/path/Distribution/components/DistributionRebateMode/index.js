import { Link } from 'react-router-dom';
import PagePanel from 'components/PagePanel';
import i18n from 'utils/i18n';
import cs from './DistributionRebateMode.less';

const tabs = [
  {
    name:
      i18n['settings.left_menu.rebate_setting.sub_menu.user_hierarchy_setting'],
    link: '/levelSetting'
  },
  {
    name:
      i18n[
        'settings.left_menu.rebate_setting.sub_menu.distribution_rule_setting'
      ],
    link: '/distributionRuleSetting'
  }
];

export default class DistributionRebateMode extends PureComponent {
  render() {
    const {
      children,
      location: { pathname },
      match: { path }
    } = this.props;
    const activeKey = pathname;

    return (
      <PagePanel>
        <PagePanel.Header>
          {
            i18n[
              'settings.left_menu.rebate_setting.sub_menu.distribution_setting'
            ]
          }
        </PagePanel.Header>
        <PagePanel.Body className="panel-body">
          <ul className={`nav nav-tabs ${cs['nav']}`}>
            {tabs.map(tab => {
              return (
                <li
                  key={tab.name}
                  className={activeKey === `${path}${tab.link}` ? 'active' : ''}
                >
                  <Link to={`${path}${tab.link}`}>{tab.name}</Link>
                </li>
              );
            })}
          </ul>
          {children}
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
