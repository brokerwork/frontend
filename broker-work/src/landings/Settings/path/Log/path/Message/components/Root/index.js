import List from '../List';
import { Card } from 'lean-ui';
import ActionBar from '../ActionBar';
import NoDataView from 'components/v2/NoDataView';
import cs from './index.less';

export default class TaskLogs extends Component {
  componentDidMount() {
    const { modifyParams, module, params, getLogType } = this.props;
    getLogType(module).then(res => {
      if (!res.result) return Promise.resolve(res);
      modifyParams({
        ...params,
        module,
        fuzzyItem: 'fromName',
        productId: 'BW',
        type: res.data[0].value
      });
    });
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
      emails,
      paginationInfo,
      title,
      modifyParams,
      showTopAlert,
      showTipsModal,
      resendEmail,
      searchOptions,
      getEmailList,
      userRights
    } = this.props;
    return (
      <div className={cs.body}>
        <ActionBar
          params={params}
          modifyParams={modifyParams}
          logType={logType}
          userRights={userRights}
          module={module}
          searchOptions={searchOptions}
          title={title}
        />
        <Card>
          <List
            data={data}
            params={params}
            paginationInfo={paginationInfo}
            modifyParams={modifyParams}
            module={module}
            showTopAlert={showTopAlert}
            showTipsModal={showTipsModal}
            resendEmail={resendEmail}
            getEmailList={getEmailList}
            emails={emails}
          />
          {data.length === 0 ? <NoDataView /> : undefined}
        </Card>
      </div>
    );
  }
}
