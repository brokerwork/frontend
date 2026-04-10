import ConditionFilter from 'components/v2/ConditionFilter';
import i18n from 'utils/i18n';
import _ from 'lodash';
import TableType, {
  ADVANCED_SEARCH_CONFIG,
  COMMISSION_TYPE_FLAG
} from '../../constants';
import { dateRange } from 'utils/config';
import { ADVANCED_SEARCH_CONDITIONS } from '../../../../constant';
export default class Conditions extends PureComponent {
  onAdvancedSearch = (data, logicType, viewId, resetType) => {
    const {
      modifyParams,
      objectType,
      params,
      match: { params: { type } = {} },
      updateFieldConditions
    } = this.props;
    const copyData = _.cloneDeep(data);
    if (!viewId && resetType === 'reset') {
      copyData.push({
        key: 'objectType',
        type: 'equals',
        originValue: objectType[0],
        value: objectType[0].value
      });
    }
    this.props.checkFailNum(copyData);
    Promise.resolve(updateFieldConditions(copyData)).then(() => {
      modifyParams({ ...params, nowPage: 1, conditions: copyData });
    });
  };
  injectDataToAdvancedSearchType = () => {
    const {
      advancedSearchType,
      objectType,
      getComissionSubLevelUsers,
      currentCommissionReportType,
      brandInfo,
      getTreeSearch,
      getSubTreeUsersById,
      searchFieldConditions,
      userRights
    } = this.props;
    let types = _.cloneDeep(advancedSearchType);
    const searchType = types.find(item => item.value === 'objectType');
    const status = types.find(item => item.value === 'status');
    const rebateType = types.find(item => item.value === 'rebate_type');
    const scope = types.find(item => item.value === 'scope');

    // 新版报表
    const newRebateType = types.find(item => item.value === 'rebateType');
    if (brandInfo.mode === 'DISTRIBUTION') {
      types = types.filter(item => item.value !== 'rebate_type');
    }
    if (searchType) {
      searchType.optionList = objectType;
      searchType.additions = searchType.additions || {};
      searchType.additions.getData = getComissionSubLevelUsers;
      searchType.additions.onFilter = getTreeSearch;
      searchType.additions.searchable = true;
      searchType.additions.getSearchTree = getSubTreeUsersById;
    }
    if (status) {
      status.optionList =
        TableType[`${currentCommissionReportType.value.toUpperCase()}_FLAG`];
    }
    if (scope) {
      scope.optionList =
        TableType[`${currentCommissionReportType.value.toUpperCase()}_FLAG`];
    }
    if (rebateType) {
      rebateType.optionList = COMMISSION_TYPE_FLAG;
    }
    // 新版报表
    if (newRebateType) {
      newRebateType.optionList = COMMISSION_TYPE_FLAG;
    }
    // 状态为失败的情况时间可选全部
    if (
      searchFieldConditions.find(
        el => el.key === 'status' && el.value === 'failed'
      )
    ) {
      types.find(el => el.fieldType === 'date').additions.ranges[
        i18n['general.date_range_picker.option.all']
      ] = dateRange.all;
    } else {
      //   delete types.find(el => el.fieldType === 'date').additions.ranges[
      //     i18n['general.date_range_picker.option.all']
      //   ];
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
