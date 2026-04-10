import { connect } from 'react-redux';
import { submit, change } from 'redux-form';
import UpdateTemplate from '../components/UpdateTemplate';
import {
  getTemplateDetail,
  getTemplateList,
  updateTemplate,
  getEmailDefaultTemplate
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  brokerEmailSetting: {
    templateEmailList,
    templateDetail
  },
  common: {languages}
}) => ({
  templateEmailList,
  templateDetail,
  languages
}), {
  getTemplateDetail,
  getTemplateList,
  updateTemplate,
  submitForm: submit,
  changeFormField: change,
  showTopAlert,
  getEmailDefaultTemplate
})(UpdateTemplate);
