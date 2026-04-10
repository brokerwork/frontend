import { DIALOG_WIDTH, TEMPLATE_URL } from './index';
import cs from './ImportModal.less';
import i18n from 'utils/i18n';
import { Dialog, Upload, Loading, Icon } from 'lean-ui';
import { Link } from 'react-router-dom';

export default class Success extends PureComponent {
  render() {
    const {
      importResult: { errorUrl = '', successNum = 0, errorSize = 0 }
    } = this.props;

    return (
      <div className={cs['import-success-container']}>
        <div className={cs['checkContent-result-table-row']}>
          <span className={cs['checkContent-result-table-title']}>
            {i18n['customer.import.num.pass']}
          </span>
          <span className={cs['checkContent-result-table-title']}>
            {i18n['customer.import.num.not_pass']}
          </span>
        </div>
        <div className={cs['checkContent-result-table-row']}>
          <span className={cs['checkContent-result-table-content']}>
            {successNum}
          </span>
          <span className={cs['checkContent-result-table-content']}>
            {errorSize}
          </span>
        </div>
        {!!errorUrl && (
          <div className={cs['upload-footer']}>
            <div>
              {i18n['customer.create_customer.import.download']}
              <Link target="_black" className="main-color" to={errorUrl}>
                {i18n['customer.import.import_failed.file_name']}
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}
