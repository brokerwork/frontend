import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import PaginationBar from 'components/v2/PaginationBar';
import { Popover, Icon, Select } from 'lean-ui';
import Chart from '../Chart';
import cs from 'landings/Dashboard/components/common.less';
import csr from './style.less';
import moment from 'moment';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import DropdownForCode from 'components/v2/DropdownForCode';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';

const addWorkbenceArr = ['SOURCE_TUNNEL'];
const defaultSource = {
  value: 'all',
  label: i18n['dashboard.customer_source.all']
};

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataReady: false,
      activeSource: 'all',
      sourceOpts: [],
      transferDateRangeOpts: [
        {
          value: 0,
          label: i18n['dashboard.options.no_limit']
        },
        ...[1, 2, 3, 4, 5, 6, 7, 14, 30, 60, 90].map(val => ({
          label: `${val} ${i18n['dashboard.options.day']}`,
          value: val
        }))
      ]
    };
  }
  componentDidMount() {
    const {
      getTransferFunnel,
      getCustomerSources,
      modifyTablePagination,
      getBrandInfo,
      searchParams,
      modifyParams,
      setDashboardViewRight,
      userRights
    } = this.props;
    const defaultParams = {
      ...searchParams,
      trasnferPeriod: 7
    };
    modifyParams(defaultParams);
    Promise.all([
      getTransferFunnel(defaultParams),
      getCustomerSources(),
      setDashboardViewRight(userRights)
    ]).then(([transferFunnel, sourceData]) => {
      if (transferFunnel.result && sourceData.result) {
        const sourceOpts = this.sourceOptionsTrans(
          transferFunnel.data,
          sourceData.data
        );
        this.setState({
          sourceData,
          sourceOpts: [defaultSource, ...sourceOpts],
          dataReady: true
        });
      }
    });
  }
  componentWillUnmount() {
    this.props.resetData();
  }
  sourceOptionsTrans(transferFunnel = { detail: {} }, sourceData) {
    const { modifyTablePagination } = this.props;
    const keys = Object.keys(transferFunnel.detail || {});
    const total = keys.length;
    let sourceOpts = [];
    modifyTablePagination({ total, pageNo: 1 });
    sourceData.forEach(sourceItem => {
      if (keys.includes(sourceItem.value)) {
        sourceOpts.push(sourceItem);
      }
    });
    return sourceOpts;
  }
  onPageChange = v => {
    const { modifyTablePagination } = this.props;
    modifyTablePagination(v);
  };
  modifyParams(type, params) {
    const { searchParams, modifyParams, getTransferFunnel } = this.props;
    const { sourceData } = this.state;
    let endParams = {};
    if (type === 'date') {
      endParams = {
        ...searchParams,
        fromTime: params.start,
        toTime: params.end
      };
    } else {
      endParams = {
        ...searchParams,
        [type]: params
      };
    }
    delete endParams.type;
    modifyParams(endParams);
    getTransferFunnel(endParams).then(data => {
      const sourceOpts = this.sourceOptionsTrans(data.data, sourceData.data);
      this.setState({ sourceOpts: [defaultSource, ...sourceOpts] });
    });
  }
  modifyActiveSource = v => {
    this.setState({
      activeSource: v
    });
  };
  trendDetailDataKeySort(data = {}) {
    const first = 'all';
    let haveFirst = false;
    const keys = Object.keys(data);
    const end = keys.filter(v => {
      if (v === first) {
        haveFirst = true;
      }
      return v !== first;
    });
    if (haveFirst) {
      return [first, ...end];
    }
    return [];
  }
  render() {
    const {
      match: { url },
      userRights,
      customerSourceOptions,
      paginationInfo,
      transferFunnel = { detail: {} },
      searchParams,
      dashboardViewRight
    } = this.props;
    const {
      dataReady,
      transferDateRangeOpts,
      activeSource,
      sourceOpts
    } = this.state;
    const { trasnferPeriod } = searchParams;
    const trendDetailDataKeys = this.trendDetailDataKeySort(
      transferFunnel.detail || {}
    );
    const customerSourceObj = {};
    customerSourceObj['all'] = i18n['dashboard.customer_source.all'];
    customerSourceOptions.forEach(item => {
      customerSourceObj[item.value] = item.label;
    });

    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;

    const tableLabels = trendDetailDataKeys.slice(pageStart, pageEnd);
    const tipsConfig = [
      {
        text: i18n['dashboard.tips.tranfom_funnel.TOTAL_CUSTOMER_TENANT'],
        show: true
      },
      {
        text:
          i18n[
            'dashboard.tips.tranfom_funnel.TOTAL_CUSTOMER_TENANT_HAS_ACCOUNT'
          ],
        show: true
      },
      {
        text:
          i18n[
            'dashboard.tips.tranfom_funnel.TOTAL_CUSTOMER_TENANT_HAS_DEPOSIT'
          ],
        show: true
      },
      {
        text:
          i18n['dashboard.tips.tranfom_funnel.TOTAL_CUSTOMER_TENANT_HAS_DEAL'],
        show: true
      }
    ];

    const selectStyle = {
      marginLeft: '10px'
    };

    if (!dashboardViewRight['checkCustomer']) return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.customer_source.transfom_funnel']}
            </span>
            {tipsConfig.length && (
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <ul className={cs['tips-box-content']}>
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
          <Popover
            content={`${i18n['dashboard.tips.funnel.timerange']}`}
            trigger="hover"
            popoverClassName={csr['pop-over-time-range']}
            placement="left"
          >
            <span />
            <DateRangePicker
              onChange={this.modifyParams.bind(this, 'date')}
              defaultDate={{
                start: searchParams.fromTime,
                end: searchParams.toTime
              }}
              defaultLabel={i18n['general.date_range_picker.option.last7days']}
            />
          </Popover>
          <Popover
            content={
              trasnferPeriod * 1 === 0
                ? i18n['dashboard.tips.funnel.trasnfer_period.nolimit']
                : `${
                    i18n['dashboard.tips.funnel.trasnfer_period.before']
                  } ${trasnferPeriod} ${
                    i18n['dashboard.tips.funnel.trasnfer_period.after']
                  }`
            }
            popoverClassName={csr['pop-over-period']}
            trigger="hover"
            placement="bottomLeft"
          >
            <span />
            <DropdownForCode
              data={transferDateRangeOpts}
              value={trasnferPeriod}
              onChange={this.modifyParams.bind(this, 'trasnferPeriod')}
            />
          </Popover>
          <DropdownForCode
            data={sourceOpts}
            value={activeSource}
            onChange={this.modifyActiveSource.bind(this)}
          />
        </div>
        <PagePanel>
          <PagePanel.Header>
            {i18n['dashboard.navigator.customer_source.transfom_funnel']}
          </PagePanel.Header>
          <PagePanel.Body>
            <div className={cs['chart']}>
              {dataReady && (
                <Chart data={transferFunnel} activeSource={activeSource} />
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {i18n['dashboard.title.table.source']}
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.navigator.customer_source']}</th>
                <th>{i18n['dashboard.data_type.FUNNEL_CREATE']}</th>
                <th>{i18n['dashboard.data_type.FUNNEL_OPEN_ACCOUNT']}</th>
                <th>{i18n['dashboard.data_type.FUNNEL_DEPOSIT']}</th>
                <th>{i18n['dashboard.data_type.FUNNEL_DEAL']}</th>
              </Table.Header>
              <Table.Body>
                {tableLabels.map((item, index) => {
                  const d = transferFunnel.detail[item];
                  return (
                    <tr key={index}>
                      <td>{customerSourceObj[item]}</td>
                      <td>{d.CREATE}</td>
                      <td>{d.OPEN_ACCOUNT}</td>
                      <td>{d.DEPOSIT}</td>
                      <td>{d.DEAL}</td>
                    </tr>
                  );
                })}
              </Table.Body>
            </Table>
            <PaginationBar
              {...paginationInfo}
              onPageChange={this.onPageChange}
            />
          </PagePanel.Body>
        </PagePanel>
      </div>
    );
  }
}
