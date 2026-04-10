import List from '../../containers/List';
import RebateAccount from '../../containers/RebateAccount';
import cs from './index.less';
import setPageTitle from 'utils/setPageTitle';
import i18n from 'utils/i18n';
import Menu from '../../../Usersetting/components/Root';

export default class Root extends Component {
  componentDidMount() {
    const { brandInfo } = this.props;
    if (brandInfo.siteName) {
      setPageTitle(
        `${brandInfo.siteName} - ${i18n['withdraw.add_modal.title']}`
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    const { brandInfo: nextBrandInfo } = nextProps;
    const { brandInfo } = this.props;
    if (
      nextBrandInfo.siteName &&
      brandInfo.siteName !== nextBrandInfo.siteName
    ) {
      setPageTitle(
        `${nextBrandInfo.siteName} - ${i18n['withdraw.add_modal.title']}`
      );
    }
  }
  render() {
    return (
      <div className={cs['container']}>
        <Menu {...this.props}>
          <div className={cs['panel']}>
            <div className={cs['head']}>{i18n['withdraw.add_modal.title']}</div>
            <RebateAccount />
            <List />
          </div>
        </Menu>
      </div>
    );
  }
}
