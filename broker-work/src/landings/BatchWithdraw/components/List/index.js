import Table from 'components/Table';
import moment from 'moment';
import Detail from '../../containers/Detail';
import Export from '../../containers/Export';
import i18n from 'utils/i18n';

export default class List extends PureComponent {
  state = {
    showDetailModal: false,
    depositId: null
  };

  showDetailModal = depositId => {
    this.setState({
      showDetailModal: true,
      depositId
    });
  };

  refresh = () => {
    const { getDepositList } = this.props;

    getDepositList();
  };

  render() {
    const { depositList } = this.props;
    const { showDetailModal, depositId } = this.state;

    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n['account.batch_widthdraw.detail.import_time']}</th>
            <th>{i18n['account.batch_widthdraw.detail.user']}</th>
            <th>{i18n['account.batch_widthdraw.detail.import_amount']}</th>
            <th>
              {i18n['account.batch_widthdraw.detail.import_success_amount']}
            </th>
            <th>{i18n['account.batch_widthdraw.detail.import_fail_amount']}</th>
            <th>{i18n['general.control']}</th>
          </Table.Header>
          <Table.Body>
            {depositList.map((item, idx) => {
              const isImporting = item.state === 'Importing';

              return (
                <tr key={idx}>
                  <td>{moment(item.time).format('YYYY-MM-DD HH:mm')}</td>
                  <td>{item.userName}</td>
                  <td>{item.count}</td>
                  <td>
                    {isImporting
                      ? i18n['account.batch_widthdraw.detail.handling']
                      : item.successCount}
                  </td>
                  <td>
                    {isImporting
                      ? i18n['account.batch_widthdraw.detail.handling']
                      : item.failCount}
                  </td>
                  <td>
                    {isImporting ? (
                      <a onClick={this.refresh}>{i18n['general.refresh']}</a>
                    ) : (
                      <div>
                        <a onClick={this.showDetailModal.bind(this, item.id)}>
                          {i18n['general.check_detail']}
                        </a>
                        <Export depositId={item.id} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        {showDetailModal ? (
          <Detail
            depositId={depositId}
            onHide={() => this.setState({ showDetailModal: false })}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
