import Table from 'components/Table';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import PaginationBar from 'components/v2/PaginationBar';

import cs from './DetailModal.less';

export default class DetailModal extends PureComponent {
  state = {
    activePage: this.props.detailList.pager,
    pageSize: 20
  };

  handleSelect = eventKey => {
    const {
      currentServer,
      getDetailList,
      symbolId,
      currentListDetailType,
      params
    } = this.props;
    Promise.resolve(
      getDetailList({
        ...params,
        reportType: currentListDetailType,
        serverId: currentServer.value,
        id: symbolId,
        nowPage: eventKey.pageNo,
        pageSize: eventKey.pageSize
      })
    ).then(res => {
      if (res.result) {
        this.setState({
          activePage: eventKey.pageNo,
          pageSize: eventKey.pageSize
        });
      }
    });
  };

  _renderTableHeader() {
    const { detailListColumns } = this.props;
    return detailListColumns.map((col, idx) => {
      return <th key={idx}>{col.label}</th>;
    });
  }

  _renderTableBodyRow = (item, idx) => {
    const { detailListColumns } = this.props;
    return (
      <tr key={idx}>
        {detailListColumns.map((col, _idx) => {
          return (
            <td key={_idx} title={item[col.value]}>
              {item[col.value]}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { show, onHide, detailList, showPage } = this.props;
    const { activePage, pageSize } = this.state;
    return (
      <Modal backdrop="static" bsSize="large" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['report.commission_table_type.detail_first']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <Table className={`${cs['table']} ellipsis`}>
            <Table.Header>{this._renderTableHeader()}</Table.Header>
            <Table.Body>
              {detailList.list && detailList.list.map(this._renderTableBodyRow)}
            </Table.Body>
          </Table>
          {showPage && detailList.pages > 0 ? (
            <PaginationBar
              pageNo={activePage}
              pageSize={pageSize}
              total={detailList.total}
              onPageChange={this.handleSelect}
            />
          ) : (
            undefined
          )}
        </Modal.Body>
      </Modal>
    );
  }
}
