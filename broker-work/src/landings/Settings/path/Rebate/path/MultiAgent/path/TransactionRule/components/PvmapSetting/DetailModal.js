import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

export default class DetailModal extends PureComponent {
  render() {
    const { show, onHide, data, serverSymbols } = this.props;

    return (
      <Dialog
        title={i18n['settings.rebate_setting.transaction_symbol_detail']}
        visible={true}
        onCancel={onHide}
        footer={<Button onClick={onHide}>{i18n['general.cancel']}</Button>}
      >
        {data ? (
          <p>
            {serverSymbols.length === 1 ? '' : `${data.serverName}: `}
            {data.symbols.join(', ')}
          </p>
        ) : (
          undefined
        )}
      </Dialog>
    );
  }
}
