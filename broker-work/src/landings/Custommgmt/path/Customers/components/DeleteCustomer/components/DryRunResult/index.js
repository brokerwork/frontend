import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';

export default props => {
  const { dryRunResult } = props;
  const numItemsCanNotDelete = dryRunResult.canNotRemove;
  const numItemsCanDelete = dryRunResult.canRemove;
  const arrBindAccounts = dryRunResult.bindAccount;
  const arrBindTa = dryRunResult.bindTa;
  return (
    <div style={{ textAlign: 'left' }}>
      <p>
        <FormattedMessage
          id="customer.remove_continue_tips1"
          defaultMessage={i18n['customer.remove_continue_tips1']}
          values={{
            number: (
              <strong style={{ color: 'red' }}>{numItemsCanNotDelete}</strong>
            )
          }}
        />
      </p>
      <p>
        {i18n['customer.remove_continue_tips2']}
        {arrBindAccounts.join(i18n['general.dot'])}
      </p>
      <p>
        {i18n['customer.remove_continue_tips3']}
        {arrBindTa.join(i18n['general.dot'])}
      </p>
      <br />
      <p>
        <FormattedMessage
          id="customer.remove_continue_tips4"
          defaultMessage={i18n['customer.remove_continue_tips4']}
          values={{
            number: (
              <strong style={{ color: 'red' }}>{numItemsCanDelete}</strong>
            )
          }}
        />
      </p>
    </div>
  );
};
