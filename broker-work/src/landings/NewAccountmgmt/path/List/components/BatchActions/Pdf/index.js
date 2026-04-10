import i18n from 'utils/i18n';
import { saveAccountPdf } from 'utils/PdfData';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
export default class Pdf extends PureComponent {
  export = () => {
    const {
      getExportInfo,
      selectedAccountIds,
      currentServer,
      showTipsModal,
      cancel
    } = this.props;

    getExportInfo(selectedAccountIds[0], currentServer).then(
      ({ result, data }) => {
        if (result) {
          this.setState({ showModal: false });
          showTipsModal({
            content: i18n['account.export_tips_modal.jump_content'],
            header: i18n['account.export_tips_modal.jump_tips'],
            onConfirm: cb => {
              saveAccountPdf(data);
              window.open('/downloadpdf/ACCOUNT_INFO');
              cb();
            }
          });
        }

        cancel();
      }
    );
  };

  render() {
    const { selectedKeys } = this.props;
    return (
      <TextButton
        text={i18n['account.button.exportPdf']}
        onClick={this.export}
      />
    );
  }
}
