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
        type: 'EQ',
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
      getEarningSubLevelUsers
    } = this.props;
    const { searchable = {}, reportType } = reportConfig;
    const defaultTypes = _.cloneDeep(ADVANCED_SEARCH_TYPE[reportType]);
    const showSearchable = Object.assign({}, searchable, {
      objectType: true,
      openTime: true
    });
    const types = defaultTypes.filter(type => showSearchable.hasOwnProperty(type.value));
    const searchType = types.find(item => item.value === 'objectType');
    const levelName = types.find(item => item.value === 'levelName');
    if (searchType) {
      searchType.optionList = privilegeType;
      searchType.additions = searchType.additions || {};
      searchType.additions.getData = getEarningSubLevelUsers;
    }
    types.forEach(item => {
      if (item.value in searchable) {
        item.label = searchable[item.value];
      }
      if (levelName) {
        levelName.optionList = userLevel;
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
