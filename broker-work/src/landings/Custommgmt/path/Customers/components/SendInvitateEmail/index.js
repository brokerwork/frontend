import i18n from 'utils/i18n';
import DryRunResult from './components/DryRunResult';
import cs from './SendInvitateEmail.less';
import DropDown from 'components/Dropdown';
import { FormattedMessage } from 'react-intl';

export default class Delete extends PureComponent {
  onSendConfirm = cb => {
    const {
      sendInvitateEmail,
      backToRoot,
      selectedItemsMap,
      showTipsModal
    } = this.props;
    const invitations = Object.keys(selectedItemsMap).map(key => {
      const selected = selectedItemsMap[key];
      return {
        email: selected.email,
        custId: selected.customerId
      };
    });

    sendInvitateEmail(invitations).then(({ result, data }) => {
      if (result) {
        const success = (data.success && data.success.length) || 0;
        const fail = (data.fail && data.fail.length) || 0;
        showTipsModal({
          content: (
            <FormattedMessage
              id="customer.send_invite_email.result_info"
              defaultMessage={i18n['customer.send_invite_email.result_info']}
              values={{
                success: <span className={cs['success']}>{success}</span>,
                fail: <span className={cs['fail']}>{fail}</span>
              }}
            />
          ),
          noCancel: true,
          onCancel: cb => {
            cb();
            backToRoot();
          },
          onConfirm: cb => {
            cb();
            backToRoot();
          }
        });
      }
    });
  };

  componentDidMount() {
    const { showTipsModal, backToRoot, selectedItemsMap } = this.props;
    if (!Object.keys(selectedItemsMap).length) {
      backToRoot();
      return;
    }
    showTipsModal({
      content: (
        <div>
          <div className={cs['label']}>
            {i18n['customer.send_invite_email.confirm']}
          </div>
          <div className={cs['note']}>
            {i18n['customer.send_invite_email.tips']}
          </div>
        </div>
      ),
      onCancel: cb => {
        cb();
        backToRoot();
      },
      onConfirm: cb => {
        this.onSendConfirm(cb);
      }
    });
  }
  render() {
    return <div />;
  }
}
