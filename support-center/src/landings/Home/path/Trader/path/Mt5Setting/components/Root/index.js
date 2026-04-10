import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import CreditSetting from '../../../../components/CreditSetting';
import BasicInfo from 'landings/Home/path/Trader/components/BasicInfo';
import Withdraw from '../../../../components/Withdraw';
import DepositSetting from 'landings/Home/path/Trader/components/DepositSetting';
import OpenAccount from 'landings/Home/path/Trader/components/OpenAccount';
import AccountSetting from 'landings/Home/path/Trader/components/AccountSetting';

import cs from './index.less';
import { getTenantId } from 'utils/tenantInfo';

const PRO_RIGHT = 'SC_CUSTOM_ACCOUNT_TYPE';
const TabPanel = Tab.Panel;
const plat = 'MT5';
const TabList = ['basic'];

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
    const tenantId = getTenantId();

    const {
      getBrandInfo,
      getPlatSetting,
      getLeverageList,
      getPlatformSetting,
      getFieldType,
      getAccountTypeConfig,
      getRiskDescData,
      getOpenDescData,
      getSameAccountSettingData
    } = this.props;
    getBrandInfo();
    getPlatSetting(plat);
    getLeverageList();
    // getPlatformSetting(plat);
    getFieldType();
    getSameAccountSettingData(plat);
    getAccountTypeConfig(tenantId).then(res => {
      if (res.result) {
        if (res.data.accountTypeInfos && res.data.accountTypeInfos.length) {
          // if (PRO_RIGHT === 'SC_CUSTOM_ACCOUNT_TYPE') {
          //   const accountTypeInfos = res.data.accountTypeInfos;
          //   getPlatformSetting(plat, accountTypeInfos[0]['customerAccountType']);
          //   getRiskDescData(plat, accountTypeInfos[0]['customerAccountType']);
          //   getOpenDescData(plat, accountTypeInfos[0]['customerAccountType']);
          // } else {
          //   getPlatformSetting(plat);
          //   getRiskDescData(plat);
          //   getOpenDescData(plat);
          // }
          const accountTypeInfos = res.data.accountTypeInfos;
          getPlatformSetting(plat, accountTypeInfos[0]['customerAccountType']);
          getRiskDescData(plat, accountTypeInfos[0]['customerAccountType']);
          getOpenDescData(plat, accountTypeInfos[0]['customerAccountType']);
        }
      }
    });
  };
  render() {
    const { activeKey } = this.state;
    const {
      paltSetting: { basicSetting, bonusSetting, withdrawSetting, depositSetting, tranSetting, productId, va },
      paltSetting,
      submitForm,
      savePlatSettingBonus,
      leverageList,
      savePlatSetting,
      reset,
      doSomeOperation,
      getPlatSetting,
      updatePayPlat,
      addRateSetting,
      deleteRateSetting,
      updateRateSetting,
      exchangeOrder,
      showTipsModal,
      payPlatSettingSort,
      deleteAccountType,
      showTopAlert,
      getRate,
      operateSync,
      brandInfo,
      versionRights,
      platformSetting,
      savePlatformSetting,
      accountTypeConfig,
      updateAccountTypeConfig,
      getPlatformSetting,
      riskDescData,
      openDescData,
      getRiskDescData,
      getOpenDescData,
      saveOpenAccountSettingData,
      sameAccountData,
      saveSameAccountSettingData,
      getSameAccountSettingData
    } = this.props;
    return (
      <ContentWrapper bodyContentClass={cs.content_height} header={i18n['left.menu.platmtMt5.setting']}>
        <div className={cs.mt5Setting}>
          <Tab
            className={cs.setting_tab}
            activeKey={activeKey}
            id="mt5Setting"
            onChange={key => {
              this.setState({ activeKey: key });
            }}
          >
            <TabPanel className={cs.setting_tabpanel} eventKey={1} title={i18n['trader.plat.setting.basicInfo']}>
              <BasicInfo
                basicSetting={basicSetting}
                leverageList={leverageList}
                submitForm={submitForm}
                savePlatSetting={savePlatSetting}
                plat={plat}
                operateSync={operateSync}
                getPlatSetting={getPlatSetting}
                type={TabList[0]}
                reset={reset}
                productId={productId}
                versionRights={versionRights}
                showTopAlert={showTopAlert}
                showTipsModal={showTipsModal}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={'6'} title={i18n['trader.plat.setting.accountSetting']}>
              <AccountSetting
                accountTypeConfig={accountTypeConfig}
                basicSetting={basicSetting}
                plat={plat}
                updateAccountTypeConfig={updateAccountTypeConfig}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={2} title={i18n['trader.plat.setting.createAccount']}>
              <OpenAccount
                brandInfo={brandInfo}
                plat={plat}
                paltSetting={paltSetting}
                submitForm={submitForm}
                reset={reset}
                getPlatSetting={getPlatSetting}
                deleteAccountType={deleteAccountType}
                showTipsModal={showTipsModal}
                plat={plat}
                productId={productId}
                savePlatSetting={savePlatSetting}
                showTopAlert={showTopAlert}
                platformSetting={platformSetting}
                versionRights={versionRights}
                savePlatformSetting={savePlatformSetting}
                accountTypeConfig={accountTypeConfig}
                getPlatformSetting={getPlatformSetting}
                getRiskDescData={getRiskDescData}
                getOpenDescData={getOpenDescData}
                riskDescData={riskDescData}
                openDescData={openDescData}
                saveOpenAccountSettingData={saveOpenAccountSettingData}
                versionRights={versionRights}
                sameAccountData={sameAccountData}
                saveSameAccountSettingData={saveSameAccountSettingData}
                getSameAccountSettingData={getSameAccountSettingData}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={3} title={i18n['trader.plat.setting.income']}>
              <DepositSetting
                depositSetting={depositSetting}
                plat={plat}
                va={va}
                productId={productId}
                type="deposit"
                doSomeOperation={doSomeOperation}
                getPlatSetting={getPlatSetting}
                updatePayPlat={updatePayPlat}
                savePlatSetting={savePlatSetting}
                submitForm={submitForm}
                reset={reset}
                addRateSetting={addRateSetting}
                deleteRateSetting={deleteRateSetting}
                updateRateSetting={updateRateSetting}
                payPlatSettingSort={payPlatSettingSort}
                exchangeOrder={exchangeOrder}
                showTopAlert={showTopAlert}
                brandInfo={brandInfo}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={4} title={i18n['trader.plat.setting.withdraw']}>
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
                reset={reset}
                showTipsModal={showTipsModal}
                doSomeOperation={doSomeOperation}
                reload={this.loadData.bind(this)}
                showTopAlert={showTopAlert}
                getRate={getRate}
              />
            </TabPanel>
            {versionRights['SC_GRANTS_SET'] ? (
              <TabPanel className={cs.setting_tabpanel} eventKey={5} title={i18n['trader.plat.setting.credit']}>
                <CreditSetting
                  plat={plat}
                  bonusSetting={bonusSetting}
                  submitForm={submitForm}
                  savePlatSettingBonus={savePlatSettingBonus}
                  showTopAlert={showTopAlert}
                />
              </TabPanel>
            ) : (
              undefined
            )}
          </Tab>
        </div>
      </ContentWrapper>
    );
  }
}
