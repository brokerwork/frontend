import i18n from 'utils/i18n';
import DropdownForCode from 'components/v2/DropdownForCode';
import { Button, Table as UiTable, Dialog, Message } from 'lean-ui';
import { ADMIN_LIST_HEADER, SEARCH_TYPES } from '../../../constants';
const { Td, Th } = UiTable;
import cs from './AdminModal.less';

export default class AdminModal extends PureComponent {
  state = {
    showAddAdminButton: true,
    nodataShow: ''
  };
  changeSearchPanel = () => {
    const { updateTausers, searchTypes, modifyParams, taParams } = this.props;
    if (this.state.showAddAdminButton) {
      updateTausers([]);
      modifyParams({
        ...taParams,
        type: searchTypes[0] && searchTypes[0].value,
        value: ''
      });
    }
    this.setState({
      showAddAdminButton: !this.state.showAddAdminButton,
      nodataShow: ''
    });
  };
  updateAdmin = (item, type) => {
    const { updateAdmin, getAdminList, showTipsModal } = this.props;
    const data = {
      userNo: item.userNo,
      isCommentAdmin: type === 'add'
    };
    if (type !== 'add') {
      showTipsModal({
        content: i18n['video.video_root.delete_tips'],
        onConfirm: cb => {
          Promise.resolve(updateAdmin(data)).then(res => {
            if (res.result) {
              Message.success(i18n['general.remove_success']);
              getAdminList();
              cb();
            }
          });
        }
      });
    } else {
      Promise.resolve(updateAdmin(data)).then(res => {
        if (res.result) {
          Message.success(i18n['general.create_success']);
          getAdminList();
        }
      });
    }
  };
  componentDidMount() {
    const { searchTypes, modifyParams, taParams } = this.props;
    modifyParams({
      ...taParams,
      type: searchTypes[0] && searchTypes[0].value
    });
  }
  modifyParams = (isGetUsers, key, value) => {
    const { taParams, modifyParams } = this.props;
    let __obj = {};

    //时间范围改变
    if (key === 'date') {
      __obj = value;
    } else if (key === 'value') {
      __obj = {
        value: value.target.value
      };
    } else {
      __obj = {
        [key]: value
      };
    }

    modifyParams({
      ...taParams,
      ...__obj,
      page: 1
    });
  };
  searchTaUser = () => {
    const { getTaUsers, taParams } = this.props;
    if (taParams.value) {
      Promise.resolve(getTaUsers(taParams)).then(({ data }) => {
        if (data.list.length === 0) {
          this.setState({
            nodataShow: i18n['video.action_bar.no_data_show']
          });
        } else {
          this.setState({
            nodataShow: ''
          });
        }
      });
    }
  };

  _renderDelAdminCellback = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData['value'];
    switch (key) {
      case 'actions':
        content = (
          <Button
            className="icon"
            onClick={this.updateAdmin.bind(this, rowData, 'del')}
          >
            <i className="fa fa-times" />
          </Button>
        );
        break;
      default:
        title = content = rowData[key];
        break;
    }
    return (
      <Td
        key={key}
        className={key === 'active' ? cs['active-actions'] : ''}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };
  _renderAddAdminCellback = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData['value'];
    switch (key) {
      case 'actions':
        content = (
          <Button
            type="primary"
            className="icon"
            onClick={this.updateAdmin.bind(this, rowData, 'add')}
          >
            <i className="fa fa-plus" />
          </Button>
        );
        break;
      default:
        title = content = rowData[key];
        break;
    }
    return (
      <Td
        key={key}
        className={key === 'active' ? cs['active-actions'] : ''}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };
  renderAdminHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  render() {
    const { onHide, taParams, taUsers, adminList } = this.props;
    const { showAddAdminButton, nodataShow } = this.state;
    return (
      <Dialog
        title={i18n['video.action_bar.button_admin']}
        className={cs['body']}
        visible={true}
        onCancel={onHide}
        footer={
          <Button className={cs['tool-item']} onClick={onHide}>
            {i18n['general.close']}
          </Button>
        }
      >
        <div className="form-horizontal">
          <div className={cs['bottom-part']}>
            {showAddAdminButton ? (
              <div>
                <Button
                  type="primary"
                  className={cs['tool-item']}
                  onClick={this.changeSearchPanel}
                >
                  <i className={'fa fa-plus'} />
                  {i18n['video.action_bar.bw.add_admin_button']}
                </Button>
                <span>({i18n['video.action_bar.bw.add_admin_limit']})</span>
              </div>
            ) : (
              <div className={cs['search-type-box']}>
                <DropdownForCode
                  icon="fa fa-angle-down"
                  buttonClassName={cs['dropdown-right-radius']}
                  value={taParams.type}
                  data={SEARCH_TYPES}
                  onChange={this.modifyParams.bind(this, false, 'type')}
                />
                <input
                  onChange={this.modifyParams.bind(this, false, 'value')}
                  onKeyUp={this.applySearchKey}
                  value={taParams.value}
                  type="text"
                  placeholder={i18n['account.search.placeholder']}
                  className={`form-control search-input ${cs['key']}`}
                />
                <Button
                  type="primary"
                  className={cs['tool-item']}
                  onClick={this.searchTaUser}
                >
                  {i18n['account.search.placeholder']}
                </Button>
                <Button
                  className={cs['tool-item']}
                  onClick={this.changeSearchPanel}
                >
                  {i18n['general.cancel']}
                </Button>
              </div>
            )}
            {taUsers.length > 0 && !showAddAdminButton ? (
              <UiTable
                data={taUsers}
                columns={ADMIN_LIST_HEADER}
                renderCell={this._renderAddAdminCellback}
                renderHeadCell={this.renderAdminHeadCell}
              />
            ) : (
              <div className={cs['no-data-show']}>{nodataShow}</div>
            )}
          </div>
          {showAddAdminButton ? (
            <div className={cs['top-part']}>
              <UiTable
                data={adminList}
                columns={ADMIN_LIST_HEADER}
                renderCell={this._renderDelAdminCellback}
                renderHeadCell={this.renderAdminHeadCell}
              />
            </div>
          ) : (
            undefined
          )}
        </div>
      </Dialog>
    );
  }
}
