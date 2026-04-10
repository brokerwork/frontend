import List from '../List';
import { Card } from 'lean-ui';
import ActionBar from '../ActionBar';
import NoDataView from 'components/v2/NoDataView';
import cs from './index.less';

export default class TaskLogs extends Component {
  componentDidMount() {
    const { modifyParams, module, params, getLogType } = this.props;
    const __params = {
      ...params,
      module
    };
    modifyParams(__params);
    getLogType(module);
  }
  componentWillUnmount() {
    this.props.resetParams();
  }

  render() {
    const {
      data,
      params,
      logType,
      module,
      paginationInfo,
      title,
      modifyParams
    } = this.props;
    return (
      <div className={cs.body}>
        <ActionBar
          params={params}
          modifyParams={modifyParams}
          logType={logType}
          module={module}
          title={title}
        />
        <Card>
          <List
            data={data}
            params={params}
            paginationInfo={paginationInfo}
            modifyParams={modifyParams}
            module={module}
          />
          {data.length === 0 ? <NoDataView /> : undefined}
        </Card>
      </div>
    );
  }
}
