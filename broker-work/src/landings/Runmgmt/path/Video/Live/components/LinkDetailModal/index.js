import cs from './LinkDetailModal.less';
import i18n from 'utils/i18n';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Dialog } from 'lean-ui';

export default class LinkDetailModal extends PureComponent {
  onCopy = () => {
    Message.success(i18n['general.clip_success']);
  };
  render() {
    const { onClose, currentLive } = this.props;
    const arr = currentLive.pushUrl.split('/live/');
    const pushUrl_1 = `${arr[0]}/live/`;
    const pushUrl_2 = arr[1];
    return (
      <Dialog
        title={i18n['video.live.video_url']}
        className={cs['form-body']}
        visible={true}
        onCancel={onClose}
        footer={<Button onClick={onClose}>{i18n['general.close']}</Button>}
      >
        <div className={`clearfix ${cs['referralLink-div']}`}>
          <label className={`col-sm-3 control-label text-right ${cs['label']}`}>
            {i18n['video.live.push_url']}：
          </label>
          <div className={`col-sm-7 ${cs['no-link-text']}`}>{pushUrl_1}</div>
          <div className="col-sm-2">
            <CopyToClipboard text={pushUrl_1} onCopy={this.onCopy}>
              <Button className={`icon ${cs['btn']}`}>
                <i className="fa fa-copy" />
              </Button>
            </CopyToClipboard>
          </div>
        </div>
        <div className={`clearfix ${cs['referralLink-div']}`}>
          <label className={`col-sm-3 control-label text-right ${cs['label']}`}>
            {i18n['video.live.push_key']}：
          </label>
          <div className={`col-sm-7 ${cs['no-link-text']}`}>{pushUrl_2}</div>
          <div className="col-sm-2">
            <CopyToClipboard text={pushUrl_2} onCopy={this.onCopy}>
              <Button className={`icon ${cs['btn']}`}>
                <i className="fa fa-copy" />
              </Button>
            </CopyToClipboard>
          </div>
        </div>
        <div className={`clearfix ${cs['referralLink-div']}`}>
          <label className={`col-sm-3 control-label text-right ${cs['label']}`}>
            {i18n['video.live.share_url']}：
          </label>
          <div className={`col-sm-7 ${cs['link-text']}`}>
            <a href={currentLive.shareUrl} target="_blank">
              {currentLive.shareUrl}
            </a>
          </div>
          <div className="col-sm-2">
            <CopyToClipboard text={currentLive.shareUrl} onCopy={this.onCopy}>
              <Button className={`icon ${cs['btn']}`}>
                <i className="fa fa-copy" />
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </Dialog>
    );
  }
}
