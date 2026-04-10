import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import QuotationIntervalSetting from '../../containers/QuotationIntervalSetting';


export default class Root extends PureComponent {
  render() {    
    return (
      <ContentWrapper header={i18n['menu.twapp.quotation_interval_setting']}>
        <QuotationIntervalSetting />
      </ContentWrapper>
    );
  }
}