import { dateTimeFormatStyle } from 'utils/config';
import i18n from 'utils/i18n';
import { NavLink as Link, Route } from 'react-router-dom';
import PaginationBar from 'components/v2/PaginationBar';
import SortToggle from 'components/v2/SortToggle';
import moment from 'moment';
import TextButton from 'components/v2/TextButton';
import cls from 'utils/class';
import cs from './index.less';
import { TW_USER_TABLE_FIELD, EDITABLE_FIELDS } from '../../constants';
import { Content, Layout } from 'components/v2/PageWraper';
import NoDataView from 'components/NoDataView';
import SendMessageModal from 'components/v2/SendMessageModal';
import OptionItem from './OptionItem';
import {
  Table as UiTable,
  Icon,
  Dropdown,
  Popover,
  Menu,
  Message,
  Button
} from 'lean-ui';
const { Td, Th } = UiTable;
const sortFieldtoSortByMap = {
  registerTime: 'registerTime',
  lastLoginTime: 'lastLoginTime'
};

export default class List extends PureComponent {
  state = {
    showSendMessageModal: false
  };
  selectAll = isAllseleced => {
    const { users, updateSelectedUsers, selectedUsers } = this.props;
    let _isAllSelected = isAllseleced;
    if (typeof isAllseleced === 'undefined') {
      _isAllSelected = users.every(user => selectedUsers[user.userNo]);
    }
    const _selecteds = _isAllSelected
      ? {}
      : users.reduce((map, user) => {
          map[user.userNo] = user;
          return map;
        }, {});
    updateSelectedUsers(_selecteds);
  };
  selectUser = user => {
    const { selectedUsers, updateSelectedUsers } = this.props;
    const copyData = Object.assign({}, selectedUsers);
    const id = user.userNo;
    if (copyData[id]) {
      delete copyData[id];
    } else {
      copyData[id] = user;
    }
    updateSelectedUsers(copyData);
  };
  modifyLoginStatus = (id, enable, restrictions = []) => {
    const { updateLoginStatus, showTipsModal } = this.props;
    if (restrictions.includes('LOGIN') && enable === true) {
      Message.error(i18n['tausermgmt.black_list.warn']);
    } else {
      this.update(id, enable);
    }
  };
  update = (id, enable) => {
    const { getUsers, params, updateLoginStatus } = this.props;
    updateLoginStatus(id, enable).then(res => {
      if (res.result) {
        Message.success(
          i18n[`tausermgmt.alert.${enable ? 'enable' : 'disable'}_success`]
        );
        getUsers(params);
      }
    });
  };
  modifyPagination = ({ pageNo, pageSize }) => {
    const { modifyParams, getUsers, params } = this.props;
    const _params = {
      ...params,
      page: pageNo,
      size: pageSize
    };
    modifyParams(_params);
    getUsers(_params);
  };
  modifySort = key => {
    const { params, modifyParams, getUsers } = this.props;
    const { sort, order } = params;
    const _order = key === sort && order === 'DESC' ? 'ASC' : 'DESC';
    const _sort = key;
    const _params = {
      ...params,
      sort: _sort,
      order: _order
    };
    modifyParams(_params);
    getUsers(_params);
  };
  componentDidMount() {
    const { getUsers, params } = this.props;
    getUsers(params);
  }
  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, key, field) => {
    const {
      match: { path },
      userRights,
      optionsObject
    } = this.props;
    const showSubUserLink =
      source.subUserCount > 0 &&
      ((userRights['USER_SELECT_SUBORDINATE'] &&
        userRights['USER_SELECT_ALL']) ||
        (userRights['USER_SELECT_DIRECTLY'] &&
          userRights['USER_SELECT_SUBORDINATE']));
    let content = null;
    let clickHandler = null;
    let title;
    switch (key) {
      case 'userNo':
        title = content = source[key];
        break;
      case 'realName':
        content = <Link to={`${path}/${source.userNo}`}>{source[key]}</Link>;
        title = source[key];
        break;
      case 'registerTime':
        title = content =
          source[key] && moment(source[key]).format(dateTimeFormatStyle);
        break;
      case 'lastLoginTime':
        title = content =
          source[key] && moment(source[key]).format(dateTimeFormatStyle);
        break;
      case 'accounts':
        title = content = source[key] && source[key].join(', ');
        break;
      case 'login_status':
        content = (
          <div className={cs['popver-td']}>
            {source.isEnable
              ? i18n['usermgmt.table_header.cell_actived']
              : i18n['usermgmt.table_header.cell_disabled']}
            {}
            <div className={cs['edit-container']}>
              <Button
                size="small"
                className={cs['actions-active-btn']}
                onClick={this.modifyLoginStatus.bind(
                  this,
                  source.userNo,
                  !source.isEnable,
                  source.restrictions
                )}
              >
                {source.isEnable
                  ? i18n['usermgmt.table_header.action_disable']
                  : i18n['usermgmt.table_header.action_active']}
              </Button>
            </div>
          </div>
        );
        break;
      case 'actions':
        content = (
          <OptionItem
            ref={this.getOptionItemRefs}
            userRights={userRights}
            onActionsSelect={this.onActionsSelect.bind(this, source)}
            onRemoveRef={this.onRemoveOptionRef}
          />
        );
        break;
      default:
        title = content = source[key];
        break;
    }
    return (
      <Td
        key={key}
        editable={false}
        className={key === 'active' ? cs['active-actions'] : ''}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };
  // 增加特殊有操作的行操作
  _columnsGenerator(columns) {
    const end = columns.map(c => ({
      key: c.key,
      name: c.label,
      ...c
    }));
    return [
      {
        key: 'actions',
        name: undefined
      },
      ...end
    ];
  }
  _renderCellNew = ({ key, data, index, rowData, listData }) => {
    return this._renderCellback(rowData, key, listData || {});
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      params: { sort, order }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {sortFieldtoSortByMap[item.key] ? (
          <SortToggle
            activeSort={sort}
            sortKey={sortFieldtoSortByMap[item.key]}
            activeOrder={order}
            onChange={this.modifySort}
          >
            {item.label}
          </SortToggle>
        ) : (
          item.label
        )}
      </Th>
    );
  };
  //选择用户
  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.toggleSelect(item, !event.target.checked);
    }
  };
  //全选和全不选
  toggleSelectAll = evt => {
    const { updateSelectedUsers, users } = this.props;
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    let map = {};
    if (isSelected) {
      users.forEach(o => {
        let id = o.userNo;
        map[id] = o;
      });
    }
    updateSelectedUsers(map);
  };
  toggleSelect = (item, isSelected) => {
    const { selectedUsers, updateSelectedUsers } = this.props;
    const __selectedUsers = Object.assign({}, selectedUsers);
    const id = item.userNo;
    if (!isSelected) {
      __selectedUsers[id] = item;
    } else {
      delete __selectedUsers[id];
    }
    updateSelectedUsers(__selectedUsers);
  };

  deleteUser = () => {
    const {
      selectedUsers,
      showTipsModal,
      deleteUsers,
      getUsers,
      params,
      updateSelectedUsers
    } = this.props;
    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        deleteUsers(Object.keys(selectedUsers)).then(res => {
          if (res.result) {
            Message.success(i18n['general.remove_success']);
            getUsers(params);
          }
        });
        cb();
        updateSelectedUsers({});
      }
    });
  };
  // 单个操作的地方
  onActionsSelect = (user, { key }) => {
    const { updateSelectedUsers } = this.props;
    Promise.resolve(updateSelectedUsers({ [user.userNo]: user })).then(res => {
      switch (key) {
        case 'delete':
          this.deleteUser();
          break;
        case 'sendMessage':
          this.toggleModal('SendMessage', true);
          break;
      }
    });
  };
  // 多选后出现的操作
  renderBatchActions = () => {
    const { userRights } = this.props;
    return (
      <div style={{ 'margin-left': '10px' }}>
        <TextButton
          text={i18n['customer.cancel']}
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        <TextButton
          text={i18n['general.delete']}
          icon="delete-outline"
          onClick={this.batchActions.bind(this, 'delete')}
        />
        {userRights['MESSAGE_SEND_OBJECT_TW'] ? (
          <TextButton
            text={i18n['general.send_message']}
            icon="chatdots-outline"
            onClick={this.batchActions.bind(this, 'sendMessage')}
          />
        ) : (
          undefined
        )}
      </div>
    );
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };
  // 根据不同的多选操
  batchActions = type => {
    const { clearSuperiorUsers } = this.props;
    switch (type) {
      case 'delete':
        this.deleteUser();
        break;
      case 'sendMessage':
        this.toggleModal('SendMessage', true);
        break;
    }
  };
  getKey = selectedUsers => {
    const selectedKeys = Object.keys(selectedUsers);
    let parseKey = [];
    selectedKeys.forEach(item => {
      parseKey.push(Number(item));
    });
    return parseKey;
  };

  options = new Set([]);
  getOptionItemRefs = r => {
    if (!r) {
      return;
    }

    this.options.add(r);
  };
  onRemoveOptionRef = ref => {
    this.options.delete(ref);
  };

  onTableScroll = () => {
    this.options.forEach(t => t.hidePopover());
  };

  render() {
    const {
      paginationInfo,
      users,
      selectedUsers,
      params,
      match,
      typesOptions
    } = this.props;
    const { showSendMessageModal } = this.state;
    const selectedAllStatus = users.every(user => selectedUsers[user.userNo]);
    const selectedKeys = this.getKey(selectedUsers);
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'userNo',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };
    const columns = this._columnsGenerator(TW_USER_TABLE_FIELD);
    return (
      <Layout footer>
        <Content table={users.length}>
          <UiTable
            data={users}
            columns={columns}
            fixedHeader
            renderCell={this._renderCellNew}
            rowSelectOptions={rowSelectOptions}
            renderHeadCell={this.renderHeadCell}
            onTableScroll={this.onTableScroll}
          />
          {users.length ? undefined : <NoDataView />}
        </Content>
        {users.length ? (
          <PaginationBar
            {...paginationInfo}
            onPageChange={this.modifyPagination}
          />
        ) : (
          undefined
        )}
        {showSendMessageModal ? (
          <SendMessageModal
            onHide={this.toggleModal.bind(this, 'SendMessage', false)}
            messageTypes={typesOptions}
            selectedMessageObjects={selectedUsers}
            type={'TwUser'}
            {...this.props}
          />
        ) : (
          undefined
        )}
      </Layout>
    );
  }
}
