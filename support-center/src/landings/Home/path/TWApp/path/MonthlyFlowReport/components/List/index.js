import i18n from 'utils/i18n';
import Table from 'components/Table';
import cs from './List.less';
import Button from 'components/Button';
import Recharge from '../../containers/Recharge';
import OrderDetail from '../../containers/OrderDetail';
import PaginationBar from 'components/PaginationBar';

export default class List extends PureComponent {
  state = {
    showRechargeModal: false,
    showDetailModal: false,
    initialData: {},
    pageNo: 1,
    pageSize: 10,
    detailId: ''
  }
  toggleModal = (type, status, server) => {
    const {getMonthlyDetail} = this.props;
    if (type=== 'Recharge' && status) {
      const copyData = Object.assign({}, {amount: server.amount || 0, orderNo: server.id});
      this.setState({
        initialData: copyData
      });
    }

    if (type === 'Detail' && status) {
      this.setState({
        detailId: server.id
      });
      getMonthlyDetail(server.id);
    }

    this.setState({
      [`show${type}Modal`]: status
    });
  }
  componentDidMount() {
    const { getRechargePlatform, getExchangeRate } = this.props;

    getRechargePlatform();
    getExchangeRate();
  }
  onRecharge = () => {
    const { showTipsModal, getTenantInfo } = this.props;

    showTipsModal({
      content: i18n['dashbord.recharge.modal.charge.pay.message'],
      onConfirm: (cb) => {
        cb();
        getTenantInfo();
      },
      noCancel: true
    });
    this.toggleModal('Recharge', false);
  }
  onPageChange = ({ pageNo, pageSize }) => {
    const { getMonthlyList } = this.props;
    getMonthlyList(pageNo, pageSize);
  }

  render() {
    const {showRechargeModal, showDetailModal, initialData, detailId} = this.state;
    const {monthlyList} = this.props;
    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n['twapp.monthlyreport.table.order_no']}</th>
            <th>{i18n['twapp.monthlyreport.table.type']}</th>
            <th>{i18n['twapp.monthlyreport.table.create_time']}</th>
            <th>{i18n['twapp.monthlyreport.table.bill_amount']}</th>
            <th>{i18n['twapp.monthlyreport.table.state']}</th>
            <th>{i18n['twapp.monthlyreport.table.action']}</th>
        </Table.Header>
        <Table.Body>
        {monthlyList.list && monthlyList.list.map((server, idx) => {
          return (
            <tr key={idx}>
              <td>
                {server.id}
              </td>
              <td>
                {i18n['twapp.monthlyreport.detail.header_fallow_type']}
              </td>
              <td>
                {server.invoiceDate}
              </td>
              <td>
                ${server.amount}
              </td>
              <td className={`free-hidden-td ${server.status === 0 ? cs['state-unpaid'] : ''}`}>
                {server.status === 0 ? i18n['dealer.report.status.unpaid'] : i18n['dealer.report.status.paid']}
              </td>
              <td>
                <Button style="primary" icon onClick={this.toggleModal.bind(this, 'Detail', true, server)}>
                  {i18n['twapp.monthlyreport.detail.open_detail']}
                </Button>
                {server.status === 0
                  ? <Button style="primary" icon onClick={this.toggleModal.bind(this, 'Recharge', true, server)}>
                      {i18n['twapp.monthlyreport.detail.open_payment']}
                    </Button>
                  : undefined}
              </td>
            </tr>
          );
        })}
        </Table.Body>
        </Table>
        <PaginationBar
          onPageChange={this.onPageChange}
          total={monthlyList.total}
          pageSize={monthlyList.size}
          pageNo={monthlyList.pager}
        ></PaginationBar>
        {showDetailModal
        ? <OrderDetail
            id={detailId}
            onClose={this.toggleModal.bind(this, 'Detail', false, undefined)}
          />
        : undefined
        }
        {showRechargeModal
          ? <Recharge
              onSave={this.onRecharge}
              initialValues={initialData}
              onClose={this.toggleModal.bind(this, 'Recharge', false, undefined)}
            ></Recharge>
          : undefined}
      </div>
    );
  }
}
