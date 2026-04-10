import ContentCard from '../../../../../components/ContentCard';
import cs from './index.less';
import { Table, Button } from 'react-bootstrap';
import logo from './logo.png';
import i18n from 'utils/i18n';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { renderField, required } from 'utils/renderField';
import InvoicesField from './ArrayFields/InvoicesField';
import payInfosField from './ArrayFields/payInfosField';
import { deepCopy } from 'utils/simpleDeepCopy';
import math from 'utils/math';
import html2canvas from 'utils/html2canvas';
import { findDOMNode } from 'react-dom';
import jsPDF from 'jspdf';
import iframeView from 'utils/iframeView';
import ToggleField from './ToggleField';
export const styleProps = {
  colClassName: cs['col'],
  columns: 12
};

export const stylePropsInput = {
  ...styleProps,
  className: cs['input']
};

export const stylePropsDropDown = {
  ...styleProps,
  className: cs['dropdown'],
  dropdownIcon: 'fa fa-angle-down'
};

export const stylePropsDatePicker = {
  ...styleProps,
  unDeletable: true,
  className: cs['date-picker']
};

export const BILL_FORM = 'BILL_FORM';

class MyForm extends Component {
  render() {
    const {
      totalAmount,
      refundAmount,
      discount,
      taxRate,
      accountTotalAmount,
      onSubmit,
      initialValues,
      productList,
      onCancel,
      justForm,
      billFormValues,
      change: changeFormValue,
      trigerChange
    } = this.props;
    return (
      <div className={cs['bill-form-paper']}>
        <div className={`${cs['bill-form-header']} main-color-bg`}>
          <img src={logo} />
        </div>
        <div className={cs['bill-form-body']}>
          <div className={cs['main-info']}>
            <div className={cs['main-info-item']}>
              <div className={cs['main-info-label']}>
                {i18n['customer.bill.to']}
              </div>
              <div className={cs['main-info-content']}>
                <ToggleField
                  name="to"
                  component={renderField}
                  type="textField"
                  validate={required}
                  {...stylePropsInput}
                  disabled={justForm}
                />
              </div>
            </div>
            <div className={cs['main-info-item']}>
              <div className={cs['main-info-label']}>
                {i18n['customer.bill.to_address']}
              </div>
              <div className={cs['main-info-content']}>
                <ToggleField
                  name="toAddress"
                  component={renderField}
                  type="textField"
                  validate={required}
                  {...stylePropsInput}
                  disabled={justForm}
                />
              </div>
            </div>
            <div className={cs['main-info-item']}>
              <div className={cs['main-info-label']}>
                {i18n['customer.bill.invoice_date']}
              </div>
              <div className={cs['main-info-content']}>
                <ToggleField
                  name="invoiceDate"
                  component={renderField}
                  type="dateField"
                  validate={required}
                  {...stylePropsDatePicker}
                  disabled={justForm}
                />
              </div>
            </div>
            <div className={cs['main-info-item']}>
              <div className={cs['main-info-label']}>
                {i18n['customer.bill.exp_date']}
              </div>
              <div className={cs['main-info-content']}>
                <ToggleField
                  name="expDate"
                  component={renderField}
                  type="dateField"
                  validate={required}
                  {...stylePropsDatePicker}
                  disabled={justForm}
                />
              </div>
            </div>
          </div>
          <FieldArray
            name="invoices"
            initialValues={initialValues}
            productList={productList}
            component={InvoicesField}
            validate={value => {
              if (!(value && value.length))
                return i18n['customer.bill.invoice_error'];
            }}
            billFormValues={billFormValues}
            changeFormValue={changeFormValue}
            trigerChange={trigerChange}
            justForm={justForm}
          />
          <div className={cs['invoice-info-money']}>
            <div className={cs['info-money-item']}>
              <div
                className={`${justForm ? cs['money-default'] : ''}  ${cs[
                  'input-group'
                ]}`}
              >
                <div>
                  {i18n['customer.bill.discount']}
                  <ToggleField
                    name="discount"
                    component={renderField}
                    type="numberField"
                    {...stylePropsInput}
                    disabled={justForm}
                    /* colClassName={`${cs['col']} ${cs['number-col']}`} */
                  />
                  %
                </div>
              </div>
            </div>
            <div className={cs['info-money-item']}>
              <div
                className={`${justForm ? cs['money-default'] : ''}  ${cs[
                  'input-group'
                ]}`}
              >
                <div>
                  {i18n['customer.bill.tax_rate']}
                  <ToggleField
                    name="taxRate"
                    component={renderField}
                    type="numberField"
                    {...stylePropsInput}
                    disabled={justForm}
                    /* colClassName={`${cs['col']} ${cs['number-col']}`} */
                  />
                  %
                </div>
              </div>
            </div>
            <div className={cs['info-money-item']}>
              <div className={cs['money-default']}>
                <label>{i18n['customer.bill_field.total_amount_label']}</label>
                <span>${totalAmount}</span>
              </div>
            </div>
            <div className={cs['info-money-item']}>
              <div className={`${cs['money-main']} main-color`}>
                <label>
                  {i18n['customer.bill_field.account_total_amount_label']}
                </label>
                <span>${accountTotalAmount}</span>
              </div>
            </div>
            <div className={cs['info-money-item']}>
              <div className={cs['money-success']}>
                <label>
                  {' '}
                  {i18n['customer.bill_field.refunded_amount_label']}
                </label>
                <span>${refundAmount}</span>
              </div>
            </div>
            <div className={cs['info-money-item']}>
              <div className={cs['money-danger']}>
                <label>
                  {' '}
                  {i18n['customer.bill_field.not_refunded_amount']}
                </label>
                <span>
                  ${getFixedNumber(accountTotalAmount - refundAmount)}
                </span>
              </div>
            </div>
          </div>
          <FieldArray
            name="payInfos"
            component={payInfosField}
            justForm={justForm}
          />

          <div className={cs['block-title']} />
          <div className={cs['main-info']}>
            <div className={cs['main-info-item']}>
              <div className={cs['main-info-label']}>
                {i18n['customer.bill.from']}
              </div>
              <div className={cs['main-info-content']}>
                <ToggleField
                  name="from"
                  component={renderField}
                  type="textField"
                  validate={required}
                  {...stylePropsInput}
                  disabled={justForm}
                />
              </div>
            </div>
            <div className={cs['main-info-item']}>
              <div className={cs['main-info-label']}>
                {i18n['customer.bill.from_address']}
              </div>
              <div className={cs['main-info-content']}>
                <ToggleField
                  name="fromAddress"
                  component={renderField}
                  type="textField"
                  validate={required}
                  {...stylePropsInput}
                  disabled={justForm}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const EditForm = reduxForm({
  form: BILL_FORM,
  enableReinitialize: true,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  }
})(MyForm);

export default class BillForm extends Component {
  state = {
    totalAmount: 0,
    accountTotalAmount: 0,
    refundAmount:
      (this.props.billDetail && this.props.billDetail.totalRefundAmount) || 0,
    downloaded: false
  };
  componentDidMount() {
    const { initialValues, type, refundList } = this.props;
    if (type === 'edit') {
      this.onFormChange(initialValues);
      this.updateRefunds(refundList);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { refundList } = this.props;
    const { refundList: nextRefundList } = nextProps;
    setTimeout(() => {
      this.updateRefunds(nextRefundList);
    });
  }
  updateRefunds = list => {
    const { exportDataReady, match: { url } } = this.props;
    const { refundAmount, downloaded } = this.state;
    const newRefundAmount = list.reduce(
      (total, item) => math.add(total, Number(item.refund.refundAmount)),
      0
    );
    if (url.includes('exportBill') && exportDataReady && !downloaded) {
      this.setState({
        downloaded: true
      });
      setTimeout(() => {
        this.exportPDF();
      });
    }
    if (refundAmount !== newRefundAmount && !url.includes('exportBill')) {
      this.setState({
        refundAmount: newRefundAmount
      });
    }
  };
  onFormChange = data => {
    const { refundList } = this.props;
    const totalAmount = getFixedNumber(
      data.invoices &&
        data.invoices.reduce((total, item) => {
          return math.add(total, getFixedNumber(item.extendedPrice));
        }, 0)
    );
    const discount = getFixedNumber(data.discount);
    const taxRate = getFixedNumber(data.taxRate);
    const accountTotalAmount = getFixedNumber(
      math.mul(
        totalAmount,
        math.mul(
          math.sub(1, math.div(discount, 100)),
          math.add(1, math.div(taxRate, 100))
        )
      )
    );
    this.setState({
      totalAmount,
      discount,
      taxRate,
      accountTotalAmount
    });
  };

  onSubmit = data => {
    const result = formatMoment(data);
    return result;
  };
  onSubmitSuccess = data => {
    const { onSave } = this.props;
    const { accountTotalAmount } = this.state;
    if (onSave) {
      const submitData = {
        ...data,
        totalAmount: accountTotalAmount
      };
      onSave(submitData);
    }
  };
  onSubmitForm = () => {
    const { submitForm } = this.props;
    submitForm(BILL_FORM);
  };
  exportPDF = step1 => {
    const {
      showTipsModal,
      initialValues,
      match: { url, params },
      enable
    } = this.props;
    if (step1) {
      this.setState({
        downloading: true
      });
      iframeView(
        `/exportBill/${params.customerId}/${params.billId}?enable=${enable}`
      ).then(res => {
        this.setState({
          downloading: false
        });
      });
      // window.open(`/exportBill/${params.customerId}/${params.billId}`);
    } else {
      const exportContent = findDOMNode(this.refs.edit);
      html2canvas(exportContent, {
        scale: 2,
        allowTaint: true,
        onrendered: function(canvas) {
          const width = 279;
          const height = canvas.height * (width / canvas.width);
          var pageData = canvas.toDataURL('image/jpeg', 1);
          const img = new Image();
          img.src = pageData;
          var pdf = new jsPDF('', 'mm', [width, height]);
          pdf.addImage(pageData, 'JPEG', 0, 0, width, height);
          setTimeout(function() {
            pdf.save(`bill-${initialValues && initialValues.billNo}.pdf`);
            if (window.IFRAME_DONE) {
              setTimeout(() => {
                IFRAME_DONE();
              }, 100);
            }
          });
        }
      });
    }
  };

  render() {
    const {
      totalAmount,
      refundAmount,
      accountTotalAmount,
      downloading
    } = this.state;
    const {
      submitForm,
      initialValues,
      productList,
      onCancel,
      justForm,
      userRights,
      type,
      enable,
      billFormValues,
      changeFormValue,
      isLostCustomer
    } = this.props;
    const isDisabled =
      (type === 'edit' && !userRights.CUSTOMER_BILLPAYMENT_EDITBILL) || //修改时无修改权限
      (type === 'add' && !userRights.CUSTOMER_BILLPAYMENT_ADDBILL) || //添加时无添加权限
      !enable || //被产出时
      justForm || // 用于导出预览时
      (type === 'edit' && isLostCustomer); // 流失客户
    return (
      <ContentCard
        className={`${isDisabled ? cs['f-just-form'] : ''} ${justForm
          ? cs['no-padding']
          : ''}`}
      >
        <ContentCard.Body className={cs['f-body']}>
          <div className={cs['padding-wrap']}>
            <EditForm
              {...{
                totalAmount,
                refundAmount,
                accountTotalAmount
              }}
              justForm={isDisabled}
              productList={productList}
              initialValues={initialValues}
              submitForm={submitForm}
              onChange={this.onFormChange}
              onSubmit={this.onSubmit}
              onSubmitSuccess={this.onSubmitSuccess}
              onCancel={onCancel}
              billFormValues={billFormValues}
              changeFormValue={changeFormValue}
              trigerChange={this.onFormChange}
              ref="edit"
            />
            {justForm ? (
              undefined
            ) : (
              <div className={cs['button-bar']}>
                {!isDisabled ? (
                  <Button
                    bsStyle="primary"
                    data-test="edit-button"
                    onClick={this.onSubmitForm}
                  >
                    {i18n['general.save']}
                  </Button>
                ) : (
                  undefined
                )}
                {type === 'edit' ? (
                  <Button
                    disabled={downloading}
                    bsStyle="primary"
                    className={cs['export-btn']}
                    onClick={this.exportPDF.bind(this, true)}
                  >
                    {i18n['customer.button.export_pdf']}
                    {downloading ? (
                      <i className="fa fa-circle-o-notch" />
                    ) : (
                      undefined
                    )}
                  </Button>
                ) : (
                  undefined
                )}
                <Button onClick={onCancel}> 取消</Button>
              </div>
            )}
          </div>
        </ContentCard.Body>
      </ContentCard>
    );
  }
}

function getFixedNumber(number) {
  const __number = Number(number) || 0;
  return (__number && Number(__number.toFixed(2))) || 0;
}

function formatMoment(d) {
  const data = deepCopy(d);
  return Object.keys(data).reduce((obj, key) => {
    if (data[key].format) {
      data[key] = data[key].valueOf();
    } else if (Array.isArray(data[key])) {
      data[key] = data[key].map(formatMoment);
    }
    return data;
  }, {});
}
