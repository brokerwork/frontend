import Form from 'components/Form';
import LanguageSelector from 'components/LanguageSelector';
import { getType as getLanguageType } from 'utils/language';
import { languages } from 'utils/config';
import cs from './Header.less';

export default class Header extends Component {
  languageModify = v => {
    this.props.onLanguageChange(v.value);
    this.setState({ language: v });
  };
  constructor(props) {
    super(props);
    const langType = getLanguageType(props.defaultLanguage);
    let lang = languages.find(item => langType === item.value);
    lang = lang ? lang : languages[0];
    this.state = { language: lang };
  }
  render() {
    const { errorMessage, title, fixed, companySite } = this.props;
    const { language } = this.state;
    return (
      <div
        className={`${cs['login-page-header']} ${
          !!fixed ? cs['fixedTop'] : ''
        }`}
      >
        <Form.Item className={cs['logo-and-lang']}>
          {!!companySite && typeof title !== 'string' ? (
            <a className={cs['title']} href={companySite} target="_blank">
              {title}
            </a>
          ) : (
            <div className={cs['title']}>{title}</div>
          )}
          <LanguageSelector
            value={language}
            right
            onChange={this.languageModify}
          />
        </Form.Item>
        {errorMessage ? (
          <Form.Item className={cs['error-message']}>{errorMessage}</Form.Item>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
