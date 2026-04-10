import List from '../components/List';
import { connect } from 'react-redux';
import { saveFormSortColumns, showTopAlert } from 'commonActions/actions';
import {
  updatePagination,
  updateOrderBy,
  updateSelectedAccountIds,
  updateCellStatus
} from '../controls/actions';

export default connect(
  ({
    common: {
      userRights,
      versionRights,
      accountTypes,
      brandInfo,
      bwAccountShow
    },
    accountManagement: {
      rights,
      listColumns,
      resources,
      currentServer,
      sortListColumns,
      list: {
        orderBy,
        accountList,
        currentPagination,
        accountTotal,
        selectedAccountIds
      },
      accountColumns
    }
  }) => ({
    userRights,
    rights,
    listColumns,
    resources,
    currentServer,
    orderBy,
    accountList,
    currentPagination,
    accountTotal,
    selectedAccountIds,
    sortListColumns,
    accountColumns,
    versionRights,
    accountTypes,
    bwAccountShow,
    brandInfo
  }),
  {
    updatePagination,
    updateOrderBy,
    updateSelectedAccountIds,
    showTopAlert,
    saveFormSortColumns,
    updateCellStatus
  }
)(List);
