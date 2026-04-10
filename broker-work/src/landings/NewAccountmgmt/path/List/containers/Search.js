import Search from '../components/Actions/Search';
import { connect } from 'react-redux';
import { updateFuzzyVal } from '../controls/actions';

export default connect(
  ({
    accountManagement: {
      list: { fuzzyValue }
    }
  }) => ({
    fuzzyValue
  }),
  {
    updateFuzzyVal
  }
)(Search);
