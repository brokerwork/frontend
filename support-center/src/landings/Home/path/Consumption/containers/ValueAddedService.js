import { connect } from 'react-redux';
import ValueAddedService from '../components/ValueAddedService';
import {
  getValueAddedService,
  _changeValueAddedServiceDataRange
} from '../controls/actions';


export default connect(({
  consumption: {
    valueAddedService,
    valueAddedServiceDateRange
  }
}) => ({
  valueAddedService,
  valueAddedServiceDateRange
}), {
  getValueAddedService,
  _changeValueAddedServiceDataRange
})(ValueAddedService);