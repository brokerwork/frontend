import { connect } from 'react-redux';
import Nation from '../components/Nation';
import { 
  getNationList,
  updateNationStatus,
  setNationDefault,
  clearNationDefault
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'common/actions';


export default connect(({
  brokerFieldSetting: {
    nationList
  }
}) => ({
  nationList
}), {
  getNationList,
  updateNationStatus,
  setNationDefault,
  clearNationDefault,
  showTopAlert,
  showTipsModal
})(Nation);