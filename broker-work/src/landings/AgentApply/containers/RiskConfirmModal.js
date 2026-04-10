import { connect } from 'react-redux';
import RiskConfirmModal from '../components/RiskConfirmModal';

export default connect(
  ({ agentApply: { agentConfig } }) => ({
    agentConfig
  }),
  null
)(RiskConfirmModal);
