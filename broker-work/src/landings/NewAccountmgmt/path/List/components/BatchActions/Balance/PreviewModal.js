import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import Table from 'components/Table';
import Checkbox from 'components/Checkbox';
import cs from './Balance.less';

export default class PreviewModal extends PureComponent {
  state = {
    sendEmail: true
  };

  onChangeEmail = evt => {
    this.setState({
      sendEmail: evt.target.checked
    });
  };

  render() {
    const { onHide, previewData, onImport, type } = this.props;
    const { sendEmail } = this.state;
    const hasFail = previewData.data.some(item => item.state === 'FAIL');

    return (
      <Modal backdrop="static" bsSize="lg" show onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['account.batch_deposit.preview_title']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Header>
              <th>{i18n['account.batch_deposit.preview.number']}</th>
              <th>{i18n['account.batch_deposit.preview.account']}</th>
              <th>{i18n['account.batch_deposit.preview.manager_name']}</th>
              <th>
                {type === 'excel'
                  ? i18n['account.batch_deposit.preview.amount']
                  : i18n['account.batch_widthdraw.preview.amount']}
              </th>
              <th>{i18n['account.batch_deposit.preview.comment']}</th>
              <th>{i18n['account.batch_deposit.preview.error']}</th>
            </Table.Header>
            <Table.Body>
              {previewData.data.map((item, idx) => {
                const isFail = item.state === 'FAIL';

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.accountId}</td>
                    <td>{item.managerName}</td>
                    <td>{item.amount}</td>
                    <td>{item.comment}</td>
                    <td className={isFail ? 'text-danger' : ''}>
                      {isFail
                        ? item.failReason
                            .split(',')
                            .map(reason => i18n[reason] || reason)
                            .join(', ')
                        : i18n['general.none']}
                    </td>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
          <div className={cs['preview-actions']}>
            <Checkbox inline checked={sendEmail} onChange={this.onChangeEmail}>
              {type === 'excel'
                ? i18n['account.batch_deposit.preview.send_email']
                : i18n['account.batch_widthdraw.preview.send_email']}
            </Checkbox>
            <div className={cs['preview-actions-buttons']}>
              <Button
                bsStyle="primary"
                disabled={hasFail}
                onClick={() => onImport(sendEmail, type)}
              >
                {i18n['general.import']}
              </Button>
              <Button onClick={onHide}>{i18n['general.cancel']}</Button>
              {hasFail ? (
                <span className={cs['error-tips']}>
                  {i18n['account.batch_deposit.preview.error_tips']}
                </span>
              ) : (
                undefined
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
