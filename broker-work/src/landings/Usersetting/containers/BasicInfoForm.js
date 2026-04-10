import { connect } from 'react-redux';
import BasicInfoForm from '../components/BasicInfoForm';

export default connect(
  ({
    usersetting: { base: { serverList, roleList, userList, genderList } }
  }) => ({
    serverList,
    roleList,
    userList,
    genderList
  }),
  null
)(BasicInfoForm);
