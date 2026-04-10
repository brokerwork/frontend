import { connect } from 'react-redux';
import {
  getConditionsList,
  getCustomerFormFields,
  getCustomerSource,
  getRoleList
} from '../controls/actions';

import {
  showTopAlert,
  showTipsModal,
  createCondition,
  updateCondition,
  removeCondition,
  getConditionsListDetail
} from 'commonActions/actions';

import Root from '../components/Root';

export default connect(
  ({ settings: { searchConditions } }) => {
    return {
      conditionsList: searchConditions.conditionsList
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getConditionsList,
    createCondition,
    updateCondition,
    removeCondition,
    getCustomerFormFields,
    getCustomerSource,
    getRoleList,
    getConditionsListDetail
  }
)(Root);
