import { reduxForm, Field } from 'redux-form';
import CustomField, { validate } from 'components/v2/CustomField';

import i18n from 'utils/i18n';
export const CTRADER_ACCOUNT_FROM = 'TASK_SETTING_CTRADER_ACCOUNT_FROM';
class CtraderInfo extends PureComponent {
  render() {
    const { fields, disabled, children } = this.props;
    return (
      <CustomField
        fields={fields}
        disabled={disabled}
        size="large"
        children={children}
      />
    );
  }
}

export default class ObjectSettingCtraderForm extends Component {
  state = {
    serverId: this.props.initialValues && this.props.initialValues.serverId
  };
  FormComponent = reduxForm({
    form: this.props.formName,
    onSubmitFail: errors => {
      setTimeout(() => {
        let errorDom = document
          .querySelectorAll('[class*=error]')[0]
          .querySelector('input');
        errorDom
          ? errorDom.focus()
          : document.querySelectorAll('[class*=error]')[0].focus();
      }, 0);
    },
    validate: function(values = {}, props) {
      const { currentServer, passwordRegular } = props;
      const customeErrors = validate(values, props);
      const errors = {};

      if (
        values.leverage &&
        values.maxLeverage &&
        parseFloat(values.leverage) > parseFloat(values.maxLeverage)
      ) {
        errors.maxLeverage =
          i18n['task.object_setting.save.invaild_max_leverage'];
      }
      return Object.assign({}, customeErrors, errors);
    },
    shouldValidate({ values = {}, nextProps, props }) {
      return true;
    },
    enableReinitialize: true
  })(CtraderInfo);
  componentDidMount() {
    const {
      cTraderFormFields,
      getCtraderForm,
      cTraderExtenalData,
      getCtraderUserGroup,
      initialValues = {},
      getCtraderCurrencyByServerId
    } = this.props;
    if (!cTraderFormFields.length) {
      getCtraderForm();
    }
    if (!cTraderExtenalData.userGroupsData.length) {
      getCtraderUserGroup();
    }
    if (initialValues.serverId) {
      getCtraderCurrencyByServerId(initialValues.serverId);
    }
  }
  onServerChange = value => {
    const {
      getCtraderCurrencyByServerId,
      changeFormField,
      cTraderExtenalData,
      formName
    } = this.props;
    const { formData } = this.state;
    if (value && !cTraderExtenalData.currencyData[value]) {
      getCtraderCurrencyByServerId(value);
    }
    changeFormField(formName, 'group', '');
    changeFormField(formName, 'currency', '');
    this.setState({
      serverId: value
    });
  };

  formatFields = () => {
    const {
      cTraderFormFields,
      cTraderExtenalData,
      verify,
      serverList
    } = this.props;
    const { serverId } = this.state;
    const status = {
      optionList: {
        userGroup: cTraderExtenalData.userGroupsData,
        currency: cTraderExtenalData.currencyData[serverId] || [],
        group: this.getMtGroup(),
        serverId: serverList
      }
    };
    return cTraderFormFields.map(item => {
      const result = Object.assign({}, item);
      for (let key in status) {
        if (status[key][item.key]) {
          result[key] = status[key][item.key];
        }
      }
      if (verify) {
        result.validateType = {
          ...result.validateType,
          required: false
        };
      }
      return result;
    });
  };
  onChange = data => {
    const { serverId } = this.state;
    if (data.serverId !== serverId) {
      this.onServerChange(data.serverId);
    }
  };
  onSubmit = data => {
    return data;
  };
  onSubmitSuccess = data => {
    const { onSubmit, formName } = this.props;
    if (onSubmit) onSubmit(formName, data);
  };
  onSubmitFail = errors => {
    const { onError } = this.props;
    const errs = [];
    if (
      errors.maxLeverage &&
      errors.maxLeverage ===
        i18n['task.object_setting.save.invaild_max_leverage']
    ) {
      errs.push(errors.maxLeverage);
      delete errors.maxLeverage;
    }
    for (const i in errors) {
      if (errors[i]) {
        errs.push(i18n['task.object_setting.save.cbroker_required']);
        break;
      }
    }
    if (onError) onError(errs);
  };
  getMtGroup = () => {
    const { serverList, initialValues = {} } = this.props;
    const { serverId } = this.state;
    const currentServer = serverList.find(server => server.value === serverId);
    return (currentServer && currentServer.groups) || [];
  };
  render() {
    const { initialValues = {}, disabled, serverList, verify } = this.props;
    const fields = this.formatFields();
    const FormComponent = this.FormComponent;
    return (
      <FormComponent
        initialValues={initialValues}
        fields={fields}
        disabled={disabled}
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmitFail={this.onSubmitFail}
      />
    );
  }
}
