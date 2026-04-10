import { connect } from 'react-redux';
import LanguageSelector from './LanguageSelector';

export default connect(({ common: { languageSelectors, accessConfig } }) => {
  return {
    languageSelectors,
    accessConfig
  };
})(LanguageSelector);
