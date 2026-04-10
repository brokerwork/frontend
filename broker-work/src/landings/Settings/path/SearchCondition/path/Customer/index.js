import { connect } from 'react-redux';

import Customer from './Customer';
import {
  getFollowWayOptions,
  getCustomerFormFields,
  getCustomerSource
} from '../../controls/actions.js';

export default connect(
  ({ settings: { searchConditions } }) => {
    return {
      conditionsList: searchConditions.conditionsList,
      customerSource: searchConditions.customerSource,
      advancedSearchTypeCustomer: searchConditions.advancedSearchTypeCustomer
    };
  },
  {
    getFollowWayOptions,
    getCustomerFormFields,
    getCustomerSource
  }
)(Customer);
