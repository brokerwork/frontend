import i18n from 'utils/i18n';
import cs from './index.less';

export default class WarningValue extends Component {
  render() {
    const {
      field,
      empty = true,
      minus,
      children,
      pending,
      positive
    } = this.props;
    const content = children || field;
    const parsedNumber = Number(field);
    if (pending !== true && typeof field === 'undefined' && empty) {
      return (
        <span className={cs['red']}>{i18n['general.data_get_failed']}</span>
      );
    } else if (parsedNumber && parsedNumber < 0 && minus) {
      return <span className={cs['red']}>{content}</span>;
    } else if (positive) {
      return <span className={cs['green']}>{content}</span>;
    } else {
      return <span>{content}</span>;
    }
  }
}
