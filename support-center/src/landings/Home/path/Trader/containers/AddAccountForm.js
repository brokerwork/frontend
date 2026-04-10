import { connect } from 'react-redux';
import Root from '../components/OpenAccount/SimulationSetting/AddAccountForm';
import { getMaxLeverageList, getTotalCaculationTypeList, getAccountTypeList } from '../controls/actions';

export default connect(
  ({ traderCommon: { leverageList, maxLeverageList, accountTypeList, totalCaculationTypeList } }) => {
    return { leverageList, maxLeverageList, accountTypeList, totalCaculationTypeList };
  },
  { getMaxLeverageList, getAccountTypeList, getTotalCaculationTypeList }
)(Root);
