import { connect } from 'react-redux';
import CustomNav from '../components/CustomNav';
import { getMenuList, geMenuDetails, menuSorts, updateMenus, getRoleList, menuEnabled } from '../controls/actions';
import { showTipsModal, showTopAlert } from 'common/actions';
import { submit, reset } from 'redux-form';

export default connect(
  ({ brokerBrandSetting, brokerCommon: { brandInfo } }) => {
    return {
      menuList: brokerBrandSetting.menuList,
      menuDetails: brokerBrandSetting.menuDetails,
      roleList: brokerBrandSetting.roleList,
      brandInfo
    };
  },
  {
    getMenuList,
    geMenuDetails,
    menuSorts,
    showTipsModal,
    showTopAlert,
    submitForm: submit,
    updateMenus,
    getRoleList,
    menuEnabled
  }
)(CustomNav);
