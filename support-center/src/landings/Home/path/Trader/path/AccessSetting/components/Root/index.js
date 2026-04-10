import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import AccessSettingForm, { ACCESS_SETTING_FORM } from './form';
import Button from 'components/Button';
import cs from './style.less';
import { SubmissionError } from 'redux-form';
import { defaultOperation } from '../DoubleValidate/index';
import _ from 'lodash';
import Table from 'components/FixTable';

const columns = [
  {
    key: 'sort'
  },
  {
    key: 'loginType'
  },
  {
    key: 'enable'
  },
  {
    key: 'operation'
  }
];
const validKeys = [
  {
    key: 'verificationLoginFailTimes',
    min: 0,
    max: 10,
    error: i18n['access.setting.message.tip2']
  },
  {
    key: 'lockLoginFailTimes',
    min: 3,
    max: 20,
    error: i18n['access.setting.message.tip3']
  },
  {
    key: 'logoutTime',
    min: 1,
    max: 1000,
    error: i18n['access.setting.message.tip4']
  },
  {
    key: 'appLogoutTime',
    min: 0.5,
    max: 336,
    error: i18n['access.setting.message.hours.tip']
  }
];
export default class Root extends Component {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const { getAccessSetting } = this.props;
    getAccessSetting().then(() => {
      this.setState({
        dataReady: true
      });
    });
  }
  submit = () => {
    const { submitForm } = this.props;
    submitForm(ACCESS_SETTING_FORM);
  };
  onReset = () => {
    const { reset } = this.props;
    reset(ACCESS_SETTING_FORM);
  };
  onSubmit = values => {
    let errors = {};
    const { updateAccessSetting, showTopAlert, getAccessSetting } = this.props;
    validKeys.forEach(valid => {
      const isValiPass = this.numberValidPass(values[valid.key], valid.min, valid.max);
      if (!isValiPass) {
        errors[valid.key] = valid.error;
      }
    });
    if (values.registrable) {
      if (!values.allowEmail && !values.allowPhone) {
        errors.registerMethod = i18n['access.setting.regist.way.default.tips1'];
      }
      if (!values.defaultRegisterMethod) {
        errors.registerMethod = i18n['access.setting.regist.way.default.tips2'];
      }
    }
    if (values.lockLoginFailTimes <= values.verificationLoginFailTimes) {
      errors.lockLoginFailTimes = i18n['access.setting.message.tip3'];
    }
    if (_.keys(errors).length) {
      throw new SubmissionError(errors);
    }
    if (values.twoFAConfig && !values.twoFAConfig.enable) {
      values.twoFAConfig.mandatoryVerification = false;
      values.twoFAConfig.operation = [];
      values.twoFAConfig.types = [];
    }
    values.productId = 'TW';
    updateAccessSetting(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['access.setting.message.tip1']
        });
        getAccessSetting();
      }
    });
  };
  numberValidPass = (val, min, max) => {
    const num = Number(val);
    if (isNaN(num)) {
      return false;
    }
    if (num >= min && num <= max) {
      return true;
    }
    return false;
  };
  configInitialValue = () => {
    const { accessSetting, tenantInfo } = this.props;
    const data = _.cloneDeep(accessSetting);
    // 验证方式 短信初始值
    if (!_.get(data, 'twoFAConfig.types', []).length) {
      _.set(data, 'twoFAConfig.types', ['GoogleAuthenticator']);
      if (_.get(tenantInfo, 'sms.flag', false)) {
        if (_.get(tenantInfo, 'sms.enabled', false)) {
          data.twoFAConfig.types.push('SMS');
        }
      }
    }
    if (!_.get(data, 'twoFAConfig.operation', []).length) {
      _.set(data, 'twoFAConfig.operation', defaultOperation);
    }
    return data;
  };
  renderHeader = () => {
    return columns.map(col => {
      let content = i18n[`trader.plat.setting.deposit.rate_setting.table_header.${col.key}`];
      if (['sort', 'operation'].includes(col.key)) {
        content = i18n[`general.${col.key}`];
      }
      return <th key={col.key}>{content}</th>;
    });
  };
  onSort = ({ newIndex, oldIndex }) => {
    let {
      accessSetting: { loginConfigs }
    } = this.props;
    const deletedItem = loginConfigs[oldIndex];
    loginConfigs.splice(oldIndex, 1);
    loginConfigs.splice(newIndex, 0, deletedItem);
    this.setState({
      dataReady: true
    });
  };
  switch = (type, loginConfigs) => {
    const item = this.props.accessSetting.loginConfigs.find(el => el.loginType === type);
    if (this.props.accessSetting.loginConfigs.filter(el => el.enable).length === 1 && item.enable) {
      this.props.showTopAlert({
        content: i18n['trader.plat.setting.loginType.error_tip']
      });
      return;
    }
    item.enable = !item.enable;
    this.setState({
      dataReady: true
    });
  };
  renderCell = (item, key) => {
    return (
      <tr key={item.loginType}>
        {columns.map(col => {
          let content = '';
          switch (col.key) {
            case 'sort':
              content = <i className="fa fa-bars" />;
              break;
            case 'loginType':
              content = i18n['trader.plat.setting.loginType.' + item[col.key]];
              break;
            case 'enable':
              content = item[col.key] ? i18n['general.enabled'] : i18n['open.mgmt.disabled'];
              break;
            case 'operation':
              content = (
                <div>
                  {item.enable ? (
                    <Button className="icon" onClick={this.switch.bind(this, item['loginType'])}>
                      <i className="fa fa-ban" />
                    </Button>
                  ) : (
                    <Button style="primary" className="icon" onClick={this.switch.bind(this, item['loginType'])}>
                      <i className="fa fa-check-circle" />
                    </Button>
                  )}
                </div>
              );
              break;
            default:
              content = item[col.key];
          }
          return <td key={col.key}>{content}</td>;
        })}
      </tr>
    );
  };
  renderTableBody = data => {
    return data.map((item, key) => this.renderCell(item, key));
  };
  render() {
    const { dataReady } = this.state;
    const {
      accessSetting,
      doServiceSetting,
      versionRights,
      accessSetting: { loginConfigs = [] }
    } = this.props;
    const initialValues = this.configInitialValue(accessSetting);
    return (
      <ContentWrapper header={i18n['left.menu.access.setting']}>
        <div className={cs['access-settings']}>
          <div className={cs['login-type']}>
            <span>{i18n['trader.plat.setting.loginType']}</span>
            <div>
              <span className={cs['tip']}>{i18n['trader.plat.setting.loginType.tip']}</span>
              <Table className={cs.table}>
                <Table.Header fixHeader={true} data={columns}>
                  {this.renderHeader()}
                </Table.Header>
                <Table.Body sortable onSort={this.onSort} data={columns}>
                  {this.renderTableBody(loginConfigs)}
                </Table.Body>
              </Table>
            </div>
          </div>
          {dataReady ? (
            <AccessSettingForm
              initialValues={initialValues}
              onSubmit={this.onSubmit}
              versionRights={versionRights}
              doServiceSetting={doServiceSetting}
            />
          ) : null}
          <div className={cs['footer']}>
            <Button style="primary" onClick={this.submit}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.onReset}>{i18n['app.btn.reset']}</Button>
          </div>
        </div>
      </ContentWrapper>
    );
  }
}
