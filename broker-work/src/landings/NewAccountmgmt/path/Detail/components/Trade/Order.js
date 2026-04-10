import { Table, Pagination, Icon } from 'lean-ui';
import cs from './Trade.less';
import i18n from 'utils/i18n';

export default class Order extends PureComponent {
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
    return (
      <Table.Td key={index}>{`${data === undefined ? '' : data}`}</Table.Td>
    );
  };
  render() {
    const {
      list: { trade = {}, timeZone }
    } = this.props;
    const { desc } = this.state;
    const columns = [
      {
        key: 'openTime',
        name: (
          <span>
            {`${
              i18n['account.detail.trade_record.order.open_time']
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
        name: i18n['account.detail.trade_record.order.ticket']
      },
      { key: 'type', name: i18n['account.detail.trade_record.order.type'] },
      { key: 'symbol', name: i18n['account.detail.trade_record.order.symbol'] },
      { key: 'price', name: i18n['account.detail.trade_record.order.price'] },
      { key: 'volume', name: i18n['account.detail.trade_record.order.volume'] },
      {
        key: 'closeTime',
        name: i18n['account.detail.trade_record.order.close_time']
      }
    ];
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
