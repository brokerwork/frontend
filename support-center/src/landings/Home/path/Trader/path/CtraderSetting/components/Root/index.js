import ContentWrapper from 'components/ContentWrapper';
import BasicInfo from 'landings/Home/path/Trader/components/BasicInfo';
import DepositSetting from 'landings/Home/path/Trader/components/DepositSetting';
import OpenAccount from 'landings/Home/path/Trader/components/OpenAccount';

import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import Withdraw from '../../../../components/Withdraw';
import cs from './index.less';
const TabPanel = Tab.Panel;
const plat = 'CTRADER';
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
    const { getPlatSetting, getLeverageList, getPlatformSetting, getFieldType } = this.props;
    getPlatSetting(plat);
    getLeverageList();
    getPlatformSetting(plat);
    getFieldType();
  };
  render() {
    const { activeKey } = this.state;
    const {
      paltSetting: { basicSetting, withdrawSetting, depositSetting, tranSetting, va },
      paltSetting,
      submitForm,
      leverageList,
      savePlatSetting,
      reset,
      doSomeOperation,
      exchangeOrder,
      showTipsModal,
      updatePayPlat,
      addRateSetting,
      deleteRateSetting,
      updateRateSetting,
      productId,
      getPlatSetting,
      payPlatSettingSort,
      deleteAccountType,
      showTopAlert,
      platformSetting,
      savePlatformSetting,
      versionRights
    } = this.props;
    return (
      <ContentWrapper bodyContentClass={cs.content_height} header={i18n['left.menu.platmtCtrader.setting']}>
        <div className={cs.ctraderSetting}>
          <Tab
            className={cs.setting_tab}
            activeKey={activeKey}
            id="ctraderSetting"
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
                type={TabList[0]}
                reset={reset}
                productId={productId}
                showTopAlert={showTopAlert}
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={2} title={i18n['trader.plat.setting.createAccount']}>
              <OpenAccount
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
              />
            </TabPanel>
            <TabPanel className={cs.setting_tabpanel} eventKey={4} title={i18n['trader.plat.setting.withdraw']}>
              <Withdraw
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
              />
            </TabPanel>
          </Tab>
        </div>
      </ContentWrapper>
    );
  }
}
