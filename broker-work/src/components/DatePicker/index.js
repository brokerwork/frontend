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
    const date = datetime ? datetime.format() : '';
    onChange && onChange(datetime);
  };

  clear = evt => {
    const { onChange, disabled } = this.props;

    if (disabled) return;

    evt.stopPropagation();
    onChange && onChange('');
  };
  componentDidMount() {
    const { toggleHoler } = this.props;
    if (toggleHoler) {
    }
  }
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
      minDate,
      maxDate,
      unDeletable,
      contentHolder
    } = this.props;
    const datetime = value ? moment(value) : undefined;
    const displayDate = value
      ? moment(value).format(dateFormat || dateFormatStyle)
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
          weeks={weeks}
          months={months}
          minDate={minDate}
          maxDate={maxDate}
          dayFormat={dayFormat}
          shortcuts={buttons}
        >
          {contentHolder ? (
            contentHolder
          ) : (
            <div className={cs['input-group']}>
              <i className={`fa fa-calendar ${cs['calender-icon']}`} />
              <input
                type="text"
                className={`form-control ${cs['text']} ${unDeletable
                  ? cs['no-clear']
                  : ''} ${controlClassName} ${error ? cs['error'] : ''}`}
                disabled={disabled}
                value={displayDate}
                readOnly
              />
              {unDeletable ? (
                undefined
              ) : (
                <i
                  className={`fa fa-times ${cs['clear-btn']}`}
                  onClick={this.clear}
                />
              )}
            </div>
          )}
          {contentHolder && displayDate ? (
            <i
              className={`fa fa-times ${cs['clear-btn']}`}
              onClick={this.clear}
            />
          ) : (
            undefined
          )}
        </DatetimePickerTrigger>
      </div>
    );
  }
}
