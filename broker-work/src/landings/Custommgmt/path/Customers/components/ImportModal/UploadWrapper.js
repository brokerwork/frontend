/**
 * 包含了Upload组件功能，处理了对应回调
 */

export const MAX_SIZE_MB = 5; //MB

export const ACTION_URL = '/api/v2/custom/profiles/excel/check';

export default class UploadWrapper extends PureComponent {
  onUploadStart = file => {
    console.log(file)
    const { selectImportFile, toggleLoading, showTopAlert } = this.props;

    const { size } = file;

    if (size > MAX_SIZE_MB * 1024 * 1024) {
      return;
    }

    toggleLoading(true);

    selectImportFile(file); //state中保存选中的文件信息
  };
  notify = () => {
    this.props.showTopAlert({
      bsStyle: 'danger',
      content: '文件过大或格式错误！'
    });
  };

  onUploadError = e => {
    const { onUploadFailed } = this.props;
    !!onUploadFailed && onUploadFailed();
  };

  onUploadSuccess = res => {
    const {
      toggleLoading,
      onUploadSuccess,
      checkImportContentSuccess
    } = this.props;

    toggleLoading(false);
    const { result, data } = res;

    if (!result) {
      const { onUploadFailed } = this.props;
      !!onUploadFailed && onUploadFailed();
      return;
    }

    !!onUploadSuccess && onUploadSuccess();
    checkImportContentSuccess(data);
  };
}
