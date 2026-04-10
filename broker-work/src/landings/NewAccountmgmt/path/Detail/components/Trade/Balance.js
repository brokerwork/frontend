import cs from './Trade.less';
import i18n from 'utils/i18n';
import { Table, Pagination, Icon } from 'lean-ui';

export default class Balance extends PureComponent {
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
    if (key === 'amount') {
      return (
        <Table.Td key={index}>{`${rowData.currency} ${
          rowData.profit
        }`}</Table.Td>
      );
    }
    return <Table.Td key={index}>{`${data}`}</Table.Td>;
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
            {`${i18n['account.detail.trade_record.time']}${timeZone}`}
            <Icon
              icon={desc ? 'sorting-down' : 'sorting-up'}
              className="main-color"
            />
          </span>
        ),
        onClick: this.changeOrderBy
      },
      {
        key: 'type',
        name: i18n['account.detail.trade_record.control_type']
      },
      { key: 'amount', name: i18n['account.detail.trade_record.amount'] },
      { key: 'comment', name: i18n['account.detail.trade_record.comment'] }
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
