import Dropdown from 'components/Dropdown';
import AdvancedSearch from 'components/AdvancedSearch';
import DateRangePicker from 'components/DateRangePicker';
import moment from 'moment';
import { dateRange } from 'utils/config';
import i18n from 'utils/i18n';
import cs from './ProfitReport.less';
import { get as getQuery, set as setQuery } from 'utils/cacheQuery';
import { PROFIT_STATUS } from '../../../../constant';

export default class ActionsBar extends PureComponent {
  state = {
    showAdvancedSearchModal: false,
    ranges: {
      [i18n['general.date_range_picker.option.today']]: dateRange.today,
      [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
      [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
      [i18n['general.date_range_picker.option.last30days']]:
        dateRange.last30days,
      [i18n['general.date_range_picker.option.currentMonth']]:
        dateRange.currentMonth,
      [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
    }
  };
  componentDidMount() {
    const {
      getStatus,
      updateNeedRefresh,
      type,
      updateStatus,
      updateDateRange,
      updatePagination
    } = this.props;

    Promise.all([
      getStatus(PROFIT_STATUS),
      updateNeedRefresh(i18n['report.date_range_type.default_tints'])
    ]).then(() => {
      const preKey = type;
      const result = getQuery();
      Promise.all([
        result[`${preKey}dateRanges`] &&
          result[`${preKey}dateRanges`].startDate &&
          result[`${preKey}dateRanges`].endDate &&
          updateDateRange({
            startDate: moment(result[`${preKey}dateRanges`].startDate),
            endDate: moment(result[`${preKey}dateRanges`].endDate)
          }),
        result[`${preKey}currentStatus`] &&
          updateStatus(result[`${preKey}currentStatus`]),
        result[`${preKey}currentPagination`] &&
          updatePagination(result[`${preKey}currentPagination`])
      ]).then(() => {
        this.getProfitList();
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    const newId = nextProps.userId;
    if (newId && newId !== this.props.userId) {
      setTimeout(() => {
        this.getProfitList();
      }, 0);
    }
  }
  getProfitList = () => {
    const {
      getProfitList,
      currentStatus,
      dateRanges,
      currentPagination,
      updateNeedRefresh,
      userId,
      type
    } = this.props;
    const { startDate, endDate } = dateRanges;
    const { pageNo, pageSize } = currentPagination;
    setQuery('currentStatus', 'dateRanges', 'currentPagination')(
      this.props,
      type
    );
    getProfitList({
      userId: userId,
      status: currentStatus.value === 'all' ? '' : currentStatus.value,
      start: startDate ? startDate.format('YYYY-MM-DD') : null,
      end: endDate ? endDate.format('YYYY-MM-DD') : null,
      nowPage: pageNo,
      pageSize: pageSize
    }).then(res => {
      if (res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };
  getQuery = () => {
    const { updateNeedRefresh } = this.props;
    updateNeedRefresh('');
    this.getProfitList();
  };
  onDateRangeSelect = ({ startDate, endDate }) => {
    const { updateDateRange } = this.props;
    Promise.all([updateDateRange({ startDate, endDate })]).then(() => {
      this.getQuery();
    });
  };
  getReportList = () => {
    const { getReportList, dateRanges, currentPagination } = this.props;
    const { startDate, endDate } = dateRanges;
    const { pageNo, pageSize } = currentPagination;
  };
  onSearch = evt => {
    if (evt.which === 13) {
      this.getReportList();
    }
  };
  onStatusSelect = selected => {
    const { updateStatus } = this.props;
    Promise.all([updateStatus(selected)]).then(() => {
      this.getProfitList();
    });
  };
  render() {
    const { currentStatus, dateRanges } = this.props;
    const { startDate, endDate } = dateRanges;
    const dateLimit = { months: 6 };
    const { ranges } = this.state;
    return (
      <div className={cs['action-bar']}>
        <div className={cs['wrapper']}>
          <Dropdown
            autoWidth
            className={`${`${cs['dropdown']} focus`} focus`}
            data={PROFIT_STATUS}
            value={currentStatus}
            onSelect={this.onStatusSelect}
          />
          <div className={cs['date-time-picker']}>
            <DateRangePicker
              className={cs['picker']}
              inputClassName={'focus'}
              dateLimit={dateLimit}
              ranges={ranges}
              inline
              format="YYYY-MM-DD"
              onApply={this.onDateRangeSelect}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    );
  }
}
