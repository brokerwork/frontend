import i18n from "utils/i18n";
import cs from "./QuotationIntervalSetting.less";
import Button from "components/Button";
import Nav from "components/Nav";
import NumberInput from "components/NumberInput";
import Checkbox from "components/Checkbox";
import IntervalForm from "../../containers/IntervalForm";

export default class QuotationIntervalSetting extends PureComponent {
  componentDidMount() {
    const { getIntervalInfo, getVendorInfo, getServerInfo } = this.props;
    Promise.all([
      getIntervalInfo(),
      getVendorInfo()
    ]).then(() => {
      const { vendorInfo, intervalInfo } = this.props;
      getServerInfo(vendorInfo[0].serverId).then(result => {
        if (result.result) {
          this.setState({
            activeKey: vendorInfo[0].serverId,
            defaultedInterval: intervalInfo && intervalInfo.defaulted || 0,
            specialSetting: intervalInfo && intervalInfo.special || false,
          });
        }
      });
    });
  }

  constructor(props) {
    super(props);
    const {intervalInfo} = this.props;
    this.state = {
      defaultedInterval: intervalInfo.defaulted || 0,
      specialSetting: intervalInfo.special || false,
      activeKey: ''
    };
  }

  changeDefaultedInterval = v => { 
    this.setState({
      defaultedInterval: v
    });
  };
  openSpecialSetting = evt => {
    this.setState({
      specialSetting: evt.target.checked
    });
  };
  onChangeServer = (activeKey) => {
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
    const {updateIntervalInfo, intervalInfo, showTopAlert, getServerInfo, getIntervalInfo} = this.props;
    const {defaultedInterval, specialSetting, activeKey} = this.state;
    const copyData = Object.assign({}, intervalInfo);
    copyData.defaulted = defaultedInterval;
    copyData.special = specialSetting;
    updateIntervalInfo(copyData).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getIntervalInfo();
        if (specialSetting) {
          getServerInfo(activeKey);
        }
      }
    });
  }

  render() {
    const { vendorInfo } = this.props;
    const { defaultedInterval, specialSetting, activeKey } = this.state;
    return (
      <div className={cs['container']}>
        <div className={cs['started-page-title']}>
          <span>
            {i18n['twapp.quotationinterval.warning_tips']}
          </span>
          <span>
            {i18n['twapp.quotationinterval.warning_desc']}
          </span>
        </div>
        <div className={cs['setting-content']}>
          <div>
            <div className={cs['default-label']}>{i18n['twapp.quotationinterval.default_setting']}：</div>
            <NumberInput
              className={cs['default-control']}
              onChange={this.changeDefaultedInterval}
              value={defaultedInterval}
            />
            <div className={cs['default-unit']}>{i18n['twapp.quotationinterval.second_unit']}</div>
          </div>
          <div className={cs['interval-item']}>
            <div className={cs['default-label']}>{i18n['twapp.quotationinterval.special_setting']}：</div>
            <Checkbox
              children={i18n['twapp.quotationinterval.open_option']}
              inline
              className={cs['special-control']}
              checked={specialSetting}
              onChange={this.openSpecialSetting}
            />
            <div className={cs['special-unit']}>
              {i18n['twapp.quotationinterval.open_option_tips']}
            </div>
          </div>
          
          {specialSetting ? (
            <div>
              <Nav
                activeKey={activeKey}
                onChange={this.onChangeServer}
                className={cs['nav']}
              >
                {vendorInfo.map((server, idx) => {
                  return (
                    <Nav.Item key={idx} eventKey={server.serverId}>
                    {server.type === 'real' ? i18n['menu.twapp.vendor_setting.real'] : i18n['menu.twapp.vendor_setting.simulator']}{server.vendor}-{server.serverId}
                    </Nav.Item>
                  );
                })}
              </Nav>
              <IntervalForm activeKey={activeKey} defaultedInterval={defaultedInterval} />
            </div>
          ) : (
            undefined
          )}
          <div className={cs['save-button']}>
            <Button style="primary" onClick={this.onSave}>{i18n['app.btn.save']}</Button>
          </div>
        </div>
      </div>
    );
  }
}
