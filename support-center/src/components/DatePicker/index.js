import { DatetimePickerTrigger } from 'rc-datetime-picker';
import moment from 'moment';
import {
  dateFormatStyle,
  singleDate,
  weeks,
  months,
  dayFormat
} from 'utils/config';

import cs from './DatePicker.less';
import i18n from 'utils/i18n';

export default class DatePicker extends PureComponent {
  handleChange = datetime => {
    const { onChange } = this.props;
    onChange && onChange(datetime);
  };

  clear = evt => {
    const { onChange, disabled } = this.props;

    if (disabled) return;

    evt.stopPropagation();
    onChange && onChange('');
  };

  render() {
    const {
      error,
      className = '',
      pickerClassName = '',
      controlClassName = '',
      value,
      dateFormat,
      disabled,
      buttons,
      showTimePicker = false,
      showCalendarPicker = true,
      minDate,
      maxDate
    } = this.props;
    const datetime = value ? moment(value, dateFormat) : undefined;
    const displayDate = value
      ? moment(value, dateFormat).format(dateFormat || dateFormatStyle)
      : '';

    return (
      <div className={`${cs['date-picker-wrapper']} ${className}`}>
        <DatetimePickerTrigger
          disabled={disabled}
          moment={datetime}
          onChange={this.handleChange}
          className={`${pickerClassName} ${error ? cs['error'] : ''}`}
          closeOnSelectDay
          showTimePicker={showTimePicker}
          showCalendarPicker={showCalendarPicker}
          weeks={weeks}
          months={months}
          minDate={minDate}
          maxDate={maxDate}
          dayFormat={dayFormat}
          shortcuts={buttons}
        >
          <div className={cs['input-group']}>
            <i className={`fa fa-calendar ${cs['calender-icon']}`} />
            <input
              type="text"
              className={`form-control ${cs['text']} ${controlClassName} ${error
                ? cs['error']
                : ''}`}
              disabled={disabled}
              value={displayDate}
              readOnly
            />

            <i
              className={`fa fa-times ${cs['clear-btn']}`}
              onClick={this.clear}
            />
          </div>
        </DatetimePickerTrigger>
      </div>
    );
  }
}
