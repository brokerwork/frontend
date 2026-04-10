import { connect } from 'react-redux';
import TemplateEmail from '../components/TemplateEmail';
import {
  getTemplateList,
  getEmailDefaultLanguage,
  _storeSelectedTemplate,
  batchResetEmailTemplates
} from '../controls/actions';
import { showTopAlert } from 'common/actions';

export default connect(
  ({ brokerEmailSetting: { templateList, emailList, emailDefaultLanguage, selectedTemplate }, common }) => ({
    templateList,
    emailList,
    emailDefaultLanguage,
    selectedTemplate,
    languages: common.languages
  }),
  {
    getTemplateList,
    getEmailDefaultLanguage,
    _storeSelectedTemplate,
    showTopAlert,
    batchResetEmailTemplates
  }
)(TemplateEmail);
