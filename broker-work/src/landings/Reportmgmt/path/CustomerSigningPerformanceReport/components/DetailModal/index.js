import Button from 'components/Button';
import Modal from 'components/Modal';
import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import i18n from 'utils/i18n';
import { set as setQuery } from 'utils/cacheQuery';
import NoDataView from 'components/NoDataView';
import {
  INNER_CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER,
  PAYMENT_STATUS,
  PRODUCT_LIST
} from '../../constant';

import cs from './DetailModal.less';
const actionColumn = ['action'];
const productColumns = [
  'serviceType',
  'type',
  'invoicedate',
  'endDate',
  'unitPrice',
  'num',
  'extendedPrice'
];
const payStateColumn = ['payState'];
export default class DetailModal extends PureComponent {
  _renderTableHeader = () => {
    const { innerParams } = this.props;
    const sortStr = `${innerParams.sortBy}-${innerParams.orderDesc
      ? 'down'
      : 'up'}`;
    return INNER_CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER.map((col, idx) => {
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
  // 改变排序
  modifySort = v => {
    const {
      innerParams,
      modifyInnerParams,
      getCustomerSigningDetailList
    } = this.props;
    const lastSortby = innerParams.sortby;
    const currentOrderDesc = lastSortby === v ? !innerParams.orderDesc : false;
    const newParams = Object.assign(innerParams, {
      sortBy: v,
      orderDesc: currentOrderDesc
    });
    modifyInnerParams(newParams);
    getCustomerSigningDetailList(newParams);
  };
  // 改变页码
  modifyPagination = v => {
    const {
      innerParams,
      modifyInnerParams,
      getCustomerSigningDetailList
    } = this.props;
    const newParams = Object.assign(innerParams, {
      pageSize: v.pageSize,
      currentPage: v.pageNo
    });
    modifyInnerParams(newParams);
    getCustomerSigningDetailList(newParams);
  };
  gotoPayment = item => {
    window.open(
      `/custommgmt/customers/detail/${item.customerId}/bill/${item.billId}?enable=true`
    );
  };
  _renderinerRow = (item, idx) => {
    return (
      <li key={idx} className={cs['search-results-item']}>
        {item}
      </li>
    );
  };
  _renderinerServerTypeRow = (item, idx) => {
    return (
      <li key={idx} className={cs['search-results-item']}>
        {PRODUCT_LIST.find(object => object.value === item).label}
      </li>
    );
  };
  _renderinerTypeRow = (item, idx) => {
    return (
      <li key={idx} className={cs['search-results-item']}>
        {i18n[`customer.product_list.${item}`]}
      </li>
    );
  };
  _renderTableBodyRow = (item, idx) => {
    return (
      <tr key={idx}>
        {INNER_CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER.map((col, _idx) => {
          return (
            <td key={_idx}>
              {actionColumn.includes(col.value) ? (
                <Button
                  bsSize="xsmall"
                  bsStyle="primary"
                  onClick={this.gotoPayment.bind(this, item)}
                >
                  {i18n['report.customer_signing_performance.detail_button']}
                </Button>
              ) : productColumns.includes(col.value) ? (
                <ul className={cs['search-results']}>
                  {col.value === 'serviceType'
                    ? item[col.value] &&
                      item[col.value].map(this._renderinerServerTypeRow)
                    : col.value === 'type'
                      ? item[col.value] &&
                        item[col.value].map(this._renderinerTypeRow)
                      : item[col.value] &&
                        item[col.value].map(this._renderinerRow)}
                </ul>
              ) : payStateColumn.includes(col.value) ? (
                <div
                  className={`${item[col.value] === 'paid'
                    ? cs['safe']
                    : cs['drange']}`}
                >
                  {
                    PAYMENT_STATUS.find(
                      object => object.value === item[col.value]
                    ).label
                  }
                </div>
              ) : (
                item[col.value]
              )}
            </td>
          );
        })}
      </tr>
    );
  };
  render() {
    const { customerSigningReportDetail, onHide } = this.props;
    const currentNeedRefresh =
      customerSigningReportDetail.list &&
      customerSigningReportDetail.list.length > 0;
    return (
      <Modal
        backdrop="static"
        bsSize="large"
        onHide={onHide}
        className={cs['detail-modal']}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['report.customer_signing_performance.report_detail_header']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <Table className={'ellipsis'}>
            <Table.Header fixed>{this._renderTableHeader()}</Table.Header>
            {currentNeedRefresh ? (
              <Table.Body>
                {customerSigningReportDetail.list &&
                  customerSigningReportDetail.list.map(
                    this._renderTableBodyRow
                  )}
              </Table.Body>
            ) : (
              undefined
            )}
          </Table>
          {currentNeedRefresh ? (
            <PaginationBar
              total={customerSigningReportDetail.total}
              pageSize={customerSigningReportDetail.size}
              pageNo={customerSigningReportDetail.pager}
              onPageChange={this.modifyPagination}
            />
          ) : (
            <NoDataView />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}
