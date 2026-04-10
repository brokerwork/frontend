import { Popover } from 'react-bootstrap';
import cs from './MessageList.less';
import i18n from 'utils/i18n';

export default class MessageList extends PureComponent {
  render() {
    const { data, className, markMessageAsRead } = this.props;
    const __data = data.concat();
    if (__data.length > 5) {
      __data.length = 5;
    }

    return (
      <div className={cs['message-box']}>
        <Popover
          placement="bottom"
          id="header-message-list"
          className={`${className ? className : ''} ${cs['message-list']}`}
        >
          <div className={cs['message-col']}>
            <div className={cs['message-left']}>{`${i18n[
              'message.unread_message_title'
            ]}`}</div>
            <a className={cs['message-all']} href="/msgmgmt">
              {`${i18n['message.unread_message_all']}`}
            </a>
          </div>
          {__data.length > 0 ? (
            __data.map((item, index) => {
              return (
                <div key={index} className={cs['message-list-item']}>
                  <div className={cs['message-col']}>
                    <div className={cs['message-left']}>
                      <div className={cs['text-ellipsis']}>{item.title}</div>
                    </div>
                    <div>
                      <i
                        onClick={markMessageAsRead.bind(this, item.inId)}
                        className={`fa fa-check ${cs['readIcon']}`}
                      />
                    </div>
                  </div>
                  <div className={cs['message-col']}>
                    <div className={cs['message-left']}>
                      <div className={cs['text-ellipsis']}>{item.fromName}</div>
                    </div>
                    <div>{item.sendDate}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={cs['nomessage']}>{i18n['message.no_message']}</div>
          )}
        </Popover>
      </div>
    );
  }
}
