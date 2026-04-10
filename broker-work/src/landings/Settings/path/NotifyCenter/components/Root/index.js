import DataDaily from '../../containers/DataDaily';
import ImportantNotification from '../../containers/ImportantNotification';
import RuleArea from '../../containers/RuleArea';
import Other from '../../containers/Other';
import PagePanel from 'components/PagePanel';
import i18n from 'utils/i18n';
import { Card } from 'lean-ui';
import CommonHeader from 'components/v2/CommonHeader';
import cs from './index.less';

export default class Root extends PureComponent {
  componentDidMount() {
    const { getSystemSettings, getVasSwitch, getRoleOption } = this.props;
    getSystemSettings();
    getVasSwitch();
    getRoleOption();
  }
  render() {
    const { userRights } = this.props;
    return (
      <div className={cs.body}>
        <CommonHeader
          menus={[{ value: i18n['page.title.settings'] }]}
          title={i18n['settings.notify_center']}
        />
        {userRights['SYSTEM_REPOET_SUB'] && (
          <Card style={{ marginBottom: 20 }}>
            <DataDaily />
          </Card>
        )}
        <Card style={{ marginBottom: 20 }}>
          <ImportantNotification />
          <RuleArea />
          <Other />
        </Card>
        {this.props.children}
      </div>
    );
  }
}
