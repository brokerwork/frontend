import cs from './index.less';
import i18n from 'utils/i18n';
const withDrawKeysFilter = {
  withdraw_task: [
    'account',
    'accountName',
    'withdrawType',
    'withdrawAmount',
    'bankAccountName',
    'bankAccount',
    'bank',
    'bankBranchName',
    'bankAddress',
    'SWIFT',
    'receiveAddress',
    'comment'
  ],
  transfer_task: [
    'account',
    'accountName',
    'transferAmount',
    'receiptAccount',
    'receiptAccountName',
    'receiptServerName',
    'comment'
  ]
};

export default class WithdrawInfoCard extends PureComponent {
  render() {
    const {
      info,
      withdrawTypesMap,
      formFields,
      bankObj,
      optionType
    } = this.props;
    return (
      <div className={cs['confirm-container']}>
        <div className={cs['content']}>
          <div className={cs['header']}>
            {i18n['settings.deposit_withdraw.create_task.information']}
          </div>
          <ul className={cs['body']}>
            {withDrawKeysFilter[optionType].map(key => {
              let isShow = true;
              let content = info[key];
              switch (key) {
                case 'withdrawType':
                  content = withdrawTypesMap[info.withdrawType];
                  break;
                case 'bankAccountName':
                  isShow =
                    optionType === 'withdraw_task' &&
                    info.withdrawType === 'BANK_CARD';
                  break;
                case 'bankAccount':
                  isShow =
                    optionType === 'withdraw_task' &&
                    (info.withdrawType === 'BANK_CARD' ||
                      info.withdrawType === 'CHECK');
                  break;
                case 'bankBranchName':
                case 'bankAddress':
                case 'SWIFT':
                  isShow =
                    optionType === 'withdraw_task' &&
                    info.withdrawType === 'BANK_CARD';
                  break;
                case 'bank':
                  isShow =
                    optionType === 'withdraw_task' &&
                    (info.withdrawType === 'BANK_CARD' ||
                      info.withdrawType === 'CHECK');
                  content = bankObj[info.bank];
                  break;
                case 'receiveAddress':
                  isShow =
                    optionType === 'withdraw_task' &&
                    info.withdrawType === 'DIGITAL_CASH';
                  break;
                default:
                  content = info[key];
              }
              return (
                isShow && (
                  <li key={key}>
                    <span>
                      {
                        i18n[
                          `settings.deposit_${
                            optionType === 'withdraw_task'
                              ? 'withdraw'
                              : 'transfer'
                          }.create_task.${key}`
                        ]
                      }
                    </span>
                    <span>{content}</span>
                  </li>
                )
              );
            })}
            {formFields &&
              formFields.map(el => {
                return (
                  <li>
                    <span>{el.label}</span>
                    <span>{info[el.key]}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}
