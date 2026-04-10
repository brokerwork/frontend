import Table from 'components/Table';
import OperateEmail from '../../containers/OperateEmail';
import AnimationWrapper from 'components/AnimationWrapper';
import Button from 'components/Button';
import i18n from 'utils/i18n';

export default class List extends PureComponent {
  state = {
    showOperateEmailModal: false
  };

  componentDidMount() {
    const { getEmailList } = this.props;

    getEmailList();
  }

  toggelModal = (status, target) => {
    const { _setEmailTarget } = this.props;

    Promise.resolve(_setEmailTarget(target)).then(() => {
      this.setState({
        showOperateEmailModal: status
      });
    });
  };

  onSaveEmail = () => {
    const { getEmailList } = this.props;

    getEmailList().then(() => {
      this.toggelModal(false, {});
    });
  };

  removeEmail = email => {
    const { showTipsModal, showTopAlert, emailList, removeEmail, getEmailList } = this.props;

    if (emailList.length === 1) {
      showTopAlert({
        content: i18n['email.setting.tips18']
      });

      return;
    }

    showTipsModal({
      content: i18n['email.setting.tips15'],
      onConfirm: cb => {
        removeEmail(email.configId).then(({ result }) => {
          if (result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.remove_success']
            });
            getEmailList();
          }
        });
        cb();
      }
    });
  };

  render() {
    const { showOperateEmailModal } = this.state;
    const { emailList, emailProvider } = this.props;
    return (
      <div>
        <div className="actions-bar">
          <div>
            <Button style="primary" onClick={this.toggelModal.bind(this, true, {})}>
              <i className="fa fa-plus" />
              {i18n['email.setting.smtp.btn.add']}
            </Button>
          </div>
        </div>
        <div>
          <Table>
            <Table.Header>
              <th>{i18n['email.setting.smtp.provider']}</th>
              <th>{i18n['email.setting.smtp.server']}</th>
              <th>{i18n['email.setting.smtp.account']}</th>
              <th>{i18n['email.setting.smtp.send.email']}</th>
              <th>{i18n['email.setting.smtp.send.name']}</th>
              <th>{i18n['table.header.operation']}</th>
            </Table.Header>
            <Table.Body>
              {emailList
                .filter(e => e.type === 'MAIL')
                .map((email, idx) => {
                  const curProvider = emailProvider.find(item => item.value === email.provider);
                  return (
                    <tr key={idx}>
                      <td>
                        <a onClick={this.toggelModal.bind(this, true, email)}>{curProvider && curProvider.label}</a>
                      </td>
                      <td>{email.host}</td>
                      <td>{email.username}</td>
                      <td>{email.from}</td>
                      <td>{email.fromName}</td>
                      <td>
                        <Button icon onClick={this.removeEmail.bind(this, email)}>
                          <i className="fa fa-times" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </Table.Body>
          </Table>
        </div>
        <AnimationWrapper>
          {showOperateEmailModal ? (
            <OperateEmail onSave={this.onSaveEmail} onClose={this.toggelModal.bind(this, false, {})} />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
