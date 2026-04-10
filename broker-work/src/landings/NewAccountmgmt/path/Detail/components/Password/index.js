import CbrokerForm, { CBROKER_PASSWORD_FORM } from './CbrokerForm';
import Form, { PASSWORD_FORM } from './Form';
import cs from './Password.less';
import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

export default class Password extends PureComponent {
  onSubmit = () => {
    const {
      submit,
      currentServer: { vendor }
    } = this.props;
    if (vendor === 'CTRADER') {
      submit(CBROKER_PASSWORD_FORM);
    } else {
      submit(PASSWORD_FORM);
    }
  };
  onSave = values => {
    const {
      accountId,
      currentServer,
      updatePassword,
      showTopAlert,
      onClose
    } = this.props;

    updatePassword(
      {
        login: accountId,
        ...values
      },
      currentServer
    ).then(({ result }) => {
      if (result) {
        onClose();
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  };

  render() {
    const {
      currentServer: { vendor },
      passwordRegular,
      filteredRights,
      visible,
      onClose
    } = this.props;

    return (
      <Dialog
        visible={visible}
        title={i18n['account.edit_account.reset_password']}
        footer={
          <Button
            disabled={!filteredRights.update.password}
            type="primary"
            onClick={this.onSubmit}
          >
            {i18n['general.save']}
          </Button>
        }
        onCancel={onClose}
      >
        {vendor === 'CTRADER' ? (
          <CbrokerForm
            initialValues={{ sendEmail: 1 }}
            onSubmit={this.onSave}
            disabled={!filteredRights.update.password}
          />
        ) : (
          <Form
            initialValues={{ sendEmail: 1 }}
            passwordRegular={passwordRegular}
            vendor={vendor}
            onSubmit={this.onSave}
            disabled={!filteredRights.update.password}
          />
        )}
      </Dialog>
    );
  }
}
