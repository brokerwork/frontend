import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateConnector from '../components/UpdateConnector';
import { 
  getCurrentNo,
  checkConnector,
  updateConnector
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'common/actions';


export default connect(({
  brokerConnectorSetting: {
    serverList,
    currentNo
  }
}) => ({
  serverList,
  currentNo
}), {
  getCurrentNo,
  checkConnector,
  updateConnector,
  submitForm: submit,
  showTipsModal, 
  showTopAlert
})(UpdateConnector);