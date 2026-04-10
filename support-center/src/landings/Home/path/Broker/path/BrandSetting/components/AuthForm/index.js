import { reduxForm, getFormValues } from 'redux-form';
import AuthForm from './form';
export const AUTH_FORM = 'BROKER_BRANDING_SETTING_CUSTOM_NAV_EDIT_AUTH_FORM';
import { connect } from 'react-redux';
import _ from 'lodash';
import i18n from 'utils/i18n';
import { NAV_AUTH_MODAL_ROLE } from '../../constant';

const TraderNavAuthForm = reduxForm({
  form: AUTH_FORM,
  enableReinitialize: true
})(AuthForm);

class NavAuthForm extends PureComponent {
  submitForm = values => {
    const { onClose, showTopAlert, onSubmit, getMenuList } = this.props;
    let copyValues = _.cloneDeep(values);
    if (copyValues.roleType === 'all') {
      copyValues.roleRight = [];
    }
    delete copyValues.roleType;
    // const params = { ...editData, ...copyValues };
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
  configInitial = editData => {
    const { menuList, roleList } = this.props;
    let roleTypeOptions = NAV_AUTH_MODAL_ROLE;
    let copyData = _.cloneDeep(editData);
    let copyRoleData = _.cloneDeep(roleList);
    if (_.get(copyData, 'roleRight', '')) {
      copyData.roleType = 'part';
    } else {
      copyData.roleType = 'all';
      copyData.roleRight = [];
    }
    // 先判断是一级还是二级菜单
    if (copyData.parent !== '0') {
      // 先获取一级菜单的角色权限设置
      const parentAuth = _.get(menuList.find(item => item.id === editData.parent), 'roleRight', []);
      if (parentAuth.length) {
        // 一级菜单权限为部分
        copyData.roleType = 'part';
        roleTypeOptions = NAV_AUTH_MODAL_ROLE.filter(item => item.value === 'part');
        copyRoleData = roleList.filter(item => parentAuth.includes(`${item.id}`));
        // 此时二级菜单需要在一级菜单范围内，如果存在二级一级菜单没有权限的人自动过滤
        copyData.roleRight = copyData.roleRight.filter(item => parentAuth.includes(item));
      }
    }
    return { initialValues: copyData, roleTypeOptions, roleList: copyRoleData };
  };
  render() {
    const { formValues, editData } = this.props;
    const { initialValues, roleTypeOptions, roleList } = this.configInitial(editData);
    return (
      <div>
        <TraderNavAuthForm
          onSubmit={this.submitForm}
          formValues={formValues}
          roleList={roleList}
          initialValues={initialValues}
          roleTypeOptions={roleTypeOptions}
        />
      </div>
    );
  }
}
export default connect(
  state => {
    return {
      formValues: getFormValues(AUTH_FORM)(state)
    };
  },
  {}
)(NavAuthForm);
