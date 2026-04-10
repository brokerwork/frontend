import cs from './index.less';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../../components/ContentCard';
import UserLevelSelector from 'components/v2/UserLevelSelector';
import { FormattedMessage } from 'react-intl';
import { Button } from 'lean-ui';

export default class Contacts extends Component {
  state = {
    showUserLevelTreeModal: false,
    userLevelTreeDefaultValue: null,
    userLevelTreeData: null,
    firstLevelRecCounter: null
  };

  componentWillReceiveProps() {
    this.getFirstLevelRecCounter();
  }

  // 查看推荐人的列表
  showUserLevelTree = item => {
    const { firstLevelRecCounter } = this.state;
    if (firstLevelRecCounter <= 0) {
      return;
    }
    const { accountOwnerInfo: { baseInfo = {} } = {} } = this.props;
    const initialData = [
      { label: baseInfo.accountName, value: baseInfo.customerId, child: true }
    ];
    this.setState({
      showUserLevelTreeModal: true,
      userLevelTreeData: initialData,
      userLevelTreeDefaultValue: initialData[0]
    });
  };

  getFirstLevelRecCounter() {
    const {
      accountOwnerInfo: { baseInfo } = {},
      getRecommendSubLevelUsers
    } = this.props;
    if (this.state.firstLevelRecCounter === null && baseInfo) {
      // 防止多次请求
      this.state.firstLevelRecCounter = 0;
      getRecommendSubLevelUsers(baseInfo.customerId).then(res => {
        this.setState({
          firstLevelRecCounter: res.data ? res.data.length || 0 : 0
        });
      });
    }
  }

  hideUserLevelTree = () => {
    this.setState({
      showUserLevelTreeModal: false,
      userLevelTreeData: null,
      userLevelTreeDefaultValue: null
    });
  };

  getRecommendSubLevelUsers = v => {
    const { getRecommendSubLevelUsers } = this.props;
    return getRecommendSubLevelUsers(v).then(res => {
      return {
        ...res,
        data: (res.data || []).map(user => ({
          label: user.customName,
          value: user.customerId,
          child: true
        }))
      };
    });
  };

  render() {
    const { userRights } = this.props;

    const {
      showUserLevelTreeModal,
      userLevelTreeData,
      userLevelTreeDefaultValue,
      firstLevelRecCounter
    } = this.state;

    return (
      <div>
        {userRights.CUSTOMER_CONTACTS ? (
          <ContentCard limit={4}>
            <ContentCard.Header
              icon="trader"
              iconClassName={cs['trader']}
              title={
                <FormattedMessage
                  id="customer.detail.contact_title"
                  defaultMessage={i18n['customer.detail.recommend_customers']}
                  values={{ number: `${firstLevelRecCounter || 0}` }}
                />
              }
            >
              <ContentCard.Tools>
                <Button
                  className={cs['add-button']}
                  onClick={this.showUserLevelTree}
                >
                  {i18n['general.view']}
                </Button>
              </ContentCard.Tools>
            </ContentCard.Header>
          </ContentCard>
        ) : (
          undefined
        )}
        {showUserLevelTreeModal && (
          <UserLevelSelector
            title={i18n['usermgmt.detail.show_subordinate_user']}
            getData={this.getRecommendSubLevelUsers}
            initialData={userLevelTreeData}
            defaultValue={userLevelTreeDefaultValue}
            onHide={this.hideUserLevelTree}
            noButton
            show
            type="view"
          />
        )}
      </div>
    );
  }
}
