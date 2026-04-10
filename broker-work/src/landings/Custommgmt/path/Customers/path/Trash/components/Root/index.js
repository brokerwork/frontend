import i18n from 'utils/i18n';
import List from '../../containers/List';
import ActionsBar from '../../containers/ActionsBar';
import PagePanel from 'components/PagePanel';
import Breadcrumb from 'lean-ui';
import { Link } from 'react-router-dom';
import cs from './index.less';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import Conditions from '../../containers/Conditions';

export default class Main extends PureComponent {
  getCustomerList = () => {
    const {
      currentSortParam,
      // searchDate,
      // dateRange,
      paginationInfo,
      // currentCustomerState,
      getCustomers,
      searchFieldConditions
    } = this.props;
    // const { startDate, endDate } = dateRange;
    // const showAllRevisitTime = endDate.format('YYYY-MM-DD') === '2100-12-31';
    // const deteleRevisite = !searchDate;
    // const newStart = deteleRevisite ? undefined : new Date(startDate).getTime();
    // const newEnd = deteleRevisite ? undefined : new Date(endDate).getTime();
    return getCustomers({
      // fuzzyItem: fuzzySearchType.value,
      // fuzzyVal: fuzzySearchText,
      // searchDate: searchDate.value,
      sortBy: currentSortParam.sortBy,
      orderDesc: currentSortParam.orderDesc,
      // searchStart: !showAllRevisitTime ? newStart : undefined,
      // searchEnd: !showAllRevisitTime ? newEnd : undefined,
      pageSize: paginationInfo.pageSize,
      currentPage: paginationInfo.currentPage,
      // customerState: currentCustomerState.value,
      advanceConditions: searchFieldConditions
    });
  };
  render() {
    const props = this.props;
    const {
      match: { path }
    } = props;
    return (
      <Layout>
        {/* <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={path.replace('/trash', '')}>
              {i18n['navigation.customer.module_name']}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={path.replace('/trash', '')}>
              <span>{i18n['customer.trash.title']}</span>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb> */}

        {/* <PagePanel>
          <PagePanel.Header>
            <Breadcrumb>
              <span>{i18n['customer.trash.title']}</span>
            </Breadcrumb>
          </PagePanel.Header>
          <PagePanel.Body> */}
        <Summary>
          {<ActionsBar {...props} getCustomerList={this.getCustomerList} />}
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <Conditions getCustomerList={this.getCustomerList} />
          </Sider>
          <List {...props} getCustomerList={this.getCustomerList} />
        </Layout>
        {/* </PagePanel.Body>
        </PagePanel> */}
      </Layout>
    );
  }
}
