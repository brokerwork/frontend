import { NavLink as Link } from 'react-router-dom';
import i18n from 'utils/i18n';
import cs from './SendSuccess.less';

export default class SendSuccess extends Component {
  componentDidMount() {
    this.props.setPageTitle(i18n['message.send_success']);
  }
  render() {
    const { match: { params: { id } } } = this.props;
    return (
      <div className={cs['container']}>
        <div className={cs['success-item']}>
          <i className={`fa fa-check-circle ${cs['success-icon']}`} />
        </div>
        <div className={cs['success-text']}>{i18n['message.send_success']}</div>
        <div className={cs['success-tips-text']}>
          {i18n['message.send_tips_success']}
        </div>
        <div className={cs['links-wrap']}>
          <Link
            to={`/msgmgmt/outbox/details/${id}`}
            className={`lean-btn lean-btn-primary ${cs['link-success-message']}`}
          >
            {i18n['message.view_message']}
          </Link>
          <Link
            to="/msgmgmt/addMessage"
            className={`btn btn-default ${cs['send-again-btn']}`}
          >
            {i18n['message.send_again']}
          </Link>
        </div>
      </div>
    );
  }
}
