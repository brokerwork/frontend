import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

import cs from './UserCountModal.less';

export default class UserCountModal extends PureComponent {
  render() {
    const { onHide, data } = this.props;
    return (
      <Dialog
        title={i18n['settings.level_setting.relative_user_detail']}
        visible={true}
        onCancel={onHide}
        footer={
          <Button type="primary" onClick={onHide}>
            {i18n['general.confirm']}
          </Button>
        }
      >
        {data.map((array, index) => {
          return (
            <span key={index}>{`${array.entityNo}:${array.name}`}, &nbsp;</span>
          );
        })}
      </Dialog>
    );
  }
}
