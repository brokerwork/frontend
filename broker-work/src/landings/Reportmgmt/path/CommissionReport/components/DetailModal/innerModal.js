import Table from 'components/Table';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import { Pagination } from 'react-bootstrap';
import { LOTS_DETAIL_TABLE } from '../../../../constant';

import cs from './DetailModal.less';

class InnerModal extends PureComponent {
  state = {
    activePage: this.props.innerDetailList.pager
  };

  //过滤手数和处理数问题
  filiterVolume = commissionReportList => {
    let copyData = LOTS_DETAIL_TABLE;
    const staStatus = commissionReportList['sta'];
    if (staStatus) {
      const volumeDisplayStatus = !staStatus['volume_display'];
      const openCloseVolumeDisplayStatus = !staStatus[
        'open_close_volume_display'
      ];
      copyData = copyData.filter(item => {
        let s = true;
        if (volumeDisplayStatus) {
          s = item.value !== 'close_volum';
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
    let copyData = LOTS_DETAIL_TABLE;
    return copyData.map((col, idx) => {
      return <th key={idx}>{col.label}</th>;
    });
  }

  _renderTableBodyRow = (item, idx) => {
    let copyData = LOTS_DETAIL_TABLE;
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
  };

  handleSelect = eventKey => {
    const {
      dateRange,
      currentServer,
      getInnerDetailList,
      objectType,
      reportType,
      currentObjectType,
      id,
      currentCommissionItemLogin
    } = this.props;
    const { startDate, endDate } = dateRange;
    Promise.resolve(
      getInnerDetailList({
        objectType:
          reportType === 'Lots' ? currentObjectType.value : objectType,
        reportType: 'LotsDetailOrder',
        searchStart: startDate ? startDate.format('YYYY-MM-DD') : null,
        searchEnd: endDate ? endDate.format('YYYY-MM-DD') : null,
        serverId: currentServer.value,
        id: id,
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

  render() {
    const { show, onHide, innerDetailList } = this.props;
    const { activePage } = this.state;
    return (
      <Modal backdrop="static" bsSize="large" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['report.commission_table_type.detail_second']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <Table className={`${cs['table']} ellipsis`}>
            <Table.Header>{this._renderTableHeader()}</Table.Header>
            <Table.Body>
              {innerDetailList.list &&
                innerDetailList.list.map(this._renderTableBodyRow)}
            </Table.Body>
          </Table>
          <Pagination
            bsSize="small"
            items={innerDetailList.pages}
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
        </Modal.Body>
      </Modal>
    );
  }
}

export default InnerModal;
