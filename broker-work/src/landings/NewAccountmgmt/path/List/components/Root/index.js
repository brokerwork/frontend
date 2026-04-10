import PropTypes from 'prop-types';
import PagePanel from 'components/PagePanel';
import Actions from '../../containers/Actions';
import List from '../../containers/List';
import i18n from 'utils/i18n';
import cs from './Root.less';
import moment from 'moment';
import Conditions from '../../containers/Conditions';
import { dateTimeFormatStyle } from 'utils/config';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import ConditionFilter from 'components/v2/ConditionFilter';

export default class Root extends PureComponent {
  state = {
    refreshTime: moment()
  };

  getAccountList = () => {
    const {
      currentServer,
      currentPagination: { pageNo, pageSize },
      orderBy: { type: sortby, desc: orderDesc },
      fieldConditions,
      dateRange: { startDate, endDate },
      currentPrivilegeType,
      searchCondition,
      searchLogicType,
      filterUser,
      fuzzyValue,
      getAccountList
    } = this.props;
    return getAccountList(
      {
        pageNo,
        pageSize,
        sortby,
        orderDesc,
        fieldConditions,
        startDate: startDate ? startDate.valueOf() : null,
        endDate: endDate ? endDate.valueOf() : null,
        userSearchType: filterUser.value
          ? filterUser.isDirect
            ? 'sub'
            : ''
          : currentPrivilegeType,
        userId: filterUser.value,
        searchId: searchCondition,
        logicType: searchLogicType,
        fuzzyValue
      },
      currentServer
    );
  };

  reload = () => {
    const { reload } = this.context;

    reload(this.getAccountList);
  };

  refresh = () => {
    this.getAccountList().then(({ result }) => {
      if (result) {
        this.setState({
          refreshTime: moment()
        });
      }
    });
  };

  render() {
    const { selectedAccountIds, match } = this.props;
    const { refreshTime } = this.state;
    const props = this.props;
    return (
      <Conditions {...props} onChange={this.getAccountList}>
        <Summary>
          <Actions onChange={this.getAccountList} reload={this.reload} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel />
          </Sider>
          <List
            match={match}
            onChange={this.getAccountList}
            reload={this.reload}
          />
        </Layout>
      </Conditions>
    );
  }
}

Root.contextTypes = {
  reload: PropTypes.func
};
