import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

import cs from './DetailModal.less';

export default class DetailModal extends PureComponent {
  onHide = () => {
    const { onHide } = this.props;
    onHide();
  };

  _renderBelongRow = (item, idx) => {
    return (
      <span key={idx} className={cs['userDetail']}>
        {item.entityNo} : {item.name}
      </span>
    );
  };

  render() {
    const { show, data, onHide } = this.props;
    return (
      <Dialog
        visible={show}
        onCancel={onHide}
        width={700}
        title={i18n['settings.role_setting.belong_detail_Header']}
        footer={
          <Button type="primary" onClick={this.onHide}>
            {i18n['general.cancel']}
          </Button>
        }
      >
        {data ? data.map(this._renderBelongRow) : ''}
      </Dialog>
    );
  }
}
