import { connect } from 'react-redux';
import AddToWorkbench from '../components/AddToWorkbench';
import { getMyDashboard, saveMyDashboard } from './../controls/actions';
import { showTopAlert } from 'commonActions/actions';
export default connect(
  ({ dashboard_my_dashboard: { myDashboardArr } }) => ({
    myDashboardArr
  }),
  {
    getMyDashboard,
    saveMyDashboard,
    showTopAlert
  }
)(AddToWorkbench);
