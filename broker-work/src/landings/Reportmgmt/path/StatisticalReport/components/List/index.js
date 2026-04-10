import PaginationBar from 'components/v2/PaginationBar';
import DetailModal from '../../containers/DetailModal';
import i18n from 'utils/i18n';
import _ from 'lodash';
import {
  CTRADER_NOSHOW_TYPE,
  CTRADER_COLUMNS_FILTER
} from '../../../../constant';
import { SYMBOLGROUP_DETAIL } from '../../constant';
import NoDataView from 'components/NoDataView';
import { Table as UiTable, Button } from 'lean-ui';
const { Td, Th } = UiTable;
import { Content, Layout } from 'components/v2/PageWraper';
import SortToggle from 'components/v2/SortToggle';
import moment from 'moment';
import cs from './List.less';
const dateColumns = ['open_time', 'close_time'];
const defaultSubColumn = ['parent_name'];
const formatStyle = 'YYYY-MM-DD HH:mm:ss';
const actionColumn = ['action'];
const ticketColumn = ['ticket'];

export default class List extends PureComponent {
  state = {
    showDetailModal: false
  };

  getReportList() {
    const { getReportList, params } = this.props;
    getReportList(params);
  }
  showModal = (toggle, item) => {
    const {
      updateDetailListColumns,
      getDetailType,
      getDetailList,
      updateCurrentSymbolId,
      params
    } = this.props;
    let copyData = SYMBOLGROUP_DETAIL;
    updateDetailListColumns(copyData);
    updateCurrentSymbolId(item.id);
    getDetailType('SymbolGroupDetail');
    const copyParams = Object.assign(params, {
      reportType: 'SymbolGroupDetail',
      id: item.id,
      nowPage: 1,
      pageSize: 20
    });
    Promise.resolve(getDetailList(copyParams)).then(res => {
      if (res.result) {
        this.setState({
          showDetailModal: toggle
        });
      }
    });
  };

  hideModal = () => {
    this.setState({
      showDetailModal: false
    });
  };

  //改变排序
  modifySort = v => {
    const {
      updateCurrentSortParam,
      currentSortParam,
      updatePagination
    } = this.props;
    const lastSortby = currentSortParam.sortby;
    const currentOrderDesc =
      lastSortby === v ? !currentSortParam.orderDesc : false;
    Promise.all([
      updateCurrentSortParam({
        sortby: v,
        orderDesc: currentOrderDesc
      }),
      updatePagination({ pager: 1 })
    ]).then(() => {
      this.getReportList();
    });
  };

  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      currentSortParam: { sortby, orderDesc }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {item.sort ? (
          <SortToggle
            activeSort={sortby}
            orders={[true, false]}
            sortKey={item.value}
            activeOrder={orderDesc}
            onChange={this.modifySort}
          >
            {item.label}
          </SortToggle>
        ) : (
          item.label
        )}
      </Th>
    );
  };
  _renderCellNew = ({ rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };
  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, field) => {
    const key = field.value;
    const {
      match: { url },
      userRights
    } = this.props;
    let content = null;
    let clickHandler = null;
    let title;
    switch (key) {
      case 'name':
        title = content = source[key];
        break;
      case 'action':
        content = (
          <Button
            type="primary"
            size="small"
            icon="info-outline"
            onClick={this.showModal.bind(this, true, source)}
          />
        );
        title = i18n['report.commission_Report.open_detail'];
        break;
      case 'closeTime':
        title = content = moment(source[key]).format(formatStyle);
        break;
      case 'openTime':
        title = content = moment(source[key]).format(formatStyle);
        break;
      case 'openClose':
        title = content = source['direction'];
        break;
      default:
        title = content = source[key];
        break;
    }

    return (
      <Td
        key={key}
        className={'active-actions'}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };

  //改变页码
  modifyPagination = v => {
    const { params, modifyParams } = this.props;
    modifyParams({
      ...params,
      pageSize: v.pageSize,
      nowPage: v.pageNo
    });
  };
  // 合计
  // jimmy要求 交易历史查询报表 不展示利息的合计 swap
  // jimmy又要求展示了哦
  _renderTableTotal = sta => {
    const { reportList } = this.props;
    const column = this.setColumn();
    if (sta && reportList.list.length) {
      return (
        <tr>
          {column.map((col, _idx) => {
            return (
              <Td key={_idx}>
                {_idx === 0
                  ? i18n['report.count']
                  : sta['sum_' + col.value] || sta[col.value]}
              </Td>
            );
          })}
        </tr>
      );
    }
  };
  ctreaderColumnFilter = columns => {
    const { currentStatisticalReportType } = this.props;
    const type =
      currentStatisticalReportType &&
      currentStatisticalReportType.value.toUpperCase();
    const filterArray = CTRADER_COLUMNS_FILTER[type];
    //挂单查询 初始手数和交易量一个字段，此处特殊处理，显示初始手数;
    if (type === 'ORDER') {
      columns = columns.filter(item => {
        if (item.value === 'volume') {
          return item.ctrader;
        } else {
          return true;
        }
      });
    }
    return filterArray
      ? columns.filter(
          item => !filterArray.includes(item.value) || item.ctrader
        )
      : columns;
  };
  setColumn = () => {
    const {
      statisticalListColumns,
      currentServer,
      currentStatisticalReportType
    } = this.props;
    let copyData = _.cloneDeep(statisticalListColumns);
    const currentVendor =
      currentServer.vendor === 'MT4'
        ? 'mt4'
        : currentServer.vendor === 'CTRADER'
          ? 'ctrader'
          : 'mt5';
    switch (currentVendor) {
      case 'mt4':
        //mt4时执行
        if (
          ['Position', 'Order', 'HistoryOrder'].includes(
            currentStatisticalReportType.value
          )
        ) {
          copyData = copyData.filter(item => {
            return item[currentVendor];
          });
          return copyData;
        }
        return copyData;
      case 'mt5':
        //mt5时执行
        if (
          ['Position', 'Order', 'HistoryOrder'].includes(
            currentStatisticalReportType.value
          )
        ) {
          copyData = copyData.filter(item => {
            return item[currentVendor];
          });
          return copyData;
        }
        return copyData;
      case 'ctrader':
        //ctrader时执行
        copyData = copyData.filter(item => {
          return !CTRADER_NOSHOW_TYPE.includes(item.value);
        });
        copyData = this.ctreaderColumnFilter(copyData);
        if (currentStatisticalReportType.value === 'AccountDw') {
          copyData.push({
            label: i18n['report.account_dw_Header.outer_comment'],
            value: 'comment',
            fieldType: 'input'
          });
        }
        return copyData;
    }
  };

  render() {
    const {
      reportList,
      paginationInfo,
      params,
      currentStatisticalReportType
    } = this.props;
    const { showDetailModal } = this.state;
    const column = this.setColumn();
    return (
      <Layout footer>
        <Content table={true}>
          <UiTable
            data={(reportList.list && reportList.list) || []}
            columns={column}
            fixedHeader
            renderCell={this._renderCellNew}
            renderHeadCell={this.renderHeadCell}
            lastRow={
              currentStatisticalReportType.value === 'HistoryOrder'
                ? this._renderTableTotal(reportList.stat)
                : this._renderTableTotal(reportList.sta)
            }
            pager={
              reportList.list && reportList.list.length ? (
                <PaginationBar
                  {...paginationInfo}
                  onPageChange={this.modifyPagination}
                />
              ) : (
                undefined
              )
            }
          />
          {reportList.list && reportList.list.length ? (
            undefined
          ) : (
            <NoDataView className={cs['nodata-div']} />
          )}
        </Content>
        {showDetailModal ? (
          <DetailModal
            show={showDetailModal}
            showPage={true}
            reportType={currentStatisticalReportType.value}
            onHide={this.hideModal}
            params={params}
          />
        ) : (
          undefined
        )}
      </Layout>
    );
  }
}
