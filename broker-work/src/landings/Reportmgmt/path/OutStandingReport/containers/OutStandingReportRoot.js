import { connect } from 'react-redux';
import OutStandingReportRoot from '../components/OutStandingReportRoot';

export default connect(
  ({ common: { brandInfo } }) => ({
    brandInfo
  }),
  null
)(OutStandingReportRoot);
