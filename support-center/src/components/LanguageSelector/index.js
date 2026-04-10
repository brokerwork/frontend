import { connect } from 'react-redux';
import LanguageSelector from './LanguageSelector';


export default connect(({common: {languages}})=>({
  languages
}), {})(LanguageSelector);
