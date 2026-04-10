import { NavLink } from 'react-router-dom';
import { Panel, PanelGroup } from 'react-bootstrap';
import cs from './Menu.less';
import i18n from 'utils/i18n';

const MENUS = [
  {
    category: 'live',
    link: '/runmgmt/live',
    label: i18n['navigation.runmgmt.live'],
    icon: 'operations-live',
    right: 'LIVE_LIVE'
  },
  {
    category: 'videomgmt',
    link: '/runmgmt/videomgmt',
    label: i18n['navigation.runmgmt.videomgmt'],
    icon: 'operations-video',
    right: 'LIVE_DEMAND'
  },
  {
    label: i18n['navigation.runmgmt.follow'],
    icon: 'operations-signal',
    category: 'follow',
    right: 'OPERATION_COPY',
    subMenus: [
      {
        link: '/source_setting',
        label: i18n['navigation.runmgmt.follow.source_setting'],
        right: 'OPERATION_COPY'
      }
    ]
  },
  {
    label: i18n['navigation.runmgmt.content'],
    icon: 'operations-signal',
    category: 'content',
    right: 'LIVE_CONTENT',
    subMenus: [
      {
        link: '/article',
        label: i18n['navigation.runmgmt.content.article'],
        right: 'LIVE_CONTENT_ARTICLE'
      },
      {
        link: '/column',
        label: i18n['navigation.runmgmt.content.column'],
        right: 'LIVE_CONTENT_COLUMN'
      }
    ]
  }
];

export default class Menu extends PureComponent {
  state = {
    narrow: false,
    expanded: ['video', 'follow']
  };

  toggle = (category, isExpanded) => {
    const { expanded, narrow } = this.state;

    if (narrow) return;

    this.setState({
      expanded: isExpanded
        ? expanded.filter(item => item !== category)
        : [...expanded, category]
    });
  };

  toggleExpand = () => {
    this.setState({
      narrow: !this.state.narrow
    });
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

  render() {
    const { activeKey, narrow, expanded } = this.state;
    const menus = this.filterMenus();

    return (
      <div className={`${cs['menu']} ${narrow ? cs['narrow'] : ''}`}>
        <div className={cs['menu-container']}>
          {menus.map((item, idx) => {
            const isExpanded = expanded.includes(item.category);

            return (
              <div
                className={`${cs['menu-item']} ${
                  isExpanded ? cs['expanded'] : ''
                }`}
                key={idx}
              >
                {item.link ? (
                  <NavLink
                    exact
                    to={item.link}
                    className={cs['menu-title']}
                    activeClassName="main-color active"
                  >
                    <i className={`fa fa-${item.icon} ${cs['icon']}`} />
                    <span className={cs['text']}>{item.label}</span>
                  </NavLink>
                ) : (
                  <a
                    className={cs['menu-title']}
                    onClick={this.toggle.bind(this, item.category, isExpanded)}
                  >
                    <i className={`fa fa-${item.icon} ${cs['icon']}`} />
                    <span className={cs['text']}>{item.label}</span>
                    <i className={`fa fa-angle-down ${cs['arrow']}`} />
                  </a>
                )}
                {item.subMenus ? (
                  <ul className={cs['sub-menu']}>
                    <li className={cs['sub-menu-title']}>{item.label}</li>
                    {item.subMenus.map((_item, _idx) => {
                      return (
                        <li key={_idx}>
                          <NavLink
                            to={`/runmgmt/${item.category}${_item.link}`}
                            activeClassName="main-color active"
                          >
                            {_item.label}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  undefined
                )}
              </div>
            );
          })}
        </div>
        <a className={cs['expand-btn']} onClick={this.toggleExpand}>
          <i className={`fa fa-expand-nav ${cs['icon']}`} />
          <span className={cs['text']}>
            {i18n['dashboard.navigation.expand_btn']}
          </span>
        </a>
      </div>
    );
  }
}
