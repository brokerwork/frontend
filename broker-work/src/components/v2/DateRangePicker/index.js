import { DatePicker, Message } from 'lean-ui';
import moment from 'moment';
import i18n from 'utils/i18n';
import { DATE_PICKER_LOCALE } from '../DatePicker/constans';
const { RangePicker } = DatePicker;

const convertToArray = (
  dateObj,
  [start = 'startDate', end = 'endDate'] = []
) => {
  return dateObj && [moment(dateObj[start]), moment(dateObj[end])];
};

const convertToObj = (dateArray, showTime) => {
  let [startDate, endDate] = dateArray;
  if (showTime) {
    return {
      startDate,
      endDate
    };
  }
  //矫正开始时间和结束时间为00:00:00-23:59:59
  if (startDate && endDate) {
    startDate
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);

    endDate
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999);
  }

  return {
    startDate,
    endDate
  };
};
export default class DateRangePicker extends PureComponent {
  currentStart = undefined;
  disabledDate = current => {
    const { currentStart } = this;
    const { dateLimit } = this.props;
    if (!(current && currentStart && dateLimit)) return false;
    const key = Object.keys(dateLimit)[0];
    const value = dateLimit[key];
    const minStart = currentStart.clone().subtract(value, key);
    const maxEnd = currentStart.clone().add(value, key);
    return current < minStart || current > maxEnd;
  };
  render() {
    const {
      defaultValue,
      onChange,
      ranges,
      size = 'default',
      value = defaultValue,
      showTime = false,
      ...props
    } = this.props;
    return (
      <RangePicker
        locale={DATE_PICKER_LOCALE}
        defaultValue={convertToArray(defaultValue)}
        value={convertToArray(value)}
        size={size}
        ranges={
          ranges &&
          Object.keys(ranges).reduce(
            (obj, key) => ({
              ...obj,
              [key]: convertToArray(ranges[key], ['start', 'end'])
            }),
            {}
          )
        }
        onCalendarChange={([start, end]) => {
          if (start && !end) {
            this.currentStart = start;
          } else {
            this.currentStart = undefined;
          }
        }}
        onChange={date => {
          onChange(convertToObj(date, showTime));
        }}
        disabledDate={this.disabledDate}
        showTime={showTime}
        {...props}
      />
    );
  }
}
