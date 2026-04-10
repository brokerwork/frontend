import PaginationBar from 'components/v2/PaginationBar';
import i18n from 'utils/i18n';
import _ from 'lodash';
import NoDataView from 'components/NoDataView';
import { Table as UiTable, Button, Message } from 'lean-ui';
const { Td, Th } = UiTable;
import { Content, Layout } from 'components/v2/PageWraper';
import SortToggle from 'components/v2/SortToggle';
import moment from 'moment';
import cs from './List.less';
const formatStyle = 'YYYY-MM-DD HH:mm:ss';

export default class List extends PureComponent {
  getReportList() {
    const { getReportList, params } = this.props;
    getReportList(params);
  }

  //改变排序
  modifySort = v => {
    const {
      updateCurrentSortParam,
      currentSortParam,
      updatePagination
    } = this.props;
    const lastSortby = currentSortParam.sortby;
    const currentOrderDesc =
      lastSortby === v
        ? currentSortParam.orderDesc === 'DESC'
          ? 'ASC'
          : 'DESC'
        : 'DESC';
    Promise.all([
      updateCurrentSortParam({
        sortby: v,
        orderDesc: currentOrderDesc
      }),
      updatePagination({ pageNo: 1, pageSize: 20 })
    ]).then(() => {
      this.getReportList();
    });
  };

  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      currentSortParam: { sortby = '', orderDesc }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {item.sortable ? (
          <SortToggle
            activeSort={sortby}
            orders={['DESC', 'ASC']}
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
    if (/time/gi.test(key)) {
      title = content =
        source[key] !== 0
          ? moment(source[key]).format('YYYY-MM-DD HH:mm')
          : source[key];
    } else if (key === 'cmd' && ['balance', 'credit'].includes(source[key])) {
      title = content = i18n[`report.custom_report.cmdStr.${source[key]}`];
    } else {
      title = content = source[key];
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
      pageNo: v.pageNo
    });
  };
  // 合计
  _renderTableTotal = stat => {
    const { reportList } = this.props;
    const column = this.getColumn();
    const listLen = _.get(reportList, 'list.length', 0);
    if (stat && listLen) {
      return (
        <tr>
          {column.map((col, _idx) => {
            return <Td key={_idx}>{stat[col.value]}</Td>;
          })}
        </tr>
      );
    }
  };

  getColumn = () => {
    const { reportList } = this.props;
    const header = _.get(reportList, 'header', []);
    return header.map(col => ({
      label: col.name,
      value: col.key,
      sortable: col.sortable
    }));
  };

  render() {
    const { reportList, paginationInfo, params } = this.props;
    const column = this.getColumn();
    const list = _.get(reportList, 'list', []);
    const stat = _.get(reportList, 'stat', {});
    return (
      <Layout footer>
        <Content table={true}>
          <UiTable
            data={list}
            columns={column}
            fixedHeader
            renderCell={this._renderCellNew}
            renderHeadCell={this.renderHeadCell}
            lastRow={this._renderTableTotal(stat)}
            pager={
              list && list.length ? (
                <PaginationBar
                  {...paginationInfo}
                  onPageChange={this.modifyPagination}
                />
              ) : (
                undefined
              )
            }
          />
          {list && list.length ? (
            undefined
          ) : (
            <NoDataView className={cs['nodata-div']} />
          )}
        </Content>
      </Layout>
    );
  }
}
