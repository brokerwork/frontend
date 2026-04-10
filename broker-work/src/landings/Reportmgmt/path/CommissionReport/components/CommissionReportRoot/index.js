import ActionsBar from '../../containers/ActionsBar';
import List from '../../containers/List';
import ConditionFilter from 'components/v2/ConditionFilter';
import Conditions from '../../containers/Conditions';
import { Layout, Sider, Summary } from 'components/v2/PageWraper';
import { dateRange } from 'utils/config';
import cs from './CommissionReportRoot.less';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';
export default class Report extends PureComponent {
  state = {
    readyData: false
  };
  componentWillMount() {
    const {
      updateCurrentCommissionReportType,
      match: { params: { type } = {} },
      getServerList,
      brandInfo
    } = this.props;
    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'reportmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
    Promise.all([
      getServerList(),
      updateCurrentCommissionReportType(type)
    ]).then(() => {
      this.setState({
        readyData: true
      });
    });
  }
  setParams = conditions => {
    let condition = _.cloneDeep(conditions);
    let { params, objectType } = this.props;
    let newConditions = [
      {
        key: 'status',
        type: 'equals',
        value: 'failed'
      }
    ];
    if (condition) {
      condition.find(el => {
        return el.key === 'filterDate';
      }).value = {
        startDate: dateRange.all.start,
        endDate: dateRange.all.end
      };
      let con = condition.filter(el => {
        return el.key === 'objectType' || el.key === 'filterDate';
      });
      newConditions = newConditions.concat(con);
    } else {
      newConditions.unshift(
        params.conditions.find(el => el.key === 'objectType') || {
          key: 'objectType',
          type: 'equals',
          originValue: objectType[0],
          value: objectType[0].value
        }
      );
      newConditions.unshift({
        key: 'filterDate',
        type: 'between',
        value: {
          startDate: dateRange.all.start,
          endDate: dateRange.all.end
        }
      });
    }
    const newParams = {
      ...params,
      conditions: newConditions,
      pageNo: 1
    };
    return newParams;
  };
  checkFailNum = condition => {
    const {
      modifyParams,
      match: { params: { type } = {} }
    } = this.props;
    /**
      实时返佣和按天返佣需要显示失败数量
    */
    if (type === 'RTCommission' || type === 'RealTime') {
      // 只查询失败数，不更新列表及参数
      modifyParams(this.setParams(condition), true);
    }
  };
  componentWillReceiveProps(nextProps) {
    const {
      match: { path, params: { type } = {} },
      history: { push },
      updateCurrentCommissionReportType,
      getServerList
    } = this.props;
    const nextType = nextProps.match.params.type;
    if (nextType && nextType !== type) {
      push(path.replace('/:type', `/${nextType}`));
      Promise.all([
        getServerList(),
        updateCurrentCommissionReportType(nextType)
      ]).then(() => {
        this.checkFailNum();
        this.setState({
          readyData: true
        });
      });
    }
  }
  render() {
    const props = this.props;
    const { readyData } = this.state;
    return (
      <Conditions checkFailNum={this.checkFailNum} {...props}>
        <Summary>
          {readyData ? (
            <ActionsBar
              checkFailNum={this.checkFailNum}
              setParams={this.setParams}
              {...props}
            />
          ) : (
            undefined
          )}
        </Summary>
        <Layout direction="horizontal">
          <Sider className={cs['rtc-sider']}>
            <ConditionFilter.Panel currentServer={props.currentServer} />
          </Sider>
          <List {...props} />
        </Layout>
      </Conditions>
    );
  }
}
