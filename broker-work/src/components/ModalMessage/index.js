import cs from './ModalMessage.less';
import { Button } from 'lean-ui';
import i18n from 'utils/i18n';

export default class ModalMessage extends PureComponent {
  state = {
    currentMessageIndex: 0
  };

  markModalMessageAsRead = inId => {
    const { markModalMessageAsRead } = this.props;
    markModalMessageAsRead(inId).then(res => {
      if (!res.result) return;
      const { currentMessageIndex } = this.state;
      this.setState({
        currentMessageIndex: currentMessageIndex + 1
      });
    });
  };

  viewMessage = (e, id, inId) => {
    e.preventDefault();
    this.markModalMessageAsRead(inId);
    window.location.href = `/msgmgmt#/details/${id}`;
  };

  render() {
    const { data, markModalMessageAsRead } = this.props;
    const { currentMessageIndex } = this.state;
    const message = data[currentMessageIndex];
    if (!message) return <div />;
    return (
      <div className={`${cs['container']} modal-content`}>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            onClick={this.markModalMessageAsRead.bind(this, message.inId)}
          />
          {i18n['message.unread_message_title']}
        </div>
        <div className={`modal-body`}>
          <div className={cs['message-title']}>{message.title}</div>
          <div className={cs['message-body']}>{message.content}</div>
        </div>
        <div className="modal-footer">
          <Button
            type="primary"
            onClick={e => this.viewMessage(e, message.id, message.inId)}
          >
            {i18n['general.view']}
          </Button>
        </div>
      </div>
    );
  }
}
