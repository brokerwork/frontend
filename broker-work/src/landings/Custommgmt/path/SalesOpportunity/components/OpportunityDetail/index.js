import i18n from 'utils/i18n';
import getQueryString from 'utils/queryString';
import PageFrame from '../../../../components/PageFrame';
import { Link } from 'react-router-dom';
import Breadcrumb from 'components/v2/Breadcrumb';
import HeadInfo from './HeadInfo';
import DetailInfo from './DetailInfo';
import FollowForm from './FollowForm';
import Records from './Records';
import Contracts from './Contracts';
import { Layout, Content } from 'components/v2/PageWraper';
const routes = [
  {
    path: '/custommgmt/salesopportunities',
    breadcrumbName: i18n['customer.sales_opportunity.detail.title']
  },
  {
    path: '',
    breadcrumbName: i18n['customer.sales_opportunity.detail.sub_title']
  }
];
export default class OpportunityDetail extends PureComponent {
  componentDidMount() {
    const {
      getFormColumns,
      getOpportunityTypeList,
      getLoseCauseList,
      getFollowWayList,
      getSalesStageList,
      salesStageList
    } = this.props;
    const query = getQueryString(location.search);

    this.getDetail(true);
    if (!salesStageList.length) {
      getFormColumns();
      getOpportunityTypeList();
      getLoseCauseList();
      getFollowWayList();
      getSalesStageList();
    }
  }

  getDetail = isInit => {
    const {
      getDetail,
      getIsLostCustomer,
      getCustomerParticipant,
      match: {
        params: { id }
      }
    } = this.props;
    const query = getQueryString(location.search);
    const enable = query.get('enable') === 'false' ? false : true;
    getDetail(id, enable).then(res => {
      if (res.result) {
        const customerId = res.data.basicinfo.customerId;
        getIsLostCustomer(customerId);
        if (isInit) {
          getCustomerParticipant(customerId);
        }
      }
    });
  };

  render() {
    const {
      detail,
      userRights,
      match: { path },
      isLostCustomer
    } = this.props;
    const { contracts = [] } = detail;
    const query = getQueryString(location.search);
    const enable = query.get('enable') === 'false' ? false : true;
    const canEdit =
      userRights['CUSTOMER_SALEOPP_MODIFY'] && enable && !isLostCustomer;
    return (
      <Layout footer>
        <Content old>
          <PageFrame>
            <PageFrame.Header>
              <Breadcrumb routes={routes} />
            </PageFrame.Header>
            <PageFrame.Body>
              <PageFrame.Left>
                <HeadInfo
                  {...this.props}
                  canEdit={canEdit}
                  getDetail={this.getDetail}
                />
                <DetailInfo
                  {...this.props}
                  canEdit={canEdit}
                  getDetail={this.getDetail}
                />
                <Contracts
                  {...this.props}
                  canEdit={canEdit}
                  getDetail={this.getDetail}
                  contractListOfCustomer={contracts}
                />
              </PageFrame.Left>
              <PageFrame.Right>
                <FollowForm
                  {...this.props}
                  getDetail={this.getDetail}
                  canEdit={canEdit}
                />
                <Records
                  {...this.props}
                  getDetail={this.getDetail}
                  canEdit={canEdit}
                />
              </PageFrame.Right>
            </PageFrame.Body>
          </PageFrame>
        </Content>
      </Layout>
    );
  }
}
