import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { Button } from 'lean-ui';

export default class BatchActionBar extends Component {
  onCancel = () => {
    const { updateSelectedItems } = this.props;
    updateSelectedItems({});
  };
  render() {
    const {
      userRights,
      selectedItemsMap,
      onDeleteCustomer,
      onTransferCustomer,
      onSendMessage,
      onSendInvitateEmail
    } = this.props;
    const selectedItems = Object.keys(selectedItemsMap);

    return (
      <span className={cs['batch-action']}>
        <span className={cs['selected']}>
          <FormattedMessage
            id="customer.selected_tips"
            defaultMessage={i18n['customer.selected_tips']}
            values={{
              number: (
                <span className={`${cs['selected-number']} main-color`}>
                  {selectedItems.length}
                </span>
              )
            }}
          />
        </span>
        <span
          className={`${cs['tool-btn']} main-color`}
          onClick={this.onCancel}
        >
          {i18n['customer.cancel']}
        </span>
        {userRights['CUSTOMER_DELETE'] ? (
          <span
            className={`${cs['tool-btn']} main-color`}
            onClick={onDeleteCustomer}
          >
            {i18n['customer.remove']}
          </span>
        ) : (
          undefined
        )}

        {userRights['CUSTOMER_MODIFY'] && userRights['CUSTOMER_TRANSFER'] ? (
          <span
            className={`${cs['tool-btn']} main-color`}
            onClick={onTransferCustomer}
          >
            {i18n['customer.transfer']}
          </span>
        ) : (
          undefined
        )}
        {userRights['MESSAGE_SEND_OBJECT_OWNC'] ? (
          <span
            onClick={onSendMessage}
            className={`${cs['tool-btn']} main-color`}
          >
            {i18n['general.send_message']}
          </span>
        ) : (
          undefined
        )}

        <span
          className={`${cs['tool-btn']} main-color`}
          onClick={onSendInvitateEmail}
        >
          {i18n['customer.send_invite_email']}
        </span>
      </span>
    );
  }
}
