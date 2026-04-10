import { Field } from 'redux-form';
import { Form, Input, Button } from 'lean-ui';
import { renderField } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from '../../Balance.less';
import CustomField from 'components/v2/CustomField';
import { required } from 'utils/v2/renderField';
import _ from 'lodash';
const hideBox = ['receiptAccount', 'receiptAccountName', 'receiptServer'];
export default class CreateTasks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fieldItem: props.fieldItem,
      isOther: false
    };
  }
  componentDidMount() {
    // 转入账户
    let copyFieldItem = _.cloneDeep(this.state.fieldItem);
    // 汇率;
    // 添加转入账户改变函数;
    this.getFieldValue(
      copyFieldItem,
      'receiptUser'
    ).onChange = this.handleReceiptUserSelect;
    this.setState({
      fieldItem: copyFieldItem
    });
  }
  handleReceiptUserSelect = value => {
    let copyFieldItem = _.cloneDeep(this.state.fieldItem);
    if (value === 'other') {
      hideBox.forEach(item => {
        this.getFieldValue(copyFieldItem, item).hide = false;
      });
    } else {
      hideBox.forEach(item => {
        this.getFieldValue(copyFieldItem, item).hide = true;
      });
    }
    this.setState({
      fieldItem: copyFieldItem,
      isOther: value === 'other'
    });
  };
  // 获取item对应field的项
  getFieldValue = (items, name) => {
    return items && items.length && items.find(item => item.key === name);
  };

  // 渲染固定field
  renderFieldItem = () => {
    const { formValues, payCurrencyList } = this.props;
    const { payAmount, finalExchange, showExchange, fieldItem } = this.state;
    return fieldItem.filter(item => !item.hide).map(field => {
      const label = field.label
        ? field.label
        : i18n[`settings.deposit_transfer.create_task.${field.key}`];
      let validate = null;
      if (field.required) {
        if (!field.validateType) {
          field.validateType = [];
        }
        if (!field.validateType.includes(required)) {
          field.validateType.push(required);
        }
        validate = field.validateType;
      } else {
        if (field.validateType) {
          _.remove(field.validateType, function(n) {
            return n === required;
          });
          validate = field.validateType;
        }
      }
      return (
        <Form.Item required={field.required} col="1">
          <Form.Label>{label}</Form.Label>
          <Form.Control>
            <Field
              name={field.key}
              component={renderField}
              type={field.fieldType}
              validate={validate}
              label={label}
              disabled={field.disabled}
              options={field.list && field.list.length && field.list}
              onFieldChange={field.onChange}
              searchable={field.searchable}
              edit={field.edit}
              placeholder={field.placeholder}
            />
            {field.key === 'withdrawAmount' &&
              showExchange &&
              !!payCurrencyList.length && (
                <div className={cs.rate}>
                  {formValues.withdrawCurrency}：{payAmount}（
                  {i18n['settings.deposit_withdraw.create_task.exchange']}：
                  {finalExchange.toFixed(4)}）
                </div>
              )}
          </Form.Control>
        </Form.Item>
      );
    });
  };
  render() {
    const { showInfo } = this.props;
    return (
      <div
        className={cs.widthdraw_container}
        style={{ display: showInfo ? 'none' : 'block' }}
      >
        <Form horizontal>
          {this.renderFieldItem()}
          {/* <div className={cs.customFieldForm}>
            <CustomField fields={formFields} />
          </div> */}
        </Form>
      </div>
    );
  }
}
