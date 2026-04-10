import { connect } from 'react-redux';
import List from '../components/List';
import { showTopAlert, showTipsModal } from 'common/actions';
import {
  getEmailList,
  _setEmailTarget,
  removeEmail
} from '../controls/actions';


export default connect(({
  traderEmailSetting: {
    emailList,
    emailProvider
  }
}) => ({
  emailList,
  emailProvider
}), {
  getEmailList,
  removeEmail,
  _setEmailTarget,
  showTopAlert,
  showTipsModal
})(List);
