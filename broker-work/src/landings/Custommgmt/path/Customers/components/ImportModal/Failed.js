import cs from './ImportModal.less';
import i18n from 'utils/i18n';
import { Dialog, Upload, Icon } from 'lean-ui';
import { TEMPLATE_URL } from './index';
import { Link } from 'react-router-dom';
import UploadWrapper, { ACTION_URL } from './UploadWrapper';

export default class Failed extends UploadWrapper {
  render() {
    const {
      show,
      importFile: { name: fileName, showSize: fileShowSize }
    } = this.props;

    return (
      <div
        id="failed_container"
        className={cs['checkContent-container']}
        style={{ display: show ? 'flex' : 'none' }}
      >
        <div className={cs['importFailed-file-container']}>
          <div className={cs['file-info-container']}>
            <Icon
              icon="excel-color"
              className={cs['file-info-icon']}
              fontType="bw"
            />
            <div>
              <span className={cs['checkContent-fileName']}>{fileName}</span>
              <div className={cs['checkContent-fileSize']}>{fileShowSize}</div>
            </div>
          </div>
          <div className={cs['importFailed-file-notPass']}>
            {i18n['customer.import.failed.not_pass']}
          </div>
        </div>
        <div className={cs['upload-footer']}>
          {i18n['customer.import.failed.des']}
          <div>
            {i18n['customer.create_customer.import.download']}
            <Link target="_black" className="main-color" to={TEMPLATE_URL}>
              {i18n['customer.create_customer.import.file_name']}
            </Link>
          </div>
        </div>
        <div style={{ display: 'none' }}>
          <Upload
            onStart={this.onUploadStart}
            onSuccess={this.onUploadSuccess}
            onError={this.onUploadError}
            accept="*"
            notify={this.notify}
            action={ACTION_URL}
            data={{ t: Date.now() }}
          />
        </div>
      </div>
    );
  }
}
