import React, { PureComponent } from 'react';
import Table from 'components/FixTable';
import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import PaginationBar from 'components/PaginationBar';
import cs from './index.less';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';

export class VoucherModal extends PureComponent {
  columns = [
    { name: i18n['dashbord.voucher.field.couponName'], key: 'couponName' },
    { name: i18n['dashbord.voucher.field.parValue'], key: 'parValue' },
    // ALL("通用"),
    // USER_NUM("用户数"),
    // USER_PACKAGE("用户包"),
    // VAS("增值服务"),
    // BUY("新购"),
    // CON("续费"),
    // CHG("版本变更");
    { name: i18n['dashbord.voucher.field.scene'], key: 'scene' },
    { name: i18n['dashbord.voucher.field.productId'], key: 'productId' },
    { name: i18n['dashbord.voucher.field.couponExpired'], key: 'couponExpired' },
    { name: i18n['dashbord.voucher.field.content'], key: 'content' },
    //0 未使用 1 已使用 -1 锁定 2 已过期
    { name: i18n['dashbord.voucher.field.status'], key: 'status' },
    { name: i18n['dashbord.voucher.field.usedTime'], key: 'usedTime' }
  ];

  componentDidMount() {
    const { getVoucherList } = this.props;
    getVoucherList({ pageSize: 20, pager: 1 });
  }

  renderHeader = (item, index) => {
    return <th key={index}>{item.name}</th>;
  };

  renderRowData = (key, data, rowData) => {
    let content = data;
    switch (key) {
      case 'couponExpired':
      case 'usedTime':
        content = data ? moment(data).format(dateFormatStyle) : null;
        break;
      case 'scene':
        content = data ? i18n[`dashbord.voucher.field.scene.${data}`] : null;
        break;
      case 'status':
        content = i18n[`dashbord.voucher.field.status.${data}`];
        break;
      default:
        break;
    }
    return <td key={key}>{content}</td>;
  };

  renderRow = (data, row) => {
    return this.columns.map(({ key }, col) => {
      return this.renderRowData(key, data[key], data);
    });
  };

  renderCell = (item, row) => {
    return <tr key={row}>{this.renderRow(item, row)}</tr>;
  };

  onClose = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  onPageChange = ({ pageNo: pager, pageSize }) => {
    const { getVoucherList } = this.props;
    getVoucherList({ pager, pageSize });
  };

  render() {
    const {
      voucherList: { list, pager: pageNo, size: pageSize, total }
    } = this.props;

    return (
      <Modal className={cs.container} onClose={this.onClose}>
        <Modal.Header>{i18n['dashbord.recharge.btn.voucher']}</Modal.Header>
        <Modal.Body>
          <div className={cs.content}>
            <div className={cs.table}>
              <div className={cs.tableContent}>
                <Table>
                  <Table.Header fixHeader>{this.columns.map(this.renderHeader)}</Table.Header>
                  <Table.Body>{list.map(this.renderCell)}</Table.Body>
                </Table>
              </div>
            </div>
            {total > 0 ? (
              <PaginationBar onPageChange={this.onPageChange} total={total} pageSize={pageSize} pageNo={pageNo} />
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onClose}>
            {i18n['app.btn.confirm']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VoucherModal;
