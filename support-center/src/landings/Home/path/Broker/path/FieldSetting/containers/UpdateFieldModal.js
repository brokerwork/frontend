import { connect } from 'react-redux';
import UpdateFieldModal from '../components/UpdateFieldModal';
import { submit, getFormValues } from 'redux-form';
import {
  updateField,
  createCustomizeField,
  updateCustomizeField,
  enableField,
  getFieldList
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'common/actions';

export default connect(
  state => {
    let {
      brokerFieldSetting: { fieldType, notEnabledField, relationFieldList },
      common: {
        // 映射OS系统配置支持的语言
        languages,
        versionRights
      }
    } = state;
    return {
      fieldType,
      notEnabledField,
      relationFieldList,
      languages,
      versionRights,
      formValues: getFormValues('BROKER_FIELD_SETTING_FIELD_FORM')(state)
    };
  },
  {
    updateField,
    submitForm: submit,
    showTopAlert,
    showTipsModal,
    createCustomizeField,
    updateCustomizeField,
    enableField,
    getFieldList
  }
)(UpdateFieldModal);
