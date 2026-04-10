import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Button } from 'lean-ui';
import DropdownItem from 'components/v2/DropdownItem';
import ContentCard from '../../../../../../components/ContentCard';
import AddBillModal from '../../../../../Bills/containers/Add';
import moment from 'moment';
import iframeView from 'utils/iframeView';
import EditBill from '../../../../../Bills/containers/Edit';
import math from 'utils/math';
export default class Bills extends Component {
  state = {
    showAddBillModal: false,
    showEditContactModal: false
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  createBill = () => {
    const {
      match: { url },
      history: { push },
      customerDetailInfo
    } = this.props;

    const creatUrl = !!customerDetailInfo.introducer
      ? `${url}/bill`
      : `${url}/bill?introducer=${customerDetailInfo.introducer}`;
    push(creatUrl);
  };

  editBill = data => {
    const {
      match: { url },
      history: { push },
      customerDetailInfo
    } = this.props;
    const editUrl = !!customerDetailInfo.introducer
      ? `${url}/bill/${data.billId}?enable=${
          customerDetailInfo.enabled
        }&introducer=${customerDetailInfo.introducer}`
      : `${url}/bill/${data.billId}?enable=${customerDetailInfo.enabled}`;

    push(editUrl);
  };

  BillOperation = v => {
    const {
      showTipsModal,
      showTopAlert,
      removeBill,
      getCustomerDetail,
      customerDetailInfo,
      getCustomerParticipant
    } = this.props;
    const { type, item } = v;

    if (type === 'edit') {
      this.editBill(item);
    }

    if (type === 'remove') {
      showTipsModal({
        content: i18n['customer.detail.remove_tips'],
        onConfirm: cb => {
          cb();
          removeBill(customerDetailInfo.customerId, item.billId).then(
            ({ result }) => {
              if (result) {
                showTopAlert({
                  content: i18n['general.remove_success'],
                  bsStyle: 'success'
                });
                getCustomerDetail();
              }
            }
          );
        }
      });
    }
    if (type === 'export') {
      showTipsModal({
        content: (
          <EditBill
            justForm={true}
            customerId={customerDetailInfo.customerId}
            billId={item.billId}
            {...this.props}
          />
        ),
        header: '发送账单',
        className: cs['export-modal'],
        onConfirm: cb => {
          cb();
          iframeView(
            `/exportBill/${customerDetailInfo.customerId}/${item.billId}`
          );
        },
        confirmBtnText: '导出PDF'
      });
    }
  };

  EditContact = () => {
    const { getCustomerDetail, customerDetailInfo } = this.props;

    this.setState(
      {
        showEditContactModal: false
      },
      () => {
        getCustomerDetail();
      }
    );
  };

  BillOptions = o => {
    const {
      userRights,
      customerDetailInfo: { isLost }
    } = this.props;
    const BillOptions = [];

    if (userRights.CUSTOMER_BILLPAYMENT_EDITBILL && !isLost) {
      BillOptions.push({
        label: i18n['customer.detail.edit'],
        type: 'edit',
        item: o
      });
    }

    if (userRights.CUSTOMER_BILLPAYMENT_DELETEBILL && !isLost) {
      BillOptions.push({
        label: i18n['customer.detail.remove'],
        type: 'remove',
        item: o
      });
    }
    BillOptions.push({
      label: '发送账单',
      type: 'export',
      item: o
    });

    return BillOptions;
  };

  syncApproveStage = () => {
    const {
      syncApproveStage,
      onUpdated,
      customerDetailInfo: { customerId }
    } = this.props;
    syncApproveStage({ customerId, auditType: 'REFUND' }).then(res => {
      const { result } = res;

      result && onUpdated();

      return res;
    });
  };

  render() {
    const { showAddBillModal, showEditContactModal, editingBill } = this.state;
    const {
      customerDetailInfo,
      customerDetailInfo: { enabled, isLost },
      userRights,
      billListOfCustomer: billList,
      productList
    } = this.props;

    const customerInfo = {
      customerId: customerDetailInfo.customerId,
      customerName: customerDetailInfo.customName
    };
    return (
      <div>
        {userRights.CUSTOMER_BILLPAYMENT ? (
          <ContentCard limit={4}>
            <ContentCard.Header
              title={
                <FormattedMessage
                  id="customer.detail.bill_title"
                  defaultMessage={i18n['customer.detail.bill_title']}
                  values={{ number: `${billList.length}` }}
                />
              }
              icon="fa fa fa-bill"
              iconClassName={cs['hearder-icon']}
            >
              <ContentCard.Tools>
                {' '}
                {userRights.CUSTOMER_BILLPAYMENT_ADDBILL &&
                enabled &&
                !isLost ? (
                  <div>
                    <Button
                      className={`${cs['add-button']} ${cs['sync-button']}`}
                      onClick={this.syncApproveStage}
                    >
                      {i18n['customer.approve.button.sync']}
                    </Button>
                    <Button
                      className={cs['add-button']}
                      onClick={this.createBill}
                    >
                      {i18n['customer.detail.create']}
                    </Button>
                  </div>
                ) : (
                  undefined
                )}
              </ContentCard.Tools>
            </ContentCard.Header>
            {userRights.CUSTOMER_BILLPAYMENT_SELECTBILL ? (
              <ContentCard.Body className={cs['staff-list']}>
                {billList.map((o, index) => {
                  const bill = o.bill;
                  const totalAmount = getFixedNumber(
                    bill.invoices &&
                      bill.invoices.reduce((total, item) => {
                        return total + getFixedNumber(item.extendedPrice);
                      }, 0)
                  );
                  const discount = getFixedNumber(bill.discount);
                  const taxRate = getFixedNumber(bill.taxRate);
                  const accountTotalAmount =
                    bill.totalAmount ||
                    getFixedNumber(
                      totalAmount * (1 - discount / 100) * (1 + taxRate / 100)
                    );
                  return (
                    <div className={cs['staff-item']} key={index}>
                      <div className={cs['staff-item-container']}>
                        <div className={cs['straff-box']}>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.bill_field.bill_no_label']}
                            </span>
                            <div className={cs['straff-name']}>
                              <a
                                className={`${
                                  cs['straff-name-label']
                                } main-color`}
                                title={bill.billNo}
                                href="javascript:void(0);"
                                onClick={this.editBill.bind(this, o)}
                              >
                                {bill.billNo}
                              </a>
                            </div>
                          </div>
                          {/* <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.opp_type_label']}
                          </span>
                          {BillTypeListObj[o.BillType]}
                        </div> */}
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.bill_field.account_total_amount_label'
                                ]
                              }
                            </span>
                            $ {accountTotalAmount}
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.bill_field.refunded_amount_label'
                                ]
                              }
                            </span>
                            ${o.totalRefundAmount}
                          </div>
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {
                                i18n[
                                  'customer.bill_field.not_refunded_amount_label'
                                ]
                              }
                            </span>
                            $
                            {math.sub(
                              accountTotalAmount,
                              o.totalRefundAmount || 0
                            )}
                          </div>
                        </div>
                        {enabled ? (
                          <DropdownItem
                            onSelect={this.BillOperation}
                            className={cs['dropdown-button']}
                            right
                            data={this.BillOptions(o)}
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
      </div>
    );
  }
}

function getFixedNumber(number) {
  const __number = Number(number) || 0;
  return (__number && Number(__number.toFixed(2))) || 0;
}
