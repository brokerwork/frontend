import { Card, Table } from 'lean-ui';
import PaginationBar from 'components/v2/PaginationBar';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import i18n from 'utils/i18n';
import cs from './index.less';
import EllipsisContent from 'components/v2/EllipsisContent';
export default class List extends Component {
  componentDidMount() {
    const { getApplications, params } = this.props;
    getApplications(params);
  }
  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination, getApplications } = this.props;
    Promise.resolve(updatePagination({ pageNo, pageSize })).then(() => {
      const { params } = this.props;
      getApplications(params);
    });
  };
  renderCell = ({ key, data, index }) => {
    const Td = Table.Td;
    const statusClassName = cs[`status-${String(data).toLowerCase()}`];
    return (
      <Td key={index}>
        {key === 'addition' && (
          <EllipsisContent className={cs['td-content']}>{data}</EllipsisContent>
        )}
        {key === 'state' && (
          <span className={statusClassName}>
            {i18n[`withdraw.application.status.${data}`] || data}
          </span>
        )}
        {key !== 'addition' && key !== 'state' && data}
      </Td>
    );
  };
  render() {
    const { applications, params } = this.props;
    const columns = [
      {
        name: i18n['withdraw.list.th.id'],
        dataIndex: 'apId',
        key: 'apId'
      },
      {
        name: i18n['withdraw.list.th.account'],
        dataIndex: 'account',
        key: 'account'
      },
      {
        name: i18n['withdraw.list.th.withdraw_amount'],
        dataIndex: 'withdraw_amount',
        key: 'withdraw_amount'
      },
      {
        name: i18n['withdraw.list.th.create_time'],
        dataIndex: 'create_time',
        key: 'create_time'
      },
      {
        name: i18n['withdraw.list.th.addition'],
        dataIndex: 'addition',
        key: 'addition'
      },
      {
        name: i18n['withdraw.list.th.state'],
        dataIndex: 'state',
        key: 'state'
      },
      {
        name: i18n['withdraw.list.th.comment'],
        dataIndex: 'comment',
        key: 'comment'
      }
    ];
    const data = applications.map(el => {
      return {
        apId: el.accountId,
        account: el.accountName,
        withdraw_amount: el.withdrawAmount,
        create_time: moment(el.createdTime).format(dateTimeFormatStyle),
        addition: el.reason,
        state: el.status,
        comment: el.comment
      };
    });
    return (
      <div className={cs['container']}>
        <div className={cs['panel']}>
          <div className={cs['head']}>{i18n['withdraw.list.title']}</div>
          <div className={cs['body']}>
            <Table
              className="ellipsis"
              columns={columns}
              data={data}
              renderCell={this.renderCell}
            />
            <PaginationBar
              {...params}
              onPageChange={this.onPageChange}
              className={cs['pagination-bar']}
            />
          </div>
        </div>
      </div>
    );
  }
}
