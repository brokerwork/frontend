import Select from 'components/Select';

import cs from './HourRangePicker.less';
import i18n from 'utils/i18n';
import {HOUR_OPTIONS} from './constant';

export default class HourRangePicker extends PureComponent {
  handleChange = ( type, data) => {
    const {value, onChange} = this.props;
    
    let start = data && type === 'start' ? data : value.start || 0;
    let end = data && type === 'end' ? data : value.end || 0;
    onChange && onChange({start, end});
  }

  render() {
    const {className = '', value: {start, end}, disabled} = this.props;
    return (
      <div className={cs['time-date-range-picker']}>
        <Select 
          className={`${className} ${cs['inline']}`} 
          value={start || '0'}
          disabled={disabled}
          options={HOUR_OPTIONS}
          onChange={this.handleChange.bind(this, 'start')}
        />
        {i18n['twapp.trade_time_setting.between']}
        <Select 
          className={`${className} ${cs['inline']}`} 
          value={end || '24'}
          options={HOUR_OPTIONS}
          disabled={disabled}
          onChange={this.handleChange.bind(this, 'end')}
        />
      </div>
    );
  }
}
