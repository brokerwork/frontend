import i18n from 'utils/i18n';
import cs from './List.less';
import NoDataView from 'components/NoDataView';
import { Table as UiTable, Message } from 'lean-ui';
const { Td, Th } = UiTable;
import { Content, Layout } from 'components/v2/PageWraper';
import PaginationBar from 'components/v2/PaginationBar';
import { OUTSTANDING_RRPORT_HEADERS } from '../../constant';
const defaultSubColumn = ['name'];

export default class OutStandingList extends PureComponent {
  modifyPagination = v => {
    const { params, modifyParams } = this.props;
    modifyParams({
      ...params,
      pageSize: v.pageSize,
      nowPage: v.pageNo
    });
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };

  _renderCellNew = ({ rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };

  // 合计
  _renderTableTotal = sta => {
    const { outStandingReportList } = this.props;
    if (sta && outStandingReportList.list.length) {
      return (
        <tr>
          {OUTSTANDING_RRPORT_HEADERS.map((col, _idx) => {
            return (
              <Td key={_idx}>
                {defaultSubColumn.includes(col.value)
                  ? i18n['report.count']
                  : sta['sum_' + col.value]
                    ? sta['sum_' + col.value]
                    : undefined}
              </Td>
            );
          })}
        </tr>
      );
    }
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

  render() {
    const { outStandingReportList, paginationInfo } = this.props;
    return (
      <Layout footer>
        <Content
          table={
            outStandingReportList.list && outStandingReportList.list.length
          }
        >
          <UiTable
            data={
              (outStandingReportList.list && outStandingReportList.list) || []
            }
            columns={OUTSTANDING_RRPORT_HEADERS}
            fixedHeader
            renderCell={this._renderCellNew}
            renderHeadCell={this.renderHeadCell}
            lastRow={this._renderTableTotal(outStandingReportList.sta)}
            pager={
              outStandingReportList.list &&
              outStandingReportList.list.length ? (
                <PaginationBar
                  {...paginationInfo}
                  onPageChange={this.modifyPagination}
                />
              ) : (
                undefined
              )
            }
          />
          {outStandingReportList.list && outStandingReportList.list.length ? (
            undefined
          ) : (
            <NoDataView />
          )}
        </Content>
      </Layout>
    );
  }
}
