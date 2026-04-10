import { reduxForm, getFormValues } from 'redux-form';
import AddForm from './form';
export const ADD_NAV_FORM = 'BROKER_BRANDING_SETTING_CUSTOM_NAV_ADD_NAV_FORM';
import { connect } from 'react-redux';
import { getParentMenu } from '../../controls/actions';
import _ from 'lodash';
import i18n from 'utils/i18n';
import language from 'utils/language';

const BrokerNavAddForm = reduxForm({
  form: ADD_NAV_FORM,
  enableReinitialize: true
})(AddForm);

class AddNavForm extends PureComponent {
  submitForm = values => {
    const { onClose, showTopAlert, onSubmit, getMenuList, menuList } = this.props;
    const copyValues = _.cloneDeep(values);

    if (copyValues.level === 'one') {
      const parentMenu = menuList.filter(item => item.parent === '0') || [];
      if (parentMenu.length >= 5) {
        showTopAlert({
          content: i18n['broker.brand_setting.custom_nav.menu_limit']
        });
        return;
      }
      copyValues.parent = '0';
    }
    delete copyValues.level;
    //
    onSubmit(copyValues).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.add_success']
        });
        onClose();
        getMenuList();
      }
    });
  };
  componentDidMount() {}
  setInitialValue = () => {
    return {
      //   id: 20, // 新增菜单时，不传，传此值的话，相当于修改
      level: 'one', // one , two 辅助字段 提交不用传
      type: 'CUSTOM', // 导航类型 SYSTEM、CUSTOM
      enabled: false, // 新增菜单默认不启用
      message: {
        // 菜单国际化
        'zh-CN': '',
        'en-US': ''
      },
      parent: '' // 新增一级导航传0，新增二级导航，传接口2返回的key，注意是key,比如：menu.view.point，非ID
    };
  };
  render() {
    const { formValues, menuList } = this.props;
    const initialVal = this.setInitialValue();
    const lang = language.getLang();
    const parentMenuList = menuList
      .filter(item => item.parent === '0')
      .map(menu => {
        return {
          value: menu.id,
          label: (menu && menu.message && menu.message[lang]) || ''
        };
      });
    return (
      <div>
        <BrokerNavAddForm
          onSubmit={this.submitForm}
          formValues={formValues}
          initialValues={initialVal}
          parentMenuList={parentMenuList}
        />
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      formValues: getFormValues(ADD_NAV_FORM)(state)
    };
  },
  { getParentMenu }
)(AddNavForm);
