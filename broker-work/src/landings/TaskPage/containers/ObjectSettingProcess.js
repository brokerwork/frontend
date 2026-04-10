import { connect } from 'react-redux';
import { submit } from 'redux-form';

import ObjectSettingProcess from '../components/ObjectSettingProcess';
import { getDetails } from '../controls/ObjectSettingActions';

export default connect(
  ({ taskmgmt: { setting } }) => ({
    details: setting.details
  }),
  {
    getDetails
  }
)(ObjectSettingProcess);
