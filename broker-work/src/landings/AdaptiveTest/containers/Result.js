import { connect } from 'react-redux';
import Result from '../components/Result';
import * as actions from '../controls/actions';

export default connect(({ adaptiveTest: { testResult } }) => ({ testResult }), {
  ...actions
})(Result);
