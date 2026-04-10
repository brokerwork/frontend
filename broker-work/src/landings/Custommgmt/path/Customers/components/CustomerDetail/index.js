import CardPanel, { CardPanelWrapper } from 'components/CardPanel';
import i18n from 'utils/i18n';
import cs from './index.less';
import HeaderInfoView from './HeaderInfoView';
import RelatedView from './RelatedView';
import DetailView from './DetailView';
import FollowRecordView from './FollowRecordView';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageFrame from '../../../../components/PageFrame';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';

export default class CustomerDetailCard extends PureComponent {
  closeCustomerCard = () => {
    const {
      updateCustomerDetail,
      history,
      match: { path },
      backToRoot,
      location
    } = this.props;
    const isFromList = location.state && location.state.fromList;
    if (isFromList) {
      history.goBack();
    } else {
      history.push(path.replace('/detail/:customerId', ''));
    }
    setTimeout(function() {
      updateCustomerDetail({}); //清空当前选择过的客户数据
    });
  };
  componentDidMount() {
    const {
      getFormColumns,
      getSalesStageList,
      getOpportunityTypeList,
      getProductInfo,
      getOpportunityForm,
      match: { params: { customerId } = {} },
      getCustomerFormFields,
      getFollowWayOptions,
      customerFormFields,
      getProductList,
      getCustomerLinkSource,
      tenantType
    } = this.props;
    getFormColumns();
    getSalesStageList();
    getOpportunityTypeList();
    getOpportunityForm();
    getProductInfo('TW');
    getCustomerLinkSource();
    this.getCustomerDetail();
    if (!customerFormFields.length) {
      getCustomerFormFields(tenantType);
      getFollowWayOptions();
    }
  }
  componentWillUnmount() {
    const { clearCustomerDetailInfo } = this.props;
    clearCustomerDetailInfo();
  }
  getCustomerDetail = () => {
    const {
      getCustomerDetail,
      followWayOptions,
      searchType,
      match: { params: { customerId } = {} },
      tenantType,
      userRights
    } = this.props;
    getCustomerDetail(customerId, tenantType, userRights);
  };
  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { customerId }
      }
    } = this.props;
    if (this.props.phoneCallStatus && !nextProps.phoneCallStatus) {
      this.getCustomerDetail();
    }
  }
  render() {
    const {
      showCustomerCard,
      customerDetailInfo,
      userRights,
      location,
      backToRoot,
      match: { path, params }
    } = this.props;
    const { ...props } = this.props;
    return (
      <Layout footer>
        <Content old>
          <PageFrame>
            <PageFrame.Header>
              {Object.keys(customerDetailInfo).length !== 0 && (
                <HeaderInfoView
                  userRights={userRights}
                  {...props}
                  getCustomerDetail={this.getCustomerDetail}
                  closeCustomerCard={this.closeCustomerCard}
                />
              )}
            </PageFrame.Header>
            <PageFrame.Body>
              {Object.keys(customerDetailInfo).length ? (
                <PageFrame.Left>
                  {/* <BasicInfoView
                    userRights={userRights}

                    {...props}
                    getCustomerDetail={this.getCustomerDetail}
                  /> */}
                  <DetailView
                    userRights={userRights}
                    {...props}
                    getCustomerDetail={this.getCustomerDetail}
                  />
                  <RelatedView
                    userRights={userRights}
                    {...props}
                    getCustomerDetail={this.getCustomerDetail}
                  />
                </PageFrame.Left>
              ) : (
                undefined
              )}
              <PageFrame.Right>
                {Object.keys(customerDetailInfo).length ? (
                  <FollowRecordView
                    {...props}
                    getCustomerDetail={this.getCustomerDetail}
                  />
                ) : (
                  undefined
                )}
              </PageFrame.Right>
            </PageFrame.Body>
          </PageFrame>
        </Content>
      </Layout>
    );
  }
}
