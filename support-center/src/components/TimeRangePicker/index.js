import DatePicker from 'components/DatePicker';
import moment from 'moment';

import cs from './TimeRangePicker.less';
import i18n from 'utils/i18n';
import {minutesFormatStyle} from 'utils/config';

export default class TimeRangePicker extends PureComponent {
  handleChange = (type, data) => {
    const {value, onChange} = this.props;
    let start = data && type === 'start' ? data : value.start || '';
    let end = data && type === 'end' ? data : value.end || '';
    onChange && onChange({start, end});
  }

  render() {
    const {className = '', value: {start, end}, disabled} = this.props;
    return (
      <div className={cs['time-date-range-picker']}>
        <DatePicker
        className={`${className} ${cs['inline']}`} 
          value={start}
          showCalendarPicker={false}
          showTimePicker={true}
          inline={true}
          dateFormat={minutesFormatStyle}
          disabled={disabled}
          onChange={this.handleChange.bind(this, 'start')}
        />
        {i18n['twapp.trade_time_setting.between']}
        <DatePicker
        className={`${className} ${cs['inline']}`} 
        value={end}
        showCalendarPicker={false}
        showTimePicker={true}
        inline={true}
        dateFormat={minutesFormatStyle}
        disabled={disabled}
        onChange={this.handleChange.bind(this, 'end')}
      />
      </div>
    );
  }
}
