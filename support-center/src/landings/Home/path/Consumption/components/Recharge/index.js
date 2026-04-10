import Panel from 'components/Panel';
import Table from 'components/Table';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import RechargeDetail from '../../containers/RechargeDetail';
import PaginationBar from 'components/PaginationBar';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import { getToken } from 'utils/userInfo';

export default class Recharge extends PureComponent {
  state = {
    record: null,
    showDetailModal: false,
    pageNo: 1,
    pageSize: 10
  }

  componentDidMount() {
    this.getRechargeRecord();
  }

  getRechargeRecord = () => {
    const { pageNo, pageSize } = this.state;
    const { getRechargeRecord } = this.props;

    getRechargeRecord(pageNo, pageSize);
  }

  toggleModal = (status) => {
    this.setState({
      showDetailModal: status
    });
  }

  showDetailModal = (record) => {
    this.setState({
      record,
      showDetailModal: true
    });
  }

  cancel = (record) => {
    const { showTipsModal, cancelOrder } = this.props;
    
    showTipsModal({
      content: i18n['general.pay.cancel_confirm.tips'],
      onConfirm: (cb) => {
        cancelOrder(record.orderNo).then(({ result }) => {
          if (result) {
            this.getRechargeRecord();
          }
        });
        cb();
      }
    });
  }

  pay = (record) => {
    const { showTipsModal } = this.props;
    const form = document.createElement('form');
    const values = {
      token: getToken(),
      orderNo: record.orderNo
    };
    const keys = Object.keys(values);

    form.setAttribute('method', 'post');
    form.setAttribute('action', '/payment');
    form.setAttribute('target', '_blank');

    keys.forEach(key => {
      const field = document.createElement('input');

      field.setAttribute('type', 'hidden');
      field.setAttribute('name', key);
      field.setAttribute('value', values[key]);

      form.appendChild(field);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    showTipsModal({
      content: i18n['general.pay.success.tips'],
      onConfirm: (cb) => {
        cb();
        this.getRechargeRecord();
      },
      noCancel: true
    });
  }

  showReason = (record) => {
    const { showTipsModal } = this.props;
    const content = () => (
      <div>
        <p>{i18n['consumption.recharge.offline.fail_reason.title']}</p>
        <p className="text-danger">{record.reason}</p>
        <p>{i18n['consumption.recharge.offline.fail_reason.tips']}</p>
      </div>
    );

    showTipsModal({
      content: content(),
      confirmBtnText: i18n['general.repay'],
      onConfirm: (cb) => {
        this.pay(record);
        cb();
      }
    });
  }

  onPageChange = ({ pageNo, pageSize }) => {
    this.setState({
      pageNo,
      pageSize
    }, () => {
      this.getRechargeRecord();
    });
  }

  _renderList = (item, idx) => {
    const { 
      rechargeType,
      rechargeTypeRechargeStatus,
      rechargeTypeRemittingStatus 
    } = this.props;
    const typeStatus = item.rechargeType === 'RECHARGE' ? rechargeTypeRechargeStatus : rechargeTypeRemittingStatus;
    const status = typeStatus.find(_item => _item.value === item.status) || {};

    return (
      <tr key={idx}>
        <td>{item.orderNo}</td>
        <td>${item.amount}</td>
        <td>{rechargeType.find(type => type.value === item.rechargeType).label}</td>
        <td>{moment(item.createdTime).format(dateTimeFormatStyle)}</td>
        <td className={status.color ? `text-${status.color}` : ''}>
          {status.value === 'NOT_APPROVED'
            ? <a className={`text-${status.color}`} onClick={this.showReason.bind(this, item)}>{status.label}</a>
            : status.label}
        </td>
        <td>
          {item.status === 'NEW'
            ? <Button style="primary" onClick={this.pay.bind(this, item)}>
                {i18n['general.pay']}
              </Button>
            : undefined}
          <Button style="primary" onClick={this.showDetailModal.bind(this, item)}>
            {i18n['general.check_detail']}
          </Button>
          {item.status === 'NEW'
            ? <Button onClick={this.cancel.bind(this, item)}>
                {i18n['general.cancel']}
              </Button> 
            : undefined}
        </td>
      </tr>
    );
  }

  render() {
    const { showDetailModal, record } = this.state;
    const { rechargeRecord } = this.props;

    return (
      <Panel header={i18n['consumption.recharge.title']}>
        <Table>
          <Table.Header>
            <th>{i18n['consumption.recharge.order_no']}</th>
            <th>{i18n['consumption.recharge.amount']}</th>
            <th>{i18n['consumption.recharge.recharge_type']}</th>
            <th>{i18n['consumption.recharge.create_time']}</th>
            <th>{i18n['consumption.recharge.status']}</th>
            <th>{i18n['table.header.operation']}</th>
          </Table.Header>
          <Table.Body>
            {rechargeRecord.list.map(this._renderList)}
          </Table.Body>
        </Table>
        {showDetailModal
          ? <RechargeDetail
              onClose={this.toggleModal.bind(this, false)}
              detail={record}
            />
          : undefined}
        <PaginationBar
          onPageChange={this.onPageChange}
          total={rechargeRecord.total}
          pageSize={rechargeRecord.size}
          pageNo={rechargeRecord.pager}
        ></PaginationBar>
      </Panel>
    );
  }
}