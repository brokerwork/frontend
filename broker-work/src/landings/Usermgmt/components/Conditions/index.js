import ConditionFilter from 'components/v2/ConditionFilter';
import { deepCopy } from 'utils/simpleDeepCopy';
import i18n from 'utils/i18n';

export default class Conditions extends PureComponent {
  onAdvancedSearch = (data, logicType, viewId) => {
    const {
      updateFieldConditions,
      modifyParams,
      searchFieldConditions
    } = this.props;
    let copyData = [];
    // 针对重置操作保留mainfilter值
    if (data.length === 0) {
      copyData.push(
        searchFieldConditions.find(item => item.field === 'userSearchType')
      );
    } else {
      copyData = data;
    }
    Promise.resolve(updateFieldConditions(copyData)).then(() => {
      const { params } = this.props;
      modifyParams({
        ...params,
        pageNo: 1
      });
    });
  };

  injectDataToAdvancedSearchType = () => {
    const {
      advancedSearchType,
      options,
      levelList,
      getUserSubLevelUsers
    } = this.props;
    const types = deepCopy(advancedSearchType);
    const searchType = types.find(item => item.value === 'userSearchType');
    const level = types.find(item => item.value === 'levelId');

    if (searchType) {
      searchType.optionList = options.userSearchType;
      searchType.additions = {
        getData: getUserSubLevelUsers
      };
    }
    if (level) {
      level.optionList = levelList;
    }
    return types;
  };
  render() {
    const {
      advancedSearchType,
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
      >
        {children}
      </ConditionFilter.Container>
    );
  }
}
