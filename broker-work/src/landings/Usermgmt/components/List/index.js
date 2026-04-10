import cls from 'utils/class';
import { getCountryObject } from 'utils/country';
import i18n from 'utils/i18n';
import { NavLink as Link, Route } from 'react-router-dom';
import UserLevelSelector from 'components/UserLevelSelector';
import { CardPanelWrapper } from 'components/CardPanel';
import UserDetails from '../../containers/UpdateUserCard';
import NoDataView from 'components/NoDataView';
import FieldSort from 'components/v2/FieldSort';
import { Content, Layout } from 'components/v2/PageWraper';
import PaginationBar from 'components/v2/PaginationBar';
import TransferModal from '../TransferModal';
import SendMessageModal from 'components/v2/SendMessageModal';
import TableConfig from './TableConfig';
import { Message } from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
const idForNames = [{ key: 'roleName', for: 'roleId' }];

import cs from './List.less';

let countryObject = getCountryObject();

export default class List extends PureComponent {
  state = {
    showUserLevelTreeModal: false,
    userLevelTreeDefaultValue: null,
    userLevelTreeData: null,
    showFieldSortModal: false,
    transferModalData: null,
    showTransferModal: false
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  parseList = () => {
    const { listColumns } = this.props;
    const copyData = JSON.parse(JSON.stringify(listColumns));
    copyData.forEach(item => {
      if (
        [
          'subUserCount',
          'createDate',
          'active',
          'ownAccounts',
          'ownCustomers'
        ].includes(item.key)
      ) {
        item.label = i18n[`usermgmt.table_header.${item.label}`];
      }
    });
    return copyData;
  };

  onSort = data => {
    const {
      saveFormSortColumns,
      showTopAlert,
      getListData,
      params,
      getListColumns
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));
    idForNames.forEach(id => {
      const idx = copyData.findIndex(col => col.key === id.key);

      if (idx !== -1) {
        copyData[idx].key = id.for;
      }
    });
    Promise.resolve(saveFormSortColumns(copyData, 't_user_profiles')).then(
      ({ result }) => {
        if (result) {
          showTopAlert({
            content: i18n['general.save_success'],
            bsStyle: 'success'
          });
          this.setState({
            showFieldSortModal: false
          });
        }
        getListColumns();
        getListData(params);
      }
    );
  };
  // transfer method
  transferUsers = () => {
    const { selectedUsers, getSuperiorUsers } = this.props;
    let errorMsg, levelId;
    for (let k in selectedUsers) {
      const item = selectedUsers[k];
      if (!levelId) levelId = item.levelId;
      //是否有未设置层级的用户
      if (!item.levelId || item.levelId === '0') {
        errorMsg = i18n['usermgmt.transfer.no_level'];
        break;
        //用户层级不同的情况
      } else if (item.levelId !== levelId) {
        errorMsg = i18n['usermgmt.transfer.different_level'];
        break;
      }
    }
    //弹出错误提示
    if (errorMsg) {
      Message.error(errorMsg);
      return;
    }
    getSuperiorUsers({
      type: 1,
      includeParent: true,
      id: levelId
    }).then(res => {
      if (res.result) {
        this.setState({
          showTransferModal: true,
          transferModalData: {
            levelId: levelId,
            selectedUsers
          }
        });
      }
    });
  };

  hideTransferModal = () => {
    this.setState({
      showTransferModal: false,
      transferModalData: null
    });
    this.toggleModal.bind(this, 'Transfer', false);
  };

  saveTransferUsers = id => {
    const {
      selectedUsers,
      saveTransferUsers,
      getListData,
      params,
      selectUser,
      showTopAlert
    } = this.props;
    if (!id) {
      Message.error(i18n['usermgmt.transfer.no_superior']);
      return;
    }
    const selectedUsersList = [];
    for (let k in selectedUsers) {
      selectedUsersList.push(selectedUsers[k]['id']);
    }
    saveTransferUsers(id, selectedUsersList).then(res => {
      if (!res.result) return Promise.resolve(res);
      const failData = _.get(res, 'data.fail', []);
      if (failData.length) {
        showTopAlert({
          title: i18n['usermgmt.transfer.warning'],
          content: (
            <FormattedMessage
              id="task.warning.info_exist.details"
              defaultMessage={i18n['usermgmt.transfer.warning_content']}
              values={{
                users: failData.map(u => selectedUsers[u].name).join(',')
              }}
            />
          )
        });
      }
      selectUser({});
      getListData(params);
      this.hideTransferModal();
    });
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
      authSetting,
      modifyAuthStatus,
      versionRights
    } = this.props;
    const {
      showUserLevelTreeModal,
      userLevelTreeData,
      userLevelTreeDefaultValue,
      showFieldSortModal,
      showSendMessageModal,
      showTransferModal,
      transferModalData
    } = this.state;
    // 检查国家代码是否已经成功载入，如果没有则重新加载
    if (!Object.keys(countryObject).length === 0)
      countryObject = getCountryObject();
    const I18nLiseColumns = this.parseList();
    return (
      <Layout footer>
        <Content table={data.length}>
          <TableConfig
            versionRights={versionRights}
            authSetting={authSetting}
            modifyAuthStatus={modifyAuthStatus}
            toggleModal={this.toggleModal}
            showUserLevelTree={this.showUserLevelTree}
            transferUsers={this.transferUsers}
            pager={
              data.length ? (
                <PaginationBar
                  {...paginationInfo}
                  onPageChange={this.modifyPagination}
                />
              ) : (
                undefined
              )
            }
            {...this.props}
          />
          {data.length ? undefined : <NoDataView />}
        </Content>
        {showFieldSortModal ? (
          <FieldSort
            title={i18n['general.data.table_sort_title']}
            sortable
            data={I18nLiseColumns}
            onSubmit={this.onSort}
            onHide={this.toggleModal.bind(this, 'FieldSort', false)}
          />
        ) : (
          undefined
        )}
        {showUserLevelTreeModal ? (
          <UserLevelSelector
            title={i18n['usermgmt.table_header.show_subordinate_user']}
            getData={getUserSubLevelUsers}
            initialData={userLevelTreeData}
            defaultValue={userLevelTreeDefaultValue}
            onHide={this.hideUserLevelTree}
            type="view"
          />
        ) : (
          undefined
        )}
        {showTransferModal ? (
          <TransferModal
            {...transferModalData}
            superiorUsers={superiorUsers}
            onHide={this.hideTransferModal}
            onSave={this.saveTransferUsers}
          />
        ) : (
          undefined
        )}
        {showSendMessageModal ? (
          <SendMessageModal
            onHide={this.toggleModal.bind(this, 'SendMessage', false)}
            messageTypes={typesOptions}
            selectedMessageObjects={selectedUsers}
            type={'user'}
            {...this.props}
          />
        ) : (
          undefined
        )}
        <Route
          path={`${match.url}/:userId`}
          children={props => (
            <CardPanelWrapper appear>
              {props.match && (
                <UserDetails
                  {...props}
                  parentUrl={match.url}
                  onSubmitUserInfo={this.updateUser}
                  type="edit"
                  header={i18n['usermgmt.card_header.update_user']}
                />
              )}
            </CardPanelWrapper>
          )}
        />
      </Layout>
    );
  }

  hideUserLevelTree = () => {
    this.setState({
      showUserLevelTreeModal: false,
      userLevelTreeData: null,
      userLevelTreeDefaultValue: null
    });
  };

  showUserLevelTree = item => {
    const initialData = [{ label: item.name, value: item.id, child: true }];
    this.setState({
      showUserLevelTreeModal: true,
      userLevelTreeData: initialData,
      userLevelTreeDefaultValue: initialData[0]
    });
  };

  updateUser = finallyData => {
    const { editUser, showTopAlert, getListData, params } = this.props;
    return editUser(finallyData).then(res => {
      if (!res.result) return Promise.resolve(res);
      showTopAlert({
        content: i18n['general.modify_success'],
        bsStyle: 'success'
      });
      getListData(params);
      return Promise.resolve({ result: true });
    });
  };

  componentDidMount() {
    const { getAllUser } = this.props;
    getAllUser();
  }
  //改变页码
  modifyPagination = v => {
    const { params, modifyParams, selectUser } = this.props;
    //翻页时，清除已经选择的项目
    selectUser({});
    modifyParams({
      ...params,
      size: v.pageSize,
      pageNo: v.pageNo
    });
  };
}
