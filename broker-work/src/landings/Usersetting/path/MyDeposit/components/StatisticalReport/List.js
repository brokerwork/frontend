import { Button } from 'react-bootstrap';

import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { set as setQuery } from 'utils/cacheQuery';
import NoDataView from 'components/NoDataView';

import cs from './StatisticalReport.less';
const defaultSubColumn = ['parent_name'];
export default class List extends PureComponent {
  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination, type } = this.props;
    Promise.resolve(updatePagination({ pageNo, pageSize })).then(() => {
      setQuery('currentPagination')(this.props, type);
      this.getReportList();
    });
  };

  getReportList = () => {
    const {
      getReportList,
      dateRanges,
      currentPagination,
      currentServer,
      updateNeedRefresh,
      accountQueryItem,
      accountQueryValue,
      currentSortParam,
      type,
      userId
    } = this.props;
    const { startDate, endDate } = dateRanges;
    const { pageNo, pageSize } = currentPagination;
    getReportList({
      objectType: userId,
      accountQueryItem: accountQueryItem.value,
      accountQueryValue: accountQueryValue,
      reportType: type,
      searchStart: startDate ? startDate.format('YYYY-MM-DD') : null,
      searchEnd: endDate ? endDate.format('YYYY-MM-DD') : null,
      serverId: currentServer.value,
      nowPage: pageNo,
      pageSize: pageSize,
      sortingDirection: currentSortParam.orderDesc ? 'asc' : 'desc',
      sortingColumn: currentSortParam.sortby,
      isMarginMode: true
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

  //改变排序
  modifySort = v => {
    const {
      updateCurrentSortParam,
      currentSortParam,
      updatePagination,
      type
    } = this.props;
    const lastSortby = currentSortParam.sortby;
    const currentOrderDesc =
      lastSortby === v ? !currentSortParam.orderDesc : false;
    Promise.all([
      updateCurrentSortParam({ sortby: v, orderDesc: currentOrderDesc }),
      updatePagination({ pageNo: 1 })
    ]).then(() => {
      setQuery('currentPagination', 'currentSortParam')(this.props, type);
      this.getReportList();
    });
  };
  _renderTableHeader = () => {
    const {
      currentSortParam: { sortby, orderDesc },
      reportHeader
    } = this.props;
    const sortStr = `${sortby}-${orderDesc ? 'up' : 'down'}`;
    return reportHeader.map((col, idx) => {
      return (
        <th key={idx}>
          {col.sort ? (
            <span
              className={cs['sort-text']}
              onClick={this.modifySort.bind(this, col.value)}
            >
              {col.label}
              <span className={`${cs['sort-icon']}`}>
                <i
                  className={`fa fa-sort-asc ${sortStr === `${col.value}-up`
                    ? cs['active']
                    : ''}`}
                />
                <i
                  className={`fa fa-sort-desc ${sortStr === `${col.value}-down`
                    ? cs['active']
                    : ''}`}
                />
              </span>
            </span>
          ) : (
            col.label
          )}
        </th>
      );
    });
  };
  gotoDetail = userId => {
    window.location.href = `/usersetting/mydeposit?userId=${userId}`;
  };
  _renderTableBodyRow = (item, idx) => {
    const { reportHeader } = this.props;
    return (
      <tr key={idx}>
        {reportHeader.map((col, _idx) => {
          return (
            <td key={_idx}>
              <div title={item[col.value]} className={cs['report_td']}>
                {item[col.value]}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  _renderTableFooter = sta => {
    const { reportHeader } = this.props;
    return (
      <tr>
        {reportHeader.map((col, _idx) => {
          let newkey = `sum_${col.value}`;
          return (
            <td key={_idx}>
              {defaultSubColumn.includes(col.value)
                ? i18n['report.count']
                : eval(`sta.${newkey}`)}
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
