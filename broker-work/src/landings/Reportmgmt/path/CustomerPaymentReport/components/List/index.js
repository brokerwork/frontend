import Table from 'components/Table';
import PaginationBar from 'components/PaginationBar';
import NoDataView from 'components/NoDataView';
import cs from './index.less';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

export default class List extends PureComponent {
  onParamsChange = (key, value) => {
    const { modifyParams, params } = this.props;
    modifyParams({ [key]: value }, params);
  };
  onSortChange = (sortBy, orderDesc) => {
    const { modifyParams, params } = this.props;
    modifyParams({ sortBy, orderDesc }, params);
  };
  render() {
    const {
      tableTimeLine,
      reportList,
      listLoadAndEmpty,
      params,
      currentPageInfo,
      reportSta,
      modifyParams,
      billRefundViewKey
    } = this.props;
    const { type, productId } = params;
    return (
      <div>
        <div>
          <Table className={`${cs['payment-report-table']} ellipsis`}>
            <TableHeader
              dataType={type}
              tableTimeLine={tableTimeLine}
              params={params}
              onSortChange={this.onSortChange}
            />

            {!listLoadAndEmpty ? (
              <TableBody
                data={reportList}
                statistics={reportSta}
                tableTimeLine={tableTimeLine}
                billRefundViewKey={billRefundViewKey}
                dataType={type}
                productId={productId}
              />
            ) : (
              undefined
            )}
          </Table>
          {!listLoadAndEmpty ? (
            <PaginationBar
              total={currentPageInfo.total}
              pageSize={currentPageInfo.pageSize}
              pageNo={currentPageInfo.pageNo}
              onPageChange={this.onParamsChange.bind(this, 'pageInfo')}
            />
          ) : (
            <NoDataView />
          )}
        </div>
      </div>
    );
  }
}
