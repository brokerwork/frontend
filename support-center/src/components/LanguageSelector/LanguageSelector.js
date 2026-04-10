import Dropdown from '../Dropdown';
import { countryCodeStaticDir } from 'utils/config';
import cs from './LanguageSelector.less';

export default class LanguageSelector extends Component {
  handleClick = selected => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(selected);
    }
  };

  render() {
    const { value, className = '', right = true, languages } = this.props;
    const currentLang = languages.find(item => item.value === value);

    return (
      <Dropdown className={`${cs['dropdown']} ${className}`} right={right}>
        <Dropdown.Toggle>
          <img src={countryCodeStaticDir + currentLang.icon} width="18" height="12" />
          <span className={cs['text']}>{currentLang.label}</span>
          <i className={`fa fa-angle-down ${cs['arrow']}`}></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <ul className="menu-list">
            {languages.map((language, idx) => {
              return (
                <li key={idx}>
                  <a onClick={this.handleClick.bind(this, language)}>{language.label}</a>
                </li>
              );
            })}
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
