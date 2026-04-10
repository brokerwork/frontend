import ContentWrapper from 'components/ContentWrapper';
import Info from '../../containers/Info';
import Contact from '../../containers/Contact';
import Product from '../../containers/Product';
import ValueAddedService from '../../containers/ValueAddedService';
import VideoService from '../../containers/VideoService';
import DataService from '../../containers/DataService';
import i18n from 'utils/i18n';

export default class Root extends PureComponent {
  componentDidMount() {
    const { getExchangeRate } = this.props;
    getExchangeRate();
  }

  render() {
    const { tenantInfo } = this.props;

    return (
      <ContentWrapper header={i18n['left.menu.dashboard']}>
        <Info />
        <Contact />
        <Product />
        <ValueAddedService />
        {/* <VideoService /> */}
      </ContentWrapper>
    );
  }
}
