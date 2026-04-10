import ConditionFilter from 'components/v2/ConditionFilter';
import { ADVANCED_SEARCH_CONFIG, ADVANCED_SEARCH_TYPE } from '../../constants';
import { deepCopy } from 'utils/simpleDeepCopy';

export default class Conditions extends PureComponent {
  getList = () => {
    const { getUsers, params } = this.props;
    getUsers(params);
  };

  onAdvancedSearch = (data, logicType, viewId) => {
    const {
      updateSearchDate,
      updateDateRange,
      updateFieldConditions
    } = this.props;
    Promise.resolve(updateFieldConditions(data)).then(() => {
      this.getList();
    });
  };

  injectDataToAdvancedSearchType = () => {
    const types = deepCopy(ADVANCED_SEARCH_TYPE);

    return types;
  };
  render() {
    const {
      advancedSearchConditions,
      searchFieldConditions,
      children
    } = this.props;
    return (
      <ConditionFilter.Container
        types={this.injectDataToAdvancedSearchType()}
        conditions={advancedSearchConditions}
        onSearch={this.onAdvancedSearch}
        data={searchFieldConditions}
        {...ADVANCED_SEARCH_CONFIG}
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
