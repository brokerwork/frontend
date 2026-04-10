import { connect } from 'react-redux';
import OtherInfoForm from '../components/OtherInfoForm';
import { submit } from 'redux-form';

export default connect(
  ({ usersetting: { base: { userAgentColumns } } }) => ({
    userAgentColumns
  }),
  {
    submitForm: submit
  }
)(OtherInfoForm);
