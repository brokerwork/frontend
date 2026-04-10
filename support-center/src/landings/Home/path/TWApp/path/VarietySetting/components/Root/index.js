import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Nav from 'components/Nav';
import VarietyList from '../../containers/VarietyList';
import cs from './Root.less';



export default class Root extends PureComponent {
  state = {
    activeKey: ''
  }
  componentDidMount() {
    const { getVendorInfo, getServerInfo } = this.props;

    Promise.resolve(getVendorInfo()).then((res) => {
      if (res.result) {
        const {vendorInfo} = this.props;
        Promise.resolve(getServerInfo(vendorInfo[0].serverId)).then((result) => {
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
    const {getServerInfo} = this.props;
    Promise.resolve(getServerInfo(activeKey)).then((res) => {
      if (res.result) {
        this.setState({
          activeKey
        });
      }
    });
  }

  onSave = () => {
    const {activeKey} = this.state;

  }

  render() { 
    const { activeKey } = this.state;   
    const {vendorInfo} = this.props;
    return (
      <ContentWrapper header={i18n['menu.twapp.variety_setting']}>
        <Nav activeKey={activeKey} onChange={this.onChange} className={cs['nav']}>
        {vendorInfo.map((server, idx) => {
          return (
            <Nav.Item key={idx} eventKey={server.serverId}>
            {server.type === 'real' ? i18n['menu.twapp.vendor_setting.real'] : i18n['menu.twapp.vendor_setting.simulator']}{server.vendor}-{server.serverId}
            </Nav.Item>
          );
        })} 
        </Nav>
        <VarietyList activeKey={activeKey} />
      </ContentWrapper>
    );
  }
}