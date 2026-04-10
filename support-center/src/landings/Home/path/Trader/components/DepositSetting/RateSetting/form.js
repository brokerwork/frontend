import Panel from 'components/Panel';
import List from './List';
import PayPlatForm from './PayPlatForm';
import TelegraphicForm from './TelegraphicForm';
import Tab from 'components/Tab';
import FieldSetting from './FieldSetting';
import i18n from 'utils/i18n';
import { rateSettingColumns, otherSettingColumns } from '../constant';
import { reduxForm } from 'redux-form';
import TelegraphicTabs from './TelegraphicTabs';
import cs from './index.less';
import _ from 'lodash';
import Button from 'components/Button';
import AddRateModal from './AddRateModal';
import EditModal from './EditModal';

export const DEPOSIT_SETTING_FORM = 'TRADER_PLAT_SETTING_DEPOSIT_SETTING_FORM';
let telegraphicFields = [];
class DepositSetting extends PureComponent {
  state = {
    isPayPlatAuth: false,
    addRateModalVisible: false,
    activeKey: 2
  };
  componentDidMount() {
    const { initialValues } = this.props;
    const isPayPlatAuth = initialValues.payList.some(
      pay => pay.providerName.indexOf('款亚') >= 0 || pay.providerName.indexOf('支付通道') >= 0
    );
    this.setState({
      isPayPlatAuth
    });
  }

  toggleAddRateModal = visible => {
    this.setState({ addRateModalVisible: visible });
  };
  onChangeField = fields => {
    telegraphicFields = fields;
  };
  render() {
    const {
      initialValues,
      doSomeOperation,
      plat,
      getPlatSetting,
      showTipsModal,
      updatePayPlat,
      submitForm,
      updateRateSetting,
      addRateSetting,
      deleteRateSetting,
      payPlatSettingSort,
      exchangeOrder,
      va,
      showTopAlert,
      accountGroups,
      saveAccountConfig,
      versionRights,
      brandInfo: { languages = [] } = {},
      array
    } = this.props;
    const { isPayPlatAuth, addRateModalVisible, activeKey } = this.state;
    initialValues.telegraphicsList = initialValues.telegraphicsList || [initialValues.telegraphics];
    if (!initialValues) return null;
    return (
      <div>
        <Panel
          header={
            <div className={cs['rate_header']}>
              <div>{i18n['platform.tab.deposit.exchange.setting.title']}</div>
              <Button style="primary" onClick={this.toggleAddRateModal.bind(this, true)}>
                {i18n['platform.tab.deposit.exchange.add']}
              </Button>
            </div>
          }
        >
          <List
            data={initialValues.exchangeRateSettings}
            defaultCurrencyPair={initialValues.defaultCurrencyPair}
            doSomeOperation={doSomeOperation}
            plat={plat}
            getPlatSetting={getPlatSetting}
            showTipsModal={showTipsModal}
            columns={rateSettingColumns}
            heightLimit={true}
            type="rate"
            sortType="deposit"
            submitForm={submitForm}
            updateRateSetting={updateRateSetting}
            deleteRateSetting={deleteRateSetting}
            platSettingSort={exchangeOrder}
            showTopAlert={showTopAlert}
          />
        </Panel>
        <Panel header={i18n['trader.plat.setting.payplat.title']}>
          <List
            data={initialValues.payList}
            defaultCurrencyPair={initialValues.defaultCurrencyPair}
            doSomeOperation={doSomeOperation}
            plat={plat}
            getPlatSetting={getPlatSetting}
            showTipsModal={showTipsModal}
            columns={otherSettingColumns}
            type="payPlat"
            sortType="pay"
            heightLimit={true}
            updatePayPlat={updatePayPlat}
            submitForm={submitForm}
            platSettingSort={payPlatSettingSort}
            showTopAlert={showTopAlert}
            saveAccountConfig={saveAccountConfig}
            accountGroups={accountGroups}
            versionRights={versionRights}
          />
          <div className={cs.margin_top}>
            <PayPlatForm isPayPlatAuth={isPayPlatAuth} />
          </div>
        </Panel>
        <Panel header={i18n['trader.plat.setting.deposit.telegraphic.title']}>
          {va ? (
            <TelegraphicTabs
              languages={languages}
              plat={plat}
              onChangeField={this.onChangeField}
              fields={initialValues.telegraphicFields}
              personalList={initialValues.personalTelegraphic}
              publicList={initialValues.publicTelegraphic}
            />
          ) : (
            <Tab
              activeKey={activeKey}
              id="telegraphic"
              onSelect={key => {
                this.setState({ activeKey: key });
              }}
            >
              <Tab.Panel eventKey={2} title={i18n['menu.fundmgmt.telegraphic']}>
                <TelegraphicForm
                  list={initialValues.telegraphicsList || []}
                  languages={languages}
                  plat={plat}
                  formArray={array}
                ></TelegraphicForm>
              </Tab.Panel>
              <Tab.Panel eventKey={3} title={i18n['left.menu.field.setting']}>
                <div className={cs.margin_top}>
                  <FieldSetting onChangeField={this.onChangeField} fields={initialValues.telegraphicFields} />
                </div>
              </Tab.Panel>
            </Tab>
          )}
        </Panel>
        {addRateModalVisible && (
          <AddRateModal
            onClose={this.toggleAddRateModal.bind(this, false)}
            submitForm={submitForm}
            type="deposit"
            plat={plat}
            showTopAlert={showTopAlert}
            getPlatSetting={getPlatSetting}
            addRateSetting={addRateSetting}
          />
        )}
      </div>
    );
  }
}

const TraderDepositSettingForm = reduxForm({
  form: DEPOSIT_SETTING_FORM,
  enableReinitialize: true
})(DepositSetting);

export default class DepositForm extends PureComponent {
  formateFloat = (value, float) => {
    return value && Number(value).toFixed(float);
  };
  onSubmit = values => {
    const { savePlatSetting, plat, type, getPlatSetting, productId, va, showTopAlert } = this.props;
    if (!va) {
      values.charges = this.formateFloat(values.charges, 8);
      values.minDeposit = this.formateFloat(values.minDeposit, 4);
      values.maxDeposit = this.formateFloat(values.maxDeposit, 4);
    } else {
      values.personalTelegraphic.charges = this.formateFloat(values.personalTelegraphic.charges, 8);
      values.personalTelegraphic.minDeposit = this.formateFloat(values.personalTelegraphic.minDeposit, 4);
      values.personalTelegraphic.maxDeposit = this.formateFloat(values.personalTelegraphic.maxDeposit, 4);
      values.publicTelegraphic.charges = this.formateFloat(values.publicTelegraphic.charges, 8);
      values.publicTelegraphic.minDeposit = this.formateFloat(values.publicTelegraphic.minDeposit, 4);
      values.publicTelegraphic.maxDeposit = this.formateFloat(values.publicTelegraphic.maxDeposit, 4);
    }

    const params = _.cloneDeep(values);
    console.log('params', params);
    let mapOne = {};
    for (let key in params) {
      if (key.indexOf('telegraphics_') !== -1) {
        mapOne[key.split('_').pop()] = params[key];
        plat !== 'CTRADER' && delete params[key];
      }
    }
    plat !== 'CTRADER' && (params.telegraphics = mapOne);
    let mapTwo = {};
    for (let key in params.personalTelegraphic) {
      if (key.indexOf('telegraphics_') !== -1) {
        mapTwo[key.split('_').pop()] = params.personalTelegraphic[key];
        plat !== 'CTRADER' && delete params.personalTelegraphic[key];
      }
    }
    plat !== 'CTRADER' && (params.personalTelegraphic.telegraphics = mapTwo);
    let mapThree = {};
    for (let key in params.publicTelegraphic) {
      if (key.indexOf('telegraphics_') !== -1) {
        mapThree[key.split('_').pop()] = params.publicTelegraphic[key];
        plat !== 'CTRADER' && delete params.publicTelegraphic[key];
      }
    }
    plat !== 'CTRADER' && (params.publicTelegraphic.telegraphics = mapThree);
    params.productId = productId;
    // 如果富文本为空不保存-todo:va的可能还要处理
    params.telegraphicsList = params.telegraphicsList.filter(el => {
      const obj = { ...el };
      delete obj.activeKey;
      let allEmpty = true;
      for (let i in obj) {
        allEmpty = !obj[i].trim();
      }
      return !allEmpty;
    });
    savePlatSetting(plat, type, { ...params, telegraphicFields }).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getPlatSetting(plat);
      }
    });
  };
  render() {
    const { depositSetting, va, ...props } = this.props;
    if (!depositSetting) return null;
    if (depositSetting.telegraphics) {
      for (let key in depositSetting.telegraphics) {
        depositSetting[`telegraphics_${key}`] = depositSetting.telegraphics[key];
      }
    }
    if (depositSetting.personalTelegraphic.telegraphics) {
      for (let key in depositSetting.personalTelegraphic.telegraphics) {
        depositSetting.personalTelegraphic[`telegraphics_${key}`] =
          depositSetting.personalTelegraphic.telegraphics[key];
      }
    }
    if (depositSetting.publicTelegraphic.telegraphics) {
      for (let key in depositSetting.publicTelegraphic.telegraphics) {
        depositSetting.publicTelegraphic[`telegraphics_${key}`] = depositSetting.publicTelegraphic.telegraphics[key];
      }
    }
    return (
      <div>
        <TraderDepositSettingForm initialValues={depositSetting} {...props} onSubmit={this.onSubmit} va={va} />
      </div>
    );
  }
}
