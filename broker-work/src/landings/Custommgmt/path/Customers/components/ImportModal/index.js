import cs from './ImportModal.less';
import i18n from 'utils/i18n';
import { Button, Dialog, Loading } from 'lean-ui';
import Upload from './Upload';
import CheckContent from './CheckContent';
import Failed from './Failed';
import Success from './Success';

export const DIALOG_WIDTH = 700;
export const TEMPLATE_URL = '/api/v2/custom/profiles/excel/download';
const SHOW_TYPES = { UPLOAD: 0, CHECK_CONTENT: 1, FAILED: 2, SUCCESS: 3 };

export default class ImportModal extends PureComponent {
  state = { showType: SHOW_TYPES.UPLOAD, loading: false };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      //每次显示重置状态
      this.setState({ showType: SHOW_TYPES.UPLOAD });
    }
  }

  onUploadSuccess = () => {
    this.setState({ showType: SHOW_TYPES.CHECK_CONTENT });
  };

  onUploadFailed = () => {
    const { showTopAlert } = this.props;
    showTopAlert({
      bsStyle: 'danger',
      content: i18n['upload.upload_fail']
    });

    this.setState({ showType: SHOW_TYPES.UPLOAD });
  };

  onImportSuccess = () => {
    this.setState({ showType: SHOW_TYPES.SUCCESS });
  };
  onImportFailed = () => {
    this.setState({ showType: SHOW_TYPES.FAILED });
  };

  toggleLoading = show => {
    this.setState({ loading: show });
  };

  renderContent = () => {
    switch (this.state.showType) {
      default:
      case SHOW_TYPES.UPLOAD:
        return (
          <Upload
            {...this.props}
            show={!this.state.loading}
            toggleLoading={this.toggleLoading}
            onUploadSuccess={this.onUploadSuccess}
            onUploadFailed={this.onUploadFailed}
          />
        );
      case SHOW_TYPES.CHECK_CONTENT:
        return (
          <CheckContent
            {...this.props}
            show={!this.state.loading}
            toggleLoading={this.toggleLoading}
          />
        );
      case SHOW_TYPES.FAILED:
        return (
          <Failed
            {...this.props}
            show={!this.state.loading}
            toggleLoading={this.toggleLoading}
            onUploadSuccess={this.onUploadSuccess}
          />
        );
      case SHOW_TYPES.SUCCESS:
        return (
          <Success
            {...this.props}
            show={!this.state.loading}
            toggleLoading={this.toggleLoading}
          />
        );
    }
  };

  footer = () => {
    if (
      this.state.showType === SHOW_TYPES.FAILED ||
      this.state.showType === SHOW_TYPES.SUCCESS
    ) {
      return (
        <div>
          <Button type="primary" onClick={this.onOk}>
            {this.okText()}
          </Button>
        </div>
      );
    }

    if (this.state.loading) {
      return null;
    }

    if (this.state.showType === SHOW_TYPES.UPLOAD) {
      return null;
    }

    return undefined;
  };

  okText = () => {
    switch (this.state.showType) {
      case SHOW_TYPES.CHECK_CONTENT:
        return i18n['general.import'];
      case SHOW_TYPES.FAILED:
        return i18n['customer.import.failed.uploadOther'];
      case SHOW_TYPES.SUCCESS:
        return i18n['general.confirm'];
    }
  };

  onOk = () => {
    switch (this.state.showType) {
      case SHOW_TYPES.CHECK_CONTENT:
        //确认导入
        // !!this.refs['CheckContent'] && this.refs['CheckContent'].startImport();
        const {
          checkImportContentResult: { importId },
          executeImport
        } = this.props;

        executeImport(importId).then(res => {
          const { result } = res;
          result ? this.onImportSuccess() : this.onImportFailed();
        });
        break;
      case SHOW_TYPES.FAILED:
        //导入其他文件
        const uploadBtn = document.querySelector(
          '#failed_container .upload-button'
        );
        !!uploadBtn && uploadBtn.click();
        break;
      case SHOW_TYPES.SUCCESS:
        //导入成功，点击确定
        const { onClose } = this.props;
        !!onClose && onClose(true);
        break;
    }
  };

  onCancel = () => {
    const { onClose } = this.props;

    if (!onClose) {
      return;
    }

    !!onClose && onClose(this.state.showType === SHOW_TYPES.SUCCESS);
  };

  render() {
    const { visible = false } = this.props;
    return (
      <Dialog
        title={i18n['customer.create_customer.import.title']}
        width={DIALOG_WIDTH}
        visible={visible}
        footer={this.footer()}
        onCancel={this.onCancel}
        onOk={this.onOk}
        okText={this.okText()}
        cancelText={i18n['general.cancel']}
      >
        {this.renderContent()}
        <div
          className={cs['loading-container']}
          style={{ display: this.state.loading ? 'block' : 'none' }}
        >
          <Loading />
        </div>
      </Dialog>
    );
  }
}
