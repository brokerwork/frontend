import BrandForm from '../Forms/Brand';
import i18n from 'utils/i18n';
import cs from './UpdateBrandInfo.less';
import { getHtml } from 'components/Editor';
import language from 'utils/language';

export default class UpdateBrandInfo extends PureComponent {
  onSave = values => {
    const { updateBrandInfo, getBrandInfo, showTopAlert } = this.props;
    const copyed = values;
    const loginTipMap = {};

    Object.keys(copyed.loginTipMap).forEach(item => {
      let html = '';

      if (typeof copyed.loginTipMap[item] === 'string') {
        html = copyed.loginTipMap[item];
      } else {
        const editorState = copyed.loginTipMap[item];
        const contentState = editorState.getCurrentContent();

        if (contentState.hasText()) {
          html = getHtml(editorState);
        }
      }

      loginTipMap[item] = html;
    });
    const nameRequired = Object.values(values.companyNames).some(el => !!el);
    if (!nameRequired) {
      showTopAlert({
        content: i18n['brand.setting.site.tips10'],
        style: 'danger'
      });
      return;
    }
    updateBrandInfo({ ...values, loginTipMap }).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['brand.setting.site.tips1']
        });
        getBrandInfo();
      }
    });
  };

  validDomain = () => {
    const { formValues, brandInfo, validDomain, showTopAlert } = this.props;
    const { productDomain } = brandInfo;
    const { customerDomain } = formValues;

    validDomain(productDomain, customerDomain).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['brand.setting.site.tips2']
        });
      }
    });
  };

  render() {
    const { brandInfo, themeList, formValues, loginModuleList, versionRights } = this.props;
    if(!brandInfo.companyNames){
      brandInfo.companyNames = {
        [language.getLang()]: brandInfo.companyName
      }
    }
    return (
      <div className={cs['container']}>
        <BrandForm
          initialValues={brandInfo}
          formValues={formValues}
          themeList={themeList}
          loginModuleList={loginModuleList}
          productDomain={brandInfo.productDomain}
          onSave={this.onSave}
          versionRights={versionRights}
          validDomain={this.validDomain}
        />
      </div>
    );
  }
}
