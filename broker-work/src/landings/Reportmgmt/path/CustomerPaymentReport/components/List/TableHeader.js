import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import SortToggle from 'components/sortToggle';
import Table from 'components/Table';

export default class TableHeader extends PureComponent {
  renderTimeLineYear = (item, i) => {
    const { tableTimeLine, dataType, params } = this.props;
    const { type } = tableTimeLine;
    const { count, year } = item;
    const isOnlyYear = type === 'year';
    const isMix = dataType === 'refund_bill';
    return (
      <th
        className={`${cs['th-cell']} ${cs['th-cell-year']} `}
        key={i}
        colSpan={isMix ? count * 2 : count}
      >
        {type === 'year' ? (
          ''
        ) : (
          <FormattedMessage
            id="report.payment.table_header.year"
            defaultMessage={i18n['report.payment.table_header.year']}
            values={{ value: year }}
          />
        )}
      </th>
    );
  };
  renderTimeLineUnit = (item, i) => {
    const { dataType, params, onSortChange } = this.props;
    const { index, type, year, timestamp } = item;
    const isMix = dataType === 'refund_bill';
    const timeStr = (
      <FormattedMessage
        id="report.payment.table_header.year"
        defaultMessage={i18n[`report.payment.table_header.${type}`]}
        values={{ value: type === 'year' ? year : index }}
      />
    );
    return isMix ? (
      [
        <th className={cs['th-cell']} key={`${i}-refund`}>
          {timeStr}
          <br />
          {i18n['report.payment.action.filter.refund']}
        </th>,
        <th
          className={`${cs['th-cell']} ${cs['th-cell-sub']}`}
          key={`${i}-bill`}
        >
          {timeStr}
          <br />
          {i18n['report.payment.action.filter.bill']}
        </th>
      ]
    ) : (
      <th className={cs['th-cell']} key={i}>
        <SortToggle
          activeSort={params.sortBy}
          sortKey={timestamp}
          activeOrder={params.orderDesc}
          onChange={onSortChange}
          orders={[true, false]}
          clearable
          disabled={isMix}
        >
          {timeStr}
        </SortToggle>
      </th>
    );
  };
  render() {
    const { children, tableTimeLine, dataType } = this.props;
    const { type } = tableTimeLine;
    return (
      <thead>
        <tr>
          <Table.FixedCell tag="th" rowSpan="2">
            {i18n['report.payment.table_header.customer_name']}
          </Table.FixedCell>
          <th rowSpan="2">{i18n['report.payment.table_header.customer_no']}</th>
          <th rowSpan="2">
            {i18n['report.payment.table_header.customer_state']}
          </th>
          <th rowSpan="2">
            {dataType === 'income'
              ? undefined
              : i18n['report.payment.table_header.product']}
          </th>
          <th rowSpan="2">{i18n['report.payment.table_header.own_name']}</th>
          <th rowSpan="2" />
          {tableTimeLine.header.map(this.renderTimeLineYear)}
        </tr>
        <tr>{tableTimeLine.list.map(this.renderTimeLineUnit)}</tr>
      </thead>
    );
  }
}
