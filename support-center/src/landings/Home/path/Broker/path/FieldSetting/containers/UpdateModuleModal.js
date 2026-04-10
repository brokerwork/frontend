import { connect } from 'react-redux';
import UpdateModuleModal from '../components/UpdateModule/Modal';
import {
  updateModule
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  brokerFieldSetting: {
    moduleList
  }
}) => ({
  moduleList
}), {
  updateModule,
  showTopAlert
})(UpdateModuleModal);