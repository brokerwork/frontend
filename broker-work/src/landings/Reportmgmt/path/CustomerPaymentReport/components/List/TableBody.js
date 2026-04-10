import TableRow from './TableRow';
import Table from 'components/Table';
import cs from './index.less';
import { Link } from 'react-router-dom';
import { CUSTOMER_STATE_TYPES, PRODUCT_LIST } from '../../contants';
import Tips from 'components/Tips';
import i18n from 'utils/i18n';

export default class TableBody extends PureComponent {
  getProductItem = item => {
    const { productId } = this.props;
    if (productId && item.products && item.products.length === 1) {
      const product = item.products[0];
      const matchedProduct = PRODUCT_LIST.find(
        prod => prod.value === productId
      );
      return (matchedProduct && matchedProduct.label) || '';
    } else if (item.products) {
      return (
        <Tips
          hover
          align="bottom"
          text={
            <span className={cs['tip-click']}>
              {(item.products && item.products.length) || ''}
            </span>
          }
        >
          <div className={cs['ques-content']}>
            {item.products.map((item, i) => {
              return (
                <div key={i}>
                  {(PRODUCT_LIST.find(prod => prod.value === item) || {}).label}
                </div>
              );
            })}
          </div>
        </Tips>
      );
    }
  };

  render() {
    const {
      data,
      tableTimeLine,
      dataType,
      statistics,
      billRefundViewKey
    } = this.props;
    return (
      <Table.Body>
        {data.map((item, i) => {
          const customerStateLabel = (CUSTOMER_STATE_TYPES.find(
            state => state.value === item.customerState
          ) || {}
          ).label;
          return (
            <TableRow
              dataType={dataType}
              data={item.charts}
              key={i}
              tableTimeLine={tableTimeLine}
              title={item.customerName}
              billRefundViewKey={billRefundViewKey}
            >
              <Table.FixedCell>
                <Link
                  target="_blank"
                  to={{
                    pathname: `/custommgmt/customers/detail/${item.customerId}`,
                    state: { fromList: true }
                  }}
                >
                  {item.customerName}
                </Link>
              </Table.FixedCell>
              <td>{item.customerNo}</td>
              <td>{customerStateLabel}</td>
              <td className={cs['td-product']}>
                {dataType === 'income' ? undefined : this.getProductItem(item)}
              </td>
              <td>{item.oweName}</td>
              <td />
            </TableRow>
          );
        })}
        <TableRow
          dataType={dataType}
          data={statistics}
          tableTimeLine={tableTimeLine}
          billRefundViewKey={billRefundViewKey}
        >
          <td colSpan="5" />
          <Table.FixedCell className={cs['total-label']}>
            {i18n['report.payment.table_row.total_label']}
          </Table.FixedCell>
        </TableRow>
      </Table.Body>
    );
  }
}
