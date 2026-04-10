import i18n from "utils/i18n";
import cs from "./OrderDetail.less";
import Modal from "components/Modal";
import Button from "components/Button";
import Table from "components/Table";
import PaginationBar from "components/PaginationBar";

export default class OrderDetail extends PureComponent {
  onPageChange = ({ pageNo, pageSize }) => {
    const { getMonthlyDetail, id } = this.props;
    getMonthlyDetail(id, pageNo, pageSize);
  }
  render() {
    const { onClose, monthlyDeatail } = this.props;
    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          <span>{i18n['twapp.monthlyreport.detail.header_date']}：{`${monthlyDeatail.sta && monthlyDeatail.sta.start}-${monthlyDeatail.sta && monthlyDeatail.sta.end}`}</span>
          <span className={cs['header-price']}>{i18n['twapp.monthlyreport.detail.header_price']}：{monthlyDeatail.sta && monthlyDeatail.sta.price}</span>
        </Modal.Header>
        <Modal.Body className={cs["body"]} scrolling={false}>
          <Table>
            <Table.Header>
              <th>{i18n['twapp.monthlyreport.detail.date']}</th>
              <th>{i18n['twapp.monthlyreport.detail.volume']}</th>
              <th>{i18n['twapp.monthlyreport.detail.amount']}</th>
            </Table.Header>
            <Table.Body>
              {monthlyDeatail.list &&
                monthlyDeatail.list.map((server, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{server.date}</td>
                      <td>{server.volume}</td>
                      <td>${server.amount}</td>
                    </tr>
                  );
                })}
              <tr>
                <td>{i18n['twapp.monthlyreport.detail.sum']}</td>
                <td>{monthlyDeatail.sta && monthlyDeatail.sta.volume}</td>
                <td>${monthlyDeatail.sta && monthlyDeatail.sta.amount}</td>
              </tr>
            </Table.Body>
          </Table>
          <PaginationBar
            onPageChange={this.onPageChange}
            total={monthlyDeatail.total}
            pageSize={monthlyDeatail.size}
            pageNo={monthlyDeatail.pager}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
