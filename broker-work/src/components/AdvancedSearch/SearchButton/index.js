import PropTypes from 'prop-types';
import cs from '../AdvancedSearch.less';
import { Button } from 'react-bootstrap';
import i18n from 'utils/i18n';

export default class SearchButton extends Component {
  onClick = () => {
    const { onOpen } = this.context;

    onOpen();
  };
  render() {
    const { className = '' } = this.props;

    return (
      <Button
        bsStyle="primary"
        className={`${cs['search-btn']} ${className}`}
        onClick={this.onClick}
      >
        {i18n['advanced_search.btn_name']}
      </Button>
    );
  }
}

SearchButton.contextTypes = {
  onOpen: PropTypes.func
};
