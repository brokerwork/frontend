import cs from './index.less';
import DatePicker from 'components/v2/DatePicker';
import i18n from 'utils/i18n';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const formatStyle = 'YYYY-MM-DD';
export default class SplitView extends PureComponent {
  state = {
    leftTabIndex: 1,
    rightTabIndex: 1,
    showDatePicker: false,
    followTime: this.props.customerDetailInfo.revisitTime || null
  };
  componentWillReceiveProps(nextProps) {
    if (
      this.props.customerDetailInfo.revisitTime !==
      nextProps.customerDetailInfo.revisitTime
    ) {
      this.setState({
        followTime: nextProps.customerDetailInfo.revisitTime || null
      });
    }
  }

  modifyFollowTime = e => {
    const {
      setRevisitTime,
      customerDetailInfo,
      getCustomers,
      getCustomerDetail,
      followWayOptions,
      searchType,
      getCustomerList
    } = this.props;
    Promise.resolve(
      setRevisitTime(
        customerDetailInfo.customerId,
        new Date(moment(e).format(formatStyle)).getTime()
      )
    ).then(res => {
      if (res.result) {
        this.setState({
          followTime: e,
          showDatePicker: false
        });
        getCustomerDetail();
        getCustomerList();
      }
    });
  };

  showDatePickerStatus = () => {
    this.setState({
      showDatePicker: true
    });
  };

  render() {
    const { showDatePicker, followTime } = this.state;
    const { disabled } = this.props;
    return (
      <div>
        <div className={`${cs['reviset-time']} main-color`}>
          <DatePicker
            onChange={this.modifyFollowTime}
            className={cs['time-container']}
            disabled={disabled}
            value={followTime ? moment(followTime) : null}
            contentHolder={
              <div className={cs['time-label']}>
                {followTime ? (
                  <FormattedMessage
                    id="customer.detail.customer_follow.follow_time"
                    defaultMessage={
                      i18n['customer.detail.customer_follow.follow_time']
                    }
                    values={{
                      fllowTime: moment(followTime).format(formatStyle)
                    }}
                  />
                ) : disabled ? (
                  undefined
                ) : (
                  <span>
                    <i className="fa fa-pencil" />{' '}
                    {i18n['customer.detail.customer_follow.set_follow_time']}
                  </span>
                )}
              </div>
            }
          />
        </div>
      </div>
    );
  }
}
