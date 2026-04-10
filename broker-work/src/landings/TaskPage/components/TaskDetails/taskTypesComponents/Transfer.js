import i18n from 'utils/i18n';
import { Form, Collapse } from 'lean-ui';
import cs from '../TaskDetails.less';
import WarningValue from 'components/v2/WarningValue';
import { FormattedMessage } from 'react-intl';

export default class Transfer extends PureComponent {
  state = {
    pending: true
  };
  componentDidMount() {
    this.getExternalData();
    this.__timer = setInterval(this.getExternalData, 5 * 60 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.__timer);
  }
  getExternalData = () => {
    const { getExternalFormData, initialValues } = this.props;
    const {
      payoutAccount: { customerId, accountId, serverId, vendor }
    } = initialValues;
    getExternalFormData([
      {
        key: 'currentAmount',
        value: { vendor, serverId, accountId },
        fieldName: 'currentBalance'
      }
    ]).then(res => {
      this.setState({
        pending: false
      });
    });
  };
  render() {
    const {
      payoutAccount,
      receiptAccount,
      currency,
      transferAmount,
      comment,
      externalData = {
        payoutAccountName: {},
        receiptAccountName: {},
        currentAmount: {}
      }
    } = this.props.initialValues;
    const { pending } = this.props;
    const receiptAccountName = externalData.receiptAccountName || {};
    const payoutAccountName = externalData.payoutAccountName || {};
    const currentAmount = externalData.currentAmount || {};
    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_out_customer_name']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {payoutAccountName.name}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_out_account']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${payoutAccount.accountId} ${
              i18n['task.details.field.server']
            }: (${
              payoutAccount.vendor
            } ${externalData.payoutAccountServerName || ''})`}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_out_account_blance']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue pending={pending} field={currentAmount.balance} minus>
              {currency} {currentAmount.balance}
            </WarningValue>
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_out_account_equity']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue pending={pending} field={currentAmount.equity} minus>
              {currency} {currentAmount.equity}
            </WarningValue>
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_out_account_available_margin']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue
              pending={pending}
              field={currentAmount.marginAvailable}
              minus
            >
              {currency} {currentAmount.marginAvailable}
            </WarningValue>
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_in_customer_name']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue pending={pending} field={receiptAccountName.name} />
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_in_account']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue field={receiptAccount.accountId}>
              {`${receiptAccount.accountId} ${
                i18n['task.details.field.server']
              }: (${
                receiptAccount.vendor
              } ${externalData.receiptAccountServerName || ''})`}
            </WarningValue>
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.transfer_amount']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue field={transferAmount} minus>
              {`${currency || ''} ${transferAmount}`}
            </WarningValue>
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export class RistWarning extends PureComponent {
  componentDidMount() {
    this.getExternalData();
  }
  getExternalData = () => {
    const { getExternalFormData, initialValues, taskId } = this.props;
    const {
      payoutAccount: { customerId, accountId }
    } = initialValues;
    getExternalFormData([
      {
        key: 'identical',
        value: { taskId, accountId },
        fieldName: 'identical'
      }
    ]);
  };
  render() {
    const { externalData: { identical = [] } = {} } = this.props.initialValues;
    const examKeys = ['balance', 'equity', 'marginFree'];
    if (!identical.length) return <div />;
    return (
      <Collapse forceActiveAll={true}>
        <Collapse.Item title={i18n['task.taks_details.risk_warning_transfer']}>
          <Form>
            {identical.map((item, i) => {
              return (
                <Form.Item col={2} key={i} data-test="job-item">
                  <Form.Label>
                    <FormattedMessage
                      id="task.taks_details.risk_warning.identical"
                      defaultMessage={
                        i18n['task.taks_details.risk_warning.identical']
                      }
                      values={{
                        jobType:
                          i18n[
                            `task.object_setting.task_setting.task_group_type.${
                              item.jobType
                            }`
                          ]
                      }}
                    />
                  </Form.Label>
                  <Form.Control className={cs['form-text']}>
                    {item.jobNo}
                    {` (${i18n['task.object_detail.taskid']}) `}
                    {item.currency}
                    {item.transferAmount || item.withdrawAmount}
                  </Form.Control>
                </Form.Item>
              );
            })}
          </Form>
        </Collapse.Item>
      </Collapse>
    );
  }
}
