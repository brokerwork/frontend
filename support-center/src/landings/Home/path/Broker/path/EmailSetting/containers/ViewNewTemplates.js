import { connect } from 'react-redux';
import ViewNewTemplates from '../components/ViewNewTemplates';
import {
  getEmailNewTemplateList
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  brokerEmailSetting: {
    newTemplateList
  },
  common
}) => ({
  newTemplateList,
  languages: common.languages
}), {
  showTopAlert,
  getEmailNewTemplateList
})(ViewNewTemplates);
