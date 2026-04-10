import i18n from 'utils/i18n';
import DataDaily from '../../containers/DataDaily';
import RuleArea from '../../containers/RuleArea';
import Menu from '../../../Usersetting/components/Root';
import cs from './Root.less';

export default class Main extends Component {
  componentDidMount() {
    const { getPersonalRule, getSystemSettings } = this.props;
    getPersonalRule();
    getSystemSettings();
  }
  render() {
    const { personalRules, personalReportShow } = this.props;
    return (
      <Menu {...this.props}>
        <div className={cs['panel']}>
          <div className={cs['head']}>
            {i18n['settings.self_notify.header']}
          </div>
          <div>
            {personalReportShow.personalDailyReportEnable ? (
              <DataDaily />
            ) : (
              undefined
            )}
            {personalRules && personalRules.length > 0 ? (
              <RuleArea />
            ) : (
              undefined
            )}
          </div>
        </div>
      </Menu>
    );
  }
}
