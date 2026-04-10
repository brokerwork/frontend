import cs from './LeftMenu.less';
import { NavLink as Link } from 'react-router-dom';
import i18n from 'utils/i18n';
import { Icon } from 'lean-ui';

export default class LeftMenu extends PureComponent {
  componentDidMount() {
    const { getBoxStatus } = this.props;
    getBoxStatus();
  }
  render() {
    const {
      boxStatus: { inboxUnreadNumber, isSendFailure },
      userRights,
      match: { url }
    } = this.props;
    return (
      <div>
        {userRights['MESSAGE_SEND_TYPE'] &&
        userRights['MESSAGE_SEND_OBJECT'] ? (
          <div className={cs['add-message-box']}>
            <Link
              to={`${url}/addMessage`}
              className={`lean-btn lean-btn-primary ${cs['add-message-btn']}`}
            >
              <Icon
                className={cs['add-icon']}
                icon={'write-outline'}
                fontType="bw"
              />
              {i18n['message.new']}
            </Link>
          </div>
        ) : (
          undefined
        )}
        <menu className={cs['menus']}>
          {userRights['MESSAGE_VIEW'] && (
            <Link
              to={`${url}/inbox`}
              className={`hover-item ${cs['link-item']}`}
              activeClassName="link-active"
            >
              <Icon
                className={cs['menu-icon']}
                icon={'inbox-outline'}
                fontType="bw"
              />
              <span className={cs['link-text']}>{i18n['message.inbox']}</span>
              {/*<Badge>{inboxUnreadNumber}</Badge>*/}
              {!!inboxUnreadNumber && (
                <span
                  className={cs['link-text']}
                >{`（${inboxUnreadNumber}）`}</span>
              )}
            </Link>
          )}
          {userRights['MESSAGE_SEND_TYPE'] ? (
            <Link
              to={`${url}/outbox`}
              className={`hover-item ${cs['link-item']}`}
              activeClassName="link-active"
            >
              <Icon
                className={cs['menu-icon']}
                icon={'outbox-outline'}
                fontType="bw"
              />
              <span className={cs['link-text']}>{i18n['message.outbox']}</span>
              {isSendFailure ? (
                <i className={`fa fa-warning ${cs['send-failure']}`} />
              ) : (
                undefined
              )}
            </Link>
          ) : (
            undefined
          )}
          {userRights['MESSAGE_SEND_TYPE'] ? (
            <Link
              to={`${url}/draftbox`}
              className={`hover-item ${cs['link-item']}`}
              activeClassName="link-active"
            >
              <Icon
                className={cs['menu-icon']}
                icon={'logs-outline'}
                fontType="bw"
              />
              <span className={cs['link-text']}>
                {i18n['message.draft_box']}
              </span>
            </Link>
          ) : (
            undefined
          )}
          {userRights['MESSAGE_SEND_TYPE'] ? (
            <Link
              to={`${url}/recyclebin`}
              className={`hover-item ${cs['link-item']}`}
              activeClassName="link-active"
            >
              <Icon className={cs['menu-icon']} icon={'delete-outline'} />
              <span className={cs['link-text']}>
                {i18n['message.recycle_bin']}
              </span>
            </Link>
          ) : (
            undefined
          )}
        </menu>
      </div>
    );
  }
}
