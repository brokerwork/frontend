import { Dialog } from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
export default class ExtraServiceAlert extends Component {
  state = {
    show: true
  };
  onCancel = () => {
    this.setState({
      show: false
    });
  };
  render() {
    const { show } = this.state;
    const { extraServiceData } = this.props;
    return (
      <Dialog
        visible={show}
        closable
        footer={null}
        title=" "
        onCancel={this.onCancel}
      >
        <div>
          <FormattedMessage
            id="extra_service.balance"
            defaultMessage={i18n['extra_service.balance']}
            values={{
              value: (
                <span style={{ color: 'red' }}>
                  ${extraServiceData.balance}
                </span>
              )
            }}
          />
        </div>
        {i18n['extra_service.balance.paid']}
      </Dialog>
    );
  }
}
