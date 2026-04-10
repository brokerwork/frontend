import ConditionFilter from 'components/v2/ConditionFilter';
import i18n from 'utils/i18n';
import {
  ADVANCED_SEARCH_CONFIG,
  ADVANCED_SEARCH_TYPE,
  MTG_RIGHTS,
  GRP_RIGHTS,
  ADVANCED_SEARCH_CONDITIONS
} from '../../constant';
import { dateRange } from 'utils/config';
import moment from 'moment';

export default class Conditions extends PureComponent {
  onAdvancedSearch = (data, logicType, viewId, resetType) => {
    const {
      modifyParams,
      privilegeType,
      params,
      updateFieldConditions
    } = this.props;
    const copyData = _.cloneDeep(data);
    if (resetType === 'reset') {
      copyData.push({
        key: 'objectType',
        type: 'equals',
        originValue: privilegeType[0],
        value: privilegeType[0].value
      });
    }
    Promise.resolve(updateFieldConditions(copyData)).then(() => {
      modifyParams({ ...params, pageNo: 1, conditions: copyData });
    });
  };
  injectDataToAdvancedSearchType = () => {
    const {
      privilegeType,
      getReportSubLevelUsers,
      userLevel,
      advanceResourceData,
      userRights,
      serverSymbols,
      currentServer,
      reportConfig,
      getTreeSearch,
      getSubTreeUsersById
    } = this.props;
    const { searchable = {}, reportType } = reportConfig;
    const defaultTypes = _.cloneDeep(ADVANCED_SEARCH_TYPE[reportType]);
    const showSearchable = Object.assign({}, searchable, {
      objectType: true,
      openTime: true
    });
    const types = defaultTypes.filter(type =>
      showSearchable.hasOwnProperty(type.value)
    );
    const searchType = types.find(item => item.value === 'objectType');
    if (searchType) {
      searchType.optionList = privilegeType;
      searchType.additions = searchType.additions || {};
      searchType.additions.getData = getReportSubLevelUsers;
      searchType.additions.onFilter = getTreeSearch;
      searchType.additions.searchable = true;
      searchType.additions.getSearchTree = getSubTreeUsersById;
    }
    const mtRight = MTG_RIGHTS.find(item => userRights[item]);
    const gtRight = GRP_RIGHTS.find(item => userRights[item]);
    types.forEach(item => {
      if (item.value in searchable) {
        item.label = searchable[item.value];
      }
      if (item.value === 'group' && mtRight) {
        const { mtGroup = [] } = advanceResourceData;
        item.optionList = mtGroup;
      }
      if (item.value === 'accountGroup' && gtRight) {
        const { accountGroup = [] } = advanceResourceData;
        item.optionList = accountGroup;
      }
      if (item.value === 'symbol') {
        item.optionList = serverSymbols;
      }
      if (item.value === 'leverage') {
        const { leverage = [] } = advanceResourceData;
        item.optionList = leverage;
      }
      // 如果存在权限 REPOPR_SELECT 则筛选时间最大范围为一年
      if (userRights['REPOPR_SELECT']) {
        if (
          item.fieldType === 'date' &&
          _.get(item, 'additions.dateLimit.months', 0)
        ) {
          _.set(item, 'additions.dateLimit.months', 12);
        }
      }
    });
    return types;
  };
  render() {
    const { searchFieldConditions, children } = this.props;
    const copyTypes = this.injectDataToAdvancedSearchType();
    return (
      <ConditionFilter.Container
        types={copyTypes}
        conditions={ADVANCED_SEARCH_CONDITIONS}
        onSearch={this.onAdvancedSearch}
        data={searchFieldConditions}
        {...ADVANCED_SEARCH_CONFIG}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
