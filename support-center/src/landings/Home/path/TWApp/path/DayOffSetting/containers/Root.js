import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert, showLoadingBar, closeLoadingBar, showTipsModal, closeTipsModal } from 'common/actions';
import { 
  getServer,
  serverChange,
  getServerDayOffList,
  syncSetting,
  showAddDayoff,
  getSymbolList,
  enableDayoff,
  disableDayoff,
  showEditDayoff
} from '../controls/actions';


export default connect(({
  dayOffSetting: {
    server,
    activeServerId,
    serverDayOffList,
    addDayoff
  }
}) => ({
  server,
  activeServerId,
  serverDayOffList,
  addDayoff
}), {
  showTopAlert,
  showTipsModal,
  closeTipsModal,
  showLoadingBar,
  closeLoadingBar,
  getServer,
  serverChange,
  getServerDayOffList,
  syncSetting,
  showAddDayoff,
  getSymbolList,
  enableDayoff,
  showEditDayoff,
  disableDayoff
})(Root);