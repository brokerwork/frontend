import DateRangePicker from 'components/DateRangePicker';
import Select from 'components/Select';
import Button from 'components/Button';
import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';
import { getToken } from 'utils/userInfo';
import { getTenantId } from 'utils/tenantInfo';

export default class List extends PureComponent {
  state = {
    start: dateRange.last30days.start,
    end: dateRange.last30days.end,
    type: 'symbol',
    pageNo: 1,
    pageSize: 10
  }

  componentDidMount() {
    this.getReportList();
  }

  getReportList = () => {
    const { getReportList } = this.props;
    const { start, end, type, pageNo, pageSize } = this.state;

    getReportList({
      type,
      from: start.format('YYYY-MM-DD'),
      to:  end.format('YYYY-MM-DD'),
      pager: pageNo,
      pageSize
    });
  }

  onDateRangeChange = ({ start, end }) => {
    this.setState({
      start,
      end
    });
  }

  onTypeChange = (type) => {
    this.setState({
      type
    });
  }

  onSearch = () => {
    this.getReportList();
  }

  onPageChange = ({ pageNo, pageSize }) => {
    this.setState({
      pageNo,
      pageSize
    }, () => {
      this.getReportList();
    });
  }

  fixedNumber = (number) => {
    return Number(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  render() {
    const { start, end, type } = this.state;
    const { reportList, tenantInfo } = this.props;

    return (
      <div>
        <div className="actions-bar">
          <div>
            <div className="action-item">
              {i18n['general.date_range']}：
              <DateRangePicker
                value={{ start, end }}
                onChange={this.onDateRangeChange}
              ></DateRangePicker>
            </div>
            <Select 
              value={type}
              className="action-item"
              options={[
                {label: i18n['dealer.report.option.symbol'], value: 'symbol'}, 
                {label: i18n['dealer.report.option.date'], value: 'reportDate'}
              ]}
              onChange={this.onTypeChange}
            ></Select>
            <Button style="primary" onClick={this.onSearch}>{i18n['general.search_btn']}</Button>
            <a 
              href={`/v2/os/dealer/stat/detail/export?type=${type}&from=${start.format('YYYY-MM-DD')}&to=${end.format('YYYY-MM-DD')}&tenantId=${getTenantId()}&token=${getToken()}`} 
              target="_blank" 
              className="btn btn-primary"
            >{i18n['general.export']}</a>
          </div>
        </div>
        <div>
          <Table>
            <Table.Header>
              <th>{i18n['dealer.report.tenant_id']}</th>
              <th>{reportList.type === 'symbol' ? i18n['dealer.report.symbol'] : i18n['dealer.report.date']}</th>
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
            </Table.Header>
            <Table.Body>
              {reportList.list.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{item.tenantId}</td>
                    <td>{item[reportList.type]}</td>
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
                  </tr>
                );
              })}
              {reportList.total && (
                <tr>
                  <td>{i18n['general.total']}</td>
                  <td></td>
                  <td></td>
                  <td className="text-right">{this.fixedNumber(reportList.total.bBooKTransactionVolume)}</td>
                  <td></td>
                  <td className="text-right">{this.fixedNumber(reportList.total.aBooKTransactionVolume)}</td>
                  <td></td>
                  <td className="text-right">{this.fixedNumber(reportList.total.copyTransactionVolume)}</td>
                  <td></td>
                  <td className="text-right">{this.fixedNumber(reportList.total.placeTransactionVolume)}</td>
                  <td></td>
                  <td className="text-right">{this.fixedNumber(reportList.total.lpTransactionVolume)}</td>
                  <td></td>
                  <td className="text-right">{this.fixedNumber(reportList.total.totalTransactionVolume)}</td>
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
            ></PaginationBar>
          )}
        </div>
      </div>
    )
  }
}