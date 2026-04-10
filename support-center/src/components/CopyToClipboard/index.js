import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from 'components/Button';
import { showTopAlert } from 'common/actions';
import i18n from 'utils/i18n';

class Root extends PureComponent {
  onCopy = () => {
    const { showTopAlert } = this.props;

    showTopAlert({
      style: 'success',
      content: i18n['general.clip_success']
    });
  }

  render() {
    const {
      onCopy,
      dispatch,
      showTopAlert,
      ...otherProps
    } = this.props;

    return (
      <CopyToClipboard {...otherProps} onCopy={this.onCopy}>
        <Button icon style="default-white">
          <i className="fa fa-copy"></i>
        </Button>
      </CopyToClipboard>
    );
  }
}

export default connect(null, {
  showTopAlert
})(Root);