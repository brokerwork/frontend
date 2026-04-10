import ObjectList from '../components/ObjectList';
import { getObjects } from '../controls/actions';
import { connect } from 'react-redux';

export default connect(
  ({ taskmgmt }) => {
    return {
      data: taskmgmt.object_list
    };
  },
  {
    getObjects
  }
)(ObjectList);
