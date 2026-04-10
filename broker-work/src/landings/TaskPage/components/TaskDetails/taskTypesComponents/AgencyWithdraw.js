import i18n from 'utils/i18n';
import { Form, Collapse } from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import cs from '../TaskDetails.less';
import { SERVER_KEY_MAP } from '../../../contants';
import EllipsisContent from 'components/v2/EllipsisContent';
import WarningValue from 'components/v2/WarningValue';
import getCustomFieldValue from 'utils/fieldValue';
import { getType as getLanguageType } from 'utils/language';
const curLang = getLanguageType();

export default class AgencyWithdraw extends PureComponent {
  state = {
    diffNameTag: ''
  };
  componentDidMount() {
    const {
      initialValues: { bankAccountName, name, vendor },
      setComfirmContent,
      withdrawCustomType
    } = this.props;
    this.getExternalData();
    this.__timer = setInterval(this.getExternalData, 5 * 60 * 1000);
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
    withdrawCustomType(vendor);
  }
  componentWillUnmount() {
    clearInterval(this.__timer);
  }
  getExternalData = () => {
    const { getExternalFormData, initialValues } = this.props;
    const { accountId, serverId, vendor } = initialValues;
    getExternalFormData([
      {
        key: 'currentAmount',
        value: { vendor, serverId, accountId },
        fieldName: 'currentBalance'
      },
      { key: 'agencyWithdrawFields', fieldName: 'agencyWithdrawFields' },
      { key: 'serverName', value: { serverId, vendor }, fieldName: 'serverId' },
      {
        key: 'accountInfomationLink',
        value: { accountId, vendor, serverId },
        fieldName: 'showAccountInfomationLink'
      }
    ]);
  };
  _renderRow = (col, idx) => {
    const { initialValues } = this.props;

    return (
      initialValues[col.key] && (
        <Form.Item
          col={col.longField ? 'longLabel' : 2 / col.columns}
          key={idx}
        >
          <Form.Label title={col.label} className={cs['label']}>
            {`${col.label}: `}
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {initialValues
              ? getCustomFieldValue(col, initialValues[col.key])
              : undefined}
          </Form.Control>
        </Form.Item>
      )
    );
  };

  render() {
    const { initialValues, withdrawTypes } = this.props;
    const { diffNameTag } = this.state;
    const { externalData, applicationData } = initialValues;
    const currentAmount = externalData.currentAmount || {};
    const agencyWithdrawFields = externalData.agencyWithdrawFields || [];
    const exchangedAmount =
      initialValues &&
      getExchangedAmount(
        initialValues.withdrawAmount,
        initialValues.withdrawExchange
      );
    let withdrawTypeLabel = '';
    if (initialValues.withdrawType !== 'CUSTOMIZE') {
      withdrawTypeLabel =
        i18n[`task.details.withdraw.types.${initialValues.withdrawType}`];
    } else {
      const tar = _.find(withdrawTypes, { typeId: initialValues.typeId });
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
    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.payee_name']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {initialValues.bankAccountName}
            {diffNameTag ? (
              <div data-test="diff-name" className={cs['warning-value']}>
                {diffNameTag}
              </div>
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
            {externalData.accountInfomationLink ? (
              <a
                target="_blank"
                href={`/accountmgmt/${initialValues.accountId}?vendor=${
                  initialValues.vendor
                }&serverId=${initialValues.serverId}`}
              >
                {`${initialValues.accountId || ''} ${
                  i18n['task.details.field.server']
                }: (${SERVER_KEY_MAP[initialValues.vendor]} ${
                  externalData.serverName
                })`}
              </a>
            ) : (
              `${initialValues.accountId || ''} ${
                i18n['task.details.field.server']
              }: (${
                SERVER_KEY_MAP[initialValues.vendor]
              } ${externalData.serverName || ''})`
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {initialValues.vendor === 'CTRADER'
              ? i18n['task.details.field.ct_group']
              : i18n['task.details.field.mt_group']}
            :
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.group}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.withdraw_amount']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${initialValues.currency || ''} ${initialValues.withdrawAmount}`}
            <span className={cs['from-bold']}>
              {exchangedAmount &&
                `(${exchangedAmount} ${initialValues.payCurrency})`}
            </span>
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.exchange_rate']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            <FormattedMessage
              id="task.details.field.exchange_rate.format"
              defaultMessage={i18n['task.details.field.exchange_rate.format']}
              values={{
                currency: initialValues.currency,
                payCurrency: initialValues.payCurrency,
                withdrawExchange: initialValues.withdrawExchange
              }}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.account_balance']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${initialValues.currency || ''} ${currentAmount.balance}`}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.account_equity']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${initialValues.currency || ''} ${currentAmount.equity}`}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.available_margin']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${initialValues.currency || ''} ${currentAmount.marginAvailable}`}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.withdraw_type']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {withdrawTypeLabel}
          </Form.Control>
        </Form.Item>
        {(initialValues.withdrawType === 'BANK_CARD' ||
          initialValues.withdrawType === 'CHECK') && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.bank_name']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {initialValues.bankName}
            </Form.Control>
          </Form.Item>
        )}
        {initialValues.withdrawType === 'BANK_CARD' && (
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.bank_branch_name']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {initialValues.bankBranchName}
            </Form.Control>
          </Form.Item>
        )}
        {initialValues.withdrawType === 'BANK_CARD' && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.bank_address']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {initialValues.bankAddress}
            </Form.Control>
          </Form.Item>
        )}
        {initialValues.withdrawType === 'BANK_CARD' && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.swift_code']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {initialValues.swift}
            </Form.Control>
          </Form.Item>
        )}
        {(initialValues.withdrawType === 'BANK_CARD' ||
          initialValues.withdrawType === 'CHECK') && (
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.bank_account']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {initialValues.bankAccountNumber}
            </Form.Control>
          </Form.Item>
        )}
        {initialValues.withdrawType === 'DIGITAL_CASH' && (
          <Form.Item col={1}>
            <Form.Label>
              {i18n['task.details.field.coin.receive_address']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {initialValues.receiveAddress}
            </Form.Control>
          </Form.Item>
        )}
        {agencyWithdrawFields.map(this._renderRow)}
      </Form>
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

export class RistWarning extends PureComponent {
  componentDidMount() {
    this.getExternalData();
  }
  getExternalData = () => {
    const { getExternalFormData, initialValues, taskId } = this.props;
    const { accountId, serverId, vendor } = initialValues;
    getExternalFormData([
      {
        key: 'accountForTask',
        value: { customerId: '', accountId, vendor, serverId },
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
      <Collapse forceActiveAll={true}>
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
                <Form.Item col={2} key={i}>
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
                  <Form.Control
                    className={cs['form-text']}
                    data-test="job-item"
                  >
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
