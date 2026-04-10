import ContentWrapper from 'components/ContentWrapper';
import Details from '../../containers/Detail';
import i18n from 'utils/i18n';


export default class Root extends PureComponent {

  componentDidMount() {
    const { getProductDetail, getMonthCharge } = this.props;
    getProductDetail();
    getMonthCharge();
  }
  render() {    
    return (
      <ContentWrapper header={i18n['menu.twapp.product_detail']}>
      <Details />
      </ContentWrapper>
    );
  }
}