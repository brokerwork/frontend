import ConditionFilter from 'components/v2/ConditionFilter';
import {
  CUSTOMER_TIME_SEARCH_TYPE,
  FUZZY_SEARCH_TYPES,
  DEFAULT_RANGES,
  REVISIT_RANGES,
  ADVANCED_SEARCH_TYPES,
  ADVANCED_SEARCH_CONDITIONS,
  ADVANCED_SEARCH_CONFIG
} from '../../constant';
import { deepCopy } from 'utils/simpleDeepCopy';

export default class ActionsBar extends PureComponent {
  getList = () => {
    const {
      getOpportunityList,
      currentPagination,
      searchFieldConditions,
      searchText
    } = this.props;
    const { pageNo, pageSize } = currentPagination;

    getOpportunityList({
      currentPage: pageNo,
      pageSize,
      fuzzyVal: searchText,
      advanceConditions: searchFieldConditions
    });
  };

  onAdvancedSearch = (data, logicType, viewId) => {
    const {
      updateSearchDate,
      updateDateRange,
      updateFieldConditions,
      updateCondition
    } = this.props;
    Promise.resolve(updateFieldConditions(data)).then(() => {
      this.getList();
    });
  };

  render() {
    const {
      advancedSearchType,
      advancedSearchConditions,
      searchFieldConditions,
      children,
      currentCondition,
      advancedSearchTypes
    } = this.props;
    return (
      <ConditionFilter.Container
        types={advancedSearchTypes}
        conditions={ADVANCED_SEARCH_CONDITIONS}
        onSearch={this.onAdvancedSearch}
        data={searchFieldConditions}
        // viewId={currentCondition}
        {...ADVANCED_SEARCH_CONFIG}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
