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
  traderEmailSetting: {
    templateEmailList,
    templateDetail
  },
  common: {languages}
}) => ({
  languages,
  templateEmailList,
  templateDetail
}), {
  getTemplateDetail,
  getTemplateList,
  updateTemplate,
  submitForm: submit,
  changeFormField: change,
  showTopAlert,
  getEmailDefaultTemplate
})(UpdateTemplate);
