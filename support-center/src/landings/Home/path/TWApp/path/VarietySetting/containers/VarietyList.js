import { connect } from 'react-redux';
import VarietyList from '../components/VarietyList';
import { 
  getServerInfo
} from '../controls/actions';


export default connect(({
  varietySettings: {
    serverInfo
  }
}) => ({
  serverInfo
}), {
  getServerInfo
})(VarietyList);