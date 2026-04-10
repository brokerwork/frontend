import Modal from 'components/Modal';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';

export default class Detail extends PureComponent {
  componentDidMount() {
    const { getDepositDetail, depositId } = this.props;

    getDepositDetail(depositId);
  }

  render() {
    const { onHide, depositDetail } = this.props;

    return (
      <Modal show bsSize="lg" onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n['account.batch_widthdraw.detail']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Header>
              <th>{i18n['account.batch_widthdraw.preview.account']}</th>
              <th>{i18n['account.batch_widthdraw.preview.manager_name']}</th>
              <th>{i18n['account.batch_widthdraw.preview.amount']}</th>
              <th>{i18n['account.batch_widthdraw.preview.comment']}</th>
              <th>{i18n['account.batch_widthdraw.detail.status']}</th>
            </Table.Header>
            <Table.Body>
              {depositDetail.data.map((item, idx) => {
                const isFail = item.state === 'FAIL';

                return (
                  <tr key={idx}>
                    <td>{item.accountId}</td>
                    <td>{item.managerName}</td>
                    <td>{item.amount}</td>
                    <td>{item.comment}</td>
                    <td className={isFail ? 'text-danger' : ''}>
                      {isFail ? (
                        <FormattedMessage
                          id="account.batch_widthdraw.detail.status.fail"
                          defaultMessage={
                            i18n['account.batch_widthdraw.detail.status.fail']
                          }
                          values={{
                            reason: item.failReason
                              .split(',')
                              .map(reason => i18n[reason] || reason)
                              .join(', ')
                          }}
                        />
                      ) : (
                        i18n['account.batch_widthdraw.detail.status.success']
                      )}
                    </td>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
        </Modal.Body>
      </Modal>
    );
  }
}
