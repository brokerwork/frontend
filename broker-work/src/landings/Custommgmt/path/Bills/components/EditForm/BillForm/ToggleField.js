import { Field } from 'redux-form';
import cs from './index.less';
import { Col, FormControl } from 'react-bootstrap';
import moment from 'moment';
const fieldTypeMap = {
  textField: 'text',
  dateField: 'datestring',
  selectField: 'select'
};
export default class ToggleField extends Component {
  getFieldValue = (item, value) => {
    if (item.type === 'dateRangeField') {
      return (
        <div>
          {value.startDate && moment(value.startDate).format('YYYY-MM-DD')}
          <br />
          {value.endDate && moment(value.endDate).format('YYYY-MM-DD')}
        </div>
      );
    } else if (item.type === 'dateField') {
      return value ? moment(value).format('YYYY-MM-DD') : '';
    } else if (item.type === 'selectField') {
      return value
        ? (item.options.find(option => option.value == value) || {}).label
        : '';
    } else {
      return value;
    }
  };
  setField = ({
    columns,
    colClassName,
    input,
    isError,
    type,
    options,
    disabled
  }) => {
    return (
      <Col
        sm={columns || 4}
        className={`${colClassName || ''} ${isError ? 'has-error' : ''}`}
      >
        <span
          className={`${cs['field']} ${this.props.className} ${disabled
            ? cs['disabled']
            : ''}`}
        >
          <span className={cs['field-content']}>
            {this.getFieldValue({ options, type }, input.value)}
          </span>
        </span>
      </Col>
    );
  };
  render() {
    const { disabled } = this.props;
    if (!disabled) {
      return <Field {...this.props} />;
    } else {
      return <Field {...this.props} component={this.setField} />;
    }
  }
}
