import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { required, renderField, maxLength } from 'utils/v2/renderField';
import { connect } from 'react-redux';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import WidthDraw from './components/WithDraw';
export const BALANCE_FORM = 'ACCOUNT_DETAIL_BALANCE_FORM';

class BalanceForm extends PureComponent {
  componentDidMount() {
    // structural
    const {
      osConfig,
      vendor,
      accountInfo,
      bankLists,
      bindBank,
      maxWidthdraw,
      formFields
    } = this.props;
  }
  render() {
    const {
      disabled,
      onTypeChange,
      resources,
      onTypeOptionChange,
      initialValues,
      handleSubmit,
      formValues
    } = this.props;
    if (!formValues) {
      return null;
    }
    const type = initialValues.type === 'deposit' ? 'deposits' : 'withdrawls';
    const typeOptions = resources[type];
    return (
      <Form horizontal>
        <WidthDraw
          disabled={disabled}
          onTypeOptionChange={onTypeOptionChange}
          initialValues={initialValues}
          typeOptions={typeOptions}
        />
      </Form>
    );
  }
}

const BalanceReduxForm = reduxForm({
  form: BALANCE_FORM,
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
  enableReinitialize: true,
  onSubmit: (values, dispatch, props) => {
    const { onSave, getAccountDetail } = props;
    const errors = {};

    if (required(values.amount)) {
      errors.amount = required(values.amount)(
        i18n['account.edit_account_money.amount']
      );
    }

    if (values.amount * 1 === 0) {
      errors.amount = i18n['account.edit_account_money.amount'];
    }

    if (maxLength(31)(values.remark)) {
      errors.remark = maxLength(31)(values.remark);
    }

    if (values.amount && values.type === 'withdraw') {
      return getAccountDetail().then(({ result, data }) => {
        if (result) {
          const amount = parseFloat(values.amount);
          const { balance, equity, marginFree } = data.accountInfo;
          const item = [];

          if (amount > parseFloat(balance))
            item.push(i18n['account.account_detail.balance']);
          if (amount > parseFloat(equity))
            item.push(i18n['account.account_detail.equity']);
          if (amount > parseFloat(marginFree))
            item.push(i18n['account.account_detail.marginAvailable']);

          const errorMsg = (
            <FormattedMessage
              id="account.account_detail.withdraw.tips"
              defaultMessage={i18n['account.account_detail.withdraw.tips']}
              values={{ items: item.join(i18n['general.stop']) }}
            />
          );

          if (item.length) {
            errors.amount = errorMsg;
          }

          if (Object.keys(errors).length) {
            throw new SubmissionError(errors);
          } else {
            onSave(values);
          }
        }
      });
    }

    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);

      return values;
    }

    onSave(values);
  }
})(BalanceForm);

export default connect(
  state => {
    return {
      formValues: getFormValues(BALANCE_FORM)(state)
    };
  },
  {}
)(BalanceReduxForm);
