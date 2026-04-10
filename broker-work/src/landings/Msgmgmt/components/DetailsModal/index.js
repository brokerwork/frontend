import { CardPanelWrapper } from 'components/CardPanel';
import { injectIntl } from 'react-intl';
import cs from './DetailsModal.less';
import i18n from 'utils/i18n';
import CardPanel from 'components/CardPanel';
import Details from '../../path/Details';

class DetailsModal extends PureComponent {
  closeModal = () => {
    const {
      history,
      match: { url }
    } = this.props;
    history.push(url.substring(0, url.indexOf('/details')));
  };

  render() {
    const { match } = this.props;

    return (
      <CardPanel
        title={i18n['message.details']}
        show={true}
        onClose={this.closeModal}
      >
        <Details match={match} className={cs['details-modal']} show={true} />
      </CardPanel>
    );
  }
}

export default injectIntl(DetailsModal);
