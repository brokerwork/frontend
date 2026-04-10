import { connect } from 'react-redux';
import LevelRelation from '../components/LevelRelation';
import { getLevelRelationList } from '../controls/actions';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from '../controls/reducers';

injectReducer('taUserMgmt_level_relations', reducers);

export default connect(
  ({ taUserMgmt_level_relations: { levelRelationLists } }) => {
    return {
      levelRelationLists
    };
  },
  { getLevelRelationList }
)(LevelRelation);
