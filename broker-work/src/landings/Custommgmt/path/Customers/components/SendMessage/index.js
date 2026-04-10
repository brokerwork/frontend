import i18n from 'utils/i18n';
import UserSelect from 'components/UserSelector';
import cs from './transferCustomer.less';
import SendMessageModal from 'components/v2/SendMessageModal';

export default class SendMessage extends PureComponent {
  componentDidMount() {
    const { showTipsModal, backToRoot, selectedItemsMap } = this.props;
    if (!Object.keys(selectedItemsMap).length) {
      backToRoot();
      return;
    }
  }
  render() {
    const { backToRoot, selectedItemsMap, typesOptions } = this.props;
    return (
      <SendMessageModal
        onHide={backToRoot.bind(this, false)}
        messageTypes={typesOptions}
        selectedMessageObjects={selectedItemsMap}
        type={'customer'}
        {...this.props}
      />
    );
  }
}
