import BrandForm from '../Forms/index';
import i18n from 'utils/i18n';
import cs from './UpdateBrandInfo.less';

export default class UpdateBrandInfo extends PureComponent {
  state = {
    brandInfo: null
  };
  // componentDidMount() {
  //   this.getBrandInfo();
  // }
  getBrandInfo = () => {
    const { getBrandInfo } = this.props;

    getBrandInfo();
  };
  onSave = values => {
    const { updateBrandInfo, showTopAlert } = this.props;

    updateBrandInfo(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['brand.setting.site.tips1']
        });
        this.getBrandInfo();
      }
    });
  };

  validDomain = () => {
    const { customerDomain, brandInfo, validDomain, showTopAlert } = this.props;
    const { productDomain } = brandInfo;

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
    const { brandInfo, ...props } = this.props;
    return (
      <div className={cs['container']}>
        {brandInfo && (
          <BrandForm
            {...props}
            initialValues={brandInfo}
            productDomain={brandInfo.productDomain}
            onSave={this.onSave}
            validDomain={this.validDomain}
          ></BrandForm>
        )}
      </div>
    );
  }
}
