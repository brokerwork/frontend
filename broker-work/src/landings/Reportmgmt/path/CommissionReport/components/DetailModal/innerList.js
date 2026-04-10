import Table from 'components/Table';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import PaginationBar from 'components/PaginationBar';
import { LOTS_DETAIL_TABLE } from '../../../../constant';

import cs from './DetailModal.less';

class InnerList extends PureComponent {
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

  handleSelect = pages => {
    const { onInnerSelect } = this.props;
    onInnerSelect(pages);
  };

  render() {
    const { innerDetailList } = this.props;
    return innerDetailList.list ? (
      <div>
        <Table className={`${cs['table']} ellipsis`}>
          <Table.Header>{this._renderTableHeader()}</Table.Header>
          <Table.Body>
            {innerDetailList.list &&
              innerDetailList.list.map(this._renderTableBodyRow)}
          </Table.Body>
        </Table>
        <PaginationBar
          simpleMode
          pageSize={innerDetailList.size}
          items={innerDetailList.pages}
          pageNo={innerDetailList.pager}
          total={innerDetailList.total}
          onPageChange={this.handleSelect}
        />
      </div>
    ) : null;
  }
}

export default InnerList;
