import cs from './index.less';
import TimeLine from 'components/v2/TimeLine';
import i18n from 'utils/i18n';

import DeleteRecord from '../../../../containers/DeleteRecord';
import AudioTip from 'components/v2/AudioTip';
import { FormattedMessage } from 'react-intl';
import timeLineDataTransfer from 'components/v2/TimeLine/transfer';
import { OPREATE_WAY } from './constant';
import WarningValue from 'components/v2/WarningValue';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import NoDataView from 'components/v2/NoDataView';
import { BILL_FIELDS_MAP as billFieldsMap } from '../../../../../Bills/constants';
import { REFUND_FIELDS_MAP as refundFieldsMap } from '../../../../../Bills/components/EditForm/RefundList/contants';
import { CONTRACT_FIELDS_MAP as contractFieldsMap } from '../../../../../Contracts/constants';
export default class ActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timelineData: this.formatActivities(props.data.list)
    };
  }

  componentDidMount() {
    // const { getData, data: { pager, pages, list } } = this.props;
    // if (typeof pager === 'undefined' && getData) {
    //   getData(1);
    // }
  }
  loadMoreData = () => {
    const {
      getData,
      data: { pager, pages, list }
    } = this.props;
    getData(pager + 1);
  };
  componentWillReceiveProps(nextProps) {
    const {
      data: { list },
      followWayOptions
    } = this.props;
    const {
      data: { list: nextList },
      followWayOptions: nextFollowWayOptions
    } = nextProps;
    if (
      nextList.length !== list.length ||
      (nextList[0] && nextList[0].time) !== (list[0] && list[0].time)
    ) {
      this.setState({
        timelineData: this.formatActivities(nextList)
      });
    }
  }
  getFollowOptionsMap = options => {
    return options.reduce((map, item) => {
      map[item.value] = item.label;
      return map;
    }, {});
    // followWayOptions.forEach(item => {
    //   followWayOptionsMap[item.value] = item.label;
    // });
  };
  formatActivities = list => {
    const result = timeLineDataTransfer(
      list
        .filter(
          item =>
            !(
              item.type === 'log' &&
              item.detail &&
              item.detail.optType === 'CUSTOMER' &&
              item.detail.field === 'participantName'
            )
        ) //participantName 和 participant重复显示
        .map(item => {
          const copyData = JSON.parse(JSON.stringify(item));
          if (item.type === 'log' && item.detail.optType === 'OPPORTUNITY') {
            if (item.detail.field === 'oweId') {
              copyData.detail.field = 'oweName';
            } else if (item.detail.field === 'isLose') {
              copyData.detail.field = 'salesStage';
            }
          }
          if (item.type === 'log' && item.detail.optType === 'CUSTOMER') {
            if (item.detail.field === 'commendId') {
              copyData.detail.field = 'commendName';
            }
          }
          return this.formatActivitiesItem(copyData);
        })
    );
    return result;
  };

  formatContentFollow = item => {
    const {
      followWayOptions,
      customerDetailInfo: { customerId }
    } = this.props;
    const followWayOptionsMap = this.getFollowOptionsMap(followWayOptions);
    const {
      time: activityTime,
      type: activityType,
      detail: activityDetail
    } = item;
    const extras = item;
    if (activityDetail.type === 'CALL') {
      //ip电话
      const isCustomer = activityDetail.calledType === 'CUSTOMER';
      const type = isCustomer ? 'customer' : 'contact';
      const name = isCustomer ? '' : activityDetail.calledName;
      const content = `${i18n[`customer.detail.opreate_type_${type}`]} ${name}`;
      const activeContent = (
        <FormattedMessage
          id="customer.detail.follow_record_call"
          defaultMessage={i18n['customer.detail.follow_record_call']}
          values={{
            content: <span className="main-color">{content}</span>
          }}
        />
      );
      return {
        time: activityTime,
        user: activityDetail.callerName,
        content: activeContent,
        icon: 'fa fa-record-14',
        extras
      };
    } else {
      const followWay =
        followWayOptions.length && activityDetail.followWay ? (
          <FormattedMessage
            id="customer.detail.follow_record_message1"
            defaultMessage={i18n['customer.detail.follow_record_message1']}
            values={{ way: followWayOptionsMap[activityDetail.followWay] }}
          />
        ) : (
          ''
        );
      const activeContent = (
        <FormattedMessage
          id="customer.detail.follow_record_message2"
          defaultMessage={i18n['customer.detail.follow_record_message2']}
          values={{
            way: followWay,
            content: (
              <span className="main-color">{activityDetail.followContent}</span>
            )
          }}
        />
      );
      return {
        time: activityTime,
        user: activityDetail.creator,
        content: activeContent,
        icon: 'fa fa-record-14',
        extras
      };
    }
  };

  formatContentLog = item => {
    const {
      opportunityFormFieldsMap,
      contactFormFieldsMap,
      customerFormFieldsMap
    } = this.props;
    const {
      time: activityTime,
      type: activityType,
      detail: activityDetail
    } = item;

    let editContent = '';
    if (activityDetail.optType === 'CUSTOMER') {
      editContent = (
        <span className="main-color">
          {activityDetail.field === 'bindUserId'
            ? i18n['customer.detail.bind_user_id.content']
            : activityDetail.field === 'customerState'
              ? i18n['customer.state_type']
              : customerFormFieldsMap[activityDetail.field] &&
                customerFormFieldsMap[activityDetail.field].label}
        </span>
      );
    } else if (activityDetail.optType === 'OPPORTUNITY') {
      editContent = (
        <FormattedMessage
          id="customer.detail.opreate_log_special_message"
          defaultMessage={i18n['customer.detail.opreate_log_special_message']}
          values={{
            way: <span className="main-color">{activityDetail.name}</span>,
            content: (
              <span className="main-color">
                {opportunityFormFieldsMap[activityDetail.field] &&
                  opportunityFormFieldsMap[activityDetail.field].label}
              </span>
            )
          }}
        />
      );
    } else if (activityDetail.optType === 'CONTACT') {
      editContent = (
        <FormattedMessage
          id="customer.detail.opreate_log_special_message"
          defaultMessage={i18n['customer.detail.opreate_log_special_message']}
          values={{
            way: <span className="main-color">{activityDetail.name}</span>,
            content: (
              <span className="main-color">
                {contactFormFieldsMap[activityDetail.field] &&
                  contactFormFieldsMap[activityDetail.field].label}
              </span>
            )
          }}
        />
      );
    } else if (activityDetail.optType === 'BILL') {
      editContent = (
        <FormattedMessage
          id="customer.detail.opreate_log_special_message"
          defaultMessage={i18n['customer.detail.opreate_log_special_message']}
          values={{
            way: <span className="main-color">{activityDetail.name}</span>,
            content: (
              <span className="main-color">
                {billFieldsMap[activityDetail.field] &&
                  billFieldsMap[activityDetail.field].label}
              </span>
            )
          }}
        />
      );
    } else if (activityDetail.optType === 'CONTRACTS') {
      editContent = (
        <FormattedMessage
          id="customer.detail.opreate_log_special_message"
          defaultMessage={i18n['customer.detail.opreate_log_special_message']}
          values={{
            way: <span className="main-color">{activityDetail.name}</span>,
            content: (
              <span className="main-color">
                {contractFieldsMap[activityDetail.field] &&
                  contractFieldsMap[activityDetail.field].label}
              </span>
            )
          }}
        />
      );
    } else if (activityDetail.optType === 'REFUND') {
      editContent = (
        <FormattedMessage
          id="customer.detail.opreate_log_special_message"
          defaultMessage={i18n['customer.detail.opreate_log_special_message']}
          values={{
            way: <span className="main-color">{activityDetail.name}</span>,
            content: (
              <span className="main-color">
                {refundFieldsMap[activityDetail.field] &&
                  refundFieldsMap[activityDetail.field].label}
              </span>
            )
          }}
        />
      );
    } else if (activityDetail.optType === 'REGISTER_EMAIL') {
      editContent = i18n['customer.detail.opreate_type_register_email'];
    }
    return {
      time: activityTime,
      user: activityDetail.optName || '',
      content: (
        <FormattedMessage
          id="customer.detail.opreate_log_message"
          defaultMessage={i18n['customer.detail.opreate_log_message']}
          values={{
            source:
              OPREATE_WAY[
                activityDetail.customerSource &&
                  activityDetail.customerSource.toUpperCase()
              ],
            way: OPREATE_WAY[activityDetail.optEvent],
            type: ['SEND'].includes(activityDetail.optEvent)
              ? ''
              : OPREATE_WAY[activityDetail.optType],
            content: ['CREATE', 'DELETE'].includes(activityDetail.optEvent) ? (
              <span className="main-color">{activityDetail.optValue}</span>
            ) : (
              <span className="main-color">{editContent}</span>
            )
          }}
        />
      ),
      icon: 'fa fa-record-14-2',
      extras: item
    };
  };

  formatActivitiesItem = item => {
    switch (item.type) {
      case 'follow':
        return this.formatContentFollow(item);
      case 'log':
        return this.formatContentLog(item);
      default:
        return {
          time: item.time,
          extras: item,
          icon: 'fa fa-record-14-2'
        };
    }
  };

  formatTimeLine = (content, data) => {
    const {
      customerDetailInfo: { customerId },
      getCustomerDetail
    } = this.props;
    const { extras = {} } = data;
    const {
      time: activityTime,
      type: activityType,
      detail: activityDetail
    } = extras;

    let tools = ['follow'].includes(activityType)
      ? [
          <DeleteRecord
            key={0}
            customerId={customerId}
            recordId={activityDetail.recordId}
            type={activityType}
            getCustomerDetail={getCustomerDetail}
            className={`timeline-hover ${cs['timeline-delete']}`}
          />
        ]
      : [];
    if (activityType === 'balance') {
      const typeMap = {
        deposit: i18n['customer.detail.follow_record.deposit'],
        withdraw: i18n['customer.detail.follow_record.withdraw'],
        in: i18n['customer.detail.follow_record.credit_in'],
        out: i18n['customer.detail.follow_record.credit_out']
      };
      return (
        <div className={cs['time-line']}>
          <span style={{ marginRight: 15 }}>
            <span>{typeMap[activityDetail.type]}</span>
          </span>
          <span className={cs['deeal-account-id']}>
            {i18n['customer.detail.follow_record.account_label']}
            <b>{activityDetail.accountId}</b>
          </span>
          <div className={cs['deal-time']}>
            {moment(activityTime).format('HH:mm')}
          </div>
          <div style={{ marginTop: 5 }}>
            <span>{typeMap[activityDetail.type]}</span>
            <span>
              <WarningValue
                field={activityDetail.profit}
                minus
                positive
                empty={false}
              />
            </span>{' '}
            <span>{activityDetail.currency}</span>
          </div>
        </div>
      );
    } else if (activityType === 'deal') {
      return (
        <div className={cs['time-line']}>
          <span style={{ marginRight: 15 }}>
            {i18n['customer.detail.follow_record.a_deal_record']}
          </span>
          <span className={cs['deeal-account-id']}>
            {i18n['customer.detail.follow_record.account_label']}
            <b>{activityDetail.accountId}</b>
          </span>
          <div className={cs['deal-time']}>
            {moment(activityTime).format('HH:mm')}
          </div>
          <div className={cs['deal-detail']}>
            <div>
              <b>{i18n['customer.detail.follow_record.deal_record.no']}</b>
              {activityDetail.ticket}
            </div>
            <div>
              <b>{i18n['customer.detail.follow_record.deal_record.type']}</b>
              {activityDetail.type}
            </div>
            <div>
              <b>{i18n['customer.detail.follow_record.deal_record.symbol']}</b>
              {activityDetail.symbol}
            </div>
            <div>
              <b>{i18n['customer.detail.follow_record.deal_record.volume']}</b>
              {activityDetail.volume}
            </div>
            <div>
              <b>{i18n['customer.detail.follow_record.deal_record.profit']}</b>
              <WarningValue
                field={activityDetail.profit}
                minus
                positive
                empty={false}
              />
            </div>
          </div>
        </div>
      );
    } else {
      if (activityType == 'follow' && activityDetail.type === 'CALL') {
        tools = [
          <span key={1}>
            <AudioTip src={activityDetail.recordUrl} />
            <span className={cs['phone-record-time']}>
              {' '}
              {activityDetail.talkDuration} {'s'}
            </span>
          </span>,
          <DeleteRecord
            key={0}
            customerId={customerId}
            recordId={activityDetail.recordId}
            type={activityDetail.type}
            getCustomerDetail={getCustomerDetail}
            className={`timeline-hover ${cs['timeline-delete']}`}
          />
        ];
      }
      return (
        <div className={cs['time-line-box']}>
          <span className={cs['time-line-content']}>{content}</span>
          <span className={cs['activity-tools']}>{tools}</span>
        </div>
      );
    }
  };
  render() {
    const {
      data: { list, pager, pages }
    } = this.props;
    const { timelineData } = this.state;
    const hasMore = pager < pages;
    const loaded = typeof pager !== 'undefined';
    return (
      <div className={cs['log-content-wrap']}>
        {list && list.length ? (
          <TimeLine
            hasMore={hasMore}
            loadMore={this.loadMoreData}
            data={timelineData}
            formatItem={this.formatTimeLine}
            box
          />
        ) : (
          loaded && <NoDataView className={cs['no-data']} />
        )}
      </div>
    );
  }
}
