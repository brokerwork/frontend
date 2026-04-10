import cs from '../index.less';
import i18n from 'utils/i18n';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import {
  stylePropsInput,
  stylePropsDropDown,
  stylePropsDatePicker
} from '../index';
import { renderField, required } from 'utils/renderField';
import math from 'utils/math';
import { BILL_FORM } from '../../BillForm';
import ToggleField from '../ToggleField';
import DateRangePicker from 'components/DateRangePicker';
import moment from 'moment';
import { Button } from 'lean-ui';
class DateRangeField extends PureComponent {
  state = {
    startDate: undefined,
    endDate: undefined
  };
  componentWillReceiveProps(nextProps) {
    const {
      input: { value = {} }
    } = nextProps;
    const { startDate: nextStartDate, endDate: nextEndDate } = value;
    const { startDate, endDate } = this.state;
    if (
      (nextStartDate && startDate !== nextStartDate) ||
      (nextEndDate && endDate !== nextEndDate)
    ) {
      this.updateRange(nextStartDate, nextEndDate);
    }
  }
  componentDidMount() {
    const {
      input: { value = {} }
    } = this.props;
    const { startDate, endDate } = value;
    if (startDate && endDate) {
      this.updateRange(startDate, endDate);
    }
  }
  updateRange = (startDate, endDate) => {
    this.setState({
      startDate,
      endDate
    });
  };
  onSelect = selected => {
    const { input, onFieldChange } = this.props;
    const result = {
      startDate: selected.startDate.valueOf(),
      endDate: selected.endDate.valueOf()
    };
    this.updateRange(result.startDate, result.endDate);
    input.onChange(result);
    if (onFieldChange) {
      onFieldChange(result);
    }
  };

  render() {
    const { startDate, endDate } = this.state;
    const {
      input,
      meta: { touched, error },
      label
    } = this.props;
    const isError = touched && error;
    return (
      <div>
        <DateRangePicker
          {...this.props}
          ranges={[]}
          onApply={this.onSelect}
          startDate={startDate}
          endDate={endDate}
          className={cs['date-picker']}
        >
          {
            <div className={`${cs['date-content']} main-color-hover`}>
              <i className={`fa fa-calendar ${cs['date-icon']}`} />
              {startDate
                ? moment(startDate).format('YYYY-MM-DD')
                : i18n['general.default_select']}
              <br />
              <i className={`fa fa-calendar ${cs['date-icon']}`} />
              {endDate
                ? moment(endDate).format('YYYY-MM-DD')
                : i18n['general.default_select']}
            </div>
          }
        </DateRangePicker>
        {isError ? (
          <div className="validate-error-msg">
            {typeof error === 'function' ? error(label) : error}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

class RenderSubFields extends PureComponent {
  state = {
    typeList: []
  };
  componentDidMount() {
    const { productList, fieldValue: { serviceType } = {} } = this.props;
    const matchedProduct = productList.find(item => item.value === serviceType);
    const typeList = (matchedProduct && matchedProduct.types) || [];
    this.setState({
      typeList
    });
  }
  onFieldChange = type => {
    setTimeout(() => {
      const {
        index,
        billFormValues,
        changeFormValue,
        invoice,
        trigerChange
      } = this.props;
      if (!billFormValues) return;
      const rowData = billFormValues.invoices[index];
      const {
        quantity,
        unitPrice,
        num,
        dateRange: { startDate, endDate } = {}
      } = rowData;
      let updateValuePromises = [];
      if (quantity && type === 'quantity') {
        const newEndDate = moment(startDate)
          .add(quantity, 'month')
          .valueOf();
        updateValuePromises = updateValuePromises.concat([
          changeFormValue(`${invoice}.dateRange`, {
            startDate: moment(startDate).valueOf(),
            endDate: newEndDate
          }),
          changeFormValue(
            `${invoice}.invoicedate`,
            moment(startDate).valueOf()
          ),
          changeFormValue(`${invoice}.endDate`, moment(newEndDate).valueOf())
        ]);
      } else if (type === 'dateRange') {
        updateValuePromises = updateValuePromises.concat([
          changeFormValue(
            `${invoice}.invoicedate`,
            moment(startDate).valueOf()
          ),
          changeFormValue(`${invoice}.endDate`, moment(endDate).valueOf())
        ]);
      }
      if (
        typeof quantity !== 'undefined' &&
        typeof unitPrice !== 'undefined' &&
        typeof num !== 'undefined' &&
        quantity !== '' &&
        unitPrice !== '' &&
        num !== ''
      ) {
        const extendedPrice = math.mul(unitPrice, quantity);
        updateValuePromises.push(
          changeFormValue(`${invoice}.extendedPrice`, extendedPrice)
        );
      }
      if (!updateValuePromises.length) return;
      Promise.all(updateValuePromises).then(() => {
        const { billFormValues } = this.props;
        trigerChange(billFormValues);
      });
    });
  };
  onProductChange = (value, item) => {
    const { changeFormValue, invoice } = this.props;
    const { types = [] } = item;
    this.setState({ typeList: types }, () => {
      changeFormValue(`${invoice}.type`, '');
    });
  };
  render() {
    const { productList, justForm, invoice, index, fields } = this.props;
    const { typeList } = this.state;
    return (
      <tr key={index} className={cs['invoice-info-base']}>
        <td className={cs['info-base-item']}>
          <div className={cs['info-base-item-content']}>{index + 1}</div>
        </td>
        <td className={cs['info-base-item']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.serviceType`} //文案叫Product
              component={renderField}
              type="selectField"
              options={productList}
              validate={required}
              {...stylePropsDropDown}
              disabled={justForm}
              onFieldChange={this.onProductChange}
            />
          </div>
        </td>
        <td className={cs['info-base-item']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.type`}
              component={renderField}
              type="selectField"
              options={typeList}
              validate={required}
              {...stylePropsDropDown}
              disabled={justForm}
            />
          </div>
        </td>
        <td className={cs['info-base-item-mini']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.num`} //文案叫做quantity
              component={renderField}
              type="numberField"
              validate={required}
              {...stylePropsInput}
              decimal={'{0,1}'}
              disabled={justForm}
              onFieldChange={this.onFieldChange}
            />
          </div>
        </td>
        <td className={cs['info-base-item-mini']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.quantity`} //文案叫做month
              component={renderField}
              type="numberField"
              validate={required}
              integer={true}
              {...stylePropsInput}
              disabled={justForm}
              onFieldChange={this.onFieldChange.bind(this, 'quantity')}
            />
          </div>
        </td>

        <td className={cs['info-base-item']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.dateRange`}
              component={DateRangeField}
              type="dateRangeField"
              validate={required}
              {...stylePropsDatePicker}
              disabled={justForm}
              onFieldChange={this.onFieldChange.bind(this, 'dateRange')}
            />
          </div>
        </td>
        <td className={cs['info-base-item']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.unitPrice`}
              component={renderField}
              type="numberField"
              {...stylePropsInput}
              validate={required}
              disabled={justForm}
              onFieldChange={this.onFieldChange}
              colClassName={`${cs['col']} ${cs['number-col']}`}
            />
          </div>
        </td>
        <td className={cs['info-base-item']}>
          <div className={cs['info-base-item-content']}>
            <ToggleField
              name={`${invoice}.extendedPrice`}
              component={renderField}
              type="numberField"
              {...stylePropsInput}
              validate={required}
              disabled={justForm}
              colClassName={`${cs['col']} ${cs['number-col']}`}
            />
          </div>
        </td>
        {justForm ? (
          undefined
        ) : (
          <td className={cs['info-base-item']}>
            <div className={cs['info-base-item-content']}>
              <i
                className={`fa fa-times ${cs['info-base-item-delete']}`}
                onClick={() => {
                  fields.remove(index);
                }}
              />
            </div>
          </td>
        )}
      </tr>
    );
  }
}

export default ({
  fields,
  initialValues,
  meta: { touched, error },
  productList,
  justForm,
  billFormValues,
  changeFormValue,
  trigerChange
}) => {
  return (
    <div className={cs['section']}>
      <div className={cs['block-title']}>
        <div className={cs['title-text']}>
          {i18n['customer.bill.invoice_number']} {initialValues.billNo}
        </div>
        {error ? (
          <div className="validate-error-msg" style={{ marginRight: '10px' }}>
            {typeof error === 'function' ? error('invoice') : error}
          </div>
        ) : (
          undefined
        )}
        {justForm ? (
          undefined
        ) : (
          <div className={cs['title-tools']}>
            <Button type="primary" onClick={() => fields.push({})}>
              {i18n['customer.detail.create']}
            </Button>
          </div>
        )}
      </div>
      <table className={cs['invoice-table']}>
        <thead>
          <tr className={cs['invoice-info-base']}>
            <th>{i18n['customer.bill.invoice.no']}</th>
            <th>{i18n['customer.bill.invoice.product']}</th>
            <th>{i18n['customer.bill.invoice.service_type']}</th>
            <th>{i18n['customer.bill.invoice.quantity']}</th>
            <th>{i18n['customer.bill.invoice.month']}</th>
            <th>
              {i18n['customer.bill.invoice.start_date']}
              <br />
              {i18n['customer.bill.invoice.end_date']}
            </th>
            <th>{i18n['customer.bill.invoice.unit_price']}</th>
            <th>{i18n['customer.bill.invoice.extended_price']}</th>
            {justForm ? (
              undefined
            ) : (
              <th>{i18n['customer.bill.invoice.action']}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {fields.map((invoice, index, fields) => {
            return (
              <RenderSubFields
                key={index}
                productList={productList}
                justForm={justForm}
                invoice={invoice}
                index={index}
                fields={fields}
                billFormValues={billFormValues}
                changeFormValue={changeFormValue}
                trigerChange={trigerChange}
                fieldValue={initialValues && initialValues.invoices[index]}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
