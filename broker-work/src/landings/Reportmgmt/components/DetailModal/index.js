import Table from 'components/Table';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import { Pagination, Tooltip, Button, OverlayTrigger } from 'react-bootstrap';
import InnerModal from './innerModal';
import { LOTS_DETAIL } from '../../constant';

import cs from './DetailModal.less';
const actionColumn = ['action'];
const showDetailTips = (
  <Tooltip id="tooltip">
    {i18n['report.commission_table_type.detailBtn']}
  </Tooltip>
);

export default class DetailModal extends PureComponent {
  state = {
    activePage: this.props.detailList.pager,
    showInnerModal: false,
    innerModalId: ''
  };

  handleSelect = eventKey => {
    const {
      dateRange,
      currentServer,
      getDetailList,
      symbolId,
      currentListDetailType,
      objectType,
      reportType,
      currentObjectType,
      currentCommissionItemLogin
    } = this.props;
    const { startDate, endDate } = dateRange;
    Promise.resolve(
      getDetailList({
        objectType:
          reportType === 'Lots' ? currentObjectType.value : objectType,
        reportType: currentListDetailType,
        searchStart: startDate ? startDate.format('YYYY-MM-DD') : null,
        searchEnd: endDate ? endDate.format('YYYY-MM-DD') : null,
        serverId: currentServer.value,
        id: symbolId,
        nowPage: eventKey,
        pageSize: 20,
        login: currentCommissionItemLogin
      })
    ).then(res => {
      if (res.result) {
        this.setState({
          activePage: eventKey
        });
      }
    });
  };

  //展示内层的详细modal
  showInnerModal = (toggle, item) => {
    const {
      dateRange,
      currentServer,
      getInnerDetailList,
      objectType,
      reportType,
      currentObjectType,
      currentCommissionItemLogin
    } = this.props;
    const { startDate, endDate } = dateRange;
    if (toggle) {
      Promise.resolve(
        getInnerDetailList({
          objectType:
            reportType === 'Lots' ? currentObjectType.value : objectType,
          reportType: 'LotsDetailOrder',
          searchStart: startDate ? startDate.format('YYYY-MM-DD') : null,
          searchEnd: endDate ? endDate.format('YYYY-MM-DD') : null,
          serverId: currentServer.value,
          id: item.id,
          login: currentCommissionItemLogin
        })
      ).then(res => {
        this.setState({
          showInnerModal: toggle,
          innerModalId: item.id
        });
      });
      return;
    }

    this.setState({
      showInnerModal: toggle
    });
  };

  //过滤手数和处理数问题
  filiterVolume = commissionReportList => {
    const { brandInfo } = this.props;
    let copyData =
      brandInfo['mode'] === 'DISTRIBUTION'
        ? LOTS_DETAIL.filter(item => item.value !== 'action')
        : LOTS_DETAIL;
    const staStatus = commissionReportList['sta'];
    if (staStatus) {
      const volumeDisplayStatus = !staStatus['volume_display'];
      const openCloseVolumeDisplayStatus = !staStatus[
        'open_close_volume_display'
      ];
      copyData = copyData.filter(item => {
        let s = true;
        if (volumeDisplayStatus) {
          s = item.value !== 'close_volume';
        }
        if (openCloseVolumeDisplayStatus) {
          s = item.value !== 'open_close_volume';
        }
        return s;
      });
    }
    return copyData;
  };

  _renderTableHeader() {
    const { detailListColumns, detailList, reportType } = this.props;
    let copyData = [];
    if (reportType === 'Lots') {
      copyData = this.filiterVolume(detailList);
      return copyData.map((col, idx) => {
        return <th key={idx}>{col.label}</th>;
      });
    }

    if (reportType !== 'Lots') {
      copyData = detailListColumns;
      return copyData.map((col, idx) => {
        return <th key={idx}>{col.label}</th>;
      });
    }
  }

  _renderTableBodyRow = (item, idx) => {
    const { detailListColumns, detailList, reportType } = this.props;
    let copyData = [];
    if (reportType === 'Lots') {
      copyData = this.filiterVolume(detailList);
      return (
        <tr key={idx}>
          {copyData.map((col, _idx) => {
            return (
              <td key={_idx} title={item[col.value]}>
                {actionColumn.includes(col.value) ? (
                  <OverlayTrigger placement="top" overlay={showDetailTips}>
                    <Button
                      className={cs['action-button']}
                      onClick={this.showInnerModal.bind(this, true, item)}
                    >
                      <i className="fa fa-exclamation-circle" />
                    </Button>
                  </OverlayTrigger>
                ) : (
                  item[col.value]
                )}
              </td>
            );
          })}
        </tr>
      );
    }

    if (reportType !== 'Lots') {
      copyData = detailListColumns;
      return (
        <tr key={idx}>
          {copyData.map((col, _idx) => {
            return (
              <td key={_idx} title={item[col.value]}>
                {item[col.value]}
              </td>
            );
          })}
        </tr>
      );
    }
  };

  render() {
    const { show, onHide, detailList, showPage, innerDetailList } = this.props;
    const { activePage, showInnerModal, innerModalId } = this.state;
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
            <Pagination
              bsSize="small"
              items={detailList.pages}
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              activePage={activePage}
              onSelect={this.handleSelect}
            />
          ) : (
            undefined
          )}
          {showInnerModal ? (
            <InnerModal
              {...this.props}
              id={innerModalId}
              show={showInnerModal}
              innerDetailList={innerDetailList}
              outterDetailList={detailList}
              onHide={this.showInnerModal.bind(this, false, undefined)}
            />
          ) : (
            undefined
          )}
        </Modal.Body>
      </Modal>
    );
  }
}
