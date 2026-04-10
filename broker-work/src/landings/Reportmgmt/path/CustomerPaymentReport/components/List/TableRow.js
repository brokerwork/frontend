import cs from './index.less';
import i18n from 'utils/i18n';
export default class TableRow extends PureComponent {
  renderTimeLineUnit = (item, i) => {
    const { data, dataType, title, billRefundViewKey } = this.props;
    const { index, key } = item;
    const matchedData = data[key] || {};
    const {
      refundPrice = '',
      billPrice = '',
      incomePrice = '',
      historyRefundPrice = '',
      historyBillPrice = ''
    } = matchedData;
    const isMrrView = billRefundViewKey === 'MRR';
    const prefix = title
      ? `${i18n['report.payment.table_header.customer_name']}:${title}\n`
      : '';
    if (dataType === 'refund_bill') {
      const valueClassName = isMrrView
        ? Number(refundPrice) < Number(billPrice)
          ? cs['value-failed']
          : cs['value-successed']
        : '';
      const refundPriceData = isMrrView ? refundPrice : historyRefundPrice;
      const billPriceData = isMrrView ? billPrice : historyBillPrice;
      return [
        <td
          className={cs['td-cell']}
          key={`${i}1`}
          title={`${prefix}${refundPriceData}`}
        >
          <span className={valueClassName}>{refundPriceData}</span>
        </td>,
        <td
          className={`${cs['td-cell']} ${cs['td-cell-sub']}`}
          key={`${i}2`}
          title={`${prefix}${billPriceData}`}
        >
          <span className={valueClassName}>{billPriceData}</span>
        </td>
      ];
    } else if (dataType === 'refund') {
      return (
        <td title={`${prefix}${refundPrice}`} key={i} className={cs['td-cell']}>
          {refundPrice}
        </td>
      );
    } else if (dataType === 'bill') {
      return (
        <td title={`${prefix}${billPrice}`} key={i} className={cs['td-cell']}>
          {billPrice}
        </td>
      );
    } else if (dataType === 'income') {
      return (
        <td title={`${prefix}${incomePrice}`} key={i} className={cs['td-cell']}>
          {incomePrice}
        </td>
      );
    }
  };
  render() {
    const { children, tableTimeLine, data, title } = this.props;
    return (
      <tr>
        {children}
        {tableTimeLine.list.map(this.renderTimeLineUnit)}
      </tr>
    );
  }
}
