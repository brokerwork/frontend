import { connect } from 'react-redux';
import CustomNav from '../components/CustomNav';
import { getMenuList, updateMenuCode, resetMenu, addOrEditMenu, enableOrDisableMenu } from '../controls/actions';
import { showTipsModal, showTopAlert } from 'common/actions';
import { submit, reset } from 'redux-form';

export default connect(
  ({ traderBrandSetting, traderCommon: { brandInfo } }) => {
    return {
      menuList: traderBrandSetting.menuList,
      brandInfo
    };
  },
  {
    getMenuList,
    updateMenuCode,
    resetMenu,
    showTipsModal,
    showTopAlert,
    submitForm: submit,
    addOrEditMenu,
    enableOrDisableMenu
  }
)(CustomNav);
