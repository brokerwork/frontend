import i18n from 'utils/i18n';
import cs from '../../../UpdateUserCard.less';
import Modal from 'components/Modal';
import Table from 'components/Table';

class RuleDetailModal extends PureComponent {
  render() {
    const { onHide, ruleDetail } = this.props;

    return (
      <Modal backdrop="static" bsSize="large" show={true} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n['usermgmt.usercard.reak_detail']}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <Table className={cs['table']}>
            <Table.Header>
              {ruleDetail && ruleDetail.length > 0
                ? ruleDetail.map((item, index) => {
                    return <th key={index}>{item.name}</th>;
                  })
                : undefined}
            </Table.Header>
            <Table.Body>
              <tr>
                {ruleDetail && ruleDetail.length > 0
                  ? ruleDetail.map((item, index) => {
                      return item.value ? (
                        <td key={index}>{item.value}</td>
                      ) : (
                        undefined
                      );
                    })
                  : undefined}
              </tr>
            </Table.Body>
          </Table>
        </Modal.Body>
      </Modal>
    );
  }
}

export default RuleDetailModal;
