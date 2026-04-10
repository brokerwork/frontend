import cs from './Details.less';
import { Button } from 'react-bootstrap';
import { getToUserValue, MESSAGE_TYPES_MAP } from '../../../../constant';
import i18n from 'utils/i18n';
import { saveMessageObjects } from 'utils/sendMessageObject';
import { Icon } from 'lean-ui';

export default class Root extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id, sourceBox }
      },
      getMessageDetails,
      setPageTitle
    } = this.props;
    getMessageDetails(id);
    setPageTitle(i18n['message.details']);
  }

  render() {
    const {
      data,
      userInfo,
      match: {
        params: { sourceBox }
      },
      userRights
    } = this.props;
    // 收件人列表
    const users = getToUserValue(data)
      .split(',')
      .join(';');

    return (
      <div className={cs['container']}>
        <div className={cs['type-container']}>
          <div className={cs['msg-type']}>{`${
            i18n['message.send_message_type']
          }: ${i18n[`message.types.${data.type}`]}`}</div>
          <div className={cs['time']}>
            <Icon className={cs['time-icon']} icon={'time-outline'} />
            {data.sendDate || ''}
          </div>
        </div>
        <div className={cs['name']}>
          <div>{`${i18n['message.sender']}: ${data.fromName ||
            i18n['message.null']}`}</div>
          {sourceBox !== 'inbox' && (
            <div className={cs['receiver']}>{`${
              i18n['message.recipient']
            }: ${users}`}</div>
          )}
        </div>
        <div className={cs['title']}>{data.title}</div>
        <div
          className={cs['content']}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    );
  }
}
