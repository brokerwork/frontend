import { connect } from 'react-redux';
import UpdateEmailLanguage from '../components/UpdateEmailLanguage';
import {
  updateEmailDefalutLanguage
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  brokerEmailSetting: {
    emailDefaultLanguage
  },
  common
}) => ({
  emailDefaultLanguage,
  languages: common.languages
}), {
  updateEmailDefalutLanguage,
  showTopAlert
})(UpdateEmailLanguage);