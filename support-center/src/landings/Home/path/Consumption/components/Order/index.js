import Table from 'components/Table';
import Panel from 'components/Panel';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import OrderDetail from '../../containers/OrderDetail';
import PaginationBar from 'components/PaginationBar';
import Button from 'components/Button';
import i18n from 'utils/i18n';

export default class Order extends PureComponent {
  state = {
    showDetailModal: false,
    pageNo: 1,
    pageSize: 10
  }

  componentDidMount() {
    this.getOrderList();
  }

  getOrderList = () => {
    const { getOrderList } = this.props;
    const { pageNo, pageSize } = this.state;

    getOrderList(pageNo, pageSize);
  }

  toggleModal = (status) => {
    this.setState({
      showDetailModal: status
    });
  }

  showDetailModal = (order) => {
    const { getOrderDetail } = this.props;

    getOrderDetail(order.orderNo).then(({ result }) => {
      if (result) {
        this.setState({
          showDetailModal: true
        });
      }
    });
  }

  onPageChange = ({ pageNo, pageSize }) => {
    this.setState({
      pageNo,
      pageSize
    }, () => {
      this.getOrderList();
    });
  }

  _renderList = (item, idx) => {
    const { orderType, orderStatus } = this.props;
    const currentType = orderType.find(type => type.value === item.type);
    const currentStatus = orderStatus.find(status => status.value === item.status);

    return (
      <tr key={idx}>
        <td>{item.orderNo}</td>
        <td>{currentType.label}</td>
        <td>{moment(item.createTime).format(dateTimeFormatStyle)}</td>
        <td>${item.amount}</td>
        <td className={`text-${currentStatus.color}`}>{currentStatus.label}</td>
        <td>
          <Button style="primary" onClick={this.showDetailModal.bind(this, item)}>
            {i18n['general.check_detail']}
          </Button>
        </td>
      </tr>
    );
  }

  render() {
    const { orderList } = this.props;
    const { showDetailModal } = this.state;

    return (
      <Panel header={i18n['consumption.order.title']}>
        <Table>
          <Table.Header>
            <th>{i18n['consumption.order.order_no']}</th>
            <th>{i18n['consumption.order.type']}</th>
            <th>{i18n['consumption.order.create_time']}</th>
            <th>{i18n['consumption.order.amount']}</th>
            <th>{i18n['consumption.order.status']}</th>
            <th>{i18n['table.header.operation']}</th>
          </Table.Header>
          <Table.Body>
            {orderList.list.map(this._renderList)}
          </Table.Body>
        </Table>
        {showDetailModal
          ? <OrderDetail
              onClose={this.toggleModal.bind(this, false)}>
            </OrderDetail>
          : undefined}
        <PaginationBar
          onPageChange={this.onPageChange}
          total={orderList.total}
          pageSize={orderList.size}
          pageNo={orderList.pager}
        ></PaginationBar>
      </Panel>
    );
  }
}