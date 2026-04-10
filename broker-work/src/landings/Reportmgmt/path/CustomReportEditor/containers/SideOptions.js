import { connect } from 'react-redux';
import SideOptions from '../components/SideOptions';
import { onFieldSelect, onFieldRemove, onFieldDrag } from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      customReportEditor: { typeFields, typeFieldsSelected }
    }
  }) => ({
    typeFields,
    typeFieldsSelected
  }),
  { onFieldSelect, onFieldRemove, onFieldDrag }
)(SideOptions);
