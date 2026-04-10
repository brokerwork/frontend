import PaginationBar from 'components/v2/PaginationBar';
import i18n from 'utils/i18n';
import NoDataView from 'components/NoDataView';
import { Content, Layout } from 'components/v2/PageWraper';
import { Table as UiTable } from 'lean-ui';
import cs from './List.less';
import TextButton from 'components/v2/TextButton';
import { MESSAGE_TYPES_OBJECT } from '../../../../constant';

const { Td, Th } = UiTable;

const columns = [
  { key: 'title', name: i18n['message.subject'] },
  { key: 'fromName', name: i18n['message.sender'] },
  { key: 'type', name: i18n['message.send_message_type'] },
  { key: 'createDate', name: i18n['message.time'] }
];

export default class List extends PureComponent {
  _renderCellNew = ({ key, data, index, rowData, listData }) => {
    let content;

    switch (key) {
      case 'title':
        content = (
          <div
            className={`main-color ${cs['td-title']}`}
            onClick={this.onTitleClick.bind(this, rowData)}
          >
            {data}
          </div>
        );
        break;
      case 'fromName':
        content = <div className={cs['td']}>{data}</div>;
        break;
      case 'type':
        content = <div className={cs['td']}>{MESSAGE_TYPES_OBJECT[data]}</div>;
        break;
      case 'createDate':
        content = <div className={cs['td']}>{data}</div>;
        break;
    }
    return (
      <Td key={key} title={data}>
        {content}
      </Td>
    );
  };

  onTitleClick = item => {
    const { push, markAsRead } = this.props;
    // const { read } = item;
    // if (!read) {
    //   markAsRead([item.inboxId]).then(res => {
    //     if (!res.result) return Promise.resolve(res);
    //     push(`/msgmgmt/recyclebin/details/${item.id}`);
    //   });
    // } else {
    push(`/msgmgmt/recyclebin/details/${item.id}`);
    // }
  };

  onPageChange = ({ pageNo, pageSize }) => {
    const { searchParams, modifyParams } = this.props;
    modifyParams({
      ...searchParams,
      size: pageSize,
      page: pageNo
    });
  };

  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.toggleSelect(item, !event.target.checked);
    }
  };

  toggleSelectAll = evt => {
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    const { selectItem, data } = this.props;
    let map = {};
    if (isSelected) {
      data.forEach(o => {
        let id = o.id;
        map[id] = o;
      });
    }
    selectItem(map);
  };
  toggleSelect = (item, isSelected) => {
    let { id } = item;
    const { selectItem, selectedItem } = this.props;
    let map = Object.assign({}, selectedItem);
    if (!isSelected) {
      map[id] = item;
    } else {
      delete map[id];
    }
    selectItem(map);
  };

  removeSelectedConfirm = () => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['message.remove_tips_completely'],
      onConfirm: this.removeSelected
    });
  };

  removeSelected = cb => {
    const {
      selectedItem,
      removeMessageCompletely,
      searchParams: { queryType },
      searchParams,
      selectItem,
      getMessages,
      showTopAlert
    } = this.props;
    const selectedItems = Object.keys(selectedItem);
    const revertQueryType = queryType.replace('RECYCLE_', '');
    let inIds;
    if (revertQueryType === 'INBOX') {
      inIds = selectedItems.map(item => selectedItem[item]['inId']);
    }
    removeMessageCompletely(queryType, selectedItems, inIds).then(res => {
      if (!res.result) return Promise.resolve(res);
      showTopAlert({
        content: i18n['message.remove_success'],
        bsStyle: 'success'
      });
      // 清空已选择信息
      selectItem({});
      // 关闭提示框
      cb();
      // 刷新列表
      return getMessages(searchParams);
    });
  };

  // 还原
  revertMessage = () => {
    const {
      selectedItem,
      revertMessage,
      searchParams: { queryType },
      searchParams,
      getMessages,
      showTopAlert,
      selectItem
    } = this.props;
    const selectedItems = Object.keys(selectedItem);
    const revertQueryType = queryType.replace('RECYCLE_', '');
    let inIds;
    if (revertQueryType === 'INBOX') {
      inIds = selectedItems.map(item => selectedItem[item]['inId']);
    }
    revertMessage(revertQueryType, selectedItems, inIds).then(res => {
      if (!res.result) return Promise.resolve(res);
      showTopAlert({
        content: i18n['message.reduction_success'],
        bsStyle: 'success'
      });
      // 清空已选择信息
      selectItem({});
      // 刷新列表
      return getMessages(searchParams);
    });
  };

  renderBatchActions = () => {
    return (
      <div>
        <TextButton
          className={cs['button-cancel']}
          text={i18n['general.cancel']}
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        <TextButton
          text={i18n['message.remove_completely']}
          icon="delete-outline"
          onClick={this.removeSelectedConfirm}
        />
        <TextButton
          text={i18n['message.reduction']}
          icon="success-outline"
          onClick={this.revertMessage}
        />
      </div>
    );
  };

  render() {
    const { data, paginationInfo, selectedItem } = this.props;

    const selectedKeys = Object.keys(selectedItem);

    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'id',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };

    return (
      <Content table={true}>
        <UiTable
          data={data}
          columns={columns}
          fixedHeader
          renderCell={this._renderCellNew}
          rowSelectOptions={rowSelectOptions}
          // renderHeadCell={this.renderHeadCell}
        />
        {data.length ? undefined : <NoDataView />}
        {data.length ? (
          <PaginationBar
            total={paginationInfo.total}
            pageSize={paginationInfo.pageSize}
            pageNo={paginationInfo.pageNo}
            onPageChange={this.onPageChange}
          />
        ) : (
          undefined
        )}
      </Content>
    );
  }
}
