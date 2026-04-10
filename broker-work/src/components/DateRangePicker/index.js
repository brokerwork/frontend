import { DatetimeRangePickerTrigger } from 'rc-datetime-picker';
import moment from 'moment';
import {
  dateFormatStyle,
  dateStartDate,
  dateRange,
  weeks,
  months
} from 'utils/config';
import i18n from 'utils/i18n';

import cs from './DateRangePicker.less';

const INITINAL_TIME = dateStartDate;
const FORMAT_STYLE = dateFormatStyle;

export default class DateRangePicker extends PureComponent {
  constructor(props) {
    super(props);
    const initinalTime = props.initinalTime || INITINAL_TIME;
    const formatStyle = props.formatStyle || FORMAT_STYLE;
    let ranges = props.ranges;
    if (!ranges) {
      ranges = {
        [i18n['general.date_range_picker.option.all']]: dateRange.all,
        [i18n['general.date_range_picker.option.today']]: dateRange.today,
        [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
        [i18n['general.date_range_picker.option.last7days']]:
          dateRange.last7days,
        [i18n['general.date_range_picker.option.last30days']]:
          dateRange.last30days,
        [i18n['general.date_range_picker.option.currentMonth']]:
          dateRange.currentMonth,
        [i18n['general.date_range_picker.option.lastMonth']]:
          dateRange.lastMonth
      };
    }

    this.state = {
      initinalTime,
      formatStyle,
      ranges
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      initinalTime: props.initinalTime || INITINAL_TIME,
      formatStyle: props.formatStyle || FORMAT_STYLE,
      ranges: props.ranges || this.state.ranges
    });
  }

  onApply = selected => {
    const { onApply } = this.props;
    const result = {
      startDate: selected.start.startOf('day'),
      endDate: selected.end.endOf('day')
    };

    if (onApply) onApply(result);
  };

  formatterValue = (start, end) => {
    const { ranges, formatStyle } = this.state;
    let value =
      start && end
        ? `${start.format(formatStyle)}, ${end.format(formatStyle)}`
        : '';

    for (let key in ranges) {
      const isSame =
        ranges[key]['start'].isSame(start, 'day') &&
        ranges[key]['end'].isSame(end, 'day');

      if (isSame) {
        value = key;
      }
    }

    return value;
  };

  render() {
    let { startDate, endDate, dateLimit, children, minPanel } = this.props;
    const { className = '', inline, inputClassName = '' } = this.props;
    const { ranges } = this.state;
    startDate =
      startDate ||
      (ranges[`${i18n['general.date_range_picker.option.all']}`] &&
        ranges[`${i18n['general.date_range_picker.option.all']}`]['start']);
    startDate = startDate && moment(startDate);
    endDate =
      endDate ||
      (ranges[`${i18n['general.date_range_picker.option.all']}`] &&
        ranges[`${i18n['general.date_range_picker.option.all']}`]['end']);
    endDate = endDate && moment(endDate);

    const value = this.formatterValue(startDate, endDate);

    return (
      <DatetimeRangePickerTrigger
        className={`${cs['date-range-picker']} ${className} ${inline
          ? cs['inline']
          : ''}`}
        showCustomButton
        customButtonText={i18n['general.date_range_picker.custome_button']}
        shortcuts={ranges}
        customRange={{
          start: moment()
            .subtract(4, 'days')
            .startOf('day'),
          end: moment().endOf('day')
        }}
        weeks={weeks}
        months={months}
        format={dateFormatStyle}
        dayFormat={dateFormatStyle}
        confirmButtonText={i18n['general.date_range_picker.apply_btn']}
        startDateText={i18n['general.date_range_picker.start_date']}
        endDateText={i18n['general.date_range_picker.end_date']}
        dateLimit={dateLimit}
        moment={{ start: startDate, end: endDate }}
        onChange={this.onApply}
        minPanel={minPanel}
      >
        {children ? (
          children
        ) : (
          <span>
            <i className={`fa fa-calendar ${cs['icon']}`} />
            <input
              type="text"
              className={`form-control ${cs['text']} ${inputClassName}`}
              value={value}
              readOnly
            />
          </span>
        )}
      </DatetimeRangePickerTrigger>
    );
  }
}
