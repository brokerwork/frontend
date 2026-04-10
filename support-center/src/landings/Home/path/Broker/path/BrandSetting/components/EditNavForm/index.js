import { reduxForm, getFormValues } from 'redux-form';
import EditForm from './form';
export const EDIT_NAV_FORM = 'BROKER_BRANDING_SETTING_CUSTOM_NAV_EDIT_NAV_FORM';
import { connect } from 'react-redux';
import _ from 'lodash';
import i18n from 'utils/i18n';

const TraderNavEditForm = reduxForm({
  form: EDIT_NAV_FORM,
  enableReinitialize: true
})(EditForm);

class EditNavForm extends PureComponent {
  submitForm = values => {
    const { onClose, showTopAlert, onSubmit, getMenuList } = this.props;
    const copyValues = _.cloneDeep(values);
    if (copyValues.type === 'SYSTEM') {
      copyValues.source = '';
      copyValues.value = '';
    } else if (copyValues.type === 'CUSTOM') {
      if (copyValues.source === 'LINK') {
        copyValues.value = copyValues.inputValue;
        delete copyValues.inputValue;
      } else if (copyValues.source === 'CONTENT') {
        copyValues.value = copyValues.textValue;
        delete copyValues.textValue;
      }
    }
    onSubmit(copyValues).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.edit_success']
        });
        onClose();
        getMenuList();
      }
    });
  };
  componentDidMount() {}
  setInitialValue = () => {
    const { editData } = this.props;
    let textValue = '';
    let inputValue = '';
    if (editData.type === 'CUSTOM') {
      if (editData.source === 'LINK') {
        inputValue = editData.value;
      } else if (editData.source === 'CONTENT') {
        textValue = editData.value;
      }
    }
    return {
      id: editData.id, // 新增菜单时，不传，传此值的话，相当于修改
      source: editData.source, // 内容来源: SYSTEM、LINK、CONTENT
      value: editData.value, // 内容，source=LINK时为链接, source=CONTENT时为富文本, source=SYSTEM时为空
      type: editData.type ? editData.type : 'CUSTOM',
      inputValue,
      textValue
    };
  };
  render() {
    const { formValues, editData } = this.props;
    const initialVal = this.setInitialValue();
    return (
      <div>
        <TraderNavEditForm
          onSubmit={this.submitForm}
          initialValues={initialVal}
          formValues={formValues}
          type={editData.type}
          system={editData.system}
        />
      </div>
    );
  }
}
export default connect(
  state => {
    return {
      formValues: getFormValues(EDIT_NAV_FORM)(state)
    };
  },
  {}
)(EditNavForm);
