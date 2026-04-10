import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateAgentModal from '../components/UpdateAgentModal';
import { showTopAlert } from 'common/actions';
import {
  getAgentInfo,
  updateAgentInfo
} from '../controls/actions';


export default connect(({
  brokerFieldSetting: {
    agentInfo
  }
}) => ({
  agentInfo
}), {
  getAgentInfo,
  updateAgentInfo,
  submitForm: submit,
  showTopAlert
})(UpdateAgentModal);