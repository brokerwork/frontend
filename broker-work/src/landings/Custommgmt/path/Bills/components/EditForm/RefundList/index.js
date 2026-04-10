import ContentCard from '../../../../../components/ContentCard';
import cs from './index.less';
import i18n from 'utils/i18n';
import NoDataView from 'components/NoDataView';
import AddRefund from './Add';
import EditRefund from './Edit';
import DropdownItem from 'components/DropdownItem';
import moment from 'moment';
import { getImageValue } from 'utils/fieldValue';
import { getApproveStageStr } from '../../../../Customers/utils';
import ApproveModal from '../../../../Customers/containers/ApproveModal';
import { FUND_TYPE_LIST } from './contants';
import { Button } from 'lean-ui';

export default class Refunds extends Component {
  state = {
    editingRefund: undefined,
    showAddModal: false,
    showEditModal: false,
    showApproveModal: false
  };
  componentDidMount() {
    const {
      match: { params },
      getRefundList,
      refundList,
      type
    } = this.props;
    if (type === 'edit') {
      this.getList();
    }
  }
  componentWillUnmount() {
    const { clearRefundList } = this.props;
    clearRefundList();
  }

  onRefundClick(data) {
    const { getrefundarticipant } = this.props;
    this.setState(
      {
        editingRefund: data
      },
      () => {
        this.toggleModal('Edit', true);
      }
    );
  }

  refundOperation = v => {
    const {
      showTipsModal,
      showTopAlert,
      removeRefund,
      getCustomerDetail,
      customerDetailInfo,
      getCustomerParticipant
    } = this.props;
    const { type, data } = v;

    if (type === 'edit') {
      this.setState({
        showEditModal: true,
        editingRefund: data
      });
    }

    if (type === 'remove') {
      showTipsModal({
        content: i18n['customer.detail.remove_tips'],
        onConfirm: cb => {
          cb();
          removeRefund(data.customerId, data.refundId).then(({ result }) => {
            if (result) {
              showTopAlert({
                content: i18n['general.remove_success'],
                bsStyle: 'success'
              });
              this.onSave();
            }
          });
        }
      });
    }
  };

  refundCreateOptions = o => {
    const { userRights } = this.props;
    let refundOptions = [];
    if (userRights.CUSTOMER_BILLPAYMENT_EDITPAYMENT) {
      refundOptions.push({
        label: i18n['customer.detail.edit'],
        type: 'edit',
        data: o
      });
    }
    if (userRights.CUSTOMER_BILLPAYMENT_DELETEPAYMENT) {
      refundOptions.push({
        label: i18n['customer.detail.remove'],
        type: 'remove',
        data: o
      });
    }

    return refundOptions;
  };

  getList = () => {
    const {
      match: { params },
      getRefundList,
      refundList,
      enable = true
    } = this.props;
    getRefundList(params.customerId, params.billId, enable);
  };
  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };
  onSave = () => {
    this.toggleModal('Add', false);
    this.toggleModal('Edit', false);
    this.getList();
  };

  onSaveApprove = () => {
    this.setState(
      {
        showApproveModal: false
      },
      () => {
        const {
          getBillDetail,
          getIsLostCustomer,
          match: { params },
          getRefundList,
          refundList,
          enable = true
        } = this.props;
        getBillDetail(params.billId, params.customerId, enable).then(res => {
          if (res.result) {
            getIsLostCustomer(params.customerId);
          }
        });
        getRefundList(params.customerId, params.billId, enable);
      }
    );
  };

  showApproveModal = (customerId, refundId) => {
    this.setState({
      showApproveModal: true,
      approveData: { customerId, refundId }
    });
  };
  render() {
    const {
      refundList,
      type,
      userRights,
      enable,
      customerDetailInfo,
      isLostCustomer
    } = this.props;
    const {
      showAddModal,
      showEditModal,
      showApproveModal,
      editingRefund
    } = this.state;

    // Object.keys(customerDetailInfo).length && customerDetailInfo.isLost;
    return (
      <div>
        <ContentCard>
          <ContentCard.Header border>
            <ContentCard.Title>
              {i18n['customer.bill.refund.title']}
            </ContentCard.Title>
            <ContentCard.Tools>
              {userRights.CUSTOMER_BILLPAYMENT_ADDPAYMENT &&
              enable &&
              !isLostCustomer ? (
                <Button
                  disabled={type === 'add'}
                  type="primary"
                  data-test="add-button"
                  onClick={this.toggleModal.bind(this, 'Add', true)}
                >
                  {i18n['customer.detail.create']}
                </Button>
              ) : (
                undefined
              )}
            </ContentCard.Tools>
          </ContentCard.Header>
          {userRights.CUSTOMER_BILLPAYMENT_SELECTPAYMENT ? (
            <ContentCard.Body>
              {refundList && refundList.length ? (
                refundList.map((o, index) => {
                  const { stage, refund: refundData } = o;
                  return (
                    <div key={index} className={cs['staff-item']}>
                      <div className={cs['straff-box']}>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.refund_no']}：
                          </span>
                          {refundData.refundNo}
                          <span
                            className={`${cs['stage-' + stage]} ${
                              cs['stage-refund']
                            }`}
                          >
                            {`(${getApproveStageStr(stage)})`}
                          </span>
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.date']}：
                          </span>
                          <div className={cs['straff-name']}>
                            {refundData.refundDate &&
                              moment(refundData.refundDate).format(
                                'YYYY-MM-DD'
                              )}
                          </div>
                        </div>
                        <div
                          className={`${cs['staff-item-row']} 
                          ${cs['row-half']}`}
                        >
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.amount']}：
                          </span>
                          {refundData.refundCurrency} {refundData.refundAmount}
                        </div>
                        <div
                          className={`${cs['staff-item-row']} 
                          ${cs['row-half']}`}
                        >
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.exchangeRate']}：
                          </span>
                          {refundData.exchangeRate}
                        </div>
                        <div className={`${cs['staff-item-row']}`}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.actual_amount']}：
                          </span>
                          {refundData.actualCurrency} {refundData.actualAmount}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.hasMediator']}：
                          </span>
                          {
                            i18n[
                              `general.${refundData.hasMediator ? 'yes' : 'no'}`
                            ]
                          }
                        </div>
                        {!!refundData.hasMediator && (
                          <div
                            className={`${cs['staff-item-row']}
                          ${cs['row-half']}`}
                          >
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.bill_field.mediatorName']}：
                            </span>
                            {refundData.mediatorName}
                          </div>
                        )}
                        {!!refundData.hasMediator && (
                          <div
                            className={`${cs['staff-item-row']}
                          ${cs['row-half']}`}
                          >
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.bill_field.mediatorRate']}：
                            </span>
                            {refundData.mediatorRate}
                          </div>
                        )}
                        <div
                          className={`${cs['staff-item-row']} 
                          ${cs['row-half']}`}
                        >
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.cost']}：
                          </span>
                          {refundData.cost ? `RMB ${refundData.cost}` : ''}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.profit']}：
                          </span>
                          {refundData.profit ? `RMB ${refundData.profit}` : ''}
                        </div>

                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.fundType']}：
                          </span>
                          {refundData.fundType &&
                            FUND_TYPE_LIST.find(
                              item => item.value === refundData.fundType
                            ).label}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.type']}：
                          </span>
                          {refundData.refundType}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.pay_name']}：
                          </span>
                          {refundData.payName}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.pay_account']}：
                          </span>
                          {refundData.payAccount}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.pay_bank']}：
                          </span>
                          {refundData.payBank}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.comment']}：
                          </span>
                          {refundData.refundComment}
                        </div>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.bill_field.certificates']}：
                          </span>
                          <div className={cs['staff-item-content']}>
                            {Array.isArray(refundData.certificates) &&
                              refundData.certificates.map((item, i) => (
                                <div key={i}>{getImageValue(item)}</div>
                              ))}
                          </div>
                        </div>
                      </div>
                      {enable && !isLostCustomer ? (
                        <DropdownItem
                          onSelect={this.refundOperation}
                          className={cs['dropdown-button']}
                          right
                          data={this.refundCreateOptions(o)}
                        >
                          <span
                            className={`fa fa-sort-down ${cs['dropdown-icon']}`}
                          />
                        </DropdownItem>
                      ) : (
                        undefined
                      )}
                    </div>
                  );
                })
              ) : (
                <NoDataView
                  className={cs['no-data']}
                  text={
                    type === 'add' && i18n['customer.bill.refund.need_new_data']
                  }
                />
              )}
            </ContentCard.Body>
          ) : (
            undefined
          )}
        </ContentCard>
        {showAddModal ? (
          <AddRefund
            {...this.props}
            showApproveModal={this.showApproveModal}
            onSave={this.onSave}
            onHide={this.toggleModal.bind(this, 'Add', false)}
          />
        ) : (
          undefined
        )}
        {showEditModal ? (
          <EditRefund
            {...this.props}
            showApproveModal={this.showApproveModal}
            onSave={this.onSave}
            data={editingRefund}
            onHide={this.toggleModal.bind(this, 'Edit', false)}
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
              auditType: 'REFUND',
              approveType: i18n['customer.approve_field.type.refund']
            }}
          />
        )}
        {/* {showEditModal ? <EditRefund /> : undefined} */}
      </div>
    );
  }
}
