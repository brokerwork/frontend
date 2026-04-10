import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import cs from '../TaskDetails.less';
import cls from 'utils/class';
import {
  SERVER_KEY_MAP,
  TELEGRAPHIC_DEPOSIT_KEY,
  VIEW_TYPE
} from '../../../contants';
import { getImageValue } from 'utils/fieldValue';
import ToggleInput from 'components/v2/ToggleInput';
import { isNumber } from 'utils/validate';
import { reduxForm } from 'redux-form';

export const DEPOSIT_FORM = 'DEPOSIT_FORM';
const DepoistTriggerForm = reduxForm({
  form: DEPOSIT_FORM
})(() => <div />);
// 入金
export default class Deposit extends PureComponent {
  state = {
    depositAmount: ''
  };
  onDepositAmountChange = value => {
    const {
      onSubmit,
      initialValues,
      showTopAlert,
      initialValues: { applicationData }
    } = this.props;
    if (!onSubmit) return;
    const copyData = JSON.parse(JSON.stringify(initialValues));
    if (!(isNumber(value) && parseFloat(value) > 0)) {
      showTopAlert({
        content: i18n['custom_field.greater_than_zero_number_unequal']
      });
      return;
    }
    copyData.applicationData = {
      ...copyData.applicationData,
      depositAmount: parseFloat(value)
    };
    delete copyData.externalData;
    onSubmit(copyData);
    this.onToggleInputBlur(value);
  };
  onDepositAmountInput = value => {
    this.setState({
      depositAmount: value
    });
  };
  componentDidMount() {
    const { initialValues, getCurrentRate } = this.props;
    const { applicationData = {}, account: { vendor } = {} } = initialValues;
    let depositAmount = applicationData.depositAmount;
    getCurrentRate &&
      getCurrentRate({
        type: 'deposit',
        vendor,
        payCurrency: applicationData.payCurrency,
        transactionCurrency: applicationData.currency
      });
    this.setState({
      depositAmount
    });
  }
  render() {
    let { disabled, initialValues, data, currentRate } = this.props;
    const { applicationData, account = {}, externalData = {} } = initialValues;
    const { depositAmount } = this.state;
    const isTelegraphic =
      applicationData.payPlatform === TELEGRAPHIC_DEPOSIT_KEY;
    let payAmount = applicationData.payAmount;
    let poundage = '';
    let balance = '';
    if ((payAmount || isTelegraphic) && depositAmount) {
      //添加isTelegraphic电汇入金没有实际支付金额（payAmount）时，也计算balance
      poundage = ((depositAmount * (applicationData.fee || 0)) / 100).toFixed(
        2
      );
      balance = depositAmount - (poundage || 0);
    }
    // 电汇入金申请能否编辑任务信息 在任务设置里面 审批人是否能够修改电汇入金申请任务信息 可控制
    if (data.viewType === VIEW_TYPE.PROCESS) {
      disabled = !data.isEdit;
    }
    return (
      <Form>
        <DepoistTriggerForm
          onSubmit={data => data}
          onSubmitSuccess={this.onDepositAmountChange.bind(this, depositAmount)}
        />
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.associated']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.customerName || ''}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.deposit_account']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${account.accountId} ${i18n['task.details.field.server']}: (${
              SERVER_KEY_MAP[account.vendor]
            } ${externalData.serverName})`}
          </Form.Control>
        </Form.Item>
        {!!applicationData.accountName && (
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.va.accountName']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.accountName}
            </Form.Control>
          </Form.Item>
        )}
        {!!applicationData.bankAccount && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.va.bankName']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {`${applicationData.bankAccount}（${applicationData.bankName}）`}
            </Form.Control>
          </Form.Item>
        )}
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.accoun_owner']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.accountOwner || ''}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {account.vendor === 'CTRADER'
              ? i18n['task.details.field.ct_group']
              : i18n['task.details.field.mt_group']}
            :
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.group}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.deposit_amount']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {applicationData.currency}{' '}
            <ToggleInput
              disabled={!isTelegraphic || disabled}
              inline
              staticIcon
              inputType="number"
              decimal="{0,2}"
              inputClassName={cs['deposit-input']}
              value={depositAmount}
              // onChange={this.onDepositAmountChange}
              cancelButton
              onInput={this.onDepositAmountInput}
              bindBlur={blurFunc => (this.onToggleInputBlur = blurFunc)}
            />
          </Form.Control>
          {isTelegraphic ? (
            <div className={cs['current-rate']}>
              {i18n['task.details.field.current_rate']}:{' '}
              {currentRate && currentRate.toFixed(4)}
            </div>
          ) : null}
        </Form.Item>
        {isTelegraphic ? (
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.telegraphic_pay_amount']}：
            </Form.Label>
            <Form.Control
              className={cs['form-text']}
            >{`${applicationData.payCurrency || ''} ${payAmount ||
              ''}`}</Form.Control>
          </Form.Item>
        ) : (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.pay_amount']}：</Form.Label>
            <Form.Control
              className={cs['form-text']}
            >{`${applicationData.payCurrency || ''} ${payAmount ||
              ''}`}</Form.Control>
          </Form.Item>
        )}

        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.poundage']}：</Form.Label>
          <Form.Control className={cs['form-text']}>{`${
            applicationData.currency
          } ${poundage}`}</Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.deposit_balance']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>{`${
            applicationData.currency
          } ${balance}`}</Form.Control>
        </Form.Item>
        {isTelegraphic ? (
          undefined
        ) : (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.order_number']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.orderNo}
            </Form.Control>
          </Form.Item>
        )}
        {isTelegraphic ? (
          undefined
        ) : (
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.pay_order_number']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.payOrderNo}
            </Form.Control>
          </Form.Item>
        )}
        {isTelegraphic ? (
          undefined
        ) : (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.pay_platform']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.payPlatformName}
            </Form.Control>
          </Form.Item>
        )}
        {isTelegraphic ? (
          undefined
        ) : (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.pay_status']}：</Form.Label>
            <Form.Control
              className={cls`${cs['form-text']}
                        ${
                          applicationData.payStatus === 'Pending'
                            ? cs['pay_status_pending']
                            : cs['pay_status_finished']
                        }`}
            >
              {i18n[`task.form.pay_status.${applicationData.payStatus}`]}
            </Form.Control>
          </Form.Item>
        )}
        {isTelegraphic ? (
          <Form.Item col={1}>
            <Form.Label>
              {i18n['task.details.field.deposit_receipt']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {Array.isArray(applicationData.telegraphicTransferUrl) &&
                applicationData.telegraphicTransferUrl.map((item, i) => (
                  <span className={cs['field-image']} key={i}>
                    {getImageValue(item, false, true)}
                  </span>
                ))}
            </Form.Control>
          </Form.Item>
        ) : (
          undefined
        )}
      </Form>
    );
  }
}
