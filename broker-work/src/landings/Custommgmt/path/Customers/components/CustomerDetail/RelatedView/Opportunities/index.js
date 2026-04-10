import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Table, Button } from 'lean-ui';
import DropdownItem from 'components/v2/DropdownItem';
import ContentCard from '../../../../../../components/ContentCard';
import CreateOpportunityModal from '../../../../../SalesOpportunity/containers/CreateOpportunityModal';
import UpdateOpportunityModal from '../../../../../SalesOpportunity/containers/UpdateOpportunityModal';
import moment from 'moment';

export default class Contacts extends Component {
  state = {
    showAddOpportunityModal: false,
    showUpdateOpportunityModal: false,
    editingOpportunity: {},
    hasContract: false
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  opportunityOperation = v => {
    const {
      showTipsModal,
      showTopAlert,
      removeOpportunity,
      getCustomerDetail,
      customerDetailInfo,
      getCustomerParticipant
    } = this.props;
    const { type, item } = v;

    if (type === 'edit') {
      Promise.resolve(
        getCustomerParticipant(customerDetailInfo.customerId)
      ).then(res => {
        if (res.result) {
          this.setState({
            showUpdateOpportunityModal: true,
            editingOpportunity: item,
            hasContract: this.isHasContract(item)
          });
        }
      });
    }

    if (type === 'remove') {
      showTipsModal({
        content: i18n['customer.detail.remove_tips'],
        onConfirm: cb => {
          removeOpportunity([item.opportunityId]).then(({ result, data }) => {
            if (result) {
              if (data && data.length) {
                //有无法删除的
                showTipsModal({
                  content:
                    i18n['customer.sales_opportunity.detail.delete_reject'],
                  noCancel: true
                });
              } else {
                cb();
                showTopAlert({
                  content: i18n['general.remove_success'],
                  bsStyle: 'success'
                });
              }
              getCustomerDetail();
            }
          });
        }
      });
    }
  };
  isHasContract = editingOpportunity => {
    const { contractListOfCustomer } = this.props;
    return contractListOfCustomer.some(
      item => item.contracts.opportunityId === editingOpportunity.opportunityId
    );
  };
  createOpportunity = () => {
    const { getCustomerDetail, customerDetailInfo } = this.props;

    this.setState(
      {
        showAddOpportunityModal: false
      },
      () => {
        getCustomerDetail();
      }
    );
  };

  updateOpportunity = () => {
    const { getCustomerDetail, customerDetailInfo } = this.props;

    this.setState(
      {
        showUpdateOpportunityModal: false
      },
      () => {
        getCustomerDetail();
      }
    );
  };

  opportunityOptions = o => {
    const {
      userRights,
      customerDetailInfo: { isLost }
    } = this.props;
    const opportunityOptions = [];

    if (userRights.CUSTOMER_SALEOPP_MODIFY && !isLost) {
      opportunityOptions.push({
        label: i18n['customer.detail.edit'],
        type: 'edit',
        item: o
      });
    }

    if (userRights.CUSTOMER_SALEOPP_DELETE && !isLost) {
      opportunityOptions.push({
        label: i18n['customer.detail.remove'],
        type: 'remove',
        item: o
      });
    }

    return opportunityOptions;
  };
  getSortedList = () => {
    const { opportunitiesOfCustomer } = this.props;
    // return [];
    return opportunitiesOfCustomer.concat().sort((a, b) => {
      if (a.lose && !b.lose) {
        return 1;
      } else if (!a.lose && b.lose) {
        return -1;
      } else {
        return 0;
      }
    });
  };
  render() {
    const {
      showAddOpportunityModal,
      showUpdateOpportunityModal,
      editingOpportunity,
      hasContract
    } = this.state;
    const {
      customerDetailInfo,
      customerDetailInfo: { enabled, isLost },
      opportunitiesOfCustomer: opportunities = [],
      userRights,
      opportunityTypeList,
      salesStageList
    } = this.props;

    const customerInfo = {
      customerId: customerDetailInfo.customerId,
      customName: customerDetailInfo.customName,
      oweId: customerDetailInfo.oweId,
      oweName: customerDetailInfo.oweName
    };

    const opportunityTypeListObj = opportunityTypeList.reduce((obj, item) => {
      return {
        ...obj,
        [item.value]: item.label
      };
    }, {});

    const salesStageListObj = salesStageList.reduce((obj, item) => {
      return {
        ...obj,
        [item.value]: item.label
      };
    }, {});
    const sortedList = this.getSortedList();
    const editEnabled = enabled && !isLost;
    return (
      <div>
        {userRights.CUSTOMER_SALEOPP ? (
          <ContentCard limit={4}>
            <ContentCard.Header
              title={
                <FormattedMessage
                  id="customer.detail.opp_title"
                  defaultMessage={i18n['customer.detail.opp_title']}
                  values={{ number: `${opportunities.length}` }}
                />
              }
              icon="opportunities"
              iconClassName={cs['opportunities']}
            >
              <ContentCard.Tools>
                {' '}
                {userRights.CUSTOMER_SALEOPP_ADD && editEnabled ? (
                  <Button
                    className={cs['add-button']}
                    onClick={this.toggleModal.bind(
                      this,
                      'AddOpportunity',
                      true
                    )}
                  >
                    {i18n['customer.detail.create']}
                  </Button>
                ) : (
                  undefined
                )}
              </ContentCard.Tools>
            </ContentCard.Header>
            <ContentCard.Body className={cs['staff-list']}>
              {sortedList.map((o, index) => {
                return (
                  <div
                    className={`${cs['staff-item']} ${
                      o.lose ? cs['staff-item-dark'] : ''
                    }`}
                    key={index}
                  >
                    <div className={cs['staff-item-container']}>
                      <div className={cs['straff-box']}>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.opp_name']}
                          </span>
                          <div className={cs['straff-name']}>
                            <a
                              target="_blank"
                              className={`${
                                cs['straff-name-label']
                              } main-color`}
                              title={o.opportunityName}
                              href={`/custommgmt/salesopportunities/${
                                o.opportunityId
                              }?enable=${customerDetailInfo.enabled}`}
                            >
                              {o.opportunityName}
                            </a>
                          </div>
                        </div>
                        {/* <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.detail.opp_type_label']}
                            </span>
                            {opportunityTypeListObj[o.opportunityType]}
                          </div> */}
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.sales_stage_label']}
                          </span>
                          {salesStageListObj[o.isLose ? 6 : o.salesStage]}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.expect_amount']}
                          </span>
                          {o.expectAmount}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.expect_time']}
                          </span>
                          {o.expectTime &&
                            moment(o.expectTime).format('YYYY-MM-DD')}
                        </div>
                      </div>
                      {editEnabled ? (
                        <DropdownItem
                          onSelect={this.opportunityOperation}
                          className={cs['dropdown-button']}
                          right
                          data={this.opportunityOptions(o)}
                        >
                          <span
                            className={`fa fa-sort-down ${cs['dropdown-icon']}`}
                          />
                        </DropdownItem>
                      ) : (
                        undefined
                      )}
                    </div>
                  </div>
                );
              })}
            </ContentCard.Body>
          </ContentCard>
        ) : (
          undefined
        )}
        {showAddOpportunityModal ? (
          <CreateOpportunityModal
            show={showAddOpportunityModal}
            customerInfo={customerInfo}
            onSave={this.createOpportunity}
            onHide={this.toggleModal.bind(this, 'AddOpportunity', false)}
          />
        ) : (
          undefined
        )}
        {showUpdateOpportunityModal ? (
          <UpdateOpportunityModal
            info={editingOpportunity}
            hasContract={hasContract}
            show={showUpdateOpportunityModal}
            onSave={this.updateOpportunity}
            onHide={this.toggleModal.bind(this, 'UpdateOpportunity', false)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
