import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Modal,
  Checkbox,
  Divider,
  Icon
} from "antd";
import { ls } from '@/utils/storage'
import "./withdraw.less";
import i18n from "@/utils/i18n";
import { ACCOUNT_DATA } from "@/utils/storage";
import message from "@/components/Message";
import Button from "@/components/Button";
import Disclaimer from "@/components/Disclaimer";
import Card from "@/components/Card";
import FileUpload from "@/components/FileUpload";
import * as actions from "@/actions/Fund/withdraw";
import { setHeaderTitle } from "@/actions/App/app";
import { SSL_OP_PKCS1_CHECK_1 } from "constants";
import { decimal2, decimal4 } from "@/utils/validate";
import DoubleValidate from "@/components/DoubleValidate";
import { configAccess } from "@/actions/Common/common";
import { getType } from '@/utils/language'
const isCustomReg = /^CUSTOM(.*?)$/; // 判断是否为自定义平台，以CUSTOM开头
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const notHideBox = [
  "account",
  "accountName",
  "currency",
  "balance",
  "curMaxWithdrawAmount",
  "withdrawCurrency",
  "comment"
];
const isShowFieldsByWithdraw = {
  DIGITAL_CASH: [
    "bankAccount",
    "bankAccountName",
    "bank",
    "bankBranchName",
    "SWIFT",
    "bankAddress"
  ],
  BANK_CARD: ["receiveAddress"],
  CHECK: [
    "bankAccountName",
    "bankBranchName",
    "SWIFT",
    "bankAddress",
    "receiveAddress"
  ],
  OFFLINE_CHECK: [
    "bankAccount",
    "bankAccountName",
    "bank",
    "bankBranchName",
    "SWIFT",
    "bankAddress",
    "receiveAddress"
  ],
  AUTH_OFFLINE_CHECK: [
    "bankAccount",
    "bankAccountName",
    "bank",
    "bankBranchName",
    "SWIFT",
    "bankAddress",
    "receiveAddress"
  ],
  CUSTOMIZE: [
    "bankAccount",
    "bankAccountName",
    "bank",
    "bankBranchName",
    "SWIFT",
    "bankAddress",
    "receiveAddress"
  ]
};
class Gold extends Component {
  lock = false;
  bankObj = {};
  withdrawTypesMap = {};
  state = {
    showInfo: false,
    info: {},
    payAmount: 0,
    finalExchange: 0,
    payCurrency: "",
    notice: "",
    disabled: false,
    add: false,
    bankName: "",
    isShowDoubleModal: false,
    formValues: {},
    isErrorName: false,
    items: [
      {
        label: i18n["withdraw.account"],
        type: "text",
        disabled: true,
        field: "account",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.accountName"],
        type: "text",
        disabled: true,
        field: "accountName",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.currency"],
        type: "text",
        disabled: true,
        field: "currency",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.balance"],
        type: "text",
        disabled: true,
        field: "balance",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.actualBalance"],
        type: "text",
        disabled: true,
        field: "curMaxWithdrawAmount",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.withdrawCurrency"],
        hide: false,
        type: "select",
        disabled: false,
        changeCurrency: true,
        field: "withdrawCurrency",
        value: "",
        list: [],
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.withdrawType"],
        type: "select",
        hide: true,
        disabled: false,
        field: "withdrawType",
        changeType: true,
        value: "",
        list: [],
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["withdraw.amount"],
        type: "text",
        disabled: false,
        extraText: true,
        needCompute: true,
        field: "withdrawAmount",
        rules: [
          {
            required: true,
            message: i18n["mobile.withdraw.out.money"]
          },
          {
            pattern:
              this.props.account.currAccount.depositCurrency === "BTC"
                ? decimal4
                : decimal2,
            message: i18n["withdraw.amount.errMsg1"]
          },
          {
            validator: (rule, value, callback) => {
              const vendor = this.props.account.currAccount.vendor;
              const isCustom = vendor && vendor.indexOf("CUSTOM") > -1;
              if ((value > this.amount || value == 0) && !isCustom) {
                callback(new Error(i18n["withdraw.amount.errMsg2"]));
              } else {
                callback();
              }
            }
          }
        ]
      },
      {
        label: i18n["withdraw.bankNumber"],
        hide: false,
        type: "select",
        needChange: true,
        disabled: false,
        field: "bankAccount",
        list: [],
        rules: [
          {
            required: true,
            message: i18n["mobile.withdraw.bank.account"]
          },
          // {
          //   type: 'integer',
          //   message: '转入帐户账号应为数字类型，且不能和转出帐户相同'
          // },
          {
            validator: (rule, value, callback) => {
              if (value == this.account) {
                callback(new Error(i18n["withdraw.bankNumber.errMsg"]));
              } else {
                callback();
              }
            }
          }
        ]
      },
      {
        label: i18n["withdraw.receiver"],
        hide: false,
        type: "text",
        disabled: false,
        needValiadate: true,
        field: "bankAccountName",
        rules: [
          {
            required: true,
            message: i18n["withdraw.receiver.errMsg"]
          }
        ]
      },
      {
        label: i18n["withdraw.bankName"],
        hide: false,
        type: "select",
        needChange: false,
        needAdd: true,
        disabled: false,
        list: [],
        field: "bank",
        rules: [
          {
            required: true,
            message: i18n["mobile.withdraw.bank"]
          }
        ]
      },
      {
        label: i18n["withdraw.bankBranchName"],
        hide: false,
        type: "text",
        disabled: false,
        field: "bankBranchName",
        rules: [
          {
            required: true,
            message: i18n["withdraw.bankBranchName.errMsg"]
          }
        ]
      },
      {
        label: i18n["withdraw.swiftCode"],
        hide: false,
        type: "text",
        disabled: false,
        field: "SWIFT",
        rules: [
          {
            required: true,
            message: i18n["withdraw.swiftCode.errMsg"]
          }
        ]
      },
      {
        label: i18n["withdraw.bankAddress"],
        hide: false,
        type: "text",
        disabled: false,
        field: "bankAddress",
        rules: [
          {
            required: true,
            message: i18n["withdraw.bankAddress.errMsg"]
          }
        ]
      },
      {
        label: i18n["withdraw.receiveAddress"],
        hide: false,
        type: "text",
        disabled: false,
        field: "receiveAddress",
        rules: [
          {
            required: true,
            message: i18n["withdraw.receiveAddressRequired"]
          }
        ]
      },
      
      // {
      //   label: i18n['withdraw.bank'],
      //   type: 'text',
      //   disabled: false,
      //   required: false,
      //   hide:true,
      //   field: 'banks'
      // },
      // {
      //   label: i18n['withdraw.bankNo'],
      //   type: 'text',
      //   disabled: false,
      //   required: false,
      //   field: 'bankNo',
      //   hide:true,

      // },
      // {
      //   label: i18n['withdraw.authName'],
      //   type: 'text',
      //   disabled: false,
      //   required: false,
      //   field: 'authName',
      //   hide:true,

      // },
      // {
      //   label: i18n['withdraw.IdCard'],
      //   type: 'text',
      //   disabled: false,
      //   required: false,
      //   field: 'IdCard',
      //   hide:true,

      // },
    ]
  };
  // 获取item对应field的项
  getFieldValue = (items, name) => {
    return (
      items &&
      items.length &&
      items.find(item => item.field.toUpperCase() === name.toUpperCase())
    );
  };
  componentDidMount() {
    this.props.setHeaderTitle(i18n["menu.fundmgmt.withdraw"]);
    this.props.configAccess();
    const vendor = this.props.account.currAccount.vendor;
    // 获取出金方式列表后 调用获取自定义字段
    // 获取启用的出金方式列表
    this.props.getWithdrawList(vendor).then(res => {
      if (res.result) {
        if (res.data && res.data.length) {
          let items = [...this.state.items];
          this.getFieldValue(items, "withdrawType").value = res.data[0].withdrawType==='CUSTOMIZE'?res.data[0].withdrawType+'#'+res.data[0].typeId:res.data[0].withdrawType; // 出金方式默认显示第一条
          this.withdrawType = res.data[0].typeId?res.data[0].typeId:res.data[0].withdrawType;
          this.getFieldValue(items, "withdrawType").hide = res.data.length == 1;
          this.getFieldValue(items, "withdrawType").list = res.data.map(el => {
            let label = i18n[`withdraw.${el.withdrawType}`]||el.message[getType()];
            this.withdrawTypesMap[el.withdrawType] = label;
            if(el.typeId){
              this.withdrawTypesMap[el.typeId] = label;
            }
            return {
              value: el.typeId?el.withdrawType+"#"+el.typeId: el.withdrawType,
              label
            };
          });
          this.setState({
            items
          });
          // 取自定义字段
          this.props.fetchFields(vendor, res.data[0].typeId?res.data[0].withdrawType+"#"+res.data[0].typeId:res.data[0].withdrawType);
        }
      }
    });

    // 取可选银行
    this.props.fetchBanks().then(rs => {
      if (rs.result) {
        let items = [...this.state.items];
        this.getFieldValue(items, "bank").list = rs.data;
        rs.data.forEach(el => {
          this.bankObj[el.value] = el.label;
        });
        // 取绑定银行
        this.props.fetchExsitBanks().then(rs => {
          if (rs.result) {
            let items = [...this.state.items];
            this.getFieldValue(items, "bankAccount").list = rs.data.map(el => {
              return {
                value: el.bankAccountNumber,
                label: `${
                  this.bankObj[el.bankName]
                    ? this.bankObj[el.bankName].substr(0, 8)
                    : el.bankName.substr(0, 8)
                } ${
                  i18n["withdraw.lastBankNumber"]
                }${el.bankAccountNumber.substr(-4, 4)}${el.bankAccountName}`
              };
            });
            this.bindBanks = rs.data;
            // 默认银行信息
            let defaultInfo = rs.data.find(el => {
              return el.isDefault;
            });
            if (defaultInfo) {
              this.validateName(true, defaultInfo.bankAccountName)
              this.getFieldValue(items, "bankAccount").value =
                defaultInfo.bankAccountNumber;
              this.getFieldValue(items, "bankAccountName").value =
                defaultInfo.bankAccountName;
              this.getFieldValue(items, "bank").value = defaultInfo.bankName;
              this.getFieldValue(items, "bankBranchName").value =
                defaultInfo.bankBranchName;
              this.getFieldValue(items, "SWIFT").value = defaultInfo.SWIFT;
              this.getFieldValue(items, "bankAddress").value =
                defaultInfo.bankAddress;
            }
            this.setState({
              items
            });
          }
        });
        this.setState({
          items
        });
      }
    });
    // 取可用余额
    this.props.fetchRestAmount().then(rs => {
      if (rs.result) {
        this.amount = rs.data;
        let items = [...this.state.items];
        // 在自定义平台 可用余额若没有值，则隐藏
        if (rs.data>=0) {
          this.getFieldValue(items, "curMaxWithdrawAmount").value = rs.data;
        } else {
          if (isCustomReg.test(vendor)) {
            this.getFieldValue(items, "curMaxWithdrawAmount").hide = true;
          }
        }
        this.setState({
          items
        });
      }
    });
  }
  // 根据选择出金方式 某些字段不显示
  showFieldsByWithdraw = (value, items) => {
    this.withdrawType = value;

    if(value.indexOf('CUSTOMIZE')!==-1){
      this.withdrawType = value.split('#')[1];
      value = value.split('#')[0]
    }
    items
      .filter(item => !notHideBox.includes(item.field))
      .forEach(i => (i.hide = false));
    isShowFieldsByWithdraw[value] &&
      isShowFieldsByWithdraw[value].forEach(
        v => (this.getFieldValue(items, v).hide = true)
      );
  };
  componentWillReceiveProps = nextProps => {
    this.props.setHeaderTitle(i18n["menu.fundmgmt.withdraw"]);
    let currentPlatform = this.props.account.currAccount.vendor;
    if (
      !nextProps.withdrawList.length ||
      !nextProps.structConfig ||
      !nextProps.accountList.liveAccountList.length ||
      this.lock
    )
      return;
    let withdrawSetting =
      nextProps.structConfig[currentPlatform].withdrawSetting;
    let defaultExchangeRateSetting = withdrawSetting.defaultExchangeRateSetting;
    // let notice = withdrawSetting.notice
    this.riskTipMode = withdrawSetting.riskTipMode;
    this.riskDesc = withdrawSetting.riskDesc;
    this.enableRiskTip = withdrawSetting.enableRiskTip;
    // 存汇率信息
    this.defaultExchangeRateSetting = defaultExchangeRateSetting;
    this.exchangeRateSettings = withdrawSetting.exchangeRateSettings;
    // 取数据
    let data = nextProps.account.currAccount;
    this.account = data.account;
    let payCurrencyList = withdrawSetting.exchangeRateSettings
      .filter(el => {
        return el.transactionCurrency === data.depositCurrency && el.status;
      })
      .map(el => {
        return {
          value: el.payCurrency,
          label: `${el.payCurrency}`
        };
      });
    this.payCurrencyList = payCurrencyList;
    let items = [...this.state.items];
    this.getFieldValue(items, "account").value = data.account;
    this.getFieldValue(items, "accountName").value = data.accountName;
    // 在自定义平台 当currency 不存在时 不展示账户货币、出金货币
    if (data.depositCurrency) {
      this.getFieldValue(items, "currency").value = data.depositCurrency;
      this.getFieldValue(
        items,
        "withdrawCurrency"
      ).hide = !payCurrencyList.length;
      this.getFieldValue(items, "withdrawCurrency").value =
        defaultExchangeRateSetting.transactionCurrency === data.depositCurrency
          ? defaultExchangeRateSetting.payCurrency
          : payCurrencyList[0] && payCurrencyList[0].value;
      this.getFieldValue(items, "withdrawCurrency").list = payCurrencyList;
    } else {
      if (isCustomReg.test(currentPlatform)) {
        this.getFieldValue(items, "currency").hide = true;
        this.getFieldValue(items, "withdrawCurrency").hide = true;
      }
    }
    // 在自定义平台 当接口没有返回账户余额，可出金余额时，则对应字段不展示
    const balanceValue = nextProps.accountList.liveAccountList.find(el => {
      return el.account === data.account;
    }).balance;
    if (balanceValue>=0) {
      this.getFieldValue(items, "balance").value = balanceValue;
    } else {
      if (isCustomReg.test(currentPlatform)) {
        this.getFieldValue(items, "balance").hide = true;
      }
    }

    this.showFieldsByWithdraw(nextProps.withdrawList[0].withdrawType, items);
    // 设置字段是否必填
    const ways = _.get(withdrawSetting, "ways", []);
    const waysItem =
      ways.find(item => item.withdrawType === nextProps.withdrawList[0].withdrawType) || {};
    const fields = waysItem.fields || [];
    fields.forEach(item => {
      if (this.getFieldValue(items, item.fieldId)) {
        this.getFieldValue(items, item.fieldId).rules[0].required =
          item.required;
      }
    });
    const notice = waysItem.notice || "";
    // this.getFieldValue(items,'bankBranchName').rules[0].required = withdrawSetting.branchBank
    // this.getFieldValue(items,'SWIFT').rules[0].required = withdrawSetting.bankSwift
    // this.getFieldValue(items,'bankAddress').rules[0].required = withdrawSetting.bankAddress
    let payCurrency = "";
    let showExchange = "";
    let finalExchange = "";
    if (
      defaultExchangeRateSetting.transactionCurrency === data.depositCurrency
    ) {
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
            el.transactionCurrency === data.depositCurrency
          );
        }) || {};
      showExchange = s1;
      finalExchange = exchange * (1 + exchangeFloat / 100);
    }
    this.setState({
      notice,
      items,
      showExchange,
      finalExchange,
      payCurrency
    });
    this.lock = true;
  };
  handleChange = (needChange, value, changeCurrency, changeType) => {
    if (needChange) {
      //银行账号修改填写默认信息
      // todo
      let defaultInfo = this.bindBanks.filter(el => {
        return el.bankAccountNumber == value;
      })[0];
      if (!defaultInfo) return;
      let items = [...this.state.items];
      this.validateName(true, defaultInfo.bankAccountName)
      this.getFieldValue(items, "bankAccount").value =
        defaultInfo.bankAccountNumber;
      this.getFieldValue(items, "bankAccountName").value =
        defaultInfo.bankAccountName;
      this.getFieldValue(items, "bank").value = defaultInfo.bankName;
      this.getFieldValue(items, "bankBranchName").value =
        defaultInfo.bankBranchName;
      this.getFieldValue(items, "SWIFT").value = defaultInfo.SWIFT;
      this.getFieldValue(items, "bankAddress").value = defaultInfo.bankAddress;
      this.setState({
        items
      });
    }
    if (changeType) {
      //修改出金类型
      let items = [...this.state.items];
      this.showFieldsByWithdraw(value, items);
      // 设置字段是否必填
      let currentPlatform = this.props.account.currAccount.vendor;
      let withdrawSetting = this.props.structConfig[currentPlatform]
        .withdrawSetting;
      const ways = _.get(withdrawSetting, "ways", []);
      const waysItem = ways.find(item => item.withdrawType === value) || {};
      const fields = waysItem.fields || [];
      fields.forEach(item => {
        if (this.getFieldValue(items, item.fieldId)) {
          this.getFieldValue(items, item.fieldId).rules[0].required =
            item.required;
        }
      });
      const notice = waysItem.notice || "";
      // 获取自定义字段
      const vendor = this.props.account.currAccount.vendor;
      this.props.fetchFields(vendor, value);
      this.setState({
        items,
        notice
      });
    }
    if (changeCurrency) {
      //出金货币修改汇率重新计算
      let payAmount;
      let finalExchange;
      let {
        exchange,
        exchangeFloat,
        showExchange
      } = this.exchangeRateSettings.find(el => {
        return (
          el.payCurrency === value &&
          this.props.account.currAccount.depositCurrency ===
            el.transactionCurrency
        );
      });
      finalExchange = exchange * (1 + exchangeFloat / 100);
      let withdrawNum = this.props.form.getFieldValue("withdrawAmount") || 0;
      payAmount = (withdrawNum * finalExchange).toFixed(
        this.props.account.currAccount.depositCurrency === "BTC" ? 4 : 2
      );
      this.setState({
        payCurrency: value,
        payAmount,
        finalExchange,
        showExchange
      });
    }
  };
  computeExchange = (needCompute, e) => {
    if (!needCompute) return;
    let payAmount;

    let {
      showExchange,
      exchangeMode,
      exchange,
      exchangeFloat
    } = this.defaultExchangeRateSetting;

    payAmount = (e.target.value * this.state.finalExchange).toFixed(
      this.props.account.currAccount.depositCurrency === "BTC" ? 4 : 2
    );
    this.setState({
      payAmount
    });
  };
  // search = (input, option)=>{
  //   return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  // }
  // 二次验证
  doubleValidate = values => {
    const { configAcessResult, validateSettingData } = this.props;
    //one 是否启用
    if (_.get(configAcessResult, "twoFAConfig.enable", false)) {
      // sc是否配置，配置后 tw是否启用，并且 启用的要和sc配置的一致
      // 设置了验证方式, 并且验证方式是在sc中启用了的
      const isEnabled = validateSettingData.some(item =>
        _.get(configAcessResult, "twoFAConfig.types", []).includes(item.type)
      );
      if (
        isEnabled &&
        _.get(configAcessResult, "twoFAConfig.operation", []).includes(
          "ACCOUNT_WITHDRAWAL"
        )
      ) {
        this.setState({
          isShowDoubleModal: true
        });
      } else {
        this.afterValidate(values);
      }
    } else {
      // 未启用
      this.afterValidate(values);
    }
  };
  afterValidate = values => {
    values.payCurrency = this.state.payCurrency;
    values.withdrawExchange = this.state.finalExchange;
    if (this.withdrawType === "BANK_CARD") {
      values.bankName = this.bankObj[values.bank] || values.bank;
      values.bankAccount = values.bankAccount.trim();
    }
    this.setState({
      showInfo: true,
      info: values
    });
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formValues: values
        });
        this.doubleValidate(values);
      }
    });
  };
  confirm = () => {
    const disclaimer = this.refs.disclaimer;
    if ((disclaimer && disclaimer.hasAgreeAll()) || !disclaimer) {
      this.setState({
        disabled: true
      });
      let info = { ...this.state.info };
      info.bankAccountName =
        info.bankAccountName && info.bankAccountName.trim();
      info.bankName = this.bankObj[info.bank] || info.bank;
      info.bankAccountNumber = info.bankAccount;
      info.withdrawType = this.withdrawType;
      if(info.withdrawType.length>18){//没办法判断了，暂时用字符串长度
        info.withdrawType = 'CUSTOMIZE'
        info.typeId = this.withdrawType
      }
      delete info.bank;
      delete info.bankAccount;
      this.props.saveWithdraw(info).then(rs => {
        if (rs.result) {
          message.success(i18n["mobile.withdraw.out.submited"]);

          setTimeout(() => {
            window.location.href = "/fund/withdraw";
          }, 2000);
        } else {
          this.setState({
            disabled: false
          });
        }
      });
    } else if (!disclaimer.state.innerChecked) {
      if (this.riskTipMode === "DEFAULT_SHOW") {
        message["warning"](i18n["openaccount.risktip.confirm.required"]);
      } else {
        disclaimer.openModal();
      }
    } else if (!disclaimer.state.outerChecked) {
      message["warning"](i18n["openaccount.risktip.confirm.required"]);
    }
  };
  addBank = () => {
    this.setState({
      add: true
    });
  };
  closeBank = () => {
    this.setState({
      add: false
    });
  };
  confirmName = e => {
    let type = e.nativeEvent.type;
    let code = e.nativeEvent.code;
    if (type === "keypress" && code !== "Enter") return;
    let items = [...this.state.items];
    this.getFieldValue(items, "bank").value = this.state.bankName;
    this.setState({
      items,
      add: false
    });
  };
  changeName = e => {
    let bankName = e.target.value;
    bankName = bankName.replace(/\d/, "");
    this.setState({
      bankName
    });
  };
  // 重组自定义字段
  configCustomFields = () => {
    const { withdrawFields } = this.props;
    return (
      (withdrawFields &&
        withdrawFields.length &&
        withdrawFields.map(el => {
          return {
            label: el.label,
            type: el.fieldType,
            placeHolder: el.placeHolder,
            disabled: false,
            list: el.optionList,
            field: el.key,
            rules: [
              {
                ...el.validateType,
                message: i18n["withdraw.field.required.errMsg"]
              }
            ]
          };
        })) ||
      []
    );
  };
  validateName = (need, e)=>{
    let value = e.target?e.target.value:e
      if(!need||!value) {
        this.setState({
            isErrorName: false
        })  
        return;
      }
      this.setState({
        isErrorName: ls.getItem('ACCOUNT_DATA_1').currAccount.accountName!==value
      })
  }
  render() {
    const { formValues, isShowDoubleModal } = this.state;
    let formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 5 }
    };
    let { getFieldDecorator } = this.props.form;
    if (!this.props.withdrawList.length && this.lock) {
      return <div className="page gold">{i18n["withdraw.serve_not_open"]}</div>;
    }
    const items = [...this.state.items, ...this.configCustomFields(),{
      label: i18n["general.comment.tw"],
      type: "text",
      disabled: false,
      required: false,
      field: "comment"
    }];
    return (
      <div className="page gold">
        <Form
          layout="horizontal"
          style={{ display: !this.state.showInfo ? "block" : "none" }}
        >
          {items.map(el => {
            let Item;
            if (el.type === "text") {
              Item = (
                <Input
                  disabled={el.disabled}
                  placeholder={el.placeHolder}
                  onChange={e => {
                    this.computeExchange(el.needCompute, e);
                  }}
                  onBlur={this.validateName.bind(this,el.needValiadate)}
                />
              );
            } else if (el.type === "select") {
              if (el.needAdd) {
                Item = (
                  <Select
                    mode={el.needChange && "combobox"}
                    disabled={el.disabled}
                    // labelInValue
                    notFoundContent={
                      <div>
                        <Divider style={{ margin: "4px 0" }} />
                        <div
                          onClick={this.addBank}
                          style={{
                            color: "#000",
                            padding: "8px",
                            cursor: "pointer"
                          }}
                        >
                          <Icon type="plus" /> {i18n["userinfo.bank.addBank"]}
                        </div>
                      </div>
                    }
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={value => {
                      this.handleChange(
                        el.needChange,
                        value,
                        el.changeCurrency,
                        el.changeType
                      );
                    }}
                    optionLabelProp={el.needChange ? "value" : ""}
                  >
                    {el.list.map(el => {
                      return <Option value={el.value}>{el.label}</Option>;
                    })}
                  </Select>
                );
              } else {
                Item = (
                  <Select
                    mode={el.needChange && "combobox"}
                    disabled={el.disabled}
                    // labelInValue
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={value => {
                      this.handleChange(
                        el.needChange,
                        value,
                        el.changeCurrency,
                        el.changeType
                      );
                    }}
                    optionLabelProp={el.needChange ? "value" : ""}
                  >
                    {el.list.map(el => {
                      return <Option value={el.value}>{el.label}</Option>;
                    })}
                  </Select>
                );
              }
            } else if (el.type === "radio") {
              Item = (
                <RadioGroup
                  onChange={e => {
                    let value = e.target.value;
                    this.handleChange(
                      el.needChange,
                      value,
                      el.changeCurrency,
                      el.changeType
                    );
                  }}
                >
                  {el.list.map(el => {
                    return <Radio value={el.value}>{el.label}</Radio>;
                  })}
                </RadioGroup>
              );
            } else if (el.type === "image") {
              Item = (
                <FileUpload numMax={1}></FileUpload>
              );
            }

            return (
              !el.hide && (
                <FormItem {...formItemLayout} label={el.label}>
                  {getFieldDecorator(el.field, {
                    rules: el.rules,
                    initialValue: el.value
                  })(Item)}
                  {el.needValiadate && this.state.isErrorName && <div style={{lineHeight: '15px',color: '#999999'}}>{i18n['withdraw.validate.name.tip']}</div>}
                  {el.extraText &&
                    this.state.showExchange &&
                    !!this.payCurrencyList.length &&
                    `${this.state.payCurrency}: ${this.state.payAmount} (${
                      i18n["withdraw.exchange"]
                    }: ${this.state.finalExchange.toFixed(4)})`}
                </FormItem>
              )
            );
          })}
          {!!this.state.notice.trim() && (
            <FormItem style={{ marginLeft: 115 }}>
              <div className="gold-notice">
                <div className="header">{i18n["fundmgmt.notice.tw"]}</div>
                <div className="body">{this.state.notice}</div>
              </div>
            </FormItem>
          )}
          <FormItem style={{ marginLeft: 150 }}>
            <Button
              style={{ lineHeight: "32px" }}
              type="primary"
              onClick={this.onSubmit}
            >
              {i18n["bindaccount.submit"]}
            </Button>
          </FormItem>
        </Form>
        <Modal
          title={i18n["userinfo.bank.addBankName"]}
          visible={this.state.add}
          onCancel={() => this.setState({ add: false })}
          footer={
            <span>
              <Button onClick={this.confirmName} type="primary">
                {i18n["general.button.sure"]}
              </Button>
              <Button
                onClick={() => {
                  this.setState({ add: false });
                }}
              >
                {i18n["general.button.cancel"]}
              </Button>
            </span>
          }
        >
          <Input
            onKeyPress={this.confirmName}
            value={this.state.bankName}
            onChange={this.changeName}
          />
        </Modal>
        <div
          className="confirm-container"
          style={{ display: this.state.showInfo ? "block" : "none" }}
        >
          <div className="title">{i18n["withdraw.confirmView.title"]}</div>
          <div className="content">
            <div className="header">{i18n["withdraw.information"]}</div>
            <ul className="body">
              <li>
                <span>{i18n["withdraw.account"]}</span>
                <span>{this.state.info.account}</span>
              </li>
              <li>
                <span>{i18n["withdraw.accountName"]}</span>
                <span>{this.state.info.accountName}</span>
              </li>
              <li>
                <span>{i18n["withdraw.withdrawType"]}</span>
                <span>{this.withdrawTypesMap[this.withdrawType]}</span>
              </li>
              <li>
                <span>{i18n["withdraw.amount"]}</span>
                <span>{this.state.info.withdrawAmount}</span>
              </li>
              {this.withdrawType === "BANK_CARD" && (
                <li>
                  <span>{i18n["withdraw.receiver"]}</span>
                  <span>{this.state.info.bankAccountName}</span>
                </li>
              )}
              {(this.withdrawType === "BANK_CARD" ||
                this.withdrawType === "CHECK") && (
                <li>
                  <span>{i18n["withdraw.bankNumber"]}</span>
                  <span>{this.state.info.bankAccount}</span>
                </li>
              )}
              {(this.withdrawType === "BANK_CARD" ||
                this.withdrawType === "CHECK") && (
                <li>
                  <span>{i18n["withdraw.bankName"]}</span>
                  <span>
                    {this.bankObj[this.state.info.bank] || this.state.info.bank}
                  </span>
                </li>
              )}
              {this.withdrawType === "BANK_CARD" && (
                <li>
                  <span>{i18n["withdraw.bankBranchName"]}</span>
                  <span>{this.state.info.bankBranchName}</span>
                </li>
              )}
              {this.withdrawType === "BANK_CARD" && (
                <li>
                  <span>{i18n["withdraw.bankAddress"]}</span>
                  <span>{this.state.info.bankAddress}</span>
                </li>
              )}
              {this.withdrawType === "BANK_CARD" && (
                <li>
                  <span>{i18n["withdraw.swiftCode"]}</span>
                  <span>{this.state.info.SWIFT}</span>
                </li>
              )}
              {this.withdrawType === "DIGITAL_CASH" && (
                <li>
                  <span>{i18n["withdraw.receiveAddress"]}</span>
                  <span>{this.state.info.receiveAddress}</span>
                </li>
              )}
              
              {this.props.withdrawFields.map(el => {
                let value = this.props.form.getFieldValue(el.key)
                if(el.fieldType === 'select'){
                  value = el.optionList.find(el=>el.value===value) && el.optionList.find(el=>el.value===value).label
                }else if(el.fieldType === 'image'){
                  value = value && <img width="80"src={'/api'+value}/>
                }
                return (
                  <li>
                    <span>{el.label}</span>
                    <span>{value}</span>
                  </li>
                );
              })}
              <li>
                <span>{i18n["general.comment.tw"]}</span>
                <span>{this.state.info.comment}</span>
              </li>
            </ul>
          </div>
          {this.enableRiskTip && (
            <div style={{ marginTop: 10 }}>
              <Disclaimer
                ref="disclaimer"
                protocol={[
                  i18n["transfer.read"],
                  i18n["openaccount.protocol2_withdraw"],
                  i18n["openaccount.protocol3_withdraw"]
                ]}
                text={i18n["openaccount.protocol_withdraw"]}
                riskTipMode={this.riskTipMode}
                riskDesc={this.riskDesc || ""}
              />
            </div>
          )}
          <div className="footer">
            <Button
              type="primary"
              onClick={this.confirm}
              disabled={this.state.disabled}
            >
              {i18n["transfer.confirmSubmit"]}
            </Button>
            <Button
              onClick={() => {
                this.setState({ showInfo: false });
              }}
            >
              {i18n["general.modify.tw"]}
            </Button>
            <Button>{i18n["general.print"]}</Button>
          </div>
        </div>
        {/* 二次验证弹窗 */}
        <DoubleValidate
          visible={isShowDoubleModal}
          operation="ACCOUNT_WITHDRAWAL"
          afterOperate={this.afterValidate.bind(this, formValues)}
          closeModal={this.closeDoubleModal}
        />
      </div>
    );
  }
}
let MyGold = Form.create()(Gold);
export default connect(
  ({ app, common, fund }) => {
    return {
      structConfig: app.structConfig,
      account: app.account,
      struct: app.struct,
      brand: common.brandInfo,
      accountList: app.accountList,
      configAcessResult: common.configAcessResult,
      validateSettingData: common.validateSettingData,
      withdrawList: fund.withdrawList,
      withdrawFields: fund.withdrawFields
    };
  },
  { ...actions, setHeaderTitle, configAccess }
)(MyGold);
