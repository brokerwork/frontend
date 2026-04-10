import cs from './ImportModal.less';
import i18n from 'utils/i18n';
import { Dialog, Upload, Loading, Icon } from 'lean-ui';
import { Link } from 'react-router-dom';
import { TEMPLATE_URL } from './index';
import UploadWrapper, { ACTION_URL, MAX_SIZE_MB } from './UploadWrapper';

export default class UploadContent extends UploadWrapper {
  render() {
    const { show } = this.props;
    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        <Upload
          maxSize={MAX_SIZE_MB}
          className={cs['upload']}
          type={'drag'}
          dragText={i18n['customer.upload_message']}
          onStart={this.onUploadStart}
          onSuccess={this.onUploadSuccess}
          onError={this.onUploadError}
          accept=".xls,.xlsx"
          notify={this.notify}
          action={ACTION_URL}
          data={{ t: Date.now() }}
        />{' '}
        <div className={cs['upload-footer']}>
          {' '}
          {i18n['customer.create_customer.import.des']}{' '}
          <div>
            {' '}
            {i18n['customer.create_customer.import.download']}{' '}
            <Link target="_black" className="main-color" to={TEMPLATE_URL}>
              {' '}
              {i18n['customer.create_customer.import.file_name']}{' '}
            </Link>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }
}
