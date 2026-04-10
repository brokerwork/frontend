import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import cs from './index.less';
import Tab from 'components/Tab';
import BasicInfo from '../BasicInfo';
import Account from '../Account';
import DepositSetting from 'landings/Home/path/Trader/components/DepositSetting';
import Withdraw from 'landings/Home/path/Trader/components/Withdraw';
import OpenAccount from '../OpenAccount';
import {
  doSomeOperation,
  exchangeOrder,
  getBrandInfo,
  payPlatSettingSort,
  updatePayPlat,
  updateRateSetting
} from '../../../../controls/actions';
const TabPanel = Tab.Panel;

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { getPlatSetting, getBrandInfo, getPlatformSetting, getFieldType } = this.props;
    getBrandInfo();
    getPlatSetting(this.getPlat());
    getPlatformSetting(this.getPlat());
    getFieldType();
  };

  //获取自定义平台id
  getPlat = () => {
    const {
      match: { params: { plat } = {} }
    } = this.props;
    return plat;
  };

  //获取对应的自定义平台名
  getPlatformName = () => {
    const { customPlatforms = [] } = this.props;
    const platform = customPlatforms.find(item => item.key === this.getPlat());
    return !!platform ? platform.name : '';
  };

  render() {
    const {
      paltSetting,
      paltSetting: { basicSetting, depositSetting, va, withdrawSetting, tranSetting },
      brandInfo,
      brandInfo: { languages = [] } = {},
      getPlatSetting,
      submitForm,
      resetForm,
      showTopAlert,
      showTipsModal,
      savePlatSetting,
      saveAccount,
      deleteAccountType,
      doSomeOperation,
      updatePayPlat,
      addRateSetting,
      deleteRateSetting,
      updateRateSetting,
      payPlatSettingSort,
      exchangeOrder,
      editOperation,
      platformSetting,
      savePlatformSetting
    } = this.props;

    const { activeKey } = this.state;

    const plat = this.getPlat();

    return (
      <ContentWrapper
        bodyContentClass={cs.content_height}
        header={`${i18n['left.menu.platform.setting.prefix']}${this.getPlatformName()}`}
      >
        <div className={cs.ctraderSetting}>
          <Tab
            className={cs.setting_tab}
            activeKey={activeKey}
            id="customSetting"
            onChange={key => {
              this.setState({ activeKey: key });
            }}
          >
            <TabPanel className={cs.setting_tabpanel} eventKey={1} title={i18n['trader.plat.setting.basicInfo']}>
              <BasicInfo
                submitForm={submitForm}
                resetForm={resetForm}
                basicSetting={basicSetting}
                savePlatSetting={savePlatSetting}
                showTopAlert={showTopAlert}
                plat={plat}
                type={'basic'}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={2} title={i18n['trader.plat.setting.accountSetting']}>
              <Account
                submitForm={submitForm}
                resetForm={resetForm}
                showTopAlert={showTopAlert}
                saveAccount={saveAccount}
                plat={plat}
                languages={languages}
                paltSetting={paltSetting}
                getPlatSetting={getPlatSetting}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={3} title={i18n['trader.plat.setting.createAccount']}>
              <OpenAccount
                paltSetting={paltSetting}
                submitForm={submitForm}
                reset={resetForm}
                getPlatSetting={getPlatSetting}
                deleteAccountType={deleteAccountType}
                showTipsModal={showTipsModal}
                plat={plat}
                // productId={productId}
                savePlatSetting={savePlatSetting}
                showTopAlert={showTopAlert}
                platformSetting={platformSetting}
                savePlatformSetting={savePlatformSetting}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={4} title={i18n['trader.plat.setting.income']}>
              <DepositSetting
                depositSetting={depositSetting}
                plat={plat}
                va={va}
                // productId={productId}
                type="deposit"
                doSomeOperation={doSomeOperation}
                getPlatSetting={getPlatSetting}
                updatePayPlat={updatePayPlat}
                savePlatSetting={savePlatSetting}
                submitForm={submitForm}
                reset={resetForm}
                updateRateSetting={updateRateSetting}
                addRateSetting={addRateSetting}
                deleteRateSetting={deleteRateSetting}
                payPlatSettingSort={payPlatSettingSort}
                exchangeOrder={exchangeOrder}
                showTopAlert={showTopAlert}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={5} title={i18n['trader.plat.setting.withdraw']}>
              <Withdraw
                brandInfo={brandInfo}
                plat={plat}
                submitForm={submitForm}
                withdrawSetting={withdrawSetting}
                depositSetting={depositSetting}
                tranSetting={tranSetting}
                getPlatSetting={getPlatSetting}
                updateRateSetting={updateRateSetting}
                addRateSetting={addRateSetting}
                deleteRateSetting={deleteRateSetting}
                exchangeOrder={exchangeOrder}
                savePlatSetting={savePlatSetting}
                reset={resetForm}
                showTipsModal={showTipsModal}
                doSomeOperation={doSomeOperation}
                reload={this.loadData}
                showTopAlert={showTopAlert}
              />
            </TabPanel>
          </Tab>
        </div>
      </ContentWrapper>
    );
  }
}
