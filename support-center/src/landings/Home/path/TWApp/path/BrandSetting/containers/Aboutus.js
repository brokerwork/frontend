import { connect } from 'react-redux';
import AboutUs from '../components/AboutUs';
import { showTopAlert } from 'common/actions';
import {
  getData,
  modifyAboutUs,
  setAboutUs,
} from '../controls/actions';


export default connect(({
  brandSettings: {
    aboutus
  }
}) => ({
  data: aboutus
}), {
    getData,
    modifyData: modifyAboutUs,
    setData: setAboutUs,
    showTopAlert
  }
)(AboutUs);