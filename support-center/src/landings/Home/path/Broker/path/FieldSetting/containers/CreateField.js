import { connect } from 'react-redux';
import CreateField from '../components/CreateField';
import {
  showTopAlert
} from 'common/actions';


export default connect(({
  brokerFieldSetting: {
    notEnabledField
  }
}) => ({
  notEnabledField
}), {
  showTopAlert
})(CreateField);