import Actions from '../components/Actions';
import { connect } from 'react-redux';
import {
  updateCondition,
  updateSearchLogicType,
  updateFieldConditions,
  updateSelectedAccountIds
} from '../controls/actions';
import { getSimpleUserList } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      rights,
      list: {
        advancedSearchTypes,
        searchCondition,
        fieldConditions,
        searchLogicType,
        currentPagination,
        listUpdateTime,
        orderBy
      }
    }
  }) => ({
    currentServer,
    rights,
    advancedSearchTypes,
    searchCondition,
    fieldConditions,
    searchLogicType,
    currentPagination,
    listUpdateTime,
    orderBy
  }),
  {
    updateCondition,
    updateSearchLogicType,
    updateFieldConditions,
    updateSelectedAccountIds,
    getSimpleUserList
  }
)(Actions);
