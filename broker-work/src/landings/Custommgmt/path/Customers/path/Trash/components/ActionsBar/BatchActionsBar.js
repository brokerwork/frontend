import cs from './ActionsBar.less';
import i18n from 'utils/i18n';
import Dropdown from 'components/Dropdown';
import { Button } from 'lean-ui';
import { FormattedMessage } from 'react-intl';

export default class BatchActionBar extends Component {
  onCancel = () => {
    const { updateSelectedItems } = this.props;
    updateSelectedItems({});
  };
  doDeleteCustomer = () => {
    const {
      selectedItemsMap,
      destroyCustomer,
      getCustomerList,
      showTopAlert
    } = this.props;
    const ids = Object.keys(selectedItemsMap);
    return destroyCustomer({ ids }).then(res => {
      if (res.result) {
        getCustomerList();
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.remove_success']
        });
        return Promise.resolve();
      }
    });
  };

  onDeleteCustomer = () => {
    const { match: { path }, history: { push } } = this.props;
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['customer.remove_modal.completely_delete_confirmation'],
      onConfirm: cb => {
        this.doDeleteCustomer().then(() => {
          cb();
        });
      }
    });
  };

  doResetCustomer = () => {
    const {
      selectedItemsMap,
      resetCustomer,
      getCustomerList,
      showTopAlert
    } = this.props;
    const ids = Object.keys(selectedItemsMap);
    return resetCustomer({ ids }).then(res => {
      if (res.result) {
        getCustomerList();
        showTopAlert({
          bsStyle: 'success',
          content: i18n['customer.trash.reset_success']
        });
        return Promise.resolve();
      }
    });
  };

  onResetCustomer = () => {
    const { match: { path }, history: { push } } = this.props;
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['customer.remove_modal.reset_confirmation'],
      onConfirm: cb => {
        this.doResetCustomer().then(() => {
          cb();
        });
      }
    });
  };

  render() {
    const {
      userRights,
      selectedItemsMap,
      onDeleteCustomer,
      onTransferCustomer,
      onSendMessage
    } = this.props;
    const selectedItems = Object.keys(selectedItemsMap);
    return (
      <div>
        <span className={cs['selected']}>
          <FormattedMessage
            id="customer.selected_tips"
            defaultMessage={i18n['customer.selected_tips']}
            values={{
              number: (
                <span className={cs['selected-number']}>
                  {selectedItems.length}
                </span>
              )
            }}
          />
        </span>
        <Button
          className={cs['tool-btn']}
          type="primary"
          onClick={this.onCancel}
        >
          {i18n['customer.cancel']}
        </Button>
        {userRights['CUSTOMER_DELETE'] ? (
          <Button
            className={cs['tool-btn']}
            type="primary"
            onClick={this.onDeleteCustomer}
          >
            {i18n['customer.trash.completely_remove']}
          </Button>
        ) : (
          undefined
        )}
        {userRights['CUSTOMER_MODIFY'] || userRights['CUSTOMER_TRANSFER'] ? (
          <Button
            className={cs['tool-btn']}
            type="primary"
            onClick={this.onResetCustomer}
          >
            {i18n['customer.trash.reset']}
          </Button>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
