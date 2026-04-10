import { findDOMNode } from 'react-dom';
import { getToken } from 'utils/userInfo';
import cs from './Export.less';
import i18n from 'utils/i18n';

export default class Export extends PureComponent {
  state = {
    show: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClicked);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClicked);
  }

  handleDocumentClicked = evt => {
    if (!findDOMNode(this).contains(evt.target)) {
      this.setState({
        show: false
      });
    }
  };

  onToggle = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
    const { show } = this.state;
    const { depositId } = this.props;

    return (
      <div className={cs['export']}>
        <a onClick={this.onToggle}>{i18n['general.export']}</a>
        {show ? (
          <ul className={cs['export-list']} data-test="export-list">
            <li onClick={() => this.setState({ show: false })}>
              <a
                href={`/api/v2/account/import/excel/deposit/${depositId}/export?onlyFail=false&token=${getToken()}`}
                target="_blank"
              >
                {i18n['account.batch_deposit.detail.export.origin_data']}
              </a>
            </li>
            <li onClick={() => this.setState({ show: false })}>
              <a
                href={`/api/v2/account/import/excel/deposit/${depositId}/export?onlyFail=true&token=${getToken()}`}
                target="_blank"
              >
                {i18n['account.batch_deposit.detail.export.fail_record']}
              </a>
            </li>
          </ul>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
