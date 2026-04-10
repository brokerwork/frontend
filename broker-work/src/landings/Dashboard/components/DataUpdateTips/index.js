import cs from './DataUpdateTips.less';
import i18n from 'utils/i18n';
import { Alert } from 'lean-ui';

const tipsKey = 'DASHBOARD_DATA_UPDATE_TIPS_DISPLAY';

export default class DataUpdateTips extends Component {
  state = {
    haveClosed: false
  };
  componentDidMount() {
    this.setState({
      haveClosed: window.localStorage.getItem(tipsKey)
    });
  }
  closeTips = () => {
    this.setState({
      haveClosed: true
    });
    window.localStorage.setItem(tipsKey, true);
  };
  render() {
    if (this.state.haveClosed) return null;
    return <div className={`${cs['container']} main-color`} />;
  }
}
