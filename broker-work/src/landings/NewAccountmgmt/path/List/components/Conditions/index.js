import ConditionFilter from 'components/v2/ConditionFilter';
import {
  ADVANCED_SEARCH_CONFIG,
  assetsColumns,
  mtColums,
  otherAccountColums,
  grpColums,
  leverageColums
} from '../../constant';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import _ from 'lodash';
import getQueryString from 'utils/queryString';
import { getType } from 'utils/language';

export default class Condition extends PureComponent {
  getList = () => {
    const { onChange } = this.props;
    onChange();
  };

  onAdvancedSearch = (data, logicType, viewId = '', resetType) => {
    const {
      updateSearchDate,
      updateDateRange,
      updateSearchLogicType,
      updateFieldConditions,
      updateCondition,
      privilegeTypeList,
      location: { state, search },
      history: { replace },
      match: { url }
    } = this.props;
    let copyData = _.cloneDeep(data);
    if (resetType === 'reset') {
      replace({ pathname: `${url}`, state: { ...state } });
    }
    if (!viewId && resetType === 'reset') {
      copyData.push({
        field: 'userSearchType',
        condition: 'EQ',
        originValue: [privilegeTypeList[0]],
        value: privilegeTypeList[0].value
      });
    }
    if (search && resetType !== 'reset') {
      const searchInfo = getQueryString(search);
      const userId = searchInfo.get('userId') || '';

      if (userId) {
        const searchValue = searchInfo.get('userName');
        let copyItem = [
          {
            field: 'userId',
            condition: 'EQ',
            value: userId,
            originValue: { label: searchValue, value: userId }
          }
        ];
        copyData = copyData.concat(copyItem);
      }
    }
    Promise.all([
      updateFieldConditions(copyData),
      updateSearchLogicType(logicType),
      updateCondition(viewId)
    ]).then(() => {
      this.getList();
    });
  };

  injectDataToAdvancedSearchType = () => {
    const {
      advancedSearchTypes,
      privilegeTypeList,
      getUserSubLevelUsers,
      rights: { privilege },
      accountColumns,
      currentServer,
      versionRights,
      accountTypes
    } = this.props;
    const types = deepCopy(advancedSearchTypes);
    const searchType = types.find(item => item.value === 'userSearchType');
    if (searchType) {
      searchType.optionList = privilegeTypeList;
      searchType.additions = searchType.additions || {};
      searchType.additions.getData = getUserSubLevelUsers;
    }
    let endSearchType = types;
    // 若没有权限 则不显示筛选项
    if (!privilege.balance) {
      endSearchType = endSearchType.filter(
        col => !assetsColumns.includes(col.value)
      );
    }
    if (!privilege.group) {
      endSearchType = endSearchType.filter(
        col => !mtColums.includes(col.value)
      );
    }
    if (!privilege.accountInfo) {
      // 账户信息需要隐藏字段
      let accountBox = accountColumns
        .filter(v => !v.sysDefault)
        .map(item => item.key);
      accountBox = [...accountBox, ...otherAccountColums];
      endSearchType = endSearchType.filter(
        col => !accountBox.includes(col.value)
      );
    }
    if (!privilege.accountGroup) {
      endSearchType = endSearchType.filter(
        col => !grpColums.includes(col.value)
      );
    }
    if (!privilege.leverage) {
      endSearchType = endSearchType.filter(
        col => !leverageColums.includes(col.value)
      );
    }
    // 服务器为ctrader 不显示登陆状态和交易状态
    if (currentServer.vendor === 'CTRADER') {
      endSearchType = endSearchType.filter(
        col => !['enable', 'readOnly'].includes(col.value)
      );
      const group = _.find(endSearchType, { key: 'accountInfo.group' });
      if (group)
        group.label = i18n['account.advanced_search.field.group_cbroker'];
    }
    if (!versionRights['SC_CUSTOM_ACCOUNT_TYPE']) {
      endSearchType = endSearchType.filter(
        col => col.value !== 'customAccountType'
      );
    } else {
      const item = _.find(endSearchType, { value: 'customAccountType' });
      // 依云的要求是把所有的数据都显示
      item.optionList = accountTypes['all'];
    }
    return endSearchType;
  };
  render() {
    const {
      advancedSearchConditions,
      fieldConditions,
      children,
      searchCondition,
      currentServer
    } = this.props;
    // 账户的视图模版需要根据serverid来查，所有这里重写一下config 里的 searchtype
    let searchType = ADVANCED_SEARCH_CONFIG.searchType;
    if (currentServer && currentServer.serverId !== undefined) {
      searchType = `${searchType}_${currentServer.serverId}`;
    }
    return (
      <ConditionFilter.Container
        types={this.injectDataToAdvancedSearchType()}
        conditions={advancedSearchConditions}
        onSearch={this.onAdvancedSearch}
        data={fieldConditions}
        viewId={searchCondition}
        {...ADVANCED_SEARCH_CONFIG}
        searchType={searchType}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
