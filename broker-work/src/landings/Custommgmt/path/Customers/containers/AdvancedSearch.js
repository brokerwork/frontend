import { connect } from 'react-redux';
import AdvancedSearch from '../components/AdvancedSearch';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    customMgmt: {
      customers: {
        customerSource,
        advancedLogicType,
        advancedSearchConditions,
        advancedSearchType,
        selectedAdvancedSearchConditions
      }
    }
  }) => {
    return {
      customerSource,
      advancedLogicType,
      advancedSearchConditions,
      advancedSearchType,
      selectedAdvancedSearchConditions
    };
  },
  {
    ...actions,
    showTopAlert
  }
)(AdvancedSearch);
