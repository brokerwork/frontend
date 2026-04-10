import Button from 'components/Button';

import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { set as setQuery } from 'utils/cacheQuery';
import NoDataView from 'components/NoDataView';
import {
  CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER,
  PAYMENT_STATUS,
  CUSTOMER_SIGNING_TYPE
} from '../../constant';
import DetailModal from '../../containers/DetailModal';

import cs from './List.less';
import { innerParams } from '../../controls/reducers';
import { getCustomerSigningDetailList } from '../../controls/actions';
const actionColumn = ['action'];
const customerStateColumn = ['customerState'];
const payStateColumn = ['payState'];
const defaultSubColumn = ['customerName'];
export default class List extends PureComponent {
  state = {
    showDetailModal: false
  };
  _renderTableHeader = () => {
    const { params } = this.props;
    const sortStr = `${params.sortBy}-${params.orderDesc ? 'down' : 'up'}`;
    return CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER.map((col, idx) => {
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
  _renderTableBodyRow = (item, idx) => {
    return (
      <tr key={idx}>
        {CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER.map((col, _idx) => {
          const value = payStateColumn.includes(col.value) ? (
            <div
              className={`${item[col.value] === 'paid'
                ? cs['safe']
                : cs['drange']}`}
            >
              {
                PAYMENT_STATUS.find(object => object.value === item[col.value])
                  .label
              }
            </div>
          ) : customerStateColumn.includes(col.value) ? (
            CUSTOMER_SIGNING_TYPE.find(
              object => object.value === item[col.value]
            ).label
          ) : (
            item[col.value]
          );
          return (
            <td key={_idx}>
              {actionColumn.includes(col.value) ? (
                <div>
                  <Button
                    bsSize="xsmall"
                    bsStyle="primary"
                    data-test="showDetailModal"
                    onClick={this.getDetail.bind(this, item)}
                  >
                    {i18n['report.customer_signing_performance.detail_button']}
                  </Button>
                  <Button
                    bsSize="xsmall"
                    bsStyle="primary"
                    onClick={this.gotoReport.bind(this, item)}
                  >
                    {
                      i18n[
                        'report.customer_signing_performance.report_paid_button'
                      ]
                    }
                  </Button>
                </div>
              ) : defaultSubColumn.includes(col.value) ? (
                <a
                  target="_blank"
                  href={`/custommgmt/customers/detail/${item.customerId}`}
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </td>
          );
        })}
      </tr>
    );
  };
  _renderTableFooter = sta => {
    return (
      <tr>
        {CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER.map((col, _idx) => {
          let newkey = `total${col.value}`;
          return (
            <td key={_idx}>
              {defaultSubColumn.includes(col.value)
                ? i18n['report.commission_table_type.subBtn']
                : eval(`sta.${newkey}`)}
            </td>
          );
        })}
      </tr>
    );
  };
  getDetail = data => {
    const {
      innerParams,
      modifyInnerParams,
      getCustomerSigningDetailList
    } = this.props;
    const newInnerParams = Object.assign(innerParams, {
      customerId: data.customerId
    });
    modifyInnerParams(newInnerParams);
    getCustomerSigningDetailList(newInnerParams).then(res => {
      if (res.result) {
        this.setState({
          showDetailModal: true
        });
      }
    });
  };
  gotoReport = item => {
    window.open(
      `/bkRportmgmt/paymentreport?customerNo=${item.customerNo}&customerId=${item.customerId}`
    );
  };
  // 改变页码
  modifyPagination = v => {
    const { params, modifyParams } = this.props;
    modifyParams({
      ...params,
      pageSize: v.pageSize,
      currentPage: v.pageNo
    });
  };
  // 改变排序
  modifySort = v => {
    const { params, modifyParams } = this.props;
    const lastSortby = params.sortBy;
    const currentOrderDesc = lastSortby === v ? !params.orderDesc : false;
    modifyParams({
      ...params,
      sortBy: v,
      orderDesc: currentOrderDesc
    });
  };
  toggleModal = toggle => {
    this.setState({
      showDetailModal: toggle
    });
  };
  render() {
    const { customerSigningReportList } = this.props;
    const { showDetailModal } = this.state;
    const currentNeedRefresh =
      customerSigningReportList.list &&
      customerSigningReportList.list.length > 0;
    return (
      <div className={cs['main-report-content']}>
        <div className={cs['report-table']}>
          <Table className={'ellipsis'}>
            <Table.Header fixed>{this._renderTableHeader()}</Table.Header>
            {currentNeedRefresh ? (
              <Table.Body>
                {customerSigningReportList.list &&
                  customerSigningReportList.list.map(this._renderTableBodyRow)}
                {customerSigningReportList.sta &&
                  this._renderTableFooter(customerSigningReportList.sta)}
              </Table.Body>
            ) : (
              undefined
            )}
          </Table>
          {currentNeedRefresh ? (
            <PaginationBar
              total={customerSigningReportList.total}
              pageSize={customerSigningReportList.size}
              pageNo={customerSigningReportList.pager}
              onPageChange={this.modifyPagination}
            />
          ) : (
            <NoDataView />
          )}
        </div>
        {showDetailModal ? (
          <DetailModal onHide={this.toggleModal.bind(this, false)} />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
