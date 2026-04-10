import { connect } from 'react-redux';
import { LiveBroadCast } from '../components/index';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';


export default connect(
	({ liveBroadCastPage }) => ({  }),
	{ ...actions, ...commonActions }
)(LiveBroadCast)