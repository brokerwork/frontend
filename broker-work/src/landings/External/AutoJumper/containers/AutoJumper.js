import { connect } from 'react-redux';
import AutoJumper from '../components/AutoJumper';
import { replace } from 'react-router-redux';
import { getBrandInfo } from 'commonActions/actions';
import { login } from '../controls/actions';

export default connect(null, {
  login,
  replace,
  getBrandInfo
})(AutoJumper);
