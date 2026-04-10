import { connect } from 'react-redux';
import AccountOwnerInfo from '../components/AccountOwnerInfo';
import { getFieldList, getFieldModule } from '../controls/actions';

export default connect(
  ({ brokerFieldSetting: { moduleList }, common: { versionRights } }) => ({
    moduleList,
    versionRights
  }),
  {
    getFieldList,
    getFieldModule
  }
)(AccountOwnerInfo);
