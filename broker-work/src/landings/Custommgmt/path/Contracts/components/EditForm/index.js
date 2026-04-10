import { reduxForm } from 'redux-form';
import CustomField, { validate } from 'components/v2/CustomField';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import { FormattedMessage } from 'react-intl';

export const CONTRACT_INFO_FORM = 'CONTRACT_INFO_FORM';

let hasMediatorFlag;

const ContractForm = reduxForm({
  form: CONTRACT_INFO_FORM,
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
  validate: function(values, props) {
    const { currentServer, passwordRegular } = props;
    const customeErrors = validate(values, props);
    const errors = {};

    if (
      values.startTime &&
      values.endTime &&
      values.startTime > values.endTime
    ) {
      errors['endTime'] = i18n['customer.contract.time_error'];
    }
    if (values.products && !values.products.length) {
      errors['products'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['customer.contract_field.products'] }}
        />
      );
    }
    return Object.assign({}, customeErrors, errors);
  },
  onChange: function(values, dispatch, props) {
    const { hasMediator } = values;
    if (hasMediator !== hasMediatorFlag) {
      const { toggleHasMediator } = props;
      toggleHasMediator(hasMediator);

      hasMediatorFlag = hasMediator;
    }
  }
})(({ fields, disabled }) => {
  return <CustomField disabled={disabled} fields={fields} />;
});

export default class EditForm extends Component {
  constructor(props) {
    super(props);
    const {
      initialValues: { hasMediator }
    } = props;
    hasMediatorFlag = hasMediator;
  }

  componentDidMount() {
    const {
      toggleHasMediator,
      initialValues: { hasMediator }
    } = this.props;
    toggleHasMediator(hasMediator);
  }

  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };

  onSubmit = data => {
    const result = {
      customerId: data.customerId,
      contracts: {
        contracstNo: data.contracstNo,
        contractsName: data.contractsName,
        customerName: data.customerName,
        opportunityId: data.opportunityId,
        products: data.products,
        startTime: data.startTime && data.startTime.valueOf(),
        endTime: data.endTime && data.endTime.valueOf(),
        totalAmount: data.totalAmount,
        accessorys: data.accessorys,
        period: data.period,
        associates: data.associates,
        certificate: data.certificate,
        refundPeriod: data.refundPeriod,
        hasMediator: data.hasMediator
      }
    };
    if (data.contractsId) {
      result.contractsId = data.contractsId; //edit;
    }

    if (data.hasMediator) {
      //有居间人，带入居间人相关属性
      result.contracts.mediatorName = data.mediatorName;
      result.contracts.mediatorAccount = data.mediatorAccount;
      result.contracts.mediatorBankAddr = data.mediatorBankAddr;
    }

    return result;
  };

  onSubmitSuccess = data => {
    const { onSave } = this.props;
    if (onSave) onSave(data);
  };
  formatFields = () => {
    const { contractFields, disabledOpIds, bindedSaleOpp } = this.props;
    return contractFields.map(item => {
      if (item.key === 'opportunityId') {
        if (bindedSaleOpp) {
          const __item = {
            ...item,
            optionList: [bindedSaleOpp],
            readonly: true
          };
          return __item;
        } else {
          const __item = {
            ...item,
            optionList: item.optionList.filter(
              item => !disabledOpIds.includes(item.value)
            )
          };
          return __item;
        }
      }
      return item;
    });
  };
  render() {
    const {
      getProductList,
      productList,
      contractFields = [],
      initialValues,
      disabled,
      toggleHasMediator
    } = this.props;
    const formatedFields = this.formatFields();
    return (
      <ContractForm
        fields={formatedFields}
        disabled={disabled}
        onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
        toggleHasMediator={toggleHasMediator}
      />
    );
  }
}
