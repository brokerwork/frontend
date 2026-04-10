import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Table, Button } from 'lean-ui';
import DropdownItem from 'components/v2/DropdownItem';
import ContentCard from '../../../../../../components/ContentCard';
import AddContractModal from '../../../../../Contracts/containers/Add';
import EditModal from '../../../../../ProductDeploy/containers/Edit';
import moment from 'moment';
import { editContract } from '../../../../../Contracts/controls/actions';
import { getApproveStageStr } from '../../../../utils';
import ApproveModal from '../../../../containers/ApproveModal';

export default class ProductDeploy extends Component {
  state = {
    showEditModal: false,
    editingData: {}
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };
  onContractClick(data) {
    const { findContacts, getContactsarticipant } = this.props;
    this.setState({
      editingData: data,
      showEditModal: true
    });
  }
  onSelectOperation = v => {
    const { type, item } = v;

    if (type === 'edit') {
      this.setState({
        showEditModal: true,
        editingData: item
      });
    }
  };

  onClickDeployName = v => {
    this.setState({
      showEditModal: true,
      editingData: v
    });
  };

  showApproveModal = (customerId, deployId, deployType) => {
    this.setState({
      showApproveModal: true,
      approveData: { customerId, deployId, deployType }
    });
  };

  onSaveEdit = () => {
    const { onUpdated } = this.props;
    this.setState(
      {
        showEditModal: false
      },
      () => {
        onUpdated();
      }
    );
  };

  onSaveApprove = () => {
    const { onUpdated } = this.props;
    this.setState(
      {
        showApproveModal: false
      },
      () => {
        onUpdated();
      }
    );
  };

  operationData = o => {
    const { userRights } = this.props;
    const options = [];
    if (userRights.CUSTOMER_DEPLOYMENT_EDIT) {
      options.push({
        label: i18n['customer.detail.edit'],
        type: 'edit',
        item: o
      });
    }

    return options;
  };

  syncApproveStage = () => {
    const {
      syncApproveStage,
      onUpdated,
      customerDetailInfo: { customerId }
    } = this.props;
    syncApproveStage({ customerId, auditType: 'DEPLOY' }).then(res => {
      const { result } = res;

      result && onUpdated();

      return res;
    });
  };

  render() {
    const { showEditModal, showApproveModal, editingData } = this.state;
    const {
      customerDetailInfo,
      customerDetailInfo: { enabled, isLost },
      userRights,
      deployListOfCustomer: dataList
    } = this.props;

    const editEnabled = enabled && !isLost;
    return (
      <div>
        {userRights.CUSTOMER_DEPLOYMENT_VIEW ? (
          <ContentCard limit={4}>
            <ContentCard.Header
              title={
                <FormattedMessage
                  id="customer.detail.contract_title"
                  defaultMessage={i18n['customer.detail.product_deploy_title']}
                  values={{ number: `${dataList.length}` }}
                />
              }
              icon="fa fa fa-contract"
              iconClassName={cs['hearder-icon']}
            >
              <ContentCard.Tools>
                <Button
                  className={`${cs['add-button']} ${cs['sync-button']}`}
                  onClick={this.syncApproveStage}
                >
                  {i18n['customer.approve.button.sync']}
                </Button>
              </ContentCard.Tools>
            </ContentCard.Header>
            {userRights.CUSTOMER_DEPLOYMENT_VIEW ? (
              <ContentCard.Body className={cs['staff-list']}>
                {dataList.map((o, index) => {
                  const {
                    stage = 1,
                    stageName,
                    deployTypeName,
                    productDeploy = {}
                  } = o;
                  const { payTime, deployTime, period } = productDeploy;
                  const contact = o.contracts;
                  return (
                    <div className={cs['staff-item']} key={index}>
                      <div className={cs['staff-item-container']}>
                        <div className={cs['straff-box']}>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.deploy_field.scheme']}
                            </span>
                            <a
                              className={`${
                                cs['straff-name-label']
                              } main-color`}
                              title={deployTypeName}
                              href="javascript:void(0);"
                              onClick={this.onClickDeployName.bind(this, o)}
                            >
                              {deployTypeName}
                            </a>
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.deploy_field.state']}
                            </span>
                            <div className={cs[`stage-${stage}`]}>
                              {stageName}
                            </div>
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.deploy_field.time']}
                            </span>
                            {!!deployTime &&
                              moment(deployTime).format('YYYY-MM-DD')}
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.deploy_field.period']}
                            </span>
                            {period}
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.deploy_field.expect_billing_time'
                                ]
                              }
                            </span>
                            {!!payTime && moment(payTime).format('YYYY-MM-DD')}
                          </div>
                        </div>
                        {editEnabled ? (
                          <DropdownItem
                            onSelect={this.onSelectOperation}
                            className={cs['dropdown-button']}
                            right
                            data={this.operationData(o)}
                          >
                            <span
                              className={`fa fa-sort-down ${
                                cs['dropdown-icon']
                              }`}
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
            ) : (
              undefined
            )}
          </ContentCard>
        ) : (
          undefined
        )}
        {showEditModal ? (
          <EditModal
            show={showEditModal}
            onSave={this.onSaveEdit}
            disabled={!editEnabled || !userRights.CUSTOMER_DEPLOYMENT_EDIT}
            approvable={userRights.CUSTOMER_DEPLOYMENT_APPROVAL}
            onHide={this.toggleModal.bind(this, 'Edit', false)}
            initialValues={editingData}
            showApproveModal={this.showApproveModal}
          />
        ) : (
          undefined
        )}
        {showApproveModal && (
          <ApproveModal
            show={showApproveModal}
            onSave={this.onSaveApprove}
            onHide={this.toggleModal.bind(this, 'Approve', false)}
            initialValues={{
              ...this.state.approveData,
              auditType: 'DEPLOY',
              approveType: i18n['customer.approve_field.type.deploy']
            }}
          />
        )}
      </div>
    );
  }
}
