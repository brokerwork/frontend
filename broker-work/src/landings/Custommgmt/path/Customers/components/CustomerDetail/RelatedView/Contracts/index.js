import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Table, Button } from 'lean-ui';
import DropdownItem from 'components/v2/DropdownItem';
import ContentCard from '../../../../../../components/ContentCard';
import AddContractModal from '../../../../../Contracts/containers/Add';
import EditContractModal from '../../../../../Contracts/containers/Edit';
import moment from 'moment';
import { editContract } from '../../../../../Contracts/controls/actions';
import { getApproveStageStr } from '../../../../utils';
import ApproveModal from '../../../../containers/ApproveModal';

export default class Contracts extends Component {
  state = {
    showAddContractModal: false,
    showEditContactModal: false,
    editingContract: {}
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };
  onContractClick(data) {
    const { findContacts, getContactsarticipant } = this.props;
    this.setState({
      editingContract: data,
      showEditContactModal: true
    });
  }
  ContractOperation = v => {
    const {
      showTipsModal,
      showTopAlert,
      removeContract,
      onUpdated,
      customerDetailInfo,
      getCustomerParticipant
    } = this.props;
    const { type, item } = v;

    if (type === 'edit') {
      this.setState({
        showEditContactModal: true,
        editingContract: item
      });
    }

    if (type === 'remove') {
      showTipsModal({
        content: i18n['customer.detail.remove_tips'],
        onConfirm: cb => {
          cb();
          removeContract(customerDetailInfo.customerId, item.contractsId).then(
            ({ result }) => {
              if (result) {
                showTopAlert({
                  content: i18n['general.remove_success'],
                  bsStyle: 'success'
                });
                onUpdated();
              }
            }
          );
        }
      });
    }
  };

  showApproveModal = (customerId, contractsId) => {
    this.setState({
      showApproveModal: true,
      approveData: { customerId, contractsId }
    });
  };

  createContract = () => {
    const { onUpdated, customerDetailInfo } = this.props;

    this.setState(
      {
        showAddContractModal: false
      },
      () => {
        onUpdated();
      }
    );
  };

  EditContact = () => {
    const { onUpdated, customerDetailInfo } = this.props;

    this.setState(
      {
        showEditContactModal: false
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

  ContractOptions = o => {
    const { userRights } = this.props;
    const ContractOptions = [];
    if (userRights.CUSTOMER_CONTRACT_EDIT) {
      ContractOptions.push({
        label: i18n['customer.detail.edit'],
        type: 'edit',
        item: o
      });
    }

    if (userRights.CUSTOMER_CONTRACT_DELETE) {
      ContractOptions.push({
        label: i18n['customer.detail.remove'],
        type: 'remove',
        item: o
      });
    }
    return ContractOptions;
  };

  syncApproveStage = () => {
    const {
      syncApproveStage,
      onUpdated,
      customerDetailInfo: { customerId }
    } = this.props;
    syncApproveStage({ customerId, auditType: 'CONTRACTS' }).then(res => {
      const { result } = res;

      result && onUpdated();

      return res;
    });
  };

  render() {
    const {
      showAddContractModal,
      showEditContactModal,
      showApproveModal,
      editingContract
    } = this.state;
    const {
      customerDetailInfo,
      customerDetailInfo: { enabled, isLost },
      userRights,
      ContractTypeList,
      contractListOfCustomer: contractList,
      productList,
      bindedSaleOpp //绑定单一销售机会
    } = this.props;

    const addInitialValue = {
      customerId: customerDetailInfo.customerId,
      customerName: customerDetailInfo.customName,
      hasMediator: false,
      associates: false
    };
    const disabledOpIds = contractList.map(item => {
      return item.contracts.opportunityId;
    });
    const editEnabled = enabled && !isLost;
    return (
      <div>
        {userRights.CUSTOMER_CONTRACT ? (
          <ContentCard limit={4}>
            <ContentCard.Header
              title={
                <FormattedMessage
                  id="customer.detail.contract_title"
                  defaultMessage={i18n['customer.detail.contract_title']}
                  values={{ number: `${contractList.length}` }}
                />
              }
              icon="contact"
              iconClassName={cs['contact']}
            >
              <ContentCard.Tools>
                {' '}
                {userRights.CUSTOMER_CONTRACT_ADD &&
                editEnabled &&
                !(bindedSaleOpp && contractList.length) ? (
                  <div>
                    <Button
                      className={`${cs['add-button']} ${cs['sync-button']}`}
                      onClick={this.syncApproveStage}
                    >
                      {i18n['customer.approve.button.sync']}
                    </Button>
                    <Button
                      className={cs['add-button']}
                      onClick={this.toggleModal.bind(this, 'AddContract', true)}
                    >
                      {i18n['customer.detail.create']}
                    </Button>
                  </div>
                ) : (
                  undefined
                )}
              </ContentCard.Tools>
            </ContentCard.Header>
            {userRights.CUSTOMER_CONTRACT_SELECT ? (
              <ContentCard.Body className={cs['staff-list']}>
                {contractList.map((o, index) => {
                  const { stage = 1 } = o;
                  const contact = o.contracts;
                  return (
                    <div className={cs['staff-item']} key={index}>
                      <div className={cs['staff-item-container']}>
                        <div className={cs['straff-box']}>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.contract_field.contract_no_label'
                                ]
                              }
                            </span>
                            <div className={cs['straff-name']}>
                              <a
                                className={`${
                                  cs['straff-name-label']
                                } main-color`}
                                title={contact.contracstNo}
                                href="javascript:void(0);"
                                onClick={this.onContractClick.bind(this, o)}
                              >
                                {contact.contracstNo}
                              </a>
                            </div>
                          </div>
                          {/* <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.detail.opp_type_label']}
                            </span>
                            {ContractTypeListObj[o.ContractType]}
                          </div> */}
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.contract_field.contract_date']}
                            </span>
                            {contact.startTime &&
                              moment(contact.startTime).format(
                                'YYYY-MM-DD'
                              )}{' '}
                            {contact.startTime || contact.endTime
                              ? '~ '
                              : undefined}
                            {contact.endTime &&
                              moment(contact.endTime).format('YYYY-MM-DD')}
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.contract_field.contract_products_label'
                                ]
                              }
                            </span>
                            {contact.products
                              .map(productKey => {
                                const matchedProduct = productList.find(
                                  p => p.value === productKey
                                );
                                return (
                                  (matchedProduct && matchedProduct.label) ||
                                  productKey
                                );
                              })
                              .join(', ')}
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.contract_field.contract_amount_label'
                                ]
                              }
                            </span>
                            ${contact.totalAmount}
                          </div>
                        </div>
                        {editEnabled ? (
                          <DropdownItem
                            onSelect={this.ContractOperation}
                            className={cs['dropdown-button']}
                            right
                            data={this.ContractOptions(o)}
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
        {showAddContractModal ? (
          <AddContractModal
            show={showAddContractModal}
            disabledOpIds={disabledOpIds}
            onSave={this.createContract}
            showApproveModal={this.showApproveModal}
            bindedSaleOpp={bindedSaleOpp}
            onHide={this.toggleModal.bind(this, 'AddContract', false)}
            initialValues={addInitialValue}
          />
        ) : (
          undefined
        )}
        {showEditContactModal ? (
          <EditContractModal
            show={showEditContactModal}
            onSave={this.EditContact}
            showApproveModal={this.showApproveModal}
            bindedSaleOpp={bindedSaleOpp}
            disabledOpIds={disabledOpIds.filter(id => {
              if (!editingContract.contracts) return true;
              else {
                return id !== editingContract.contracts.opportunityId;
              }
            })}
            disabled={!editEnabled || !userRights.CUSTOMER_CONTRACT_EDIT}
            onHide={this.toggleModal.bind(this, 'EditContact', false)}
            initialValues={editingContract}
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
              auditType: 'CONTRACTS',
              approveType: i18n['customer.approve_field.type.contract']
            }}
          />
        )}
      </div>
    );
  }
}
