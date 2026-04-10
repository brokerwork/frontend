import i18n from 'utils/i18n';
import List from '../../containers/List';
import ActionsBar from '../../containers/ActionsBar';
import PagePanel from 'components/PagePanel';
// import CustomerDetailCard from '../../containers/CustomerDetailCard';
import CustomerDetail from '../../containers/CustomerDetail';
import AddCustomerModal from '../../containers/AddCustomerModal';
import ModCustomerModal from '../../containers/ModCustomerModal';
import { MENUS } from 'utils/headerMenus';
import setPageTitle from 'utils/setPageTitle';
import { Route, Switch } from 'react-router-dom';
import { CardPanelWrapper } from 'components/CardPanel';
import { matchPath } from 'react-router-dom';
import DeleteCustomer from '../../containers/DeleteCustomer';
import TransferCustomer from '../../containers/TransferCustomer';
import SendMessage from '../../containers/SendMessage';
import Transh from '../../path/Trash';
import Duplicate from '../../path/Duplicate';
import SendInvitateEmail from '../../containers/SendInvitateEmail';
import CreateBill from '../../../Bills/containers/Add';
import EditBill from '../../../Bills/containers/Edit';
import Main from '../Main';
import LostCustomer from '../../containers/LostCustomer';
import { Layout } from 'components/v2/PageWraper';
export default class Root extends PureComponent {
  componentDidMount() {
    const {
      getAccountOwnerFormColumns,
      getTenantType,
      getIsAdaptOn
    } = this.props;
    this.setTitle();
    // getAccountOwnerFormColumns();
    getTenantType();
    getIsAdaptOn();
  }
  setTitle = () => {
    const { brandInfo, history, match, location } = this.props;
    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'custommgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  };
  getCustomerList = reback => {
    const {
      searchType,
      fuzzySearchType,
      fuzzySearchText,
      advancedLogicType,
      searchFieldConditions,
      currentSortParam,
      searchDate,
      dateRange,
      currentCondition,
      currentSource,
      paginationInfo,
      currentCustomerState,
      getCustomers,
      ownId,
      updatePagination
    } = this.props;
    const { startDate, endDate } = dateRange;
    const showAllRevisitTime = endDate.format('YYYY-MM-DD') === '2100-12-31';
    const deteleRevisite = !searchDate;
    const newStart = deteleRevisite ? undefined : new Date(startDate).getTime();
    const newEnd = deteleRevisite ? undefined : new Date(endDate).getTime();
    if (reback) {
      updatePagination({
        currentPage: 1,
        pageSize: paginationInfo.pageSize
      });
    }
    return getCustomers({
      // filterType: searchType.value,
      // fuzzyItem: ownId ? 'OwnId' : fuzzySearchType.value,
      fuzzyVal: fuzzySearchText,
      // logicType: advancedLogicType,
      advanceConditions: searchFieldConditions,
      // searchDate: searchDate.value,
      sortBy: currentSortParam.sortBy,
      orderDesc: currentSortParam.orderDesc,
      // searchStart: !showAllRevisitTime ? newStart : undefined,
      // searchEnd: !showAllRevisitTime ? newEnd : undefined,
      pageSize: paginationInfo.pageSize,
      currentPage: reback ? 1 : paginationInfo.currentPage,
      settingsId: currentCondition
      // customSource: currentSource.value,
      // customerState: currentCustomerState.value
    });
  };
  // reback 是否返回第一页
  backToRoot = (refresh, reback) => {
    const {
      history: { push },
      match: { url },
      getCustomerList
    } = this.props;
    push(url);
    if (refresh) {
      this.getCustomerList(reback);
    }
  };
  render() {
    const props = this.props;
    const { tenantType } = props;
    if (!tenantType) return <div />;
    const matchDetail = matchPath(location.pathname, {
      path: `${props.match.url}/:trash?/detail/:customerId`
    });
    return (
      <Layout>
        {/* 创建客户 */}
        <Route
          path={`${props.match.url}/create`}
          children={createProps => (
            <CardPanelWrapper appear>
              {createProps.match && (
                <AddCustomerModal
                  {...createProps}
                  getCustomerList={this.getCustomerList}
                  backToRoot={this.backToRoot}
                />
              )}
            </CardPanelWrapper>
          )}
        />
        {/* 编辑客户 */}
        <Route
          path={`${props.match.url}/:trash?/:detail?/:customerId/modify`}
          getCustomerList={this.getCustomerList}
          children={modifyProps => (
            <CardPanelWrapper appear>
              {modifyProps.match && (
                <ModCustomerModal
                  {...modifyProps}
                  getCustomerList={this.getCustomerList}
                  backToRoot={this.backToRoot}
                />
              )}
            </CardPanelWrapper>
          )}
        />
        {/* 删除客户 */}
        <Route
          path={`${props.match.url}/delete`}
          render={_props => (
            <DeleteCustomer {..._props} backToRoot={this.backToRoot} />
          )}
        />
        {/* 划转客户 */}
        <Route
          path={`${props.match.url}/transfer`}
          render={_props => (
            <TransferCustomer {..._props} backToRoot={this.backToRoot} />
          )}
        />
        {/* 发送消息 */}
        <Route
          path={`${props.match.url}/sendMessage`}
          render={_props => (
            <SendMessage {..._props} backToRoot={this.backToRoot} />
          )}
        />
        {/* 发送邀请邮件 */}
        <Route
          path={`${props.match.url}/sendInvitateEmail`}
          render={_props => (
            <SendInvitateEmail {..._props} backToRoot={this.backToRoot} />
          )}
        />
        {/* 流失客户 */}
        <Route
          path={`${props.match.url}/detail/:customerId/lost`}
          render={_props => <LostCustomer {..._props} />}
        />
        <Switch>
          {/* 编辑账单 */}
          <Route
            path={`${props.match.url}/:trash?/detail/:customerId/bill/:billId`}
            render={_props => (
              <EditBill
                {..._props}
                getCustomerList={this.getCustomerList}
                backToRoot={this.backToRoot}
              />
            )}
          />
          {/* 添加账单 */}
          <Route
            path={`${props.match.url}/:trash?/detail/:customerId/bill`}
            render={_props => (
              <CreateBill
                {..._props}
                getCustomerList={this.getCustomerList}
                backToRoot={this.backToRoot}
              />
            )}
          />

          {/* 客户详情 */}
          <Route
            path={`${props.match.url}/:trash?/detail/:customerId`}
            render={_props => (
              <CustomerDetail
                {..._props}
                getCustomerList={this.getCustomerList}
                backToRoot={this.backToRoot}
              />
            )}
          />
          <Route path={`${props.match.url}/trash`} component={Transh} />
          <Route path={`${props.match.url}/duplicate`} component={Duplicate} />
          <Route
            path={`${props.match.url}`}
            render={_props => {
              return (
                <Main {..._props} getCustomerList={this.getCustomerList} />
              );
            }}
          />
        </Switch>
      </Layout>
    );
  }
}
