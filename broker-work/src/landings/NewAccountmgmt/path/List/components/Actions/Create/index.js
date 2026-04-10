import { Icon, Button } from 'lean-ui';
import CreateModal from '../../../containers/CreateModal';
import { CardPanelWrapper } from 'components/v2/CardPanel';
import i18n from 'utils/i18n';

export default class Create extends PureComponent {
  state = {
    showModal: false
  };

  toggleModal = showModal => {
    this.setState({
      showModal
    });
  };

  onChange = () => {
    const { onChange } = this.props;

    this.setState(
      {
        showModal: false
      },
      () => {
        onChange();
      }
    );
  };

  render() {
    const { showModal } = this.state;

    return (
      <div className="create-account">
        <Button type="primary" onClick={this.toggleModal.bind(this, true)}>
          <Icon icon={'add-outline'} />
          {i18n['account.button.create_account']}
        </Button>
        <CardPanelWrapper>
          {showModal && (
            <CreateModal
              onClose={this.toggleModal.bind(this, false)}
              onChange={this.onChange}
            />
          )}
        </CardPanelWrapper>
      </div>
    );
  }
}
