import { connect } from 'react-redux';
import AboutUs from '../components/AboutUs';
import { showTopAlert } from 'common/actions';
import {
  getData,
  setDisclaimer,
  modifyDisclaimer
} from '../controls/actions';


export default connect(({
  brandSettings: {
    disclaimer
  }
}) => ({
  data: disclaimer
}), {
    getData,
    modifyData: modifyDisclaimer,
    setData: setDisclaimer,
    showTopAlert
  }
)(AboutUs);