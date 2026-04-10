import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
import { showTopAlert, saveFormSortColumns } from 'commonActions/actions';
import {
  updateCondition,
  updateSearchLogicType,
  updateFieldConditions,
  getUserSubLevelUsers
} from '../controls/actions';

export default connect(
  ({
    common: { versionRights, accountTypes },
    accountManagement: {
      currentServer,
      rights,
      list: {
        advancedSearchTypes,
        searchCondition,
        fieldConditions,
        searchLogicType,
        advancedSearchConditions,
        privilegeTypeList
      }
    }
  }) => ({
    currentServer,
    rights,
    advancedSearchTypes,
    searchCondition,
    fieldConditions,
    searchLogicType,
    advancedSearchConditions,
    privilegeTypeList,
    versionRights,
    accountTypes
  }),
  {
    updateCondition,
    updateSearchLogicType,
    updateFieldConditions,
    getUserSubLevelUsers
  }
)(Conditions);
