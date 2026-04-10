import CbrokerForm, { LEVERAGE_FORM } from './CbrokerForm';
import Form from './Form';
import cs from './Leverage.less';
import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

export default class Leverage extends PureComponent {
  onSubmit = () => {
    const { submit } = this.props;
    submit(LEVERAGE_FORM);
  };
  onSave = values => {
    const {
      updateLeverage,
      showTopAlert,
      accountId,
      currentServer,
      getAccountDetail,
      onClose
    } = this.props;
    updateLeverage(
      {
        accountId,
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

        getAccountDetail(accountId, currentServer);
      }
    });
  };

  render() {
    const {
      currentServer: { vendor },
      resources,
      accountInfo,
      filteredRights,
      visible,
      onClose
    } = this.props;
    const { leverage } = accountInfo;
    const initialValues = {
      leverage,
      sendEmail: 1
    };

    return (
      <Dialog
        visible={visible}
        title={i18n['account.edit_account.leverage']}
        footer={
          <Button
            disabled={!filteredRights.update.leverage}
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
            resources={resources}
            initialValues={initialValues}
            onSubmit={this.onSave}
            disabled={!filteredRights.update.leverage}
          />
        ) : (
          <Form
            resources={resources}
            initialValues={initialValues}
            onSubmit={this.onSave}
            disabled={!filteredRights.update.leverage}
          />
        )}
      </Dialog>
    );
  }
}
