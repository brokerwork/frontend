import cs from './ImportExcel.less';
import { post } from 'utils/ajax';
import i18n from 'utils/i18n';
import templateExcel from './deposit_template.xlsx';
import widthdrawTemplateExcel from './withdraw_template.xlsx';

export default class ImportExcel extends PureComponent {
  state = {
    fileName: '',
    fail: false,
    failReason: ''
  };

  onChange = evt => {
    const file = evt.target.files[0];

    if (file) {
      this.validFile(file);
      evt.target.value = '';
    }
  };

  validFile = file => {
    this.importFile(file);
  };

  importFile = file => {
    const { type } = this.props;
    const formData = new FormData();

    formData.append('file', file);

    post({
      url: `/v2/account/import/excel/${ type === 'excel' ? 'deposit' : 'withdraw'}/preview`,
      data: formData,
      isFormData: true
    }).then(({ result, data, mcode }) => {
      if (result) {
        this.handleSuccess(file, data);
      } else {
        this.handleFail(mcode);
      }
    });
  };

  handleSuccess = (file, data) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(data);
    }

    this.setState({
      fail: false,
      fileName: file.name
    });
  };

  handleFail = mcode => {
    this.setState({
      fail: true,
      failReason: mcode
    });
  };

  remove = () => {
    const { onChange } = this.props;

    if (onChange) {
      onChange('');
    }

    this.setState({
      fileName: ''
    });
  };

  render() {
    const { fileName, fail, failReason } = this.state;
    const { type } = this.props;
    const tempStr =
      type === 'excel'
        ? i18n['account.batch_deposit.xlsx_template']
        : i18n['account.batch_widthdraw.xlsx_template'];
    return (
      <div className={cs['import-container']}>
        <label className={cs['import-btn']}>
          <i className="fa fa-upload" />
          <span className={cs['import-text']}>
            {i18n['account.batch_deposit.import_file_label']}
          </span>
          <input
            type="file"
            className={cs['hidden-element']}
            onChange={this.onChange}
          />
        </label>
        <span className={cs['download']}>
          {i18n['general.download']}
          <a
            href={type === 'excel' ? templateExcel : widthdrawTemplateExcel}
            download={tempStr}
          >
            {tempStr}
          </a>
        </span>
        {fileName ? (
          <div className={cs['file']} data-test="file-name">
            <i className={`fa fa-paperclip ${cs['file-icon']}`} />
            <span className={`${cs['file-name']} main-color`}>{fileName}</span>
            <span
              className={`fa fa-times ${cs['clear-btn']}`}
              onClick={this.remove}
            />
          </div>
        ) : (
          undefined
        )}
        {fail ? (
          <div className={cs['error']} data-test="error-tips">
            <div className={cs['error-title']}>
              <i className={`fa fa-exclamation-circle ${cs['alert-icon']}`} />
              {i18n['account.batch_deposit.import_fail']}
            </div>
            <div className={cs['error-text']}>
              {i18n[failReason] || failReason}
            </div>
          </div>
        ) : (
          undefined
        )}
        <div className={cs['tips']}>
          <div>{i18n['account.batch_deposit.import_tips_title']}</div>
          <p>{i18n['account.batch_deposit.import_tips']}</p>
        </div>
      </div>
    );
  }
}
