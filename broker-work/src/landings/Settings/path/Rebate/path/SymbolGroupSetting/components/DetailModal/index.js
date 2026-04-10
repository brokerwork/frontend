import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

import cs from './DetailModal.less';

export default class DetailModal extends PureComponent {
  render() {
    const { show, onHide, data, serverSymbols } = this.props;

    return (
      <Dialog
        title={i18n['settings.rebate_setting.transaction_symbol_detail']}
        visible={show}
        onCancel={onHide}
        className={cs['detail-body']}
        footer={<Button onClick={onHide}>{i18n['general.cancel']}</Button>}
      >
        {data ? (
          serverSymbols.length === 1 ? (
            <p>{data.symbols[0] ? data.symbols[0].symbols.join(', ') : ''}</p>
          ) : (
            data.symbols.map((symbol, idx) => {
              return (
                <p key={idx}>
                  {symbol.serverName}: {symbol.symbols.join(', ')}
                </p>
              );
            })
          )
        ) : (
          ''
        )}
      </Dialog>
    );
  }
}
