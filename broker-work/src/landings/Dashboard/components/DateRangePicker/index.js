import { DatetimeRangePicker } from 'rc-datetime-picker';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import { dateFormatStyle, dateStartDate, weeks, months } from 'utils/config';
import cls from 'utils/class';
import cs from './DateRangePicker.less';

// 季度与月份划分
const QUARTER_TO_MONTH = {
  0: 1,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4
};

// 季度取值
const QUARTER = Object.defineProperties(
  {},
  {
    Q1: {
      get: function() {
        return {
          start: moment().startOf('year'),
          end: moment()
            .startOf('year')
            .add(2, 'months')
            .endOf('month')
        };
      }
    },
    Q2: {
      get: function() {
        return {
          start: moment()
            .startOf('year')
            .add(3, 'months')
            .startOf('month'),
          end: moment()
            .startOf('year')
            .add(5, 'months')
            .endOf('month')
        };
      }
    },
    Q3: {
      get: function() {
        return {
          start: moment()
            .startOf('year')
            .add(6, 'months')
            .startOf('month'),
          end: moment()
            .startOf('year')
            .add(8, 'months')
            .endOf('month')
        };
      }
    },
    Q4: {
      get: function() {
        return {
          start: moment()
            .startOf('year')
            .add(9, 'months')
            .startOf('month'),
          end: moment()
            .startOf('year')
            .add(11, 'months')
            .endOf('month')
        };
      }
    }
  }
);

const RANGES = Object.defineProperties(
  {},
  {
    [i18n['general.date_range_picker.option.today']]: {
      get: function() {
        return {
          start: moment().startOf('day'),
          end: moment().endOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.week']]: {
      get: function() {
        return {
          start: moment().startOf('week'),
          end: moment().endOf('week')
        };
      }
    },
    [i18n['general.date_range_picker.option.currentMonth']]: {
      get: function() {
        return {
          start: moment().startOf('month'),
          end: moment().endOf('month')
        };
      }
    },
    [i18n['general.date_range_picker.option.quarter']]: {
      get: function() {
        const currentMonth = new Date().getMonth();
        const quarter = QUARTER_TO_MONTH[currentMonth];
        return QUARTER[`Q${quarter}`];
      }
    },
    [i18n['general.date_range_picker.option.year']]: {
      get: function() {
        return {
          start: moment().startOf('year'),
          end: moment().endOf('year')
        };
      }
    },
    [i18n['general.date_range_picker.option.last7days']]: {
      get: function() {
        return {
          start: moment()
            .subtract(6, 'days')
            .startOf('day'),
          end: moment().endOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.last30days']]: {
      get: function() {
        return {
          start: moment()
            .subtract(29, 'days')
            .startOf('day'),
          end: moment().endOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.last180days']]: {
      get: function() {
        return {
          start: moment()
            .subtract(179, 'days')
            .startOf('day'),
          end: moment().endOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.yestoday']]: {
      get: function() {
        return {
          start: moment()
            .subtract(1, 'days')
            .startOf('day'),
          end: moment()
            .subtract(1, 'days')
            .endOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.lastWeek']]: {
      get: function() {
        return {
          start: moment()
            .subtract(1, 'weeks')
            .startOf('week'),
          end: moment()
            .subtract(1, 'weeks')
            .endOf('weeks')
        };
      }
    },
    [i18n['general.date_range_picker.option.lastMonth']]: {
      get: function() {
        return {
          start: moment()
            .subtract(1, 'months')
            .startOf('month'),
          end: moment()
            .subtract(1, 'months')
            .endOf('month')
        };
      }
    },
    [i18n['general.date_range_picker.option.lastQuarter']]: {
      get: function() {
        const currentMonth = new Date().getMonth();
        const quarter = QUARTER_TO_MONTH[currentMonth];
        let currentQuarter;
        if (quarter === 1) {
          currentQuarter = QUARTER[`Q${quarter}`];
          currentQuarter.start = currentQuarter.start.subtract(3, 'months');
          currentQuarter.end = currentQuarter.end.subtract(3, 'months');
        } else {
          currentQuarter = QUARTER[`Q${quarter - 1}`];
        }
        return currentQuarter;
      }
    },
    [i18n['general.date_range_picker.option.lastYear']]: {
      get: function() {
        return {
          start: moment()
            .subtract(1, 'years')
            .startOf('year'),
          end: moment()
            .subtract(1, 'years')
            .endOf('year')
        };
      }
    },
    [i18n['general.date_range_picker.option.last14days']]: {
      get: function() {
        return {
          end: moment().endOf('day'),
          start: moment()
            .subtract(13, 'days')
            .startOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.last90days']]: {
      get: function() {
        return {
          end: moment().endOf('day'),
          start: moment()
            .subtract(89, 'days')
            .startOf('day')
        };
      }
    },
    [i18n['general.date_range_picker.option.last365days']]: {
      get: function() {
        return {
          end: moment().endOf('day'),
          start: moment()
            .subtract(364, 'days')
            .startOf('day')
        };
      }
    }
  }
);

const rangeCol1 = [
  i18n['general.date_range_picker.option.today'],
  i18n['general.date_range_picker.option.week'],
  i18n['general.date_range_picker.option.currentMonth'],
  i18n['general.date_range_picker.option.quarter'],
  i18n['general.date_range_picker.option.year'],
  i18n['general.date_range_picker.option.last7days'],
  i18n['general.date_range_picker.option.last30days'],
  i18n['general.date_range_picker.option.last180days']
];

const rangeCol2 = [
  i18n['general.date_range_picker.option.yestoday'],
  i18n['general.date_range_picker.option.lastWeek'],
  i18n['general.date_range_picker.option.lastMonth'],
  i18n['general.date_range_picker.option.lastQuarter'],
  i18n['general.date_range_picker.option.lastYear'],
  i18n['general.date_range_picker.option.last14days'],
  i18n['general.date_range_picker.option.last90days'],
  i18n['general.date_range_picker.option.last365days']
];

function fn() {}

export default class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    const { defaultDate, defaultLabel } = this.props;
    const s = {
      view: 'range',
      show: false
    };
    if (defaultDate && defaultDate.start && defaultDate.end) {
      s['date'] = defaultDate;
      s['label'] = defaultLabel;
    } else {
      s['label'] = i18n['general.date_range_picker.option.last7days'];
      s['date'] = RANGES[s['label']];
    }
    this.state = s;
  }
  componentDidMount() {
    document.addEventListener('click', this.documentClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick, false);
  }
  changeView = view => {
    this.setState({ view });
  };
  onChange = (label, date) => {
    const { onChange } = this.props;
    this.setState({ label, date, show: false });
    date['start'] = date.start.startOf('day');
    date['end'] = date.end.endOf('day');
    if (onChange) onChange(date);
  };
  documentClick = e => {
    const ele = findDOMNode(this);
    if (!ele.contains(e.target)) {
      this.togglePicker(false);
    }
  };
  togglePicker = state => {
    this.setState({
      show: state
    });
  };

  render() {
    const { view, date, label, show } = this.state;
    const { align = '', className = '' } = this.props;
    const inputValue = `${date.start.format(
      dateFormatStyle
    )}, ${date.end.format(dateFormatStyle)}`;
    return (
      <div
        className={cls`${cs['container']}
          ${show ? cs['show'] : ''}
          ${className}
          ${align ? cs[align] : ''}`}
      >
        <i className={`fa fa-calendar ${cs['icon']}`} />
        <input
          className={`form-control ${cs['input']}`}
          type="text"
          value={inputValue}
          onChange={fn}
          onFocus={this.togglePicker.bind(this, true)}
        />
        <div className={cs['popover-container']}>
          <ul className="nav nav-tabs">
            <li
              className={view === 'range' ? 'active' : undefined}
              onClick={this.changeView.bind(this, 'range')}
            >
              <a href="javascript:;">
                {i18n['general.date_range_picker.option.relative_time']}
              </a>
            </li>
            <li
              className={view === 'date' ? 'active' : undefined}
              onClick={this.changeView.bind(this, 'date')}
            >
              <a href="javascript:;">
                {i18n['general.date_range_picker.option.cutome_time']}
              </a>
            </li>
          </ul>
          <div className={cs['view']}>
            {view === 'range' && (
              <div className={cs['rangeView']}>
                <ul>
                  {rangeCol1.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          item === label &&
                          `${cs['range-active']} main-color main-color-border`
                        }
                        onClick={this.onChange.bind(this, item, RANGES[item])}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
                <ul>
                  {rangeCol2.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          item === label &&
                          `${cs['range-active']} main-color main-color-border`
                        }
                        onClick={this.onChange.bind(this, item, RANGES[item])}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {view === 'date' && (
              <DatetimeRangePicker
                className={`datetime-range-picker-panel`}
                moment={date}
                weeks={weeks}
                months={months}
                format={dateFormatStyle}
                startDateText={`${
                  i18n['general.date_range_picker.start_date']
                }: `}
                endDateText={`${i18n['general.date_range_picker.end_date']}: `}
                confirmButtonText={i18n['general.date_range_picker.apply_btn']}
                onChange={this.onChange.bind(this, 'customer')}
                moment={moment}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
