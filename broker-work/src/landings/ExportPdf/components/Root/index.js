import jsPDF from 'jspdf';
import { findDOMNode } from 'react-dom';
import html2canvas from 'utils/html2canvas';
import { getAccountPdf, clearAccountPdf } from 'utils/PdfData';
import AccountInfo from '../AccountInfo';
import AccountClassificationInfo from '../AccountClassification';

const TEMPLATE = {
  ACCOUNT_INFO: {
    name: accountId => {
      return `${accountId}-AccountInformation.pdf`;
    },
    content: data => <AccountInfo data={data} />
  },
  ACCOUNT_CLASSIFICATION_INFO: {
    name: accountId => {
      return 'AccountClassificationInformation.pdf';
    },
    content: data => <AccountClassificationInfo data={data} />
  }
};

export default class ExportPdf extends PureComponent {
  componentDidMount() {
    this.onExport();
  }

  onExport = () => {
    const { match: { params } } = this.props;
    const { template = 'ACCOUNT_INFO' } = params;
    const exportContent = document.querySelector('#exportContent');
    const data = getAccountPdf();

    html2canvas(exportContent, {
      scale: 2,
      allowTaint: true,
      onrendered: function(canvas) {
        var pageData = canvas.toDataURL('image/jpeg', 1.0);
        var width = Math.min(canvas.width, canvas.height);
        var height = width * (canvas.height / canvas.width);
        var pdf = new jsPDF('', 'mm', [canvas.width, canvas.height]);
        pdf.addImage(pageData, 'JPEG', 0, 0, width, height);
        pdf.save(TEMPLATE[template].name(data.accountId));
        setTimeout(() => {
          if (window.IFRAME_DONE) {
            IFRAME_DONE();
          }
        }, 100);
        clearAccountPdf();
      }
    });
  };

  render() {
    const { match: { params } } = this.props;
    const { template = 'ACCOUNT_INFO' } = params;
    const data = getAccountPdf();

    return <div>{TEMPLATE[template].content(data)}</div>;
  }
}
