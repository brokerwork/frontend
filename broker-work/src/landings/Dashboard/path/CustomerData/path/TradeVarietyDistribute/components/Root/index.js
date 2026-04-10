import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import moment from 'moment';
import { Popover, Icon, Picklist } from 'lean-ui';
import { dateFormatStyle } from 'utils/config';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import PaginationBar from 'components/v2/PaginationBar';
import Chart from '../Chart';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import cs from 'landings/Dashboard/components/common.less';
import constants from 'landings/Dashboard/components/constants';
import NoPermissionView from 'components/NoPermissionView';
const addWorkbenceArr = ['TRADE_VARIRTY_DISTRIBUTE'];

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      pageSize: 20,
      chartDataReady: false,
      dataFilter: []
    };
  }
  componentDidMount() {
    const {
      searchParams,
      getTrendDatas,
      modifyParams,
      getTradeVarietyDistribute,
      setDashboardViewRight,
      userRights,
      tradeVarietyDistributeData
    } = this.props;

    const params = {
      ...searchParams,
      fromTime: moment()
        .subtract(29, 'days')
        .startOf('day'),
      toTime: moment().endOf('day')
    };
    modifyParams(params);
    Promise.all([
      getTradeVarietyDistribute({
        fromTime: params.fromTime,
        toTime: params.toTime
      }),
      setDashboardViewRight(userRights)
    ]).then(res => {
      if (res[0] && res[0].result) {
        const { data = [] } = res[0];
        this.setState({
          chartDataReady: true,
          dataFilter: data.map(t => t.key)
        });
      } else {
        this.setState({
          chartDataReady: true
        });
      }
    });
  }
  componentWillUnmount() {
    this.props.resetData();
  }
  onPageChange = page => {
    this.setState({ ...page });
  };

  modifyParams = (field, value) => {
    const {
      modifyParams,
      searchParams,
      getTradeVarietyDistribute
    } = this.props;
    let obj;
    if (field === 'date') {
      obj = {
        fromTime: value.start,
        toTime: value.end
      };
    } else {
      obj = { [field]: value };
    }
    const params = {
      ...searchParams,
      ...obj
    };
    modifyParams(params);
    getTradeVarietyDistribute({
      fromTime: params.fromTime,
      toTime: params.toTime
    }).then(res => {
      if (res && res.result) {
        const { data = [] } = res;
        this.setState({
          dataFilter: data.map(t => t.key)
        });
      }
    });
  };
  filterChange = data => {
    this.setState({
      dataFilter: data
    });
  };
  render() {
    const {
      match: { url },
      userRights,
      searchParams,
      dashboardViewRight,
      tradeVarietyDistributeData
    } = this.props;
    const { timeRange } = searchParams;
    const { chartDataReady, pageNo, pageSize, dataFilter } = this.state;

    const filterOptions = tradeVarietyDistributeData.map(t => ({
      value: t.key,
      label: t.key
    }));
    const showData = tradeVarietyDistributeData.filter(t =>
      dataFilter.includes(t.key)
    );

    const tipsConfig = [
      {
        text:
          i18n['dashboard.tips.customer_data.trade_variety_distribute.tips'],
        show: true
      }
    ];

    if (!dashboardViewRight['accountTrade']) return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {
                i18n[
                  'dashboard.navigator.customer_data.trade_variety_distribute'
                ]
              }
            </span>
            {tipsConfig.length && (
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <ul
                    className={cs['tips-box-content']}
                    style={{ whiteSpace: 'normal' }}
                  >
                    {tipsConfig.map((item, index) => {
                      if (!item.show) return null;
                      return <li key={index}>{item.text}</li>;
                    })}
                  </ul>
                }
              >
                <Icon icon="question" className={`${cs['icon']} main-color`} />
              </Popover>
            )}
          </div>
          <AddToWorkbench options={addWorkbenceArr} defaultVal={[]} />
          {chartDataReady && (
            <Picklist
              data={filterOptions}
              onChange={this.filterChange}
              selectall
              selectallText={i18n['general.date_range_picker.option.all']}
              searchable
              defaultSelectedKeys={dataFilter}
            />
          )}
          {chartDataReady && (
            <DateRangePicker
              align="right"
              onChange={this.modifyParams.bind(this, 'date')}
              defaultDate={{
                start: searchParams.fromTime,
                end: searchParams.toTime
              }}
              defaultLabel={i18n['general.date_range_picker.option.last30days']}
            />
          )}
        </div>
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            <div className={cs['chart-title']}>
              {
                i18n[
                  'dashboard.navigator.customer_data.trade_variety_distribute_detail'
                ]
              }
            </div>
          </PagePanel.Header>
          <PagePanel.Body>
            <div className={cs['chart']}>
              {chartDataReady && <Chart data={showData} />}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {
              i18n[
                'dashboard.title.table.trade_variety_distribute_times_detail'
              ]
            }
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{`${i18n['dashboard.table_header.symbol']}`}</th>
                <th>{i18n['dashboard.table_header.times']}</th>
              </Table.Header>
              <Table.Body>
                {showData
                  .slice((pageNo - 1) * pageSize, pageNo * pageSize)
                  .map(item => {
                    return (
                      <tr key={item.key}>
                        <td>{item.key}</td>
                        <td>{`${item.value}`}</td>
                      </tr>
                    );
                  })}
              </Table.Body>
            </Table>
            <PaginationBar
              total={tradeVarietyDistributeData.length}
              pageNo={pageNo}
              pageSize={pageSize}
              onPageChange={this.onPageChange.bind(this)}
            />
          </PagePanel.Body>
        </PagePanel>
      </div>
    );
  }
}
