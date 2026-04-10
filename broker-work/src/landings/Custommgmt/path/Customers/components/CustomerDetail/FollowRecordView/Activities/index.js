import { Tabs } from 'lean-ui';
import cs from './index.less';
import i18n from 'utils/i18n';
import ActivityList from './ActivityList';
const TabPane = Tabs.TabPane;
export default class Activities extends Component {
  state = {
    rightTabIndex: '1'
  };
  curryingFactory = func => {
    const {
      customerDetailInfo: { customerId, ownerType = 'all' }
    } = this.props;
    return pageNo => {
      func({
        customerId,
        pageNo,
        ownerType
      });
    };
  };
  render() {
    const {
      customerActivitiesAll,
      customerActivitiesOperate,
      customerActivitiesTrade,
      customerActivitiesFollow,
      getCustomerActivitiesAll,
      getCustomerActivitiesOperate,
      getCustomerActivitiesTrade,
      getCustomerActivitiesFollow,
      versionRights
    } = this.props;
    const { rightTabIndex } = this.state;
    return (
      <Tabs
        activeKey={rightTabIndex}
        id="followRecords"
        className={cs['follow-records']}
        onChange={key => {
          this.setState({ rightTabIndex: key });
        }}
      >
        <TabPane key="1" tab={i18n['customer.detail.activities.all']}>
          {rightTabIndex === '1' ? (
            <ActivityList
              {...this.props}
              data={customerActivitiesAll}
              getData={this.curryingFactory(getCustomerActivitiesAll)}
            />
          ) : (
            undefined
          )}
        </TabPane>
        <TabPane key="2" tab={i18n['customer.detail.activities.opreate']}>
          {rightTabIndex === '2' ? (
            <ActivityList
              {...this.props}
              data={customerActivitiesOperate}
              getData={this.curryingFactory(getCustomerActivitiesOperate)}
            />
          ) : (
            undefined
          )}
        </TabPane>
        <TabPane key="3" tab={i18n['customer.detail.activities.trade']}>
          {rightTabIndex === '3' ? (
            <ActivityList
              {...this.props}
              data={customerActivitiesTrade}
              getData={this.curryingFactory(getCustomerActivitiesTrade)}
            />
          ) : (
            undefined
          )}
        </TabPane>
        {versionRights['BW_CUSTOMER_FOLLOW'] && (
          <TabPane key="4" tab={i18n['customer.detail.activities.follow']}>
            {rightTabIndex === '4' ? (
              <ActivityList
                {...this.props}
                data={customerActivitiesFollow}
                getData={this.curryingFactory(getCustomerActivitiesFollow)}
              />
            ) : (
              undefined
            )}
          </TabPane>
        )}
      </Tabs>
    );
  }
}
