import Table from 'components/FixTable';
import Panel from 'components/Panel';
import Button from 'components/Button';
import Radio from 'components/Radio';
import i18n from 'utils/i18n';
import DfttCard from './Dftt.js';
import ExportForm, { EXPORT_FORM } from './ExportForm.js';
import RiskForm, { RISK_FORM } from './RiskForm';
import cs from './style.less';
import { rateSettingColumns } from '../DepositSetting/constant';
import RateList from '../DepositSetting/RateSetting/List';
import AddRateModal from '../DepositSetting/RateSetting/AddRateModal';

export default class Withdraw extends PureComponent {
  state = {
    editWithdrawShow: false,
    editWithdrawItem: {},
    addRateModalVisible: false
  };
  source = rate => {
    if (rate.exchangeMode === 'Manual') {
      return '--';
    }
    if (rate.payCurrency === 'CNY' && rate.transactionCurrency === 'USD') {
      if (rate.exchangeSource === 'BankDiscountPrice') {
        return i18n['platform.tab.exchange.source.bank.discount'];
      }
      if (rate.exchangeSource === 'CashPurchasePrice') {
        return i18n['platform.tab.exchange.source.cash.purchase'];
      }
      return i18n['platform.tab.exchange.source.cash.sale'];
    }
    return '--';
  };
  editWithdraw = item => {
    this.setState({
      editWithdrawShow: true,
      editWithdrawItem: item
    });
  };
  closeEditWithdraw = () => {
    this.setState({ editWithdrawShow: false, editWithdrawItem: {} });
  };
  arrTans(arr, oldIndex, newIndex) {
    const oldId = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, oldId);
    return arr;
  }
  onSort = evt => {
    const { oldIndex, newIndex } = evt;
    const { withdrawSetting, plat, exchangeOrder } = this.props;
    const exchangeRateSettings = _.get(withdrawSetting, 'exchangeRateSettings', []);
    const copyed = [].concat(exchangeRateSettings).map(item => _.pick(item, ['transactionCurrency', 'payCurrency']));
    const end = this.arrTans(copyed, oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      exchangeOrder(plat, 'withdraw', end);
    }
  };
  onSubmit = formName => {
    const { submitForm } = this.props;
    submitForm(formName);
  };
  onRiskSubmit = vals => {
    // 这里需要转换格式把多个属性集合在一个属性(除了ctrader)
    let map = {};
    for (let key in vals) {
      if (key.indexOf('agreement') !== -1) {
        map[key.split('_').pop()] = vals[key];
        // this.props.plat !== 'CTRADER' && delete vals[key];
      }
    }
    vals.riskAgreement = map;
    const { savePlatSetting, plat, showTopAlert, reload } = this.props;
    vals.productId = 'TW';
    savePlatSetting(plat, 'withdraw/risk-desc', vals).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        reload();
      }
    });
  };
  onExportSubmit = vals => {
    // 这里需要转换格式把多个属性集合在一个属性(除了ctrader)
    let map = {};
    for (let key in vals) {
      if (key.indexOf('agreement') !== -1) {
        map[key.split('_').pop()] = vals[key];
        this.props.plat !== 'CTRADER' && delete vals[key];
      }
    }
    vals.riskAgreement = map;
    const { plat, savePlatSetting, withdrawSetting, showTopAlert, reload } = this.props;
    const data = _.assign({}, withdrawSetting, vals);
    data.productId = 'TW';
    savePlatSetting(plat, 'tran-setting', data).then(({ result }) => {
      showTopAlert({
        style: 'success',
        content: i18n['general.save_success']
      });
      reload();
    });
  };
  onReset = formName => {
    const { reset } = this.props;
    reset(formName);
  };

  toggleAddRateModal = visible => {
    this.setState({ addRateModalVisible: visible });
  };
  onRef = dfttCard => {
    this.dfttCard = dfttCard;
  };
  render() {
    const { editWithdrawShow, editWithdrawItem, addRateModalVisible } = this.state;
    const {
      brandInfo,
      withdrawSetting = {},
      tranSetting = {},
      submitForm,
      updateRateSetting,
      deleteRateSetting,
      plat,
      reload,
      getRate,
      showTopAlert,
      showTipsModal,
      doSomeOperation,
      exchangeOrder,
      getPlatSetting,
      addRateSetting,
      accountGroups,
      saveWithdrawAccountGroup
    } = this.props;
    const { exchangeRateSettings = [] } = withdrawSetting;
    const withdrawTypes = _.get(withdrawSetting, 'withdrawTypes', []);
    withdrawSetting.withdrawTypeBC = _.includes(withdrawTypes, 'BANK_CARD');
    withdrawSetting.withdrawTypeDC = _.includes(withdrawTypes, 'DIGITAL_CASH');
    const dfttVals = _.pick(withdrawSetting, 'ways');
    // 转换格式为对应的form表单字段
    let tran = _.cloneDeep(tranSetting);
    if (plat !== 'CTRADER') {
      for (let key in tran.riskAgreement) {
        tran[`agreement_${key}`] = tran.riskAgreement[key];
      }
    }
    const riskVals = _.pick(withdrawSetting, ['riskAgreement', 'riskTipMode', 'enableRiskTip']);
    if (plat !== 'CTRADER') {
      for (let key in riskVals.riskAgreement) {
        riskVals[`agreement_${key}`] = riskVals.riskAgreement[key];
      }
    } else {
      riskVals.agreement = riskVals.riskAgreement && riskVals.riskAgreement.agreement;
    }
    return (
      <div className={cs['wdith-draw']}>
        <Panel
          className={cs['table-panel']}
          header={
            <div className={cs['rate_header']}>
              <div>{i18n['platform.tab.deposit.exchange.setting.title']}</div>
              <Button style="primary" onClick={this.toggleAddRateModal.bind(this, true)}>
                {i18n['platform.tab.deposit.exchange.add']}
              </Button>
            </div>
          }
        >
          <RateList
            data={exchangeRateSettings}
            defaultCurrencyPair={withdrawSetting.defaultCurrencyPair}
            doSomeOperation={doSomeOperation}
            plat={plat}
            getPlatSetting={getPlatSetting}
            showTipsModal={showTipsModal}
            columns={rateSettingColumns}
            heightLimit={true}
            type="rate"
            sortType="withdraw"
            submitForm={submitForm}
            updateRateSetting={updateRateSetting}
            deleteRateSetting={deleteRateSetting}
            platSettingSort={exchangeOrder}
            showTopAlert={showTopAlert}
          />
        </Panel>
        <Panel
          header={
            <div className={cs['rate_header']}>
              <div>{i18n['platform.tab.dftt.settings']}</div>
              <Button
                style="primary"
                onClick={() => {
                  this.dfttCard.edit(
                    i18n['settings.deposit_withdraw.withdraw.create'],
                    undefined,
                    '',
                    [],
                    true,
                    '',
                    {}
                  );
                }}
              >
                {i18n['settings.deposit_withdraw.withdraw.create']}
              </Button>
            </div>
          }
        >
          <DfttCard
            getPlatSetting={getPlatSetting}
            brandInfo={brandInfo}
            data={dfttVals}
            plat={plat}
            reload={reload}
            onRef={this.onRef}
            accountGroups={accountGroups}
            saveWithdrawAccountGroup={saveWithdrawAccountGroup}
          />
          {/* <div className={cs['btn-g']}>
            <Button style="primary" onClick={this.onSubmit.bind(this, DFTT_FORM)}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.onReset.bind(this, DFTT_FORM)}>{i18n['app.btn.reset']}</Button>
          </div> */}
        </Panel>
        <Panel header={i18n['platform.tab.dftt.ext.transfer.setting']}>
          <ExportForm brandInfo={brandInfo} plat={plat} initialValues={tran} onSubmit={this.onExportSubmit} />
          <div className={cs['btn-g']}>
            <Button style="primary" onClick={this.onSubmit.bind(this, EXPORT_FORM)}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.onReset.bind(this, EXPORT_FORM)}>{i18n['app.btn.reset']}</Button>
          </div>
        </Panel>
        <Panel header={i18n['platform.tab.withdraw.risk.setting.panel']}>
          <RiskForm brandInfo={brandInfo} initialValues={riskVals} plat={plat} onSubmit={this.onRiskSubmit} />
        </Panel>
        {addRateModalVisible && (
          <AddRateModal
            onClose={this.toggleAddRateModal.bind(this, false)}
            submitForm={submitForm}
            plat={plat}
            type="withdraw"
            showTopAlert={showTopAlert}
            getPlatSetting={getPlatSetting}
            addRateSetting={addRateSetting}
          />
        )}
      </div>
    );
  }
}
