import Create from '../../containers/Create';
import Server from '../../containers/Server';
import Search from '../../containers/Search';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Icon, Dropdown, Menu, Button, Input } from 'lean-ui';
import { Summary } from 'components/v2/PageWraper';
import NoticeBar from 'components/v2/NoticeBar';
import i18n from 'utils/i18n';
import {
  ADVANCED_SEARCH_CONFIG,
  ADVANCED_SEARCH_CONDITIONS
} from '../../constant';
import cs from './Actions.less';

export default class Actions extends PureComponent {
  onAdvancedSearch = (data, logicType, originData, isUpdate) => {
    const {
      updateSearchLogicType,
      updateCondition,
      updateFieldConditions,
      onChange
    } = this.props;
    Promise.all([
      updateFieldConditions(originData),
      updateSearchLogicType(logicType),
      isUpdate && updateCondition('')
    ]).then(() => {
      onChange();
    });
  };

  onConditionChange = selected => {
    const { updateCondition } = this.props;

    updateCondition(selected);
  };
  //刷新列表按钮
  refresh = () => {
    const { reload } = this.props;
    reload();
  };

  render() {
    const {
      onChange,
      reload,
      currentServer,
      advancedSearchTypes,
      searchCondition,
      rights,
      fieldConditions,
      searchLogicType,
      currentPagination,
      listUpdateTime,
      orderBy,
      updateSelectedAccountIds,
      getSimpleUserList
    } = this.props;
    const props = {
      onChange,
      reload,
      updateSelectedAccountIds
    };
    // 账户的视图模版需要根据serverid来查，所有这里重写一下config 里的 searchtype
    let searchType = ADVANCED_SEARCH_CONFIG.searchType;
    if (currentServer && currentServer.serverId !== undefined) {
      searchType = `${searchType}_${currentServer.serverId}`;
    }
    return (
      <div className={cs['actions-bar']}>
        <NoticeBar>
          <b>{i18n['banner_notice.notice']}</b>{' '}
          <span>{i18n['account.banner_notice']}</span>
        </NoticeBar>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              fontType="bw"
              icon="account-color"
              className={`main-color ${cs['customer-icon']}`}
            />
            <div className={cs['module-info']}>
              <Server onChange={reload} />
              <ConditionFilter.ViewList
                onChange={onChange}
                searchType={searchType}
                getData={getSimpleUserList}
                showSearch={true}
                subBelong={true}
                dataType="Account"
              />
            </div>
          </div>
          <Summary.Info
            total={currentPagination.total}
            orderBy={orderBy.name}
            updateTime={listUpdateTime}
            children={
              <Icon
                className={`${cs['refresh-icon']} main-color`}
                icon="refresh"
                onClick={this.refresh}
                fontType={'bw'}
              />
            }
          />
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {rights.create ? <Create {...props} /> : undefined}
          </div>
          <div className={cs['search-input']}>
            <Search {...props} />
          </div>
        </div>
      </div>
    );
  }
}
