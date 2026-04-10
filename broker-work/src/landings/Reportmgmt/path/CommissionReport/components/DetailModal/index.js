import Table from 'components/Table';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import { Pagination, Tooltip, Button, OverlayTrigger } from 'react-bootstrap';
import InnerModal from './innerModal';
import InnerList from './innerList';
import { LOTS_DETAIL } from '../../../../constant';

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
    itemId: '',
    detailListState: this.detailListFormat(this.props.detailList.list),
    innerDetailList: {}
  };

  detailListFormat(list) {
    return list.map(val => ({
      ...val,
      foldOpen: false
    }));
  }

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
        ['Lots', 'CommissionCharge'].includes(reportType) ? currentObjectType.value : objectType,
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

  onFoldClick(item) {
    const { detailListState } = this.state;
    if (!item['foldOpen']) {
      this.requestInnerDetail({
        itemId: item.id
      }).then(res => {
        this.setState({
          detailListState: detailListState.map(val => {
            return Object.assign({}, val, {
              foldOpen: item.id === val.id
            });
          }),
          itemId: item.id,
          innerDetailList: res.result ? res.data : {}
        });
      });
    } else {
      this.setState({
        itemId: item.id,
        detailListState: detailListState.map(val => {
          return {
            ...val,
            foldOpen: item.id === val.id ? false : val.foldOpen
          };
        })
      });
    }
  }

  requestInnerDetail(options) {
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
    const { itemId } = this.state;
    let opts = Object.assign(
      {},
      {
        objectType:
        ['Lots', 'CommissionCharge'].includes(reportType) ? currentObjectType.value : objectType,
        reportType: reportType === 'Lots' ? 'LotsDetailOrder' : 'CommissionChargeDetailOrder',
        searchStart: startDate ? startDate.format('YYYY-MM-DD') : null,
        searchEnd: endDate ? endDate.format('YYYY-MM-DD') : null,
        serverId: currentServer.value,
        id: options.itemId || itemId,
        login: currentCommissionItemLogin
      },
      options
    );
    return getInnerDetailList(opts);
  }

  onInnerSelect(pages) {
    this.requestInnerDetail({
      nowPage: pages.pageNo,
      pageSize: pages.pageSize
    }).then(res => {
      this.setState({
        innerDetailList: res.result ? res.data : {}
      });
    });
  }

  _renderTableBodyRow = (item, idx) => {
    const self = this;
    const { detailListColumns, detailList, reportType } = this.props;
    let copyData = [];
    function _itemRnder(col) {
      if (col.value === 'fold') {
        return (
          <Button
            data-test={`foldButton`}
            className={`icon ${cs['icon-btn']} ${item[
              'foldOpen'
            ]} ? 'active' : ''}`}
            onClick={() => this.onFoldClick(item)}
          >
            <i className={`fa fa-${item['foldOpen'] ? 'minus' : 'plus'}`} />
          </Button>
        );
      }
      return item[col.value];
    }
    const { innerDetailList } = this.state;
    copyData = this.filiterVolume(detailList);
    return [
      <tr key={idx}>
        {copyData.map((col, _idx) => {
          return (
            <td key={_idx} title={col.value}>
              {col.value === 'fold' ? (
                <Button
                  data-test="foldButton"
                  className={`icon ${cs['icon-btn']} ${item[
                    'foldOpen'
                  ]} ? 'active' : ''}`}
                  onClick={() => this.onFoldClick(item)}
                >
                  <i
                    className={`fa fa-${item['foldOpen'] ? 'minus' : 'plus'}`}
                  />
                </Button>
              ) : (
                item[col.value]
              )}
            </td>
          );
        })}
      </tr>,
      <tr>
        {item['foldOpen'] ? (
          <td
            colSpan="8"
            data-test="foldInnerList"
            style={{ maxWidth: 'none' }}
          >
            <InnerList
              {...this.props}
              innerDetailList={innerDetailList}
              outterDetailList={detailList}
              onInnerSelect={this.onInnerSelect.bind(this)}
            />
          </td>
        ) : null}
      </tr>
    ];
  };

  render() {
    const { show, onHide, detailList, showPage, innerDetailList } = this.props;
    const { activePage, detailListState } = this.state;
    return (
      <Modal
        backdrop="static"
        bsSize="large"
        show={show}
        onHide={onHide}
        data-test="commissionModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['report.commission_table_type.detail_first']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <Table className={`${cs['table']} ellipsis`}>
            <Table.Header>{this._renderTableHeader()}</Table.Header>
            <Table.Body>
              {detailListState && detailListState.map(this._renderTableBodyRow)}
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
        </Modal.Body>
      </Modal>
    );
  }
}
