import Root from '../components/Root';
import { connect } from 'react-redux';
import * as actions from '../controls/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      rights,
      list: {
        currentPagination,
        orderBy,
        fieldConditions,
        dateRange,
        currentPrivilegeType,
        selectedAccountIds,
        searchCondition,
        searchLogicType,
        filterUser,
        fuzzyValue
      },
      accountColumns
    }
  }) => ({
    currentServer,
    rights,
    currentPagination,
    orderBy,
    fieldConditions,
    dateRange,
    currentPrivilegeType,
    selectedAccountIds,
    searchCondition,
    searchLogicType,
    filterUser,
    fuzzyValue,
    accountColumns
  }),
  {
    ...actions
  }
)(Root);
