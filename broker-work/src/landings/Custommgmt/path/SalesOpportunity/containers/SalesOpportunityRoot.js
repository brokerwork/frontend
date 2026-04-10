import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import SalesOpportunityRoot from '../components/SalesOpportunityRoot';

export default connect(
  ({ common: { brandInfo } }) => ({
    brandInfo
  }),
  actions
)(SalesOpportunityRoot);
