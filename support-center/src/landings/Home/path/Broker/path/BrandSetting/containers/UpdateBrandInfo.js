import { connect } from 'react-redux';
import UpdateBrandInfo from '../components/UpdateBrandInfo';
import {
  updateBrandInfo,
  validDomain
} from '../controls/actions';
import {
  getBrandInfo
} from '../../../controls/actions';
import { showTopAlert } from 'common/actions';
import {formValueSelector, getFormValues, change} from 'redux-form';
import { BRAND_FORM } from '../components/Forms/index';

const selector = formValueSelector(BRAND_FORM);

export default connect(state => {
  const {
    brokerCommon: {
      brandInfo
    },
    brokerBrandSetting: {
      loginModuleList,
      themeList
    },
    ...otherState
  } = state;

  return {
    brandInfo,
    loginModuleList,
    themeList,
    customerDomain: selector(otherState, 'customerDomain'),
    brandFormValues: getFormValues(BRAND_FORM)(state)
  };
}, {
  changeField: change.bind(BRAND_FORM),
  updateBrandInfo,
  validDomain,
  showTopAlert
})(UpdateBrandInfo);
