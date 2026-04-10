import { connect } from 'react-redux';
import UpdateBrandInfo from '../components/UpdateBrandInfo';
import { updateBrandInfo, validDomain } from '../controls/actions';
import { getBrandInfo } from '../../../controls/actions';
import { showTopAlert } from 'common/actions';
import { formValueSelector } from 'redux-form';
import { BRAND_FORM } from '../components/Forms/Brand';

const selector = formValueSelector(BRAND_FORM);

export default connect(
  ({
    traderBrandSetting: { loginModuleList, themeList },
    traderCommon: { brandInfo },
    common: { versionRights },
    ...otherState
  }) => ({
    loginModuleList,
    brandInfo,
    formValues: selector(otherState, 'customerDomain', 'remCodeShow'),
    themeList,
    versionRights
  }),
  {
    getBrandInfo,
    updateBrandInfo,
    validDomain,
    showTopAlert
  }
)(UpdateBrandInfo);
