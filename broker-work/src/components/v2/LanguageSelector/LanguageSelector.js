import DropdownItem from '../DropdownItem';
import { countryCodeStaticDir, languages } from 'utils/config';
import cs from './LanguageSelector.less';

export default class LanguageSelector extends Component {
  onChange = v => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(v);
    }
  };
  render() {
    const {
      value: currentLanguage,
      languageSelectors,
      className = '',
      accessConfig: { showFlag },
      ...props
    } = this.props;
    if (!currentLanguage) {
      return null;
    }
    // 待选列表中不出现当前已选择的语言
    const languageSelectList = (languageSelectors || languages).filter(
      l => l.value !== currentLanguage.value
    );
    console.log('lllll', languageSelectList);
    return (
      <DropdownItem
        data={languageSelectList}
        value={currentLanguage}
        onSelect={this.onChange}
        className={`${cs['container']} ${className}`}
        {...props}
      >
        {showFlag && (
          <img
            src={`${countryCodeStaticDir}${currentLanguage.icon}`}
            width="18"
            height="12"
          />
        )}
        <span className={cs['text']}>{currentLanguage.tag}</span>
        <i className={`fa fa-angle-down ${cs['icon']}`} />
      </DropdownItem>
    );
  }
}
