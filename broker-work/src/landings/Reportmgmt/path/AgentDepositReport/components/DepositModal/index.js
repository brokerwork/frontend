import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import DepositForm, { DEPOSIT_FORM } from './DepositForm';
import { FormattedMessage } from 'react-intl';

import cs from './DepositModal.less';

export default class DepositModal extends PureComponent {
  constructor(props) {
    super(props);
  }
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(DEPOSIT_FORM);
  };

  deposit = data => {
    const { updateDeposit, showTopAlert, onHide } = this.props;
    let copyData = {};
    copyData.login = data.login;
    copyData.remark = data.comment;
    copyData.sendEmail = data.sendEmail.length;
    copyData.amount = data.marginWarn;
    Promise.resolve(updateDeposit(copyData, data.vendor, data.serverId)).then(
      res => {
        if (res.result) {
          showTopAlert({
            content: i18n['general.deal_success'],
            bsStyle: 'success'
          });
          onHide();
        }
      }
    );
  };

  parseData = () => {
    const { agentData } = this.props;
    let copyData = JSON.parse(JSON.stringify(agentData));
    copyData['marginWarn'] = 0;
    copyData['sendEmail'] = [1];
    return copyData;
  };
  render() {
    const { onHide } = this.props;
    const iniData = this.parseData();
    return (
      <Modal backdrop="static" onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['report.agent_deposit.deposit_modal_header']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <DepositForm
            initialValues={iniData}
            onSubmit={this.deposit}
            {...this.props}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className={'btn btn-primary'}
            onClick={this.onSave}
          >
            {i18n['general.confirm']}
          </button>
          <button type="button" className={'btn'} onClick={onHide}>
            {i18n['general.cancel']}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
