import Form, { CREDIT_FORM } from './Form';
import cs from './Credit.less';
import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';
import moment from 'moment';

export default class Credit extends PureComponent {
  state = {
    currentType: 'in'
  };

  onSubmit = () => {
    const { submit } = this.props;
    submit(CREDIT_FORM);
  };

  onTypeChange = type => {
    this.setState({
      currentType: type
    });
  };

  onSave = values => {
    const {
      updateCredit,
      accountId,
      showTopAlert,
      currentServer,
      resetForm,
      getAccountDetail,
      onClose
    } = this.props;
    const {
      type,
      inComment,
      outComment,
      sendEmail,
      creditAmount,
      expirationTime
    } = values;
    const info = {
      login: accountId,
      comment: type === 'in' ? inComment : outComment,
      sendEmail,
      expirationTime: expirationTime
        ? moment(expirationTime).format('YYYY-MM-DD')
        : '',
      creditAmount: parseFloat(creditAmount)
    };

    updateCredit(type, info, currentServer).then(({ result }) => {
      if (result) {
        onClose();
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        resetForm(CREDIT_FORM);
        getAccountDetail(accountId, currentServer);
      }
    });
  };

  render() {
    const {
      accountInfo: { credit },
      filteredRights,
      visible,
      onClose
    } = this.props;
    const { currentType } = this.state;
    const info = {
      credit,
      type: currentType,
      inComment: 'Credit in',
      outComment: 'Credit out',
      sendEmail: 1,
      expirationTime: new Date()
    };

    return (
      <Dialog
        visible={visible}
        title={i18n['account.edit_account.credit']}
        footer={
          <Button
            disabled={!filteredRights.update.credit}
            type="primary"
            onClick={this.onSubmit}
          >
            {i18n['general.save']}
          </Button>
        }
        onCancel={onClose}
      >
        <Form
          initialValues={info}
          onChange={this.onFormChange}
          onSave={this.onSave}
          disabled={!filteredRights.update.credit}
          onTypeChange={this.onTypeChange}
          currentType={currentType}
        />
      </Dialog>
    );
  }
}
