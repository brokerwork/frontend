import { Button } from 'react-bootstrap';

import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { set as setQuery } from 'utils/cacheQuery';
import NoDataView from 'components/NoDataView';
import DepositModal from '../../containers/DepositModal';

import cs from './List.less';

export const agentdepositSizeKey = 'agentdeposit_report_list';
const actionColumn = ['action'];
const balanceColumn = ['balance'];
const marginColumn = ['marginWarn'];
const fixColumn = ['accountTotalBalance', 'balance'];
export default class List extends PureComponent {
  state = {
    showDepositModal: false,
    agentData: {}
  };
  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination } = this.props;
    Promise.resolve(updatePagination({ pageNo, pageSize })).then(() => {
      setQuery('currentPagination')(this.props);
      this.getAgentDepositList();
    });
  };
  getAgentDepositList = () => {
    const {
      getAgentDepositList,
      updateNeedRefresh,
      accountQueryItem,
      accountQueryValue,
      currentPagination
    } = this.props;
    const { pageNo, pageSize } = currentPagination;
    Promise.resolve(
      getAgentDepositList({
        name: accountQueryItem.value === 'name' ? accountQueryValue : '',
        login: accountQueryItem.value === 'login' ? accountQueryValue : '',
        pageNo: pageNo,
        pageSize: pageSize
      })
    ).then(res => {
      if (res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };

  showModal = (toggle, item) => {
    this.setState({
      showDepositModal: toggle,
      agentData: item ? item : {}
    });
  };

  _renderTableHeader = () => {
    const { agentDepositListcolumns } = this.props;
    return agentDepositListcolumns.map((col, idx) => {
      return <th key={idx}>{col.label}</th>;
    });
  };
  gotoDetail = userId => {
    const { history: { push } } = this.props;
    push(`/usersetting/mydeposit/${userId}`);
  };
  _renderTableBodyRow = (item, idx) => {
    const { agentDepositListcolumns, userRights } = this.props;
    return (
      <tr key={idx}>
        {agentDepositListcolumns.map((col, _idx) => {
          const instanceMarginWarn =
            parseInt(item.marginWarnPercent || 0) /
            100 *
            item.accountTotalBalance;
          const warnColor =
            item.warnMode === 'PERCENT'
              ? instanceMarginWarn * 1.1 > parseInt(item.balance || 0) &&
                parseInt(item.balance || 0) > instanceMarginWarn
                ? 'warning'
                : parseInt(item.balance || 0) > instanceMarginWarn
                  ? 'safe'
                  : 'drange'
              : parseInt(item.marginWarn || 0) * 1.1 >
                  parseInt(item.balance || 0) &&
                parseInt(item.balance || 0) > parseInt(item.marginWarn || 0)
                ? 'warning'
                : parseInt(item.balance || 0) > parseInt(item.marginWarn || 0)
                  ? 'safe'
                  : 'drange';

          const value =
            fixColumn.includes(col.value) && item[col.value]
              ? item[col.value].toFixed(2)
              : item[col.value];
          return (
            <td key={_idx}>
              {actionColumn.includes(col.value) &&
              userRights['ACCOUNT_MODIFY-DW'] ? (
                <div>
                  <Button
                    bsSize="xsmall"
                    bsStyle="primary"
                    className="depositButton"
                    onClick={this.showModal.bind(this, true, item)}
                  >
                    {i18n['report.agent_deposit.deposit_tips']}
                  </Button>
                  {userRights['STAT_VIEW_AGENTMARGIN_DETAIL'] ? (
                    <Button
                      bsSize="xsmall"
                      bsStyle="primary"
                      onClick={this.gotoDetail.bind(this, item.userId)}
                    >
                      {i18n['report.agent_deposit.detail_tips']}
                    </Button>
                  ) : (
                    undefined
                  )}
                </div>
              ) : balanceColumn.includes(col.value) ? (
                <div
                  className={`${cs['report_td']} ${cs[warnColor]} `}
                  title={value}
                >
                  {value}
                </div>
              ) : marginColumn.includes(col.value) ? (
                <div title={item[col.value]} className={cs['report_td']}>
                  {item.warnMode === 'PERCENT'
                    ? `${item.marginWarnPercent}％`
                    : item[col.value]}
                </div>
              ) : (
                <div title={value} className={cs['report_td']}>
                  {value}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { agentdepositReportList, currentNeedRefresh } = this.props;
    const { showDepositModal, agentData } = this.state;
    return (
      <div className={cs['main-report-content']}>
        <div className={cs['report-table']}>
          <Table className={'ellipsis'}>
            <Table.Header fixed>{this._renderTableHeader()}</Table.Header>
            {currentNeedRefresh === '' ? (
              <Table.Body>
                {agentdepositReportList.list &&
                  agentdepositReportList.list.map(this._renderTableBodyRow)}
              </Table.Body>
            ) : (
              undefined
            )}
          </Table>
          {currentNeedRefresh === '' ? (
            <PaginationBar
              total={agentdepositReportList.total}
              pageSize={agentdepositReportList.size}
              pageNo={agentdepositReportList.pager}
              onPageChange={this.onPageChange}
              className={cs['pagination-bar']}
            />
          ) : (
            <NoDataView />
          )}
        </div>
        {showDepositModal ? (
          <DepositModal
            agentData={agentData}
            onHide={this.showModal.bind(this, false, undefined)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
