import i18n from 'utils/i18n';
import CardPanel from 'components/v2/CardPanel';
import HeaderInfo from './headerInfo';
import BasicInfo from './basicInfo';
import AccountInfo from './accountInfo';
import ActionInfo from './actionInfo';
import Points from 'landings/Points';
import { Card, Button } from 'lean-ui';
import cs from './index.less';
import BankInfo from './bankinfo';
export default class Detail extends Component {
  state = {
    userInfoReady: false
  };
  onClose = () => {
    const {
      history: { push },
      match: { path }
    } = this.props;
    push(path.replace('/:userId', ''));
  };
  componentDidMount() {
    const {
      getUserInfo,
      getAccessConf,
      match: { params }
    } = this.props;
    getUserInfo(params.userId).then(() => {
      this.setState({
        userInfoReady: true
      });
    });
    getAccessConf();
  }

  refresh = () => {
    const {
      getUserInfo,
      match: { params }
    } = this.props;
    getUserInfo(params.userId);
  };

  componentWillUnmount() {
    this.props.resetUserInfo();
  }

  render() {
    const { userInfoReady } = this.state;
    const { userInfo } = this.props;
    const { vaInfo } = userInfo;

    return (
      <CardPanel
        onClose={this.onClose}
        show={true}
        title={i18n['tausermgmt.detail.panel_title']}
      >
        <Card className={cs['card-style']}>
          <HeaderInfo {...this.props} />
          <BasicInfo {...this.props} />
        </Card>
        <Points info={userInfo} />
        <AccountInfo {...this.props} refresh={this.refresh} />
        {/* 若存在虚拟开户信息，则进行账户信息显示 */}
        {!!vaInfo && <BankInfo vaInfo={vaInfo} />}
        {userInfoReady && <ActionInfo {...this.props} />}
      </CardPanel>
    );
  }
}
