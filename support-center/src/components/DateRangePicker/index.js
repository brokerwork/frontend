import { DatetimeRangePickerTrigger } from "rc-datetime-picker";
import moment from "moment";
import {
  dateFormatStyle,
  dateStartDate,
  dateRange,
  weeks,
  months
} from "utils/config";
import i18n from "utils/i18n";

import cs from "./DateRangePicker.less";

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
        [i18n["general.date_range_picker.option.all"]]: dateRange.all,
        [i18n["general.date_range_picker.option.today"]]: dateRange.today,
        [i18n["general.date_range_picker.option.yestoday"]]: dateRange.yestoday,
        [i18n["general.date_range_picker.option.last7days"]]:
          dateRange.last7days,
        [i18n["general.date_range_picker.option.last30days"]]:
          dateRange.last30days,
        [i18n["general.date_range_picker.option.currentMonth"]]:
          dateRange.currentMonth,
        [i18n["general.date_range_picker.option.lastMonth"]]:
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

  onChange = selected => {
    const { onChange } = this.props;
    const result = {
      start: selected.start.startOf("day"),
      end: selected.end.endOf("day")
    };

    if (onChange) onChange(result);
  };

  formatterValue = (start, end) => {
    const { ranges, formatStyle } = this.state;
    let value = `${start.format(formatStyle)}, ${end.format(formatStyle)}`;

    for (let key in ranges) {
      const isSame =
        ranges[key]["start"].isSame(start, "day") &&
        ranges[key]["end"].isSame(end, "day");

      if (isSame) {
        value = key;
      }
    }

    return value;
  };

  render() {
    let { value: { start, end }, dateLimit } = this.props;
    const {
      className = "",
      inline,
      inputClassName = "",
      minPanel,
      showCustomButton = true,
      needRange = true,
      formatStyle
    } = this.props;
    const { ranges } = this.state;
    start = moment(
      start ||
        ranges[`${i18n["general.date_range_picker.option.all"]}`]["start"]
    );
    end = moment(
      end || ranges[`${i18n["general.date_range_picker.option.all"]}`]["end"]
    );

    const value = this.formatterValue(start, end);

    return (
      <DatetimeRangePickerTrigger
        minPanel={minPanel}
        className={`${cs["date-range-picker"]} ${className} ${
          inline ? cs["inline"] : ""
        }`}
        showCustomButton={showCustomButton}
        customButtonText={i18n["general.date_range_picker.custome_button"]}
        shortcuts={needRange ? ranges : undefined}
        customRange={{
          start: moment()
            .subtract(4, "days")
            .startOf("day"),
          end: moment().endOf("day")
        }}
        weeks={weeks}
        months={months}
        format={formatStyle || dateFormatStyle}
        dayFormat={formatStyle || dateFormatStyle}
        confirmButtonText={i18n["general.date_range_picker.apply_btn"]}
        startDateText={i18n["general.date_range_picker.start_date"]}
        endDateText={i18n["general.date_range_picker.end_date"]}
        dateLimit={dateLimit}
        moment={{ start, end }}
        onChange={this.onChange}
      >
        <i className={`fa fa-calendar ${cs["icon"]}`} />
        <input
          type="text"
          className={`form-control ${cs["text"]} ${inputClassName}`}
          value={value}
          readOnly
        />
      </DatetimeRangePickerTrigger>
    );
  }
}
