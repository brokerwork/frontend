import PaginationBar from 'components/v2/PaginationBar';
import i18n from 'utils/i18n';
import NoDataView from 'components/NoDataView';
import { Content, Layout } from 'components/v2/PageWraper';
import { Table as UiTable, Button, Dialog } from 'lean-ui';
import cs from './List.less';
import TextButton from 'components/v2/TextButton';
import DropdownForCode from 'components/v2/DropdownForCode';
import {
  MESSAGE_STATUS,
  getToUserValue,
  MESSAGE_TYPES_OBJECT
} from '../../../../constant';

const { Td, Th } = UiTable;

const columns = [
  { key: 'title', name: i18n['message.subject'] },
  { key: 'toName', name: i18n['message.recipient'] },
  { key: 'type', name: i18n['message.send_message_type'] },
  { key: 'createDate', name: i18n['message.time'] },
  { key: 'status', name: i18n['message.status'] },
  { key: 'operation', name: i18n['message.operation'] }
];

export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showResendMessageData: null
    };
  }

  componentDidMount() {
    const { getAvaliableEmails } = this.props;
    getAvaliableEmails();
  }

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
      case 'toName':
        content = <div className={cs['td']}>{getToUserValue(rowData)}</div>;
        break;
      case 'type':
        content = <div className={cs['td']}>{MESSAGE_TYPES_OBJECT[data]}</div>;
        break;
      case 'createDate':
        content = <div className={cs['td']}>{data}</div>;
        break;
      case 'status':
        let className = data;
        console.log(1, className);
        content = (
          <div className={`${cs['status']} ${cs[className]}`}>
            {MESSAGE_STATUS[data]}
          </div>
        );
        break;
      case 'operation':
        content = (
          <Button
            type="primary"
            size="small"
            disabled={rowData.status === 'STATUS_SUCCESS'}
            onClick={this.resendMessageModal.bind(this, rowData)}
          >
            {i18n['message.resend_message']}
          </Button>
        );
        break;
    }
    return (
      <Td key={key} title={data}>
        {content}
      </Td>
    );
  };

  onTitleClick = item => {
    const { push } = this.props;

    push(`/msgmgmt/outbox/details/${item.id}`);
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
      content: i18n['message.remove_tips'],
      onConfirm: this.removeSelected
    });
  };

  removeSelected = cb => {
    const {
      selectedItem,
      showTopAlert,
      selectItem,
      removeMessage,
      getMessages,
      searchParams
    } = this.props;
    const selectedItems = Object.keys(selectedItem);
    const inIds = selectedItems.map(item => selectedItem[item]['inId']);
    removeMessage(selectedItems, inIds).then(res => {
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

  renderBatchActions = () => {
    return (
      <div>
        <TextButton
          className={cs['button-cancel']}
          text={i18n['general.cancel']}
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        <TextButton
          text={i18n['general.delete']}
          icon="delete-outline"
          onClick={this.removeSelectedConfirm}
        />
      </div>
    );
  };

  resendMessageModal(item) {
    this.setState({
      showResendMessageData: {
        messagId: item.id,
        type: item.type,
        reason: item.error
      }
    });
  }

  modifyResendEmail = v => {
    const { showResendMessageData } = this.state;
    this.setState({
      showResendMessageData: {
        ...showResendMessageData,
        email: v
      }
    });
  };

  resendEmail = () => {
    const { messagId, email } = this.state.showResendMessageData;
    const { resendEmail, showTopAlert, getMessages, searchParams } = this.props;
    if (!email) {
      showTopAlert({
        content: i18n['message.select_outbox_please']
      });
      return;
    }
    resendEmail(messagId, email).then(res => {
      if (!res) return Promise.resolve(res);
      showTopAlert({
        content: i18n['message.status.STATUS_SUCCESS'],
        bsStyle: 'success'
      });
      this.hideRsendMessageModal();
      getMessages(searchParams);
    });
  };
  hideRsendMessageModal = () => {
    this.setState({
      showResendMessageData: null
    });
  };

  render() {
    const { data, paginationInfo, selectedItem, avaliableEmails } = this.props;

    const selectedKeys = Object.keys(selectedItem);

    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'id',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };

    const { showResendMessageData } = this.state;

    return (
      <div>
        <Content table={true}>
          <div>
            <UiTable
              data={data}
              columns={columns}
              fixedHeader
              renderCell={this._renderCellNew}
              rowSelectOptions={rowSelectOptions}
              // renderHeadCell={this.renderHeadCell}
            />
          </div>
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

        <Dialog
          title={i18n['customer.contacts_module.edit_contacts_title']}
          visible={!!showResendMessageData}
          onCancel={this.hideRsendMessageModal}
          footer={
            <div>
              <Button bsStyle="primary" onClick={this.resendEmail}>
                {i18n['general.apply']}
              </Button>
              <Button bsStyle="default" onClick={this.hideRsendMessageModal}>
                {i18n['general.cancel']}
              </Button>
            </div>
          }
        >
          <div className={cs['failure-reason']}>
            <span className={cs['failure-reason-label']}>
              {i18n['message.failure_reason']}:
            </span>
            {!!showResendMessageData ? showResendMessageData.reason : undefined}
          </div>
          {!!showResendMessageData && showResendMessageData.type !== 'MAIL' ? (
            <div>{i18n['message.resend_tips']}</div>
          ) : (
            <div>
              <div className={cs['resend-email-tips']}>
                {i18n['message.resend_mail_tips']}
              </div>
              <div className={cs['resend-email']}>
                <div className={cs['resend-email-label']}>{`${
                  i18n['message.select_outbox']
                }:`}</div>
                <div>
                  <DropdownForCode
                    defaultSelect
                    autoWidth
                    data={avaliableEmails}
                    value={
                      !!showResendMessageData
                        ? showResendMessageData.email
                        : undefined
                    }
                    onChange={this.modifyResendEmail}
                  />
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    );
  }
}
