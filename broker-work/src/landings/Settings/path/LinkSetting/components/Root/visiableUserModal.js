import i18n from 'utils/i18n';
import cs from './index.less';
import { Dialog, Button } from 'lean-ui';

export default class VisiableUserModal extends PureComponent {
  render() {
    const { onHide, data, show } = this.props;
    let dataStr = '';
    if (Array.isArray(data)) {
      dataStr = data.join(',');
    }
    return (
      <Dialog
        visible={true}
        onCancel={onHide}
        title={
          show === 'UserPartVisible' || show === 'DirectPartVisible'
            ? i18n['settings.link_setting.user_see_header']
            : i18n['settings.link_setting.user_not_see_header']
        }
        footer={
          <Button type="primary" onClick={onHide}>
            {i18n['general.confirm']}
          </Button>
        }
      >
        {dataStr}
      </Dialog>
    );
  }
}
