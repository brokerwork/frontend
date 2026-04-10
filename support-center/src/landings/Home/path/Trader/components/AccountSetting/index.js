import cs from './index.less';
import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import AccountForm from './accountForm';
import language from 'utils/language';
import _ from 'lodash';
import Button from 'components/Button';
import { layoutRightsLists } from './accountForm';
import { Message } from 'lean-ui';

const TabPanel = Tab.Panel;
// || (item.accountCategory === 'Individual' && item.customerAccountType === 'Individual')
const fomateRights = (rights, plat, item, allowed) => {
  let obj = {};
  for (let key of layoutRightsLists) {
    if (rights && rights[plat] && rights[plat].length) {
      obj[key] = rights[plat].includes(key);
    } else {
      if (item.accountCategory === 'Individual' && item.customerAccountType === 'Individual') {
        if (rights === undefined || (rights && rights[plat] === undefined)) {
          obj[key] = allowed;
          continue;
        }
      }
      obj[key] = false;
    }
  }
  return obj;
};

export default class AccountSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 0,
      formList: props.accountTypeConfig.accountTypeInfos
    };
  }
  lock = true;
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.accountTypeConfig.accountTypeInfos &&
      nextProps.accountTypeConfig.accountTypeInfos.length &&
      this.lock
    ) {
      this.setState({
        formList: nextProps.accountTypeConfig.accountTypeInfos
      });
      this.lock = false;
    }
  }
  onSave = () => {
    const { accountTypeConfig, updateAccountTypeConfig } = this.props;
    const { formList } = this.state;
    const params = _.cloneDeep(accountTypeConfig);
    params.accountTypeInfos = formList;
    updateAccountTypeConfig(params).then(res => {
      if (res.result) {
        Message.success(i18n['general.operate_success']);
      }
    });
  };
  handleChangeRights = (right, value, index) => {
    const { plat } = this.props;
    const copyData = _.cloneDeep(this.state.formList);
    const item = copyData[index];
    const rights = _.get(item, `rights.${plat}`, []);
    if (!value) {
      _.remove(rights, function(n) {
        return n === right;
      });
    } else {
      rights.push(right);
    }
    if (item.rights) {
      item.rights[plat] = rights;
    } else {
      item.rights = {};
      item.rights[plat] = rights;
    }
    this.setState({
      formList: copyData
    });
  };
  render() {
    const { activeKey, formList } = this.state;
    const {
      accountTypeConfig: { accountTypeInfos },
      plat,
      basicSetting = {}
    } = this.props;
    return (
      <div className={cs.ctraderSetting}>
        <Tab
          activeKey={activeKey}
          id="customAccountSetting"
          onChange={key => {
            this.setState({ activeKey: key });
          }}
        >
          {formList.map((item, index) => {
            const Lang = language.getLang();
            const title = item.accountTypeName[Lang] || (Lang === 'zh-CN' ? '未命名' : 'unknown');
            // const rights = _.get(formList[index], `rights.${plat}`, []);
            const initialValues = fomateRights(
              formList[index].rights,
              plat,
              item,
              basicSetting ? basicSetting.allowRealAccount : false
            );
            // 如果基本设置中不允许开户 则disabled
            let isDisabled = !basicSetting.allowRealAccount && !basicSetting.allowSameAccount;
            // 默认个人账户不能操作
            if (item['accountCategory'] === 'Individual' && item['customerAccountType'] === 'Individual') {
              isDisabled = true;
            }
            return (
              <TabPanel
                key={index}
                className={cs.setting_tabpanel}
                eventKey={index}
                title={
                  <span className={cs.tab_title} title={title}>
                    {title}
                  </span>
                }
              >
                <AccountForm
                  initialValues={initialValues}
                  formList={formList}
                  index={index}
                  handleChangeRights={this.handleChangeRights}
                  isDisabled={isDisabled}
                />
              </TabPanel>
            );
          })}
        </Tab>
        <div className={cs.footer_button}>
          <Button style="primary" onClick={this.onSave}>
            {i18n['app.btn.save']}
          </Button>
          <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
        </div>
      </div>
    );
  }
}
