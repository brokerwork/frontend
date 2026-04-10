import {
  Table as UiTable,
  Icon,
  Popover,
  Menu,
  Message,
  Button
} from 'lean-ui';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import i18n from 'utils/i18n';
import SortToggle from 'components/v2/SortToggle';
import getFieldValue from 'utils/fieldValue';
import fieldToEditConfig from 'utils/fieldToEditConfig';
import { EDITABLE_FIELDS } from '../../constant';
import TextButton from 'components/v2/TextButton';
import { NavLink as Link, Route } from 'react-router-dom';
import OptionItem from './OptionItem';
import cs from './List.less';
import UserLevelSelector from 'components/v2/UserLevelSelector';

const { Td, Th } = UiTable;
const linkColumns = ['name'];
const sortFieldtoSortByMap = {
  entityNo: 'entityNo',
  name: 'name',
  createDate: 'createDate'
};

export default class TableConfig extends PureComponent {
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
    const { selectUser, data } = this.props;
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    let map = {};
    if (isSelected) {
      data.forEach(o => {
        let id = o.id;
        map[id] = o;
      });
    }
    selectUser(map);
  };
  toggleSelect = (item, isSelected) => {
    const { id } = item;
    const { selectedUsers, selectUser } = this.props;
    const __selectedUsers = Object.assign({}, selectedUsers);
    if (!isSelected) {
      __selectedUsers[id] = item;
    } else {
      delete __selectedUsers[id];
    }
    selectUser(__selectedUsers);
  };
  // 增加特殊有操作的行操作
  _columnsGenerator(userShowcolumns) {
    const { toggleModal, authSetting, versionRights } = this.props;
    const end = userShowcolumns.map(c => ({
      key: c.key,
      name: c.label,
      ...c
    }));
    if (authSetting && versionRights['SC_SECURITY_SET']) {
      end.push({
        key: 'twoFactorAuth',
        name: i18n['usermgmt.table_header.two_factor_auth']
      });
    }
    return [
      {
        key: 'actions',
        name: (
          <Icon
            className={cs['pop-btn']}
            icon="set-table-soild"
            onClick={toggleModal.bind(this, 'FieldSort', true)}
          />
        )
      },
      ...end
    ];
  }
  //delete method
  deleteUser = () => {
    const {
      selectedUsers,
      showTipsModal,
      removeUsers,
      getListData,
      params,
      selectUser,
      toggleModal
    } = this.props;
    showTipsModal({
      content: (
        <div className={cs['delete-tips-content']}>
          <i
            className={`fa fa-exclamation-triangle ${cs['delete-tips-icon']}`}
          />
          {i18n['usermgmt.delete_tips.content']}
        </div>
      ),
      header: i18n['general.confirm_remove'],
      onConfirm: cb => {
        const selectedUsersList = [];
        for (let k in selectedUsers) {
          selectedUsersList.push(selectedUsers[k]['id']);
        }
        removeUsers(selectedUsersList).then(res => {
          if (!res.result) return Promise.resolve(res);
          // 清空已选择列表
          if (res.result) {
            Message.success(i18n['general.remove_success']);
            selectUser({});
            //刷新列表
            getListData(params);
            //关闭提示框
            cb();
          }
        });
      }
    });
  };
  //改变排序
  modifySort = v => {
    const { params, modifyParams, selectUser } = this.props;
    const lastSort = params.sortby;
    const __obj = {};
    __obj['pageNo'] = 1;
    __obj['sortby'] = v;
    __obj['orderDesc'] = lastSort === v ? !params.orderDesc : false;
    selectUser({});
    modifyParams({
      ...params,
      ...__obj
    });
  };
  modifyLoginStatus(account, status) {
    const { modifyLoginStatus, getListData, params } = this.props;
    // const __account = encodeURIComponent(account);
    const __account = account;
    modifyLoginStatus(__account, !status).then(res => {
      if (!res.result) return Promise.resolve(res);
      getListData(params);
    });
  }
  modifyAuthStatus(account, pubUserId) {
    const { modifyAuthStatus, getListData, params, showTipsModal } = this.props;
    showTipsModal({
      header: i18n['usermgmt.double_auth.cancel.title'],
      content: i18n['usermgmt.double_auth.cancel.content'],
      onConfirm: cb => {
        modifyAuthStatus(pubUserId).then(res => {
          getListData(params);
          cb();
        });
      }
    });
  }
  // 单个操作的地方
  onActionsSelect = (user, { key }) => {
    const {
      selectUser,
      clearSuperiorUsers,
      toggleModal,
      transferUsers
    } = this.props;
    Promise.resolve(selectUser({ [user.id]: user })).then(res => {
      switch (key) {
        case 'delete':
          this.deleteUser();
          break;
        case 'transfer':
          clearSuperiorUsers();
          transferUsers();
          break;
        case 'sendMessage':
          toggleModal('SendMessage', true);
          break;
      }
    });
  };
  // 根据不同的多选操
  batchActions = type => {
    const { clearSuperiorUsers, toggleModal, transferUsers } = this.props;
    switch (type) {
      case 'delete':
        this.deleteUser();
        break;
      case 'transfer':
        clearSuperiorUsers();
        transferUsers();
        break;
      case 'sendMessage':
        toggleModal('SendMessage', true);
        break;
    }
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
        {userRights['USER_DELETE'] ? (
          <TextButton
            text={i18n['general.delete']}
            icon="delete-outline"
            onClick={this.batchActions.bind(this, 'delete')}
          />
        ) : (
          undefined
        )}
        {userRights['USER_MODIFY'] ? (
          <TextButton
            text={i18n['general.batch_transfer']}
            icon="transfer-outline"
            onClick={this.batchActions.bind(this, 'transfer')}
          />
        ) : (
          undefined
        )}
        {userRights['MESSAGE_SEND_OBJECT_BW'] ? (
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

  _renderCellNew = ({ key, data, index, rowData, listData }) => {
    return this._renderCellback(rowData, key, listData || {});
  };
  onFieldEdit = (source, key, value, cb) => {
    const { editUser, getListData, params } = this.props;
    const copyUserInfo = Object.assign(
      source,
      { [key]: value },
      { commissionAccountOp: 'NotChange' }
    );
    editUser(copyUserInfo).then(res => {
      if (res.result) {
        cb();
        Message.success(i18n['general.modify_success']);
        getListData(params);
      }
    });
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      params: { sortby, orderDesc }
    } = this.props;
    let name = [
      'subUserCount',
      'active',
      'ownAccounts',
      'ownCustomers',
      'createDate'
    ].includes(item.key)
      ? i18n[`usermgmt.table_header.${item.label}`]
      : item.name;
    return (
      <Th key={index} fixed={fixed}>
        {sortFieldtoSortByMap[item.key] ? (
          <SortToggle
            activeSort={sortby}
            orders={[true, false]}
            sortKey={sortFieldtoSortByMap[item.key]}
            activeOrder={orderDesc}
            onChange={this.modifySort}
          >
            {name}
          </SortToggle>
        ) : (
          name
        )}
      </Th>
    );
  };
  // 点击列表中的用户树筛选
  onTreeSubmit = value => {
    const { updateFieldConditions, modifyParams } = this.props;
    const newParams = {
      field: 'userSearchType',
      value: [value[0].value, value[1].value],
      condition: 'EQ',
      originValue: value
    };
    Promise.resolve(updateFieldConditions([newParams])).then(() => {
      const { params } = this.props;
      modifyParams({
        ...params,
        pageNo: 1
      });
    });
  };
  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, key, field) => {
    const {
      match: { url },
      userRights,
      optionsObject,
      showUserLevelTree,
      getUserSubLevelUsers
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
    const isSubUser = ['sub', 'subBelong'].includes(source.realOwnerType);
    switch (key) {
      case 'name':
        content = <Link to={`${url}/${source.id}`}>{source[key]}</Link>;
        title = source[key];
        break;
      case 'phones':
        title = content = source[key]['phoneStr'];
        break;
      case 'parent':
        title = content = optionsObject.superior[source[key]];
        break;
      case 'subUserCount':
        title = source[key];
        const initialData = [
          { label: source.name, value: source.id, child: true }
        ];
        content = showSubUserLink ? (
          // <a href="javascript:;" onClick={showUserLevelTree.bind(this, source)}>
          //   {source.subUserCount}
          // </a>
          <UserLevelSelector
            title={i18n['usermgmt.table_header.show_subordinate_user']}
            getData={getUserSubLevelUsers}
            initialData={initialData}
            defaultValue={initialData[0]}
            type="searchType"
            onSubmit={(data, isDirect) => {
              const selectItem = [
                isDirect
                  ? {
                      label: i18n['user_level_selector.direct'],
                      value: 'sub'
                    }
                  : {
                      label: i18n['user_level_selector.no_direct'],
                      value: 'subBelong'
                    },
                data
              ];

              this.onTreeSubmit(selectItem);
            }}
          >
            <a href="javascript:;">{source.subUserCount}</a>
          </UserLevelSelector>
        ) : (
          source.subUserCount || 0
        );
        break;
      case 'createDate':
        const createTime = source[key]
          ? moment(source[key]).format(dateTimeFormatStyle)
          : undefined;
        title = content = createTime;
        break;
      case 'active':
        content = userRights['USER_DISABLE'] ? (
          <div className={cs['popver-td']}>
            {source[key] === 1
              ? i18n['usermgmt.table_header.cell_actived']
              : i18n['usermgmt.table_header.cell_disabled']}
            <div className={cs['edit-container']}>
              <Button
                size="small"
                className={cs['actions-active-btn']}
                onClick={this.modifyLoginStatus.bind(
                  this,
                  source.id,
                  source[key]
                )}
              >
                {source[key] === 1
                  ? i18n['usermgmt.table_header.action_disable']
                  : i18n['usermgmt.table_header.action_active']}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {source[key] === 1
              ? i18n['usermgmt.table_header.cell_actived']
              : i18n['usermgmt.table_header.cell_disabled']}
          </div>
        );
        break;
      case 'twoFactorAuth':
        content = userRights['USER_DISABLE'] ? (
          <div className={cs['popver-td']}>
            {source[key]
              ? i18n['usermgmt.table_header.cell_actived']
              : i18n['usermgmt.table_header.cell_disabled']}
            {source[key] ? (
              <div className={cs['edit-container']}>
                <Button
                  size="small"
                  className={cs['actions-active-btn']}
                  onClick={this.modifyAuthStatus.bind(
                    this,
                    source.id,
                    source.pubUserId
                  )}
                >
                  {source[key]
                    ? i18n['usermgmt.table_header.action_disable']
                    : i18n['usermgmt.table_header.action_active']}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            {source[key] === 1
              ? i18n['usermgmt.table_header.cell_actived']
              : i18n['usermgmt.table_header.cell_disabled']}
          </div>
        );
        break;
      case 'levelId':
        title = content = optionsObject.level[source[key]];
        break;
      case 'region':
        const cityType = 'city';
        title = content = source[key]
          ? `${getFieldValue({ fieldType: cityType }, source[key])}`
          : '';
        break;
      case 'ownCustomers':
        title = source[key];
        content =
          (userRights['CUSTOMER_SELECT_ALL'] ||
            (isSubUser && userRights['CUSTOMER_SELECT_SUBORDINATE'])) &&
          source[key] > 0 ? (
            <a
              target="_blank"
              href={`/custommgmt/customers?userId=${source.id}&userName=${
                source.name
              }`}
            >
              {source[key]}
            </a>
          ) : (
            source[key] || 0
          );
        break;
      case 'ownAccounts':
        title = source[key];
        content =
          (userRights['ACCOUNT_SELECT_ALL'] ||
            (isSubUser && userRights['ACCOUNT_SELECT_SUBORDINATE'])) &&
          source[key] > 0 ? (
            <a
              target="_blank"
              href={`/accountmgmt?userId=${source.id}&userName=${source.name}`}
            >
              {source[key]}
            </a>
          ) : (
            source[key] || 0
          );
        break;
      case 'actions':
        content =
          userRights['USER_MODIFY'] ||
          userRights['MESSAGE_SEND_OBJECT_BW'] ||
          userRights['USER_DELETE'] ? (
            <OptionItem
              ref={this.getOptionItemRefs}
              userRights={userRights}
              onActionsSelect={this.onActionsSelect.bind(this, source)}
              onRemoveRef={this.onRemoveOptionRef}
            />
          ) : (
            undefined
          );
        break;
      default:
        if (field.optionList && field.fieldType === 'select') {
          title = content = getFieldValue(field, source[key]);
        } else {
          title = content = source[key];
        }
        break;
    }
    const editConfig = EDITABLE_FIELDS[key]
      ? fieldToEditConfig(
          field,
          source[key],
          this.onFieldEdit.bind(this, source, key)
        )
      : undefined;
    return (
      <Td
        key={key}
        editable={!!editConfig}
        fieldConfig={editConfig}
        className={
          ['twoFactorAuth', 'active'].includes(key) ? cs['active-actions'] : ''
        }
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
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
      data,
      params: { sortby, orderDesc },
      getUserSubLevelUsers,
      paginationInfo,
      selectedUsers,
      match,
      showlistColumns,
      typesOptions,
      superiorUsers,
      pager
    } = this.props;
    const selectedKeys = this.getKey(selectedUsers);
    const columns = this._columnsGenerator(showlistColumns);
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'id',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };
    return (
      <UiTable
        data={data}
        columns={columns}
        fixedHeader
        renderCell={this._renderCellNew}
        rowSelectOptions={rowSelectOptions}
        renderHeadCell={this.renderHeadCell}
        onTableScroll={this.onTableScroll}
        pager={pager}
        className={cs.table_list}
      />
    );
  }
}
