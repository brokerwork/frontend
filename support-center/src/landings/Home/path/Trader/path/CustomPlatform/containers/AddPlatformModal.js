import { connect } from 'react-redux';
import AddPlatformModal from '../components/AddPlatformModal';
import { submit } from 'redux-form';
import { showTopAlert } from 'common/actions';
import { getList, setPlatform } from '../controls/actions';
import { getCustomPlatformMenus } from 'common/actions';

export default connect(
  ({ traderCustomPlatform: { list } }) => ({
    list
  }),
  {
    submitForm: submit,
    showTopAlert,
    setPlatform,
    getList,
    getCustomPlatformMenus
  }
)(AddPlatformModal);
