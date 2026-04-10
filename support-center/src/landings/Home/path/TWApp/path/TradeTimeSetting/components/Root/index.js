import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Nav from 'components/Nav';
import Button from 'components/Button';
import TimeList from '../../containers/TimeList';
import cs from './Root.less';
import { FormattedMessage } from 'react-intl';



export default class Root extends PureComponent {
  state = {
    activeKey: ''
  }
  componentDidMount() {
    const { getVendorInfo, getTimeInfo } = this.props;

    Promise.resolve(getVendorInfo()).then((res) => {
      if (res.result) {
        const {vendorInfo} = this.props;
        Promise.resolve(getTimeInfo(vendorInfo[0].serverId)).then((result) => {
          if (result.result) {
            this.setState({
              activeKey: vendorInfo[0].serverId
            });
          }
        });
      }
    });
  }
  onChange = (activeKey) => {
    const {getTimeInfo} = this.props;
    Promise.resolve(getTimeInfo(activeKey)).then((res) => {
      if (res.result) {
        this.setState({
          activeKey
        });
      }
    });
  }
  
  synchronrizeTime = () => {
    const {showTipsModal, saveTimeSynchronize, showTopAlert} = this.props;
    const {activeKey} = this.state;
    showTipsModal({
      header: i18n['common.tips.risk'],
      content: (
        <div className={cs['content']}>
          {i18n['twapp.trade_time_setting.synchronize_tips']}
        </div>
      ),
      onConfirm: (cb) => {
        Promise.resolve(saveTimeSynchronize(activeKey)).then((res) => {
          if (res.result) {
            showTopAlert({
              content: i18n['twapp.trade_time_setting.synchronize_success'],
              style: 'success'
            });
            getTimeInfo(activeKey);
          }
        });
        cb();
      },
    });
  }

  render() { 
    const { activeKey } = this.state;   
    const {vendorInfo} = this.props;
    const timezoneItem = vendorInfo && vendorInfo.find((item) => item.serverId === activeKey);
    const realTimezone = timezoneItem && timezoneItem.timezone !== undefined ? timezoneItem.timezone : i18n['twapp.trade_time_setting.timezone_undefined'];
    return (
      <ContentWrapper header={i18n['menu.twapp.trade_time_setting']}>
        <Nav activeKey={activeKey} onChange={this.onChange} className={cs['nav']}>
        {vendorInfo && vendorInfo.map((server, idx) => {
          return (
            <Nav.Item key={idx} eventKey={server.serverId}>
              {server.type === 'real' ? i18n['menu.twapp.vendor_setting.real'] : i18n['menu.twapp.vendor_setting.simulator']}{server.vendor}-{server.serverId}
            </Nav.Item>
          );
        })} 
          <Nav.Buttons>
            <Button style="primary" onClick={this.synchronrizeTime}>
              {i18n['twapp.trade_time_setting.synchronize_button']}
            </Button>
          </Nav.Buttons>
        </Nav>
        {vendorInfo
          ? <div className={cs['warning']}> 
              <FormattedMessage
                id="timezone"
                defaultMessage={i18n['twapp.trade_time_setting.timezone']}
                values={{timezone: `${realTimezone}`}}
                /> 
            </div>
          : undefined
        }
        <TimeList activeKey={activeKey} />
      </ContentWrapper>
    );
  }
}