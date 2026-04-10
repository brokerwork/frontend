import cs from './ActionBar.less';
import i18n from 'utils/i18n';
import { Icon, Button, Input, Breadcrumb } from 'lean-ui';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Summary } from 'components/v2/PageWraper';
import { CardPanelWrapper } from 'components/CardPanel';
import UpdateUserCard from '../../containers/UpdateUserCard';

export default class ActionsBar extends PureComponent {
  state = {
    //搜索文字条件
    queryContent: this.props.params.queryContent,
    showAddUserModal: false
  };
  componentDidMount() {
    const {
      getUserLevel,
      modifyParams,
      getPasswordStrength,
      getUserRole,
      getServerList,
      getUpdateUserLevel,
      getListColumns,
      getFormColumns,
      getAuthSetting
    } = this.props;
    getListColumns().then(() => {
      getAuthSetting();
    });
    getFormColumns();
    getUserLevel().then(res => {
      if (!res.result) return Promise.resolve(res);
      const { params } = this.props;
      const levelId = res.data[0].value;
      const __params = {
        ...params,
        levelId
      };
      modifyParams(__params);
      getServerList();
      getUpdateUserLevel();
      getUserRole();
      getPasswordStrength();
    });
  }

  onSearchTypeChange = item => {
    const { updateSearchType } = this.props;
    Promise.resolve(updateSearchType(item)).then(() => {
      this.getList();
    });
  };
  //新增客户
  addUser = finallyData => {
    const {
      addUser,
      showTopAlert,
      getListData,
      params,
      showTipsModal,
      checkSameLogin
    } = this.props;
    if (typeof finallyData['sendEmail'] === 'undefined') {
      finallyData['sendEmail'] = true;
    }
    return addUser(finallyData).then(res => {
      if (!res.result) return Promise.resolve(res);
      showTopAlert({
        content: i18n['general.save_success'],
        bsStyle: 'success'
      });
      getListData(params);
      this.toggleModal(false, 'AddUser');
      return Promise.resolve(res);
    });
  };

  onFuzzySearchTextChange = e => {
    this.setState({
      queryContent: e.target.value
    });
  };

  applySearchKey = e => {
    if (e.keyCode !== 13) return;
    const { modifyParams, params } = this.props;
    const { queryContent } = this.state;
    modifyParams({
      ...params,
      pageNo: 1,
      queryContent
    });
  };

  toggleModal = toggle => {
    this.setState({
      showAddUserModal: toggle
    });
  };

  render() {
    const {
      options,
      params,
      listUpdateTime,
      userRights,
      getUserSubLevelUsers,
      levelList,
      commissionShowStatus,
      paginationInfo,
      listColumns
    } = this.props;
    const { queryContent, showAddUserModal } = this.state;
    const sortLabel = (
      listColumns.find(item => item.key === params.sortby) || {}
    ).label;
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              fontType="bw"
              icon="user-color"
              className={`main-color ${cs['customer-icon']}`}
            />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  {i18n['navigation.user.module_name']}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ConditionFilter.ViewList />
            </div>
          </div>
          <Summary.Info
            total={paginationInfo.total}
            orderBy={
              params.sortby === 'createDate'
                ? i18n[`usermgmt.table_header.${sortLabel}`]
                : sortLabel
            }
            updateTime={listUpdateTime}
          />
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {userRights['USER_ADD'] && userRights['USER_ADD_BASIC'] ? (
              <Button
                onClick={this.toggleModal.bind(this, true)}
                type="primary"
              >
                <Icon icon={'add-outline'} />{' '}
                {i18n['usermgmt.card_header.add_user']}
              </Button>
            ) : (
              undefined
            )}
          </div>
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon icon="search" />}
              placeholder={i18n['usermgmt.fuzzy_search.placeholder']}
              value={queryContent}
              onChange={this.onFuzzySearchTextChange}
              onPressEnter={this.applySearchKey}
            />
          </div>
        </div>
        <CardPanelWrapper>
          {showAddUserModal ? (
            <UpdateUserCard
              onHide={this.toggleModal.bind(this, false)}
              type="add"
              onSubmitUserInfo={this.addUser}
              header={i18n['usermgmt.card_header.add_user']}
            />
          ) : (
            undefined
          )}
        </CardPanelWrapper>
      </div>
    );
  }
}
