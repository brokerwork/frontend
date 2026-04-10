import ConditionFilter from 'components/v2/ConditionFilter';
import i18n from 'utils/i18n';
import {
  ADVANCED_SEARCH_CONFIG,
  OUTSTANDING_STATISTICAL_RANGE,
  OUTSTANDING_ADVANCED_SEARCH_TYPE
} from '../../constant';
import { ADVANCED_SEARCH_CONDITIONS } from '../../../../constant';
export default class Conditions extends PureComponent {
  onAdvancedSearch = (data, logicType, viewId, resetType) => {
    const {
      modifyParams,
      privilegeType,
      params,
      updateFieldConditions
    } = this.props;
    const copyData = _.cloneDeep(data);
    if (!viewId && resetType === 'reset') {
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
      getEarningSubLevelUsers,
      userLevel,
      getTreeSearch,
      getSubTreeUsersById,
      userRights
    } = this.props;
    const types = _.cloneDeep(OUTSTANDING_ADVANCED_SEARCH_TYPE);
    const searchType = types.find(item => item.value === 'objectType');
    const levelId = types.find(item => item.value === 'levelId');
    const isSubBelong = types.find(item => item.value === 'isSubBelong');
    if (searchType) {
      searchType.optionList = privilegeType;
      searchType.additions = searchType.additions || {};
      searchType.additions.getData = getEarningSubLevelUsers;
      searchType.additions.onFilter = getTreeSearch;
      searchType.additions.searchable = true;
      searchType.additions.getSearchTree = getSubTreeUsersById;
    }
    if (levelId) {
      levelId.optionList = userLevel;
    }
    if (isSubBelong) {
      isSubBelong.optionList = OUTSTANDING_STATISTICAL_RANGE;
    }
    // 如果存在权限 REPOPR_SELECT 则筛选时间最大范围为一年
    if (userRights['REPOPR_SELECT']) {
      // 筛选出时间控件
      types.forEach(item => {
        if (
          item.fieldType === 'date' &&
          _.get(item, 'additions.dateLimit.months', 0)
        ) {
          _.set(item, 'additions.dateLimit.months', 12);
        }
      });
    }
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
