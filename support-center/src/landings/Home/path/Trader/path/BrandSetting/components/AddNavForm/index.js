import { reduxForm, getFormValues } from 'redux-form';
import AddForm from './form';
export const ADD_NAV_FORM = 'TRADER_BRANDING_SETTING_CUSTOM_NAV_ADD_NAV_FORM';
import { connect } from 'react-redux';
import { getParentMenu } from '../../controls/actions';
import _ from 'lodash';
import i18n from 'utils/i18n';

const TraderNavAddForm = reduxForm({
  form: ADD_NAV_FORM,
  enableReinitialize: true
})(AddForm);

class AddNavForm extends PureComponent {
  submitForm = values => {
    const { onClose, showTopAlert, onSubmit, getMenuList, platForm } = this.props;
    const copyValues = _.cloneDeep(values);
    if (copyValues.level === 'one') {
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
        getMenuList(platForm);
      }
    });
  };
  componentDidMount() {
    const { platForm, getParentMenu } = this.props;
    getParentMenu(platForm);
  }
  setInitialValue = () => {
    const { platForm } = this.props;
    return {
      //   id: 20, // 新增菜单时，不传，传此值的话，相当于修改
      level: '', // one , two
      message: {
        // 菜单国际化
        'zh-CN': '',
        'en-US': ''
      },
      parent: '', // 新增一级导航传0，新增二级导航，传接口2返回的key，注意是key,比如：menu.view.point，非ID
      platform: platForm // 平台：web，mobile
    };
  };
  render() {
    const { formValues, parentMenuList } = this.props;
    const initialVal = this.setInitialValue();

    return (
      <div>
        <TraderNavAddForm
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
      formValues: getFormValues(ADD_NAV_FORM)(state),
      parentMenuList: state.traderBrandSetting.parentMenuList
    };
  },
  { getParentMenu }
)(AddNavForm);
