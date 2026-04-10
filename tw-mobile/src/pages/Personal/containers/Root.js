import { connect } from 'react-redux';
import { PersonalInfo } from '../components/personalinfo';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

export default connect(
	({ personalInfoPage }) => ({ ...personalInfoPage }),
	{ ...actions, ...commonActions }
)(PersonalInfo)