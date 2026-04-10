import ContentWrapper from 'components/ContentWrapper';
import Order from '../../containers/Order';
import Recharge from '../../containers/Recharge';
import ValueAddedService from '../../containers/ValueAddedService';
import Live from '../../containers/Live';
import Demand from '../../containers/Demand';
import i18n from 'utils/i18n';

export default class Root extends PureComponent {
  state = {
    load: false
  };
  componentDidMount() {
    const { getTenantInfo } = this.props;
    getTenantInfo().then(() => {
      this.setState({
        load: true
      });
    });
  }
  render() {
    const { menus, tenantInfo } = this.props;
    const { load } = this.state;
    const brokerMenu = menus.find(item => item.eventKey === 'broker') || {};
    const isShowLive = (brokerMenu.subMenu || []).some(item => item.key === 'BW.LIVE.DETAIL');

    let showValueAdd = false;
    if (tenantInfo) {
      showValueAdd =
        tenantInfo.email.flag || tenantInfo.sms.flag || tenantInfo.verification.flag || tenantInfo.voip.flag;
    }
    if (!load) return null;
    return (
      <ContentWrapper header={i18n['left.menu.consumption']}>
        {showValueAdd ? (
          <ValueAddedService
            email={tenantInfo.email.flag}
            sms={tenantInfo.sms.flag}
            internationalSms={tenantInfo.internationalSms}
            verification={tenantInfo.verification.flag}
            voip={tenantInfo.voip.flag}
          />
        ) : null}
        {/* {tenantInfo.live && tenantInfo.live.flag ? <Live /> : null}
        {tenantInfo.demand && tenantInfo.demand.flag ? <Demand /> : null} */}
      </ContentWrapper>
    );
  }
}
