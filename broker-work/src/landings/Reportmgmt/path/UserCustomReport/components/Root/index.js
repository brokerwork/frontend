import i18n from 'utils/i18n';
import setPageTitle from 'utils/setPageTitle';
import ConditionFilter from 'components/v2/ConditionFilter';
import Conditions from '../../containers/Conditions';
import ActionsBar from '../../containers/ActionsBar';
import List from '../../containers/List';
import { Layout, Sider, Summary } from 'components/v2/PageWraper';
import { MENUS } from 'utils/headerMenus';
import queryString from 'utils/queryString';
import { dateRange } from 'utils/config';

export default class Report extends PureComponent {
  constructor(props) {
    super(props);
    this.defaultConditions = [
      {
        key: 'objectType',
        type: 'EQ',
        originValue: props.privilegeType[0],
        value: props.privilegeType[0].value
      },
      {
        key: 'openTime',
        type: 'BETWEEN',
        originValue: {
          startDate: dateRange.today.start,
          endDate: dateRange.today.end
        },
        value: {
          startDate: dateRange.today.start,
          endDate: dateRange.today.end
        }
      }
    ];
    this.state = {
      paramsReady: false
    };
  }
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'reportmgmt').label;
      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }
  componentWillMount() {
    this.initDatas(this.props);
  }
  initDatas = props => {
    const {
      getServerList,
      getServerSymbols,
      getResources,
      getReportConfig,
      initialParams,
      searchParams,
      updateFieldConditions,
      match: { params },
      updateCurrentServer,
      getUserLevel
    } = props;
    const reportId = params.reportId;
    this.reportId = reportId;
    const promises = [getServerList(), getReportConfig(reportId)];
    Promise.all(promises).then(([serverList, reportConfig]) => {
      let serverParams = {};
      let reportConfigParams = {};
      if (reportConfig.result && serverList.result) {
        const { data } = reportConfig;
        reportConfigParams = {
          reportId: data.id,
          sortingColumn: data.sortingColumn,
          sortingDirection: data.sortingDirection || 'DESC'
        };
        const reportType = data.reportType;
        const isMt4 = reportType === 'MT4_TRADE_ORDER';
        const isMt5 = reportType === 'MT5_TRADE_ORDER';
        const end = serverList.data.filter(server => {
          if (isMt4) {
            return server.vendor === 'MT4';
          }
          if (isMt5) {
            return server.vendor === 'MT5';
          }
          return true;
        });
        const currentServer = end[0];
        getServerSymbols(currentServer);
        getResources(currentServer);
        getUserLevel();
        serverParams = {
          serverId: currentServer.serverId
        };
        updateCurrentServer({
          label: currentServer.desc,
          value: currentServer.serverId,
          vendor: currentServer.vendor
        });
        initialParams({
          ...searchParams,
          reportType,
          conditions: this.defaultConditions,
          ...serverParams,
          ...reportConfigParams
        });
        updateFieldConditions(this.defaultConditions);
        this.setState({
          paramsReady: true
        });
      }
    });
  };
  resetConditions = () => {
    const {
      modifyParams,
      searchParams,
      updateFieldConditions,
      privilegeType
    } = this.props;
    const newConditions = this.defaultConditions;
    const newParams = {
      ...searchParams,
      conditions: newConditions
    };
    Promise.resolve(updateFieldConditions(newConditions)).then(() => {
      modifyParams(newParams);
    });
  };
  componentWillReceiveProps(nextProps) {
    const {
      getResources,
      currentServer,
      match: { params }
    } = this.props;
    const {
      match: { params: nextParams }
    } = nextProps;
    const nextCurrentServer = nextProps.currentServer;
    if (
      currentServer &&
      nextCurrentServer &&
      JSON.stringify(nextCurrentServer) !== JSON.stringify(currentServer)
    ) {
      getResources(nextCurrentServer).then(() => {
        this.resetConditions();
      });
    }
    if (params.reportId !== nextParams.reportId) {
      this.setState({
        paramsReady: false
      });
      this.initDatas(nextProps);
    }
  }
  render() {
    const props = this.props;
    const { paramsReady } = this.state;
    if (paramsReady) {
      return (
        <Conditions {...props}>
          <Summary>
            <ActionsBar {...props} reportId={this.reportId} />
          </Summary>
          <Layout direction="horizontal">
            <Sider>
              <ConditionFilter.Panel />
            </Sider>
            <List {...props} />
          </Layout>
        </Conditions>
      );
    } else {
      return null;
    }
  }
}
