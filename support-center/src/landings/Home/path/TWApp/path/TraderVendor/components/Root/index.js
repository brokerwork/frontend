import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import VendorList from '../../containers/VendorList';


export default class Root extends PureComponent {
  render() {    
    return (
      <ContentWrapper header={i18n['menu.twapp.trade_server']}>
        <VendorList />
      </ContentWrapper>
    );
  }
}