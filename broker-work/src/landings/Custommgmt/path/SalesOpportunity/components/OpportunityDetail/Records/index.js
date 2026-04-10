import cs from './index.less';
import i18n from 'utils/i18n';
import { Tabs } from 'lean-ui';
import timeLineDataTransfer from 'components/v2/TimeLine/transfer';
import { FormattedMessage } from 'react-intl';
import TimeLine from 'components/v2/TimeLine';
const TabPane = Tabs.TabPane;
export default class HeadInfo extends PureComponent {
  getFollowRecord = () => {
    const { detail } = this.props;
    const copyData = JSON.parse(JSON.stringify(detail));

    if (!detail.followUpRecords) return undefined;

    return timeLineDataTransfer(
      copyData.followUpRecords.map(item => {
        return {
          time: item.followTime,
          content: (
            <FormattedMessage
              id="customer.sales_opportunity.detail.follow_record_message"
              defaultMessage={
                i18n['customer.sales_opportunity.detail.follow_record_message']
              }
              values={{ content: item.followContent }}
            />
          ),
          user: item.creator,
          icon: 'fa fa-record-14'
        };
      })
    );
  };
  render() {
    const { canEdit } = this.props;
    const followRecord = this.getFollowRecord();
    return (
      <Tabs defaultActiveKey="followRecord" id="opportunity-follow-record">
        <TabPane
          className={cs['tab-content']}
          tab={i18n['customer.sales_opportunity.detail.follow_record']}
          key="followRecord"
        >
          <div className={cs['content-wrap']}>
            {followRecord && <TimeLine data={followRecord} box />}
          </div>
        </TabPane>
      </Tabs>
    );
  }
}
