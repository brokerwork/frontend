import { connect } from 'react-redux';
import DayoffEdit from '../components/DayoffEdit';
import { showTopAlert, showTipsModal } from 'common/actions';
import { submit } from 'redux-form';
import { 
  showAddDayoff,
  addDayOffSubmit,
  closeDayoff,
  editDayOffSubmit,
  getServerDayOffList
} from '../controls/actions';


export default connect(({
  dayOffSetting: {
    activeServerId,
    serverDayOffList,
    addDayoff,
    symbolList,
    dayoffEditData
  }
}) => ({
  activeServerId,
  serverDayOffList,
  addDayoff,
  symbolList,
  dayoffEditData
}), {
  showAddDayoff,
  showTipsModal,
  showTopAlert,
  submitForm: submit,
  addDayOffSubmit,
  closeDayoff,
  editDayOffSubmit,
  getServerDayOffList
})(DayoffEdit);