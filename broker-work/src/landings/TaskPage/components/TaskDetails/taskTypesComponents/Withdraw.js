import i18n from 'utils/i18n';
import { Form, Collapse } from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import cs from '../TaskDetails.less';
import EllipsisContent from 'components/v2/EllipsisContent';
import WarningValue from 'components/v2/WarningValue';
import getFieldValue from 'utils/fieldValue';
import { SERVER_KEY_MAP } from '../../../contants';
import { fetchBanks, setBanksMap } from 'utils/banks';
import { getType as getLanguageType } from 'utils/language';
const curLang = getLanguageType();
export default class Leverage extends PureComponent {
  state = {
    pending: true,
    diffNameTag: ''
  };
  componentDidMount() {
    const {
      getWithdrawFormField,
      initialValues: {
        applicationData: { bankAccountName } = {},
        account: { name, vendor } = {}
      } = {},
      setComfirmContent,
      withdrawCustomType
    } = this.props;
    getWithdrawFormField();
    const diffNameTag =
      bankAccountName === name
        ? ''
        : i18n['task.withdraw.diffenent_bank_account_name'];
    if (diffNameTag) {
      this.setState({
        diffNameTag
      });
      setComfirmContent(diffNameTag + ', ');
    }
    this.getExternalData();
    this.__timer = setInterval(this.getExternalData, 5 * 60 * 1000);
    withdrawCustomType(vendor);
  }
  componentWillUnmount() {
    clearInterval(this.__timer);
  }
  getExternalData = () => {
    const { getExternalFormData, initialValues } = this.props;
    const {
      account: { customerId, accountId, serverId, vendor }
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
      applicationData,
      account,
      externalData = {
        currentAmount: {},
        accountForTask: {}
      }
    } = this.props.initialValues;
    const { withdrawFormField, withdrawTypes } = this.props;
    const { pending, diffNameTag } = this.state;
    const currentAmount = externalData.currentAmount || {};
    const exchangedAmount =
      applicationData &&
      getExchangedAmount(
        applicationData.withdrawAmount,
        applicationData.withdrawExchange
      );
    let banks = fetchBanks();
    let banksMap = setBanksMap(banks);
    applicationData.bankName =
      banksMap[applicationData.bankName] || applicationData.bankName;
    let withdrawTypeLabel = '';
    if (applicationData.withdrawType !== 'CUSTOMIZE') {
      withdrawTypeLabel =
        i18n[`task.details.withdraw.types.${applicationData.withdrawType}`];
    } else {
      const tar = _.find(withdrawTypes, { typeId: applicationData.typeId });
      if (tar) {
        const label = tar.message[curLang];
        if (label) {
          withdrawTypeLabel = label;
        } else {
          const messageK = Object.keys(tar.message);
          if (messageK.length) {
            withdrawTypeLabel = tar.message[messageK[0]];
          }
        }
      }
    }
    const decimalPart = String(applicationData.withdrawExchange)
      .split('.')
      .pop();
    const withdrawExchange =
      decimalPart.length > 6
        ? Number(applicationData.withdrawExchange).toFixed(6)
        : applicationData.withdrawExchange;

    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.associated']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue pending={pending} field={externalData.customerName} />
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.payee_name']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {applicationData.bankAccountName}
            {diffNameTag ? (
              <div className={cs['warning-value']}>{diffNameTag}</div>
            ) : (
              undefined
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.withdraw_account']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            <WarningValue pending={pending} field={account.accountId}>
              {externalData.accountInfomationLink ? (
                <a
                  target="_blank"
                  href={`/accountmgmt/${account.accountId}?vendor=${
                    account.vendor
                  }&serverId=${account.serverId}`}
                >
                  {`${account.accountId || ''} ${
                    i18n['task.details.field.server']
                  }: (${SERVER_KEY_MAP[account.vendor] || account.vendor} ${
                    externalData.serverName
                  })`}
                </a>
              ) : (
                `${account.accountId || ''} ${
                  i18n['task.details.field.server']
                }: (${SERVER_KEY_MAP[account.vendor]} ${
                  externalData.serverName
                })`
              )}
            </WarningValue>
          </Form.Control>
        </Form.Item>
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
            {externalData.group || '--'}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.withdraw_amount']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {applicationData.withdrawAmount ? (
              <div>
                {`${applicationData.currency || ''} ${
                  applicationData.withdrawAmount
                }`}
                <span className={cs['from-bold']}>
                  {exchangedAmount &&
                    `(${exchangedAmount} ${applicationData.payCurrency})`}
                </span>
              </div>
            ) : (
              '--'
            )}
          </Form.Control>
        </Form.Item>
        {applicationData && applicationData.withdrawExchange ? (
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.exchange_rate']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              <FormattedMessage
                id="task.details.field.exchange_rate.format"
                defaultMessage={i18n['task.details.field.exchange_rate.format']}
                values={{
                  currency: applicationData.currency,
                  payCurrency: applicationData.payCurrency,
                  withdrawExchange
                }}
              />
            </Form.Control>
          </Form.Item>
        ) : (
          undefined
        )}
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.account_balance']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {currentAmount.balance ? (
              <WarningValue
                pending={pending}
                field={currentAmount.balance}
                minus
              >
                {`${applicationData.currency || ''} ${currentAmount.balance}`}
              </WarningValue>
            ) : (
              '--'
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.account_equity']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {currentAmount.equity ? (
              <WarningValue
                pending={pending}
                field={currentAmount.equity}
                minus
              >
                {`${applicationData.currency || ''} ${currentAmount.equity}`}
              </WarningValue>
            ) : (
              '--'
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.available_margin']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {currentAmount.marginAvailable ? (
              <WarningValue
                pending={pending}
                field={currentAmount.marginAvailable}
                minus
              >
                {`${applicationData.currency || ''} ${
                  currentAmount.marginAvailable
                }`}
              </WarningValue>
            ) : (
              '--'
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.withdraw_type']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {withdrawTypeLabel}
          </Form.Control>
        </Form.Item>
        {(applicationData.withdrawType === 'BANK_CARD' ||
          applicationData.withdrawType === 'CHECK') && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.bank_name']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.bankName}
            </Form.Control>
          </Form.Item>
        )}
        {applicationData.withdrawType === 'BANK_CARD' && (
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.bank_branch_name']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.bankBranchName}
            </Form.Control>
          </Form.Item>
        )}
        {applicationData.withdrawType === 'BANK_CARD' && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.bank_address']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.bankAddress}
            </Form.Control>
          </Form.Item>
        )}
        {applicationData.withdrawType === 'BANK_CARD' && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.swift_code']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.SWIFT}
            </Form.Control>
          </Form.Item>
        )}
        {(applicationData.withdrawType === 'BANK_CARD' ||
          applicationData.withdrawType === 'CHECK') && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.bank_account']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.bankAccountNumber}
            </Form.Control>
          </Form.Item>
        )}
        {applicationData.withdrawType === 'DIGITAL_CASH' && (
          <Form.Item col={1}>
            <Form.Label>
              {i18n['task.details.field.coin.receive_address']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {applicationData.receiveAddress}
            </Form.Control>
          </Form.Item>
        )}
        {withdrawFormField.map((field, i) => {
          return (
            applicationData[field.key] && (
              <Form.Item
                col={field.longField ? 'longLabel' : 2 / field.columns}
                key={i}
              >
                <Form.Label>{field.label}：</Form.Label>
                <Form.Control className={cs['form-text']}>
                  {getFieldValue(field, applicationData[field.key])}
                </Form.Control>
              </Form.Item>
            )
          );
        })}
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
      account: { customerId, accountId, serverId, vendor }
    } = initialValues;
    getExternalFormData([
      {
        key: 'accountForTask',
        value: { customerId, accountId, vendor, serverId },
        fieldName: 'accountForTask'
      },
      {
        key: 'identical',
        value: { taskId, accountId },
        fieldName: 'identical'
      }
    ]);
  };
  render() {
    const {
      externalData: { accountForTask = {}, identical = [] } = {},
      account: { accountId } = {}
    } = this.props.initialValues;
    const { accounts = [], ticket: { tradeList } = { tradeList: [] } } =
      accountForTask || {};
    const examKeys = ['balance', 'equity', 'marginFree'];
    if (!accounts.length && !tradeList.length && !identical.length)
      return <div />;
    return (
      <Collapse forceActiveAll>
        <Collapse.Item title={i18n['task.taks_details.risk_warning']}>
          <Form>
            {accounts.map((item, i) => {
              if (`${item.accountId}` === `${accountId}`) {
                return;
              }
              return (
                <Form.Item col={2} key={i} data-test="account-item">
                  <Form.Label>
                    {i18n['task.taks_details.risk_warning.account_name']}
                  </Form.Label>
                  <Form.Control className={cs['form-text']}>
                    {item.accountId}
                    {' ('}
                    {examKeys.map(key => {
                      if (item[key] < 0) {
                        return [
                          i18n[`task.taks_details.risk_warning.${key}`],
                          '：',
                          <WarningValue field={item[key]} minus />,
                          ' '
                        ];
                      } else {
                        return undefined;
                      }
                    })}
                    {')'}
                  </Form.Control>
                </Form.Item>
              );
            })}
            {tradeList.map((item, i) => {
              return (
                <Form.Item col={2} key={i} data-test="ticket-item">
                  <Form.Label>
                    {i18n['task.taks_details.risk_warning.orders']}
                  </Form.Label>
                  <Form.Control className={cs['form-text']}>
                    <EllipsisContent>
                      {item.ticket}
                      {' ('}
                      {i18n['task.taks_details.risk_warning.orders_number']}
                      {')'}
                    </EllipsisContent>
                  </Form.Control>
                </Form.Item>
              );
            })}
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

function getExchangedAmount(amount, exchange) {
  if (typeof amount === 'undefined' || typeof exchange === 'undefined')
    return undefined;
  const accuracy = Math.max(getAacc(amount), getAacc(exchange));
  return (
    (amount * accuracy * (exchange * accuracy)) /
    Math.pow(accuracy, 2)
  ).toFixed(2);
}

function getAacc(num = '') {
  const arr = num.toString().split('.');
  const len = (arr[1] && arr[1].length) || 0;
  return Math.pow(10, len);
}
