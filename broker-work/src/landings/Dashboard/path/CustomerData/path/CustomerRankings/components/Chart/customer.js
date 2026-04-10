import PaginationBar from 'components/v2/PaginationBar';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import cs from './Chart.less';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    if (props.dashboardItemKey) {
      this.state = {
        pageNo: 1,
        pageSize: 5
      };
    } else {
      this.state = {
        pageNo: 1,
        pageSize: 10
      };
    }
  }
  onPageChange = v => {
    this.setState(v);
  };
  render() {
    const { data = [], type } = this.props;
    const { pageNo, pageSize } = this.state;
    const total = data.length;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    const tableData = data.slice(pageStart, pageEnd);
    return (
      <div className={cs['container']}>
        <div className={cs['table']}>
          <Table>
            <Table.Header>
              <th>{i18n['dashboard.table_header.rankings']}</th>
              <th>{i18n['dashboard.table_header.name']}</th>
              <th>{i18n['dashboard.table_header.customer_count']}</th>
              <th>{i18n[`dashboard.table_header.${type}`]}</th>
            </Table.Header>
            <Table.Body>
              {tableData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{pageStart + index + 1}</td>
                    <td>
                      <div className="item-name" title={item.name}>
                        {item.name}
                      </div>
                    </td>
                    <td>{item.account}</td>
                    <td>{item.value}</td>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
        </div>
        <PaginationBar
          size="small"
          {...this.state}
          total={total}
          onPageChange={this.onPageChange}
        />
      </div>
    );
  }
}
