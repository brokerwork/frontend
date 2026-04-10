import Button from 'components/Button';
import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { getToken } from 'utils/userInfo';
import { getTenantId } from 'utils/tenantInfo';

const status = {
  0: i18n['dealer.report.status.unpaid'],
  1: i18n['dealer.report.status.paid']
};

export default class List extends PureComponent {
  state = {
    pageNo: 1,
    pageSize: 10
  };

  componentDidMount() {
    this.getReportList();
  }

  getReportList = () => {
    const { getReportList } = this.props;
    const { pageNo, pageSize } = this.state;

    getReportList({
      pager: pageNo,
      pageSize
    });
  };

  onPageChange = ({ pageNo, pageSize }) => {
    this.setState(
      {
        pageNo,
        pageSize
      },
      () => {
        this.getReportList();
      }
    );
  };

  fixedNumber = (number, toFixed = true) => {
    return toFixed
      ? Number(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      : Number(number).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  render() {
    const { startDate, endDate, type } = this.state;
    const { reportList, tenantInfo } = this.props;

    return (
      <div>
        <div className="actions-bar">
          <div>
            <a
              href={`/v2/os/dealer/stat/monthly/report/export?&tenantId=${getTenantId()}&token=${getToken()}`}
              target="_blank"
              className="btn btn-primary"
            >
              {i18n['general.export']}
            </a>
          </div>
        </div>
        <div>
          <Table>
            <Table.Header>
              <th>{i18n['dealer.report.invoice_id']}</th>
              <th>{i18n['dealer.report.invoice_date']}</th>
              <th className="text-right">{i18n['dealer.report.b_book_volume']}</th>
              <th className="text-right">{i18n['dealer.report.b_book_volume']}（$）</th>
              <th className="text-right">{i18n['dealer.report.a_book_volume']}</th>
              <th className="text-right">{i18n['dealer.report.a_book_volume']}（$）</th>
              <th className="text-right">{i18n['dealer.report.c_book_volume']}</th>
              <th className="text-right">{i18n['dealer.report.c_book_volume']}（$）</th>
              <th className="text-right">{i18n['dealer.report.d_book_volume']}</th>
              <th className="text-right">{i18n['dealer.report.d_book_volume']}（$）</th>
              <th className="text-right">{i18n['dealer.report.lp_volume']}</th>
              <th className="text-right">{i18n['dealer.report.lp_volume']}（$）</th>
              <th className="text-right">{i18n['dealer.report.total_volume']}</th>
              <th className="text-right">{i18n['dealer.report.total_volume']}（$）</th>
              <th>{i18n['dealer.report.status']}</th>
              <th className="text-right">{i18n['dealer.report.pay_amount']}</th>
            </Table.Header>
            <Table.Body>
              {reportList.list.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{item.id}</td>
                    <td>{item.invoiceDate}</td>
                    <td className="text-right">{this.fixedNumber(item.bBookVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.bBooKTransactionVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.aBookVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.aBooKTransactionVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.copyVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.copyTransactionVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.placeVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.placeTransactionVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.lpVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.lpTransactionVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.totalVolume)}</td>
                    <td className="text-right">{this.fixedNumber(item.totalTransactionVolume)}</td>
                    <td>{status[item.status]}</td>
                    <td className="text-right">{this.fixedNumber(item.payAmount, 0)}</td>
                  </tr>
                );
              })}
              {reportList.total && (
                <tr>
                  <td>{i18n['general.total']}</td>
                  <td />
                  <td />
                  <td className="text-right">
                    {this.fixedNumber(reportList.total.bBooKTransactionVolume)}
                  </td>
                  <td />
                  <td className="text-right">
                    {this.fixedNumber(reportList.total.aBooKTransactionVolume)}
                  </td>
                  <td />
                  <td className="text-right">
                    {this.fixedNumber(reportList.total.copyTransactionVolume)}
                  </td>
                  <td />
                  <td className="text-right">
                    {this.fixedNumber(reportList.total.placeTransactionVolume)}
                  </td>
                  <td />
                  <td className="text-right">
                    {this.fixedNumber(reportList.total.lpTransactionVolume)}
                  </td>
                  <td />
                  <td className="text-right">
                    {this.fixedNumber(reportList.total.totalTransactionVolume)}
                  </td>
                  <td />
                  <td className="text-right">{this.fixedNumber(reportList.total.payAmount, false)}</td>
                </tr>
              )}
            </Table.Body>
          </Table>
          {reportList.list.length !== 0 && (
            <PaginationBar
              onPageChange={this.onPageChange}
              total={reportList.pagination.total}
              pageSize={reportList.pagination.pageSize}
              pageNo={reportList.pagination.pager}
            />
          )}
        </div>
      </div>
    );
  }
}
