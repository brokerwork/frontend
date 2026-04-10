import { connect } from 'react-redux';
import Live from '../components/Live';
import {
  getLiveService
} from '../controls/actions';


export default connect(({
  consumption: {
    liveService
  }
}) => ({
  liveService
}), {
  getLiveService
})(Live);