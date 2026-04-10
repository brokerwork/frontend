import { connect } from 'react-redux';
import DataService from '../components/DataService';
import {
  getVeriCode,
  delData
} from '../controls/actions';
import {
  showTipsModal
} from 'common/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  getVeriCode,
  showTipsModal,
  delData
})(DataService);