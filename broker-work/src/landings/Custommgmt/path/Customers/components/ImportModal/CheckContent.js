import cs from './ImportModal.less';
import i18n from 'utils/i18n';
import { Dialog, Upload, Loading, Icon } from 'lean-ui';
import { Link } from 'react-router-dom';
import { TEMPLATE_URL } from './index';
import UploadWrapper, { ACTION_URL } from './UploadWrapper';

export default class CheckContent extends UploadWrapper {
  onClickReload = () => {
    this.refs['upload'].querySelector('.upload-button').click();
  };

  render() {
    const {
      show,
      checkImportContentResult: {
        errorUrl = '',
        total = 0,
        successNum = 0,
        errorSize = 0
      },
      importFile: { name: fileName, showSize: fileShowSize }
    } = this.props;
    return (
      <div
        className={cs['checkContent-container']}
        style={{ display: show ? 'flex' : 'none' }}
      >
        <div className={cs['checkContent-file-container']}>
          <div className={cs['file-info-container']}>
            <Icon
              icon="excel-color"
              className={cs['file-info-icon']}
              fontType="bw"
            />
            <div>
              <span className={`${cs['checkContent-fileName']} main-color`}>
                {fileName}
              </span>
              <div className={cs['checkContent-fileSize']}>{fileShowSize}</div>
            </div>
          </div>
          <div
            className={`${cs['checkContent-reUpload']} main-color`}
            onClick={this.onClickReload}
          >
            <Icon
              icon="edit-outline"
              className={cs['checkContent-reUpload-icon']}
            />
            {i18n['general.modify']}
          </div>
        </div>
        <div className={cs['checkContent-result-title']}>
          {i18n['customer.create_customer.import.check_content.result.title']}
        </div>
        <div className={cs['checkContent-result-table-row']}>
          <span className={cs['checkContent-result-table-title']}>
            {i18n['customer.import.check_content.result.num.upload']}
          </span>
          <span className={cs['checkContent-result-table-title']}>
            {i18n['customer.import.check_content.result.num.pass']}
          </span>
          <span className={cs['checkContent-result-table-title']}>
            {i18n['customer.import.check_content.result.num.not_pass']}
          </span>
        </div>
        <div className={cs['checkContent-result-table-row']}>
          <span className={cs['checkContent-result-table-content']}>
            {total}
          </span>
          <span className={cs['checkContent-result-table-content']}>
            {successNum}
          </span>
          <span className={cs['checkContent-result-table-content']}>
            {errorSize}
          </span>
        </div>
        {!!errorUrl && (
          <div className={cs['upload-footer']}>
            {i18n['customer.import.check_content.result.des']}
            <div>
              {i18n['customer.create_customer.import.download']}
              <Link target="_black" className="main-color" to={errorUrl}>
                {i18n['customer.import.not_pass.file_name']}
              </Link>
            </div>
          </div>
        )}
        <div ref="upload" style={{ display: 'none' }}>
          <Upload
            onStart={this.onUploadStart}
            onSuccess={this.onUploadSuccess}
            onError={this.onUploadError}
            accept="*"
            srcList={[]}
            notify={this.notify}
            action={ACTION_URL}
            data={{ t: Date.now() }}
          />
        </div>
      </div>
    );
  }
}
