import CbrokerForm, { CBROKER_BALANCE_FORM } from './CbrokerForm';
import Form, { BALANCE_FORM } from './Form';

import cs from './Balance.less';
import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';
import InfoCard from './components/InfoCard';
import { Radio } from 'lean-ui';
import CreateTaskForm, { CREATE_TASKS_FORM } from './components/CreateTasks';
import TransferTaskForm, { TRANSFER_TASKS_FORM } from './components/Transfer';
import {
  typeList,
  notHideBox,
  isShowFieldsByWithdraw,
  defaultState
} from './constant';
let cuServer = {
  vendor: location.search && location.search.split('&')[0].split('=')[1],
  serverId: location.search && location.search.split('&')[1].split('=')[1]
};

export default class Balance extends PureComponent {
  bankObj = {};
  withdrawTypesMap = {};
  accountNameObj = {};
  lock = false;
  constructor(props) {
    super(props);
    this.state = defaultState;
  }
  componentDidMount() {
    const {
      getOsConfig,
      getBankLists,
      getBindBank,
      getMaxWithdraw,
      getFormFields,
      currentServer: { vendor, serverId },
      accountId,
      accountInfo,
      ownerInfo: { baseInfo },
      getWithdrawList,
      getRelateAccountList,
      ownerRelatedInfo: { customer }
    } = this.props;
    // 获取出金方式列表
    getWithdrawList(vendor).then(res => {
      if (res.result && res.data && res.data.length) {
        let items = [...this.state.fieldItem];
        let withdrawTaskInfo = this.state.withdrawTaskInfo;
        withdrawTaskInfo.withdrawType = res.data[0]; // 出金方式默认显示第一条
        this.getFieldValue(items, 'withdrawType').hide = res.data.length == 1;
        this.getFieldValue(items, 'withdrawType').list = res.data.map(el => {
          let label = i18n[`settings.deposit_withdraw.${el}`];
          this.withdrawTypesMap[el] = label;
          return {
            value: el,
            label
          };
        });
        getFormFields(vendor, res.data[0]);
        this.setState({
          fieldItem: items,
          withdrawTaskInfo
        });
      }
    });
    // os配置
    getOsConfig().then(res => {
      if (res.result) {
        const configData =
          res.data &&
          res.data.length &&
          res.data.find(item => item.structural === vendor);
        const withdrawSetting = _.get(configData, 'withdrawSetting', {});
        const defaultExchangeRateSetting =
          withdrawSetting.defaultExchangeRateSetting;
        this.riskTipMode = withdrawSetting.riskTipMode;
        this.riskDesc = withdrawSetting.riskDesc;
        this.enableRiskTip = withdrawSetting.enableRiskTip;
        // 存汇率信息
        this.defaultExchangeRateSetting = defaultExchangeRateSetting;
        this.exchangeRateSettings = withdrawSetting.exchangeRateSettings;
        // 取数据
        let data = { ...accountInfo, ...baseInfo };
        this.account = data.account;
        let payCurrencyList = withdrawSetting.exchangeRateSettings
          .filter(el => {
            return el.transactionCurrency === data.currency && el.status;
          })
          .map(el => {
            return {
              value: el.payCurrency,
              label: `${el.payCurrency}`
            };
          });
        this.payCurrencyList = payCurrencyList;
        let items = [...this.state.fieldItem];
        let withdrawTaskInfo = this.state.withdrawTaskInfo;
        withdrawTaskInfo.account = data.account;
        withdrawTaskInfo.accountName = data.accountName;
        // 当currency 不存在是 不展示账户货币、出金货币
        if (data.currency) {
          withdrawTaskInfo.currency = data.currency;
          this.getFieldValue(
            items,
            'withdrawCurrency'
          ).hide = !payCurrencyList.length;
          withdrawTaskInfo.withdrawCurrency =
            defaultExchangeRateSetting.transactionCurrency === data.currency
              ? defaultExchangeRateSetting.payCurrency
              : payCurrencyList[0] && payCurrencyList[0].value;
          this.getFieldValue(items, 'withdrawCurrency').list = payCurrencyList;
        } else {
          this.getFieldValue(items, 'currency').hide = true;
          this.getFieldValue(items, 'withdrawCurrency').hide = true;
        }
        // 当接口没有返回账户余额，可出金余额时，则对应字段不展示
        const balanceValue = data.balance;
        if (balanceValue) {
          withdrawTaskInfo.balance = balanceValue;
        } else {
          this.getFieldValue(items, 'balance').hide = true;
        }
        //
        this.showFieldsByWithdraw(withdrawTaskInfo.withdrawType, items);
        // 设置字段是否必填
        const ways = _.get(withdrawSetting, 'ways', []);
        const waysItem =
          ways.find(item => item.withdrawType === this.props.withdrawList[0]) ||
          {};
        const fields = waysItem.fields || [];
        fields.forEach(item => {
          if (this.getFieldValue(items, item.fieldId)) {
            this.getFieldValue(items, item.fieldId).required = item.required;
          }
        });
        const notice = waysItem.notice || '';
        let payCurrency = '';
        let showExchange = '';
        let finalExchange = '';
        if (defaultExchangeRateSetting.transactionCurrency === data.currency) {
          payCurrency = defaultExchangeRateSetting.payCurrency;
          let {
            showExchange: s1,
            exchange,
            exchangeFloat
          } = this.defaultExchangeRateSetting;
          showExchange = s1;
          finalExchange = exchange * (1 + exchangeFloat / 100);
        } else {
          payCurrency = payCurrencyList[0] && payCurrencyList[0].value;
          let { showExchange: s1, exchange, exchangeFloat } =
            this.exchangeRateSettings.find(el => {
              return (
                el.payCurrency === payCurrency &&
                el.transactionCurrency === data.currency
              );
            }) || {};
          showExchange = s1;
          finalExchange = exchange * (1 + exchangeFloat / 100);
        }
        // 设置state
        this.setState({
          notice,
          fieldItem: items,
          showExchange,
          finalExchange,
          payCurrency,
          withdrawTaskInfo
        });
      }
    });
    let items = [...this.state.fieldItem];
    let withdrawTaskInfo = this.state.withdrawTaskInfo;
    const publicParams = {
      serverId: location.search.split('&')[1].split('=')[1],
      vendor,
      account: accountId
    };
    // 可选取银行
    getBankLists(publicParams).then(rs => {
      if (rs.result) {
        this.getFieldValue(items, 'bank').list = rs.data;
        rs.data.forEach(el => {
          this.bankObj[el.value] = el.label;
        });
        // 取绑定银行
        getBindBank(publicParams).then(bank => {
          if (bank.result) {
            this.getFieldValue(items, 'bankAccount').list =
              bank.data &&
              bank.data.map(el => {
                return {
                  value: el.bankAccountNumber,
                  label: `${
                    this.bankObj[el.bankName]
                      ? this.bankObj[el.bankName].substr(0, 8)
                      : el.bankName.substr(0, 8)
                  } ${
                    i18n['settings.deposit_withdraw.create_task.lastBankNumber']
                  }${el.bankAccountNumber.substr(-4, 4)}${el.bankAccountName}`
                };
              });
            // 默认银行信息
            let defaultInfo = bank.data.find(el => {
              return el.isDefault;
            });
            if (defaultInfo) {
              withdrawTaskInfo.bankAccount = defaultInfo.bankAccountNumber;
              withdrawTaskInfo.bankAccountName = defaultInfo.bankAccountName;
              withdrawTaskInfo.bank = defaultInfo.bankName;
              withdrawTaskInfo.bankBranchName = defaultInfo.bankBranchName;
              withdrawTaskInfo.SWIFT = defaultInfo.SWIFT;
              withdrawTaskInfo.bankAddress = defaultInfo.bankAddress;
            }
            this.setState({
              fieldItem: items,
              withdrawTaskInfo
            });
          }
        });
        this.setState({
          fieldItem: items
        });
      }
    });
    // 取可用余额
    getMaxWithdraw(publicParams).then(max => {
      if (max.result) {
        // 可用余额若没有值，则隐藏
        let withdrawTaskInfo = this.state.withdrawTaskInfo;
        let transferField = [...this.state.transferField];
        let transferTaskInfo = _.cloneDeep(this.state.transferTaskInfo);

        if (max.data) {
          withdrawTaskInfo.curMaxWithdrawAmount = max.data;
          transferTaskInfo.maxWithdraw = max.data;
        } else {
          this.getFieldValue(items, 'curMaxWithdrawAmount').hide = true;
          this.getFieldValue(transferField, 'maxWithdraw').hide = true;
        }
        this.setState({
          items,
          withdrawTaskInfo,
          transferField,
          transferTaskInfo
        });
      }
    });

    //transfer
    // 获取关联账户列表
    getRelateAccountList(customer.value, serverId).then(res => {
      if (res.result) {
        this.lock = true;
      }
    });
  }
  complete = false;
  componentWillReceiveProps = () => {
    const {
      relateAccountList,
      osConfig,
      accountInfo,
      ownerInfo: { baseInfo },
      currentServer: { vendor },
      serverList
    } = this.props;

    if (!osConfig.length || !this.lock || this.complete) {
      return;
    }
    let transferField = [...this.state.transferField];
    let transferTaskInfo = _.cloneDeep(this.state.transferTaskInfo);
    this.getFieldValue(
      transferField,
      'receiptUser'
    ).list = relateAccountList.length
      ? relateAccountList
          .filter(item => item.account !== accountInfo.account)
          .map(el => {
            this.accountNameObj[el.account] = {
              serverId: el.serverId,
              accountName: el.accountName,
              vendor: el.vendor
            }; //存账户名
            return {
              value: el.account,
              label: el.account
            };
          })
      : [];
    const configData = osConfig.find(item => item.structural === vendor);
    let tranSetting = _.get(configData, 'tranSetting', {});
    if (tranSetting.enabled) {
      this.getFieldValue(transferField, 'receiptUser').list.push({
        value: 'other',
        label: i18n['general.other']
      });
    }
    // 取数据
    let data = { ...accountInfo, ...baseInfo };
    for (let i in transferTaskInfo) {
      if (data[i]) {
        transferTaskInfo[i] = data[i];
      }
    }
    // 如果没有currency 隐藏账户货币
    if (!data.currency) {
      this.getFieldValue(transferField, 'currency').hide = true;
    }
    // 当接口没有返回账户余额，可转账余额时，则对应字段不展示
    if (data.balance) {
      transferTaskInfo.balance = data.balance;
    } else {
      this.getFieldValue(transferField, 'balance').hide = true;
    }
    // 服务器
    this.getFieldValue(transferField, 'receiptServer').list = serverList;
    // transferTaskInfo.maxWithdraw = maxWidthdraw;
    this.setState({
      transferField,
      transferTaskInfo
    });
    this.complete = true;
  };
  // 根据选择出金方式 某些字段不显示
  showFieldsByWithdraw = (value, items) => {
    // this.withdrawType = value;
    items
      .filter(item => !notHideBox.includes(item.key))
      .forEach(i => (i.hide = false));
    isShowFieldsByWithdraw[value] &&
      isShowFieldsByWithdraw[value].forEach(
        v => (this.getFieldValue(items, v).hide = true)
      );
  };
  // 获取item对应field的项
  getFieldValue = (items, name) => {
    return items && items.length && items.find(item => item.key === name);
  };
  onSubmit = () => {
    const {
      submit,
      currentServer: { vendor }
    } = this.props;
    const { optionType } = this.state;
    if (vendor === 'CTRADER') {
      submit(CBROKER_BALANCE_FORM);
    } else {
      if (optionType === 'deposit' || optionType === 'withdraw') {
        submit(BALANCE_FORM);
      } else if (optionType === 'withdraw_task') {
        submit(CREATE_TASKS_FORM);
      }
      {
        submit(TRANSFER_TASKS_FORM);
      }
    }
  };

  getAccountDetail = () => {
    const { accountId, currentServer, getAccountDetail } = this.props;

    return getAccountDetail(accountId, cuServer);
  };

  resetBalanceForm = () => {
    const { resetForm, currentServer } = this.props;
    const { optionType } = this.state;
    const formName =
      currentServer.vendor === 'CTRADER'
        ? CBROKER_BALANCE_FORM
        : optionType === 'deposit' || optionType === 'withdraw'
          ? BALANCE_FORM
          : CREATE_TASKS_FORM;

    this.setState(defaultState, () => {
      resetForm(formName);
    });
  };

  onSave = values => {
    const {
      accountId,
      updateBalance,
      showTopAlert,
      currentServer,
      resetForm,
      onClose
    } = this.props;
    const { type, ...balance } = values;
    this.setState({
      isDisabled: true
    });
    updateBalance(type, { ...balance, login: accountId }, cuServer).then(
      ({ result }) => {
        if (result) {
          onClose();
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          this.resetBalanceForm();
          this.getAccountDetail();
        }
        this.setState({
          isDisabled: false
        });
      }
    );
  };
  // form修改汇率
  changeExhange = value => {
    this.setState({
      finalExchange: value
    });
  };
  // 出金提交
  onSubmitTasks = values => {
    const { payCurrency, finalExchange } = this.state;
    values.payCurrency = payCurrency;
    values.withdrawExchange = finalExchange;
    if (values.withdrawType === 'BANK_CARD') {
      values.bankName = this.bankObj[values.bank] || values.bank;
      values.bankAccount = values.bankAccount.trim();
    }
    this.setState({
      showInfo: true,
      info: values
    });
  };
  //转账提交
  onSubmitTransfer = values => {
    const {
      serverList,
      verifyAccount,
      showTopAlert,
      currentServer: { vendor, serverId, tenantId },
      accountId,
      ownerInfo: { baseInfo }
    } = this.props;
    const info = _.cloneDeep(values);
    if (values.receiptUser === 'other') {
      info.receiptVendor = vendor;
    } else {
      info.receiptVendor = _.get(
        this.accountNameObj[info.receiptUser],
        'vendor'
      );
      info.receiptAccount = info.receiptUser;
      info.receiptAccountName = _.get(
        this.accountNameObj[info.receiptUser],
        'accountName'
      );
    }
    info.receiptServerId =
      info.receiptServer ||
      _.get(this.accountNameObj[info.receiptUser], 'serverId');
    info.receiptServerName = _.get(
      serverList.find(item => item.value === info.receiptServer),
      'label'
    );
    const params = {
      comment: info.comment,
      currency: info.currency,
      receiptAccount: info.receiptAccount,
      receiptAccountName: info.receiptAccountName,
      receiptServerId: info.receiptServerId,
      receiptVendor: info.receiptVendor,
      transferAmount: info.transferAmount,
      isOther: info.receiptUser === 'other'
    };
    const publicParams = {
      account: accountId,
      accountName: baseInfo.accountName,
      vendor,
      tenantId,
      serverId,
      pubUserId: '',
      taUserName: '',
      customerId: baseInfo.customerId,
      accountType: ''
    };
    // 如果是other 验证
    if (info.receiptUser === 'other') {
      verifyAccount({ ...publicParams, ...params }).then(res => {
        if (res.result) {
          if (res.data) {
            this.setState({
              showInfo: true,
              info
            });
          } else {
            showTopAlert({
              bsStyle: 'error',
              content: i18n['settings.deposit_transfer.create_task.errTips']
            });
          }
        }
      });
      // this.setState({
      //   showInfo: true,
      //   info
      // });
    } else {
      this.commitTask(params);
    }
  };
  // 转账,出金
  commitTask = info => {
    const {
      onClose,
      showTopAlert,
      currentServer: { vendor, serverId, tenantId },
      accountId,
      ownerInfo: { baseInfo }
    } = this.props;
    const { optionType } = this.state;
    const type = optionType === 'withdraw_task' ? 'withdraw' : 'transfer';
    const publicParams = {
      account: accountId,
      accountName: baseInfo.accountName,
      vendor,
      tenantId,
      serverId,
      pubUserId: '',
      taUserName: '',
      customerId: baseInfo.customerId,
      accountType: ''
    };
    this.setState({
      isDisabled: true
    });
    this.props.commitTaskApply(type, { ...info, ...publicParams }).then(rs => {
      if (rs.result) {
        onClose();
        showTopAlert({
          bsStyle: 'success',
          content: i18n[`settings.deposit_withdraw.create_task.${type}.success`]
        });
        // this.resetBalanceForm();
        this.getAccountDetail();
      }
      this.setState({
        isDisabled: false
      });
    });
  };
  onFormChange = values => {
    this.setState({
      fakeInfo: values
    });
  };

  onTypeChange = e => {
    const type = e.target.value;
    if (type === 'deposit' || type === 'withdraw') {
      this.setState({
        info: {
          ...this.state.fakeInfo,
          type,
          typeOption: undefined,
          remark: type === 'deposit' ? 'Deposit' : 'Withdrawal'
        }
      });
    } else {
      // const copy = _.cloneDeep(this.state.withdrawTaskInfo);
      this.setState({
        withdrawTaskInfo: {
          ...this.state.withdrawTaskInfo,
          type
        }
      });
    }
    this.setState({
      optionType: type,
      showInfo: false
    });
  };

  onTypeOptionChange = option => {
    this.setState({
      info: {
        ...this.state.fakeInfo,
        typeOption: option,
        remark: option
          ? option === 'lean-work-other-'
            ? ''
            : option
          : this.state.fakeInfo.type === 'deposit'
            ? 'Deposit'
            : 'Withdrawal'
      }
    });
  };

  onCbrokerTypeChange = type => {
    this.setState({
      cbrokerInfo: {
        ...this.state.cbrokerInfo,
        type
      }
    });
  };
  confirm = () => {
    let info = { ...this.state.info };
    info.bankAccountName = info.bankAccountName && info.bankAccountName.trim();
    info.bankName = this.bankObj[info.bank] || info.bank;
    info.bankAccountNumber = info.bankAccount;
    delete info.bank;
    delete info.bankAccount;
    this.commitTask(info);
  };
  render() {
    const {
      currentServer: { vendor },
      accountInfo,
      resources,
      filteredRights,
      visible,
      onClose,
      osConfig,
      bankLists,
      bindBank,
      maxWidthdraw,
      formFields,
      getFormFields,
      userRights
    } = this.props;
    const {
      info,
      cbrokerInfo,
      isDisabled,
      fieldItem,
      withdrawTaskInfo,
      transferTaskInfo,
      optionType,
      notice,
      finalExchange,
      payCurrency,
      showInfo,
      transferField
    } = this.state;
    return (
      <Dialog
        visible={visible}
        title={i18n['account.edit_account.money']}
        footer={
          showInfo ? (
            <div>
              <Button
                type="primary"
                onClick={this.confirm}
                disabled={isDisabled}
              >
                {i18n['general.confirm']}
              </Button>
              <Button
                onClick={() => {
                  this.setState({ showInfo: false });
                }}
              >
                {i18n['general.modify']}
              </Button>
            </div>
          ) : (
            <Button
              disabled={!filteredRights.balance}
              type="primary"
              onClick={this.onSubmit}
              disabled={isDisabled}
            >
              {i18n['general.save']}
            </Button>
          )
        }
        onCancel={onClose}
      >
        <div>
          {vendor === 'CTRADER' ? (
            <CbrokerForm
              initialValues={cbrokerInfo}
              getAccountDetail={this.getAccountDetail}
              onTypeChange={this.onCbrokerTypeChange}
              onSave={this.onSave}
              disabled={!filteredRights.balance}
            />
          ) : (
            <div>
              <div className={cs.option_type_item}>
                <label className={cs.option_type}>
                  {i18n['account.edit_account_money.type_label']}
                </label>
                {typeList.map(item => {
                  // 权限判断 自定义平台才显示 withdraw_task transfer_task
                  if (item.right) {
                    if (
                      userRights[item.right] &&
                      vendor &&
                      vendor.indexOf('CUSTOM') > -1
                    ) {
                      return (
                        <Radio
                          inline
                          value={item.value}
                          checked={optionType == item.value}
                          onChange={this.onTypeChange}
                        >
                          {item.label}
                        </Radio>
                      );
                    }
                  } else {
                    return (
                      <Radio
                        inline
                        value={item.value}
                        checked={optionType == item.value}
                        onChange={this.onTypeChange}
                      >
                        {item.label}
                      </Radio>
                    );
                  }
                })}
              </div>
              {optionType === 'deposit' || optionType === 'withdraw' ? (
                <Form
                  initialValues={info}
                  resources={resources}
                  onChange={this.onFormChange}
                  onTypeChange={this.onTypeChange}
                  onTypeOptionChange={this.onTypeOptionChange}
                  getAccountDetail={this.getAccountDetail}
                  onSave={this.onSave}
                  disabled={!filteredRights.update.balance}
                />
              ) : optionType === 'withdraw_task' ? (
                <CreateTaskForm
                  initialValues={withdrawTaskInfo}
                  onSubmit={this.onSubmitTasks}
                  osConfig={osConfig}
                  vendor={vendor}
                  accountInfo={accountInfo}
                  bankLists={bankLists}
                  bindBank={bindBank}
                  maxWidthdraw={maxWidthdraw}
                  getFormFields={getFormFields}
                  formFields={formFields}
                  fieldItem={fieldItem}
                  defaultExchangeRateSetting={this.defaultExchangeRateSetting}
                  finalExchange={finalExchange}
                  payCurrency={payCurrency}
                  payCurrencyList={this.payCurrencyList}
                  notice={notice}
                  exchangeRateSettings={this.exchangeRateSettings}
                  showInfo={showInfo}
                  changeExhange={this.changeExhange}
                />
              ) : (
                <TransferTaskForm
                  initialValues={transferTaskInfo}
                  onSubmit={this.onSubmitTransfer}
                  showInfo={showInfo}
                  fieldItem={transferField}
                />
              )}
              {showInfo && (
                <InfoCard
                  info={info}
                  optionType={optionType}
                  withdrawTypesMap={this.withdrawTypesMap}
                  formFields={formFields}
                  bankObj={this.bankObj}
                />
              )}
            </div>
          )}
          {/* 显示信息 */}
        </div>
      </Dialog>
    );
  }
}
