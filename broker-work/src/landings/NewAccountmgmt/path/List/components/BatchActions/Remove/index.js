import { Button } from 'lean-ui';
import cs from './Remove.less';
import rcs from './../style.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
export default class Remove extends PureComponent {
  checkAccount = () => {
    const {
      checkAccountCusAndTA,
      selectedAccountIds,
      currentServer,
      showTipsModal
    } = this.props;

    checkAccountCusAndTA(selectedAccountIds, currentServer).then(
      ({ result, data }) => {
        if (result) {
          const { hasCustomer, hasTaUser } = data;
          const content = () => {
            return (
              <div>
                {hasCustomer ? (
                  <FormattedMessage
                    id="account.remove_account.text.customer"
                    defaultMessage={
                      i18n['account.remove_account.text.customer']
                    }
                    values={{
                      number: <span className={cs['num']}>{hasCustomer}</span>
                    }}
                  />
                ) : (
                  ''
                )}
                {hasTaUser ? (
                  <FormattedMessage
                    id="account.remove_account.text.ta"
                    defaultMessage={i18n['account.remove_account.text.ta']}
                    values={{
                      number: <span className={cs['num']}>{hasTaUser}</span>
                    }}
                  />
                ) : (
                  ''
                )}
                {hasCustomer || hasTaUser ? '；' : ''}
                {i18n['account.remove_account.text.tips']}
              </div>
            );
          };

          showTipsModal({
            content: content(),
            onConfirm: cb => {
              this.removeAccount();
              cb();
            }
          });
        }
      }
    );
  };

  removeAccount = () => {
    const {
      selectedAccountIds,
      removeAccount,
      currentServer,
      showTopAlert,
      onChange,
      updateSelectedAccountIds
    } = this.props;

    removeAccount(selectedAccountIds, currentServer).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.remove_success']
        });
        onChange();
        updateSelectedAccountIds([]);
      }
    });
  };

  render() {
    const { selectedKeys } = this.props;
    return (
      <TextButton
        text={i18n['account.button.remove_account']}
        onClick={this.checkAccount}
      />
    );
  }
}
