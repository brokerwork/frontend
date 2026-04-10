import ActionsBar from '../../containers/ActionsBar';
import List from '../../containers/List';
import ConditionFilter from 'components/v2/ConditionFilter';
import Conditions from '../../containers/Conditions';
import { Layout, Sider, Summary } from 'components/v2/PageWraper';
import { REPORT_SORT_INTIAL } from '../../constant';
import * as CONSTANT from '../../constant';
import { dateRange } from 'utils/config';
import _ from 'lodash';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';

export default class Report extends PureComponent {
  componentWillMount() {
    const {
      updateCurrentStatisticalReportType,
      match: { params: { type } = {} },
      getServerList,
      getSymbolGroup,
      getResources,
      getServerSymbols,
      updateCurrentSortParam,
      brandInfo
    } = this.props;
    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'reportmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }

    const promises = [
      getServerList(),
      updateCurrentStatisticalReportType(type),
      getSymbolGroup(),
      getServerSymbols()
    ];
    Promise.all(promises).then(() => {
      const { currentServer } = this.props;
      getResources(currentServer);
      if (type !== 'SymbolGroup') {
        const currentSortInfo = REPORT_SORT_INTIAL.find(
          item => item.type === type
        );
        const sortParams = {
          sortby:
            type === 'HistoryOrder'
              ? currentSortInfo[`${currentServer.vendor}sortColumn`]
              : _.get(currentSortInfo, 'sortColumn', ''),
          orderDesc: true
        };
        updateCurrentSortParam(sortParams);
        // this.resetConditions();
      }
    });
  }
  resetConditions = () => {
    const {
      modifyParams,
      params,
      updateFieldConditions,
      privilegeType
    } = this.props;
    const objectType = params.conditions.find(
      item => item.key === 'objectType'
    );
    const filterBox = ['all', 'sub'];
    const newConditions = [
      objectType && objectType.value.indexOf('@#') > -1
        ? objectType
        : {
            key: 'objectType',
            type: 'equals',
            originValue: privilegeType.find(el => filterBox.includes(el.value)),
            value: privilegeType.find(el => filterBox.includes(el.value))
              ? privilegeType.find(el => filterBox.includes(el.value)).value
              : ''
          },
      {
        key: 'filterDate',
        type: 'between',
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
    const newParams = {
      ...params,
      conditions: newConditions,
      id: ''
    };
    Promise.resolve(updateFieldConditions(newConditions)).then(() => {
      modifyParams(newParams);
    });
  };

  componentWillReceiveProps(nextProps) {
    const {
      match: { path, params: { type } = {} },
      history: { push },
      updateCurrentStatisticalReportType,
      getServerList,
      getSymbolGroup,
      updateCurrentSortParam,
      getResources,
      currentServer,
      modifyParams,
      params
    } = this.props;
    const nextCurrentServer = nextProps.currentServer;
    const nextType = nextProps.match.params.type;
    if (
      nextCurrentServer &&
      JSON.stringify(nextCurrentServer) !== JSON.stringify(currentServer)
    ) {
      getResources(nextCurrentServer).then(() => {
        const currentSortInfo = REPORT_SORT_INTIAL.find(
          item => item.type === nextType
        );
        const sortParams = {
          sortby:
            nextType === 'HistoryOrder'
              ? currentSortInfo[`${nextCurrentServer.vendor}sortColumn`]
              : _.get(currentSortInfo, 'sortColumn', ''),
          orderDesc: true
        };
        Promise.resolve(updateCurrentSortParam(sortParams)).then(() => {
          this.resetConditions();
        });
      });
    }
    if (nextType && type && nextType !== type) {
      // 切换报表时，初始化筛选条件
      Promise.resolve(updateCurrentStatisticalReportType(nextType)).then(() => {
        // const promises = [getServerList()];
        const promises = [];
        if (nextProps.match.params.type === 'SymbolGroup') {
          promises.push(getSymbolGroup());
        }
        Promise.all(promises).then(() => {
          const { currentServer, getResources } = this.props;
          getResources(currentServer);
          if (nextType === 'SymbolGroup') {
            modifyParams({ ...params, reportType: nextType });
            return;
          }
          const currentSortInfo = REPORT_SORT_INTIAL.find(
            item => item.type === nextType
          );
          const sortParams = {
            sortby:
              nextType === 'HistoryOrder'
                ? currentSortInfo[`${nextCurrentServer.vendor}sortColumn`]
                : currentSortInfo.sortColumn,
            orderDesc: true
          };
          Promise.all([
            updateCurrentStatisticalReportType(nextType),
            updateCurrentSortParam(sortParams)
          ]).then(() => {
            this.resetConditions();
          });
          // Promise.resolve(updateCurrentSortParam(sortParams)).then(() => {
          //   this.resetConditions();
          //   // modifyParams({ ...params, ...newSortParams, reportType: nextType });
          // });
        });
      });
    }
  }
  // 初始化筛选条件
  initSearchParams = params => {};
  render() {
    const props = this.props;
    return (
      <Conditions {...props}>
        <Summary>
          <ActionsBar {...props} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel currentServer={props.currentServer} />
          </Sider>
          <List {...props} />
        </Layout>
      </Conditions>
    );
  }
}
