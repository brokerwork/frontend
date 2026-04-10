import cs from './Trade.less';
import i18n from 'utils/i18n';
import { Table, Pagination, Icon } from 'lean-ui';

export default class Deal extends PureComponent {
  state = {
    desc: true,
    pageNo: 1
  };

  componentWillReceiveProps(props) {
    if (props.dateChanged) {
      this.setState(
        {
          desc: true,
          pageNo: 1
        },
        () => {
          this.load();
        }
      );
    }
  }

  load = () => {
    const { pageNo, desc } = this.state;
    const { load } = this.props;

    load(pageNo, desc);
  };

  onSelect = pageNo => {
    const { load } = this.props;

    this.setState(
      {
        pageNo
      },
      () => {
        this.load();
      }
    );
  };

  changeOrderBy = () => {
    const { load } = this.props;

    this.setState(
      {
        desc: !this.state.desc
      },
      () => {
        this.load();
      }
    );
  };

  renderCell = ({ key, data, index, rowData }) => {
    if (key === 'profit') {
      const color = data === 0 ? '' : data > 0 ? 'text-success' : 'text-danger';
      return <Table.Td key={index} className={color}>{`${data}`}</Table.Td>;
    }
    return <Table.Td key={index}>{`${data}`}</Table.Td>;
  };

  render() {
    const {
      list: { trade = {}, timeZone },
      currentServer: { vendor }
    } = this.props;
    const { desc } = this.state;
    const entry = {
      key: 'entry',
      name: i18n['account.detail.trade_record.order.entry']
    };
    const positionId = {
      key: 'positionId',
      name: i18n['report.history_order_Header.positionId']
    };
    const columns = [
      {
        key: 'closeTime',
        name: (
          <span>
            {`${
              i18n['account.detail.trade_record.deal.close_time']
            }${timeZone}`}
            <Icon
              icon={desc ? 'sorting-down' : 'sorting-up'}
              className="main-color"
            />
          </span>
        ),
        onClick: this.changeOrderBy
      },
      {
        key: 'ticket',
        name: i18n['account.detail.trade_record.deal.ticket']
      },
      { key: 'type', name: i18n['account.detail.trade_record.deal.type'] },
      { key: 'symbol', name: i18n['account.detail.trade_record.deal.symbol'] },
      { key: 'volume', name: i18n['account.detail.trade_record.deal.volume'] },
      { key: 'profit', name: i18n['account.detail.trade_record.deal.profit'] }
    ];
    if (vendor === 'MT5') {
      columns.splice(3, 0, entry);
      columns.splice(4, 0, positionId);
    }
    return (
      <div>
        <Table
          columns={columns}
          data={trade.list || []}
          renderCell={this.renderCell}
        />
        <Pagination
          iconJumper
          total={trade.total}
          pages={trade.pages}
          current={trade.pageNo}
          onChange={page => this.onSelect(page)}
        />
      </div>
    );
  }
}
