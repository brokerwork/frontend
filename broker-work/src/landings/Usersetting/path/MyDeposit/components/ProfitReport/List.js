import { Button } from 'react-bootstrap';

import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { dateTimeFormatStyle } from 'utils/config';
import { set as setQuery } from 'utils/cacheQuery';
import NoDataView from 'components/NoDataView';
import { PROFIT_HEADER } from '../../../../constant';
import moment from 'moment';
import cs from './ProfitReport.less';
const actionColumn = ['action'];
const statusColumn = ['status'];
const moneyColumns = ['agentProfit'];
const dateColumns = ['handleTime', 'closeTime'];
const defaultSubColumn = ['userLogin'];
export default class List extends PureComponent {
  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination, type } = this.props;
    Promise.resolve(updatePagination({ pageNo, pageSize })).then(() => {
      setQuery('currentPagination')(this.props);
      this.getProfitList();
    });
  };

  getProfitList = () => {
    const {
      getProfitList,
      currentStatus,
      dateRanges,
      currentPagination,
      updateNeedRefresh,
      userId
    } = this.props;
    const { startDate, endDate } = dateRanges;
    const { pageNo, pageSize } = currentPagination;
    getProfitList({
      userId: userId,
      status: currentStatus.value === 'all' ? '' : currentStatus.value,
      start: startDate ? startDate.format('YYYY-MM-DD') : null,
      end: endDate ? endDate.format('YYYY-MM-DD') : null,
      nowPage: pageNo,
      pageSize: pageSize
    }).then(res => {
      if (res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };

  _renderTableHeader = () => {
    const listHeader = PROFIT_HEADER;
    return listHeader.map((col, idx) => {
      return <th key={idx}>{col.label}</th>;
    });
  };

  retry = item => {
    const { showTipsModal, retryProfit, showTopAlert } = this.props;
    showTipsModal({
      content: i18n['report.agent_deposit.deal_warning'],
      noCancel: true,
      onConfirm: cb => {
        retryProfit(item.id).then(({ result }) => {
          cb();
          if (result) {
            showTopAlert({
              content: i18n['general.deal_success'],
              bsStyle: 'success'
            });
            this.getProfitList();
          }
        });
      }
    });
  };
  _renderTableBodyRow = (item, idx) => {
    const listHeader = PROFIT_HEADER;
    const { userRights } = this.props;
    return (
      <tr key={idx}>
        {listHeader.map((col, _idx) => {
          const color =
            item['status'] === 0
              ? 'failed'
              : item['status'] === 1 ? 'success' : 'processing';
          return (
            <td key={_idx}>
              {dateColumns.includes(col.value) ? (
                item[col.value] ? (
                  moment(item[col.value]).format(dateTimeFormatStyle)
                ) : (
                  'N/A'
                )
              ) : actionColumn.includes(col.value) &&
              userRights['STAT_VIEW_AGENTMARGIN_RETRY'] ? (
                item['status'] === 0 ? (
                  <Button
                    title={i18n['report.agent_deposit.deal_tips']}
                    className={`btn-primary ${cs['action-button']}`}
                    onClick={this.retry.bind(this, item)}
                  >
                    <i className="fa fa-undo" />
                  </Button>
                ) : (
                  undefined
                )
              ) : statusColumn.includes(col.value) ? (
                <div title={item[col.value]} className={cs[color]}>
                  {item[col.value] === 0
                    ? i18n['report.agent_deposit.deal_failed']
                    : item['status'] === 1
                      ? i18n['report.agent_deposit.deal_success']
                      : i18n['report.agent_deposit.deal_processing']}
                </div>
              ) : moneyColumns.includes(col.value) ? (
                <div
                  title={item[col.value]}
                  className={`${parseFloat(item[col.value]) > 0
                    ? cs['success']
                    : cs['failed']} ${cs['report_td']}`}
                >
                  {parseFloat(item[col.value]) > 0 ? '+' : ''} {item[col.value]}
                </div>
              ) : (
                <div title={item[col.value]} className={cs['report_td']}>
                  {item[col.value]}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  };
  _renderTableFooter = sta => {
    const listHeader = PROFIT_HEADER;
    return (
      <tr>
        {listHeader.map((col, _idx) => {
          let newkey = 'total';
          const color =
            parseFloat(sta.total) > 0
              ? 'success'
              : parseFloat(sta.total) === 0 ? '' : 'failed';

          return (
            <td key={_idx}>
              {defaultSubColumn.includes(col.value) ? (
                i18n['report.count']
              ) : moneyColumns.includes(col.value) ? (
                <span className={cs[color]}>
                  {parseFloat(sta.total) > 0
                    ? `+${eval(`sta.${newkey}`)}`
                    : parseFloat(sta.total) == 0
                      ? ''
                      : `${eval(`sta.${newkey}`)}`}
                </span>
              ) : (
                undefined
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { reportList, currentNeedRefresh } = this.props;
    return (
      <div className={cs['main-report-content']}>
        <div className={cs['report-table']}>
          <Table className={'ellipsis'}>
            <Table.Header fixed>{this._renderTableHeader()}</Table.Header>
            {currentNeedRefresh === '' ? (
              <Table.Body>
                {reportList.list &&
                  reportList.list.map(this._renderTableBodyRow)}
                {reportList.sta && this._renderTableFooter(reportList.sta)}
              </Table.Body>
            ) : (
              undefined
            )}
          </Table>
          {currentNeedRefresh === '' ? (
            <PaginationBar
              total={reportList.total}
              pageSize={reportList.size}
              pageNo={reportList.pager}
              onPageChange={this.onPageChange}
              className={cs['pagination-bar']}
            />
          ) : (
            <NoDataView />
          )}
        </div>
      </div>
    );
  }
}
