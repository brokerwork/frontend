import Modal from 'components/Modal';
import Panel from 'components/Panel';
import Table from 'components/Table';
import cs from './OrderDetail.less';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import Button from 'components/Button';
import i18n from 'utils/i18n';


export default class OrderDetail extends PureComponent {
  render() {
    const { onClose, detail, orderType, periodType } = this.props;

    return (
      <Modal onClose={onClose} size="lg">
        <Modal.Header>
          {i18n['consumption.order.detail.title']}
        </Modal.Header>
        <Modal.Body>
          <div className={cs['summary']}>
            <span>
              {i18n['consumption.order.order_no']}：{detail.orderNo}
            </span>
            <span>
              {i18n['consumption.order.type']}：{orderType.find(type => type.value === detail.type).label}
            </span>
            <span>
              {i18n['consumption.order.create_time']}：{moment(detail.createTime).format(dateTimeFormatStyle)}
            </span>
          </div>
          {detail.product
            ? <Panel header={i18n['consumption.order.detail.product.title']} className={cs['panel']}>
                <Table>
                  <Table.Header>
                    <th>{i18n['consumption.order.version']}</th>
                    <th>{i18n['consumption.order.spec']}</th>
                    <th>{i18n['consumption.order.user_num']}</th>
                    <th>{i18n['consumption.order.period']}</th>
                    <th>{i18n['consumption.order.product_amount']}</th>
                  </Table.Header>
                  <Table.Body>
                    <tr>
                      <td>{detail.product.versionName}</td>
                      <td>{detail.product.spec}</td>
                      <td>{detail.product.userNum}</td>
                      <td>
                        {detail.period}
                        {periodType.find(period => period.value === detail.periodType).label}
                      </td>
                      <td>${detail.amount}</td>
                    </tr>
                  </Table.Body>
                </Table>
              </Panel>
            : undefined}
          {detail.vas
            ? <Panel header={i18n['consumption.order.detail.vas.title']} className={cs['panel']}>
                <Table>
                  <Table.Header>
                    <th>{i18n['consumption.order.vas_name']}</th>
                    <th>{i18n['consumption.order.price']}</th>
                    <th>{i18n['consumption.order.order_qty']}</th>
                    <th>{i18n['consumption.order.total_qty']}</th>
                    <th>{i18n['consumption.order.period']}</th>
                  </Table.Header>
                  <Table.Body>
                    {detail.vas.map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td>{item.orderQty}</td>
                          <td>{item.totalQty}</td>
                          <td>
                            {detail.period}
                            {periodType.find(period => period.value === detail.periodType).label}
                          </td>
                        </tr>
                      );
                    })}
                  </Table.Body>
                </Table>
              </Panel>
            : undefined}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>
            {i18n['general.close']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}